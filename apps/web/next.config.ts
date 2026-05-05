import type { NextConfig } from "next";

const buildTimestamp = new Date().toISOString();
const appVersion = process.env.npm_package_version ?? "0.1.0";
const buildSha = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    NEXT_PUBLIC_BUILD_SHA: buildSha,
  },
};

export default nextConfig;
