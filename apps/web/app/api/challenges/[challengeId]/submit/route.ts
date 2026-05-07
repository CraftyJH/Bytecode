import { BYTECODE_API_URL, parseBearerToken, unauthorized } from "@/lib/api-proxy";
import { getStaticChallenge, type StaticChallenge } from "@/lib/challenges";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const JUDGE0_URL = process.env.JUDGE0_URL ?? "https://ce.judge0.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

function buildHarness(challenge: StaticChallenge, userCode: string): string {
  const lines: string[] = [];
  if (challenge.preamble) {
    lines.push(challenge.preamble, "");
  }
  lines.push(userCode, "");
  lines.push("public class Main {");
  lines.push("    public static void main(String[] args) {");
  for (const tc of challenge.testCases) {
    lines.push(
      `        try { System.out.println("${tc.id}:" + (${tc.call})); } catch(Exception e) { System.out.println("${tc.id}:ERR:"+e.getMessage()); }`,
    );
  }
  lines.push("    }");
  lines.push("}");
  return lines.join("\n");
}

function parseOutputs(stdout: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const line of stdout.split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) map[line.slice(0, idx)] = line.slice(idx + 1);
  }
  return map;
}

async function gradeLocally(challenge: StaticChallenge, sourceCode: string) {
  const source = buildHarness(challenge, sourceCode);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
  }

  let res: Response;
  try {
    res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: source,
        language_id: challenge.languageId,
        stdin: "",
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach code execution service" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json({ error: `Judge0 error ${res.status}` }, { status: 502 });
  }

  const data = (await res.json()) as {
    status?: { id: number };
    stdout?: string;
    compile_output?: string;
    time?: string;
    memory?: number;
  };

  const hiddenCases = challenge.testCases.filter((tc) => !tc.visible);

  // Compilation error (status id 6)
  if (data.status?.id === 6) {
    return NextResponse.json({
      isCorrect: false,
      visibleResults: challenge.testCases
        .filter((tc) => tc.visible)
        .map((tc) => ({ id: tc.id, passed: false, expected: tc.expected, actual: null, error: "Compile error" })),
      hiddenPass: 0,
      hiddenTotal: hiddenCases.length,
      runtimeMs: null,
      memoryKb: null,
      compileError: data.compile_output ?? "Compilation failed",
      xpAwarded: null,
      badgesEarned: [],
    });
  }

  const outputs = parseOutputs(data.stdout ?? "");

  const visibleResults = challenge.testCases
    .filter((tc) => tc.visible)
    .map((tc) => {
      const raw = outputs[tc.id];
      const isErr = raw?.startsWith("ERR:") === true;
      const passed = !isErr && raw?.trim() === tc.expected.trim();
      return {
        id: tc.id,
        passed,
        expected: tc.expected,
        actual: isErr ? null : (raw ?? null),
        error: isErr ? (raw?.slice(4) ?? null) : null,
      };
    });

  const hiddenPass = hiddenCases.filter((tc) => {
    const raw = outputs[tc.id];
    return raw != null && !raw.startsWith("ERR:") && raw.trim() === tc.expected.trim();
  }).length;

  const isCorrect = visibleResults.every((r) => r.passed) && hiddenPass === hiddenCases.length;

  return NextResponse.json({
    isCorrect,
    visibleResults,
    hiddenPass,
    hiddenTotal: hiddenCases.length,
    runtimeMs: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
    memoryKb: data.memory ?? null,
    compileError: null,
    xpAwarded: isCorrect ? challenge.baseXp : null,
    badgesEarned: [],
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ challengeId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();

  const { challengeId } = await params;
  const body = (await request.json()) as { sourceCode?: string; language?: string };

  if (BYTECODE_API_URL) {
    try {
      const res = await fetch(`${BYTECODE_API_URL}/api/challenges/${challengeId}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // fall through to local grading
    }
  }

  const challenge = getStaticChallenge(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const sourceCode = body.sourceCode ?? "";
  if (!sourceCode.trim()) {
    return NextResponse.json({ error: "No source code provided" }, { status: 400 });
  }

  return gradeLocally(challenge, sourceCode);
}
