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

3. Open `apps/android` in Android Studio and run the `app` configuration.

## Notes

- The app uses direct Supabase Auth REST endpoints for login.
- Backend API calls use the Supabase access token as bearer auth.
- Billing checkout/portal remains web-driven and is opened via browser.
