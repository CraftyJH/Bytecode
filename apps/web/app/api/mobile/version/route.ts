import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ANDROID_VERSION = process.env.ANDROID_APP_VERSION ?? "1.0";
const ANDROID_VERSION_CODE = parseInt(process.env.ANDROID_APP_VERSION_CODE ?? "1", 10);
const ANDROID_DOWNLOAD_URL = process.env.ANDROID_DOWNLOAD_URL ?? "https://bytecode.dev/get-the-app/android";

export async function GET() {
  return NextResponse.json({
    android: {
      latestVersion: ANDROID_VERSION,
      latestVersionCode: ANDROID_VERSION_CODE,
      downloadUrl: ANDROID_DOWNLOAD_URL,
      mandatory: false,
    },
  });
}
