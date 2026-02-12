# Specification

## Summary
**Goal:** Fix onboarding navigation so Next/Get Started/Skip work reliably and the app consistently transitions to the main UI without getting stuck or showing stale pages.

**Planned changes:**
- Repair onboarding step state/progress updates so "Next" advances through steps and "Get Started" completes onboarding on the final step.
- Ensure "Skip" exits onboarding immediately from any step and consistently renders the main app UI.
- Update post-onboarding behavior to reliably navigate/render the Home route ("/") so users always land on a visible main page after completion.
- Address any service worker/PWA caching behavior that can cause stale route content after navigation or deployments.

**User-visible outcome:** Users can move through onboarding with Next, finish with Get Started, or exit with Skip, and the app reliably shows the main screen immediately afterward with correct page content during navigation.
