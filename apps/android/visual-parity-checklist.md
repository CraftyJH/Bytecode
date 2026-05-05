# Android visual parity checklist

This checklist tracks progress toward web-to-Android visual parity.

## Phase 1 — design system foundations (completed)

- [x] Material color tokens aligned to Bytecode brand style
- [x] Typography scale for headline/title/body/label consistency
- [x] Shared card/header/badge primitives used across primary screens

## Phase 2 — key screen parity (completed)

- [x] Dashboard hierarchy mirrors web information architecture
- [x] Curriculum track/module/lesson cards styled with lock and premium indicators
- [x] Lesson reader polished with centered container and improved content rhythm
- [x] Dedicated in-app profile screen added
- [x] Dedicated in-app billing detail screen added

## Phase 3 — UX polish (completed)

- [x] Animated content transitions for card/surface state updates
- [x] Inline status/info banners for sync and billing messaging
- [x] Consistent in-app loading placeholders for secondary screens
- [x] Enhanced lesson state handling (loading/error/empty/premium) in unified style

## Phase 4 — visual QA pass (completed)

- [x] Spacing and typography pass performed on auth, dashboard, profile, billing, lesson
- [x] Badge tones normalized for free/premium/locked/past-due contexts
- [x] Navigation consistency verified (dashboard -> profile/billing/lesson -> back)
- [x] Build metadata surfaced on web footer for deploy verification

## Follow-up opportunities

- Add syntax highlighting for code blocks in lesson reader.
- Introduce pull-to-refresh on dashboard and profile/billing screens.
- Add screenshot-based visual regression checks in CI for Android Compose previews.
