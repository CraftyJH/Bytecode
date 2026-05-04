import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const JUDGE0_URL = process.env.JUDGE0_URL ?? "https://ce.judge0.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY; // optional — for RapidAPI hosted instance

const JAVA_LANGUAGE_ID = 62; // Java (OpenJDK 13.0.1)
const KOTLIN_LANGUAGE_ID = 78; // Kotlin (JVM) — Judge0 CE

export interface RunRequest {
  code: string;
  stdin?: string;
  /** When set to kotlin, uses Judge0 Kotlin language id. Defaults to Java. */
  language?: "java" | "kotlin";
}

export interface RunResult {
  stdout: string;
  stderr: string;
  time: string | null;
  memory: number | null;
  status: { id: number; description: string };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RunRequest;
  if (!body.code?.trim()) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
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
        source_code: body.code,
        language_id:
          body.language === "kotlin" ? KOTLIN_LANGUAGE_ID : JAVA_LANGUAGE_ID,
        stdin: body.stdin ?? "",
      }),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not reach code execution service. Check JUDGE0_URL." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { error: `Judge0 returned ${res.status}`, detail: text },
      { status: 502 },
    );
  }

  const data = await res.json();

  const result: RunResult = {
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? data.compile_output ?? "",
    time: data.time ?? null,
    memory: data.memory ?? null,
    status: data.status ?? { id: 0, description: "Unknown" },
  };

  return NextResponse.json(result);
}
