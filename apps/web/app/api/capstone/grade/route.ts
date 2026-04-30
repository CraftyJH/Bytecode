import { NextResponse } from "next/server";
import { SENTINEL, TEST_HARNESS, parseGradeOutput } from "@/lib/capstone";

const JUDGE0_URL = process.env.JUDGE0_URL ?? "https://ce.judge0.com";
const JAVA_LANGUAGE_ID = 62;

export async function POST(request: Request) {
  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  // Split at the sentinel and inject the test harness in place of the demo main
  const sentinelIndex = code.indexOf(SENTINEL);
  if (sentinelIndex === -1) {
    return NextResponse.json(
      { error: "Starter code structure not recognised — please reset the editor and try again." },
      { status: 400 }
    );
  }

  const studentMethods = code.slice(0, sentinelIndex).trimEnd();
  // studentMethods ends with the closing of the method bodies but the class brace is still open
  const gradingCode = `${studentMethods}\n\n${TEST_HARNESS}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
  }

  let judgeRes: Response;
  try {
    judgeRes = await fetch(`${JUDGE0_URL}/submissions?wait=true&base64_encoded=false`, {
      method: "POST",
      headers,
      body: JSON.stringify({ language_id: JAVA_LANGUAGE_ID, source_code: gradingCode }),
    });
  } catch {
    return NextResponse.json({ error: "Code runner unreachable" }, { status: 502 });
  }

  const submission = await judgeRes.json();
  const stdout: string = submission.stdout ?? "";
  const stderr: string = submission.stderr ?? "";
  const compileOutput: string = submission.compile_output ?? "";

  if (compileOutput) {
    return NextResponse.json({ compileError: compileOutput.trim() });
  }
  if (!stdout && stderr) {
    return NextResponse.json({ compileError: stderr.trim() });
  }

  return NextResponse.json(parseGradeOutput(stdout));
}
