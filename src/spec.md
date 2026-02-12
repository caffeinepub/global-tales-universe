# Specification

## Summary
**Goal:** Enhance and visually unify the Premium, Sharing, and Notifications user experience across the app while preserving existing placeholder behaviors (no real subscriptions/payments, no real push scheduling).

**Planned changes:**
- Polish the Premium flow end-to-end (Go Premium, Premium Success, Profile, Drawer): improve layout hierarchy and copy, add clearer Monthly vs Yearly plan comparison/selection feedback, prevent rapid double-tap on Subscribe with a temporary loading/disabled state, and clarify Premium status + cancellation UX (still toggles isPremium immediately with existing fake subscription behavior).
- Ensure premium gating polish: hide all ad UI consistently when isPremium=true and make premium-only story indicators/states feel intentional and consistent (no confusing placeholder/lock states); switching Free/Premium updates UI immediately.
- Improve sharing UX for “Share App” and “Share Story”: provide clear feedback for success/cancel/failure, add an explicit copy-link action when Web Share API is unavailable (with toast confirmation), include readable shared text (title + optional preview) and a stable story URL when possible, and ensure share buttons reliably re-enable after completion.
- Polish Notifications UX: clearly communicate permission states (unsupported/denied/granted/not decided), keep toggle behavior consistent with browser permission (denied stays off/disabled with actionable guidance), request permission when enabling as needed, and restyle the in-app “New story today!” simulation banner to match existing Tailwind design tokens without clashing gradients; preserve existing /sw.js registration/offline behavior.
- Apply a consistent UI polish pass across these surfaces: align button variants, icon sizing, card padding, separators, and microcopy tone/capitalization using existing UI component patterns.

**User-visible outcome:** Premium screens feel clearer and harder to mis-tap, Premium status/cancel is understandable, ads disappear everywhere for Premium instantly, sharing provides reliable feedback with an explicit copy-link fallback, and notifications settings clearly reflect permission status with a more consistent in-app notification banner style.
