# Specification

## Summary
**Goal:** Add a basic Stories creation flow and a My Stories page with Tamil/English UI support, while fixing reported UI issues around Profile story updates, Favorites/likes visibility, login logo presentation, and the “impression page” layout.

**Planned changes:**
- Add a Create Story screen that allows submitting required text with an optional single JPG/PNG image, plus an emoji insert option in the editor.
- Add a My Stories page reachable from navigation/Profile, listing the current user’s stories newest-first with empty state, timestamps, text preview, and optional image thumbnail, plus a prominent “+ Create” button.
- Support two identity modes for Stories: guest (localStorage) and authenticated (Internet Identity + Motoko persistence per principal).
- Add optional 24-hour auto-expiration so expired stories no longer appear in My Stories (for both guest/local and authenticated/backend stories).
- Extend the Motoko backend API to create and list authenticated user stories, including optional image storage via the existing blob-storage mixin.
- Replace any placeholder “coming soon” error in the story save path and ensure My Stories refreshes after creating a story (guest and authenticated).
- Add bilingual (English + Tamil) i18n keys and wire all new Stories UI strings through the existing translation helper.
- Fix Profile page “My Stories” section so it uses the correct data source and updates reliably after create/edit.
- Fix Favorites/likes visibility so favorite cards show correct favorite state and a visible like count consistently, and toggling updates promptly.
- Improve login visuals so the logo is crisp, correctly sized across mobile/desktop, has a graceful missing-asset fallback, and avoids layout shift.
- Fix the reported “impression page” layout/appearance issues for common mobile widths (~360px) to prevent overlap/clipping/readability problems.

**User-visible outcome:** Users can create short stories (text with optional image and emojis), see them in a dedicated My Stories list (guest or logged-in), and the app’s Profile Stories, Favorites/likes display, login logo, and the “impression page” layout render more reliably and professionally.
