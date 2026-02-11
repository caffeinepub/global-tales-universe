# Specification

## Summary
**Goal:** Add PWA packaging to the Global Tales Universe web app so it can be installed on mobile home screens, run in standalone mode, and support offline-first loading of the app shell.

**Planned changes:**
- Add and link a web app manifest (name/short_name, standalone display, start_url, theme/background colors, icon entries including 512x512).
- Add a service worker with offline-first caching for the app shell and static assets, while preserving existing localStorage-based offline story downloads.
- Register the service worker from the frontend without modifying immutable paths.
- Add a lightweight in-app install prompt UX that appears when installable, triggers the browser install flow, and respects dismissal (persisted locally).
- Enhance `frontend/index.html` with PWA + iOS meta/link tags (manifest, theme color, apple-touch-icon, status bar style) and a mobile-first viewport configuration.
- Ensure required generated image assets exist under `frontend/public/assets/generated` and are referenced as static files (including splash logo and cover images).

**User-visible outcome:** Users can install Global Tales Universe to their device home screen, launch it as an app-like standalone experience, and continue using core UI routes offline after the first load, without breaking existing offline story downloads.
