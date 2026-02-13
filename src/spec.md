# Specification

## Summary
**Goal:** Eliminate remaining in-app navigation paths that land on “Page Not Found / Page currently not available” in draft preview, and make route param handling more robust.

**Planned changes:**
- Audit all navigation entry points (bottom navigation, side drawer, category chips/buttons, story cards, continue-reading, profile links) and update them to use only valid TanStack Router route paths defined in `frontend/src/App.tsx` routeTree.
- Replace any string-built/hand-assembled paths with route-template navigation using params (e.g., navigating to story/category routes via `{ to: ..., params: ... }`) to prevent typos/mismatches.
- Harden Story Reader and Category Detail route param parsing so malformed/invalid params don’t crash into router error/not-found; show a friendly in-app error state (English) with a working “Go Home” (and/or Categories/Home) action.
- Add lightweight runtime diagnostics using the existing `logOnce` pattern for: (1) navigation exceptions (log attempted target), and (2) when the route error/not-found fallback renders (log current location).

**User-visible outcome:** Tapping any tab, category, or story reliably opens the correct screen instead of “Page Not Found,” and invalid story/category URLs show a friendly error with a button to return to a safe screen.
