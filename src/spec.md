# Specification

## Summary
**Goal:** Add a persistent top header with a logo and hamburger button, plus a left-side drawer navigation, without disrupting the existing bottom navigation and layouts.

**Planned changes:**
- Add a top app header (app bar) to the post–Splash/Onboarding main layout, containing a left hamburger/menu button and a static logo image.
- Implement a left-side slide-in drawer that opens from the hamburger button and closes via explicit close/outside click and after selecting a navigation item.
- Add drawer menu items that navigate via TanStack Router to existing routes: Home (/), Categories (/categories), Search (/search), Favorites (/favorites), Profile (/profile), Premium (/premium), with active-route visual indication.
- Adjust main content layout to account for header height so content remains visible/scrollable, while keeping BottomNav behavior unchanged and ensuring full-screen experiences (e.g., StoryReader) still render correctly.

**User-visible outcome:** After Splash + Onboarding, users see a header with a logo and a hamburger button; tapping it opens a drawer with links to key sections, while the existing bottom navigation continues to work as before.
