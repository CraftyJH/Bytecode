# Bytecode Android App

Native Android client for Bytecode, built with Kotlin + Jetpack Compose.

## What is included

- Email/password sign-in against Supabase Auth REST API
- Session persistence with encrypted shared preferences
- Authenticated calls to Bytecode backend:
  - `GET /api/users/me`
  - `GET /api/users/me/billing`
- Authenticated calls to mobile curriculum endpoints:
  - `GET /api/mobile/curriculum`
  - `GET /api/mobile/lesson/{track}/{module}/{lesson}`
- Account dashboard displaying role/plan/streak and billing status
- In-app curriculum browser (tracks/modules/lessons) with premium lock states
- Lesson reader view with web billing deep-link for locked premium lessons
- "Manage billing" button that opens the web billing page in browser

## Setup

1. Copy the local properties template:

```bash
cp local.properties.example local.properties
```

2. Fill in values in `local.properties`:

```properties
sdk.dir=/path/to/android/sdk
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-or-anon-key>
BYTECODE_API_URL=https://bytecode-web.craftyjhs-projects.vercel.app
WEB_BASE_URL=https://bytecode-web.craftyjhs-projects.vercel.app
```

3. Generate a Gradle wrapper (required for CI builds and CLI builds if not already present):

```bash
cd apps/android
gradle wrapper
```

4. Open `apps/android` in Android Studio and run the `app` configuration.

## Notes

- The app uses direct Supabase Auth REST endpoints for login.
- Backend API calls use the Supabase access token as bearer auth.
- Billing checkout/portal remains web-driven and is opened via browser.

## Release signing

Release builds use env/local-properties based signing configuration:

```properties
ANDROID_SIGNING_STORE_FILE=app/keystore/release.jks
ANDROID_SIGNING_STORE_PASSWORD=your-store-password
ANDROID_SIGNING_KEY_ALIAS=your-key-alias
ANDROID_SIGNING_KEY_PASSWORD=your-key-password
```

- If all values are provided and the keystore file exists, release builds are signed with that key.
- If values are missing, release builds fall back to the debug signing key (useful for CI verification builds, not for Play Store release uploads).

## CI (GitHub Actions)

Workflow: `.github/workflows/android-build.yml`

- Triggers on pushes/PRs that touch `apps/android/**` (and manually via workflow dispatch).
- Pipeline stages:
  - `:app:lintDebug`
  - `:app:testDebugUnitTest`
  - `:app:assembleDebug`
  - `:app:assembleRelease`
- Uploads APK artifacts for both debug and release builds.
- If Gradle wrapper files are missing from the repo, the workflow auto-generates them in CI before running tasks.

Optional repository secrets for runtime/build config:

- `ANDROID_SUPABASE_URL`
- `ANDROID_SUPABASE_PUBLISHABLE_KEY`
- `ANDROID_BYTECODE_API_URL`
- `ANDROID_WEB_BASE_URL`

Optional repository secrets for signed release artifacts:

- `ANDROID_SIGNING_STORE_BASE64` (base64-encoded JKS file contents)
- `ANDROID_SIGNING_STORE_PASSWORD`
- `ANDROID_SIGNING_KEY_ALIAS`
- `ANDROID_SIGNING_KEY_PASSWORD`
