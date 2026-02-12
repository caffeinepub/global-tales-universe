# Specification

## Summary
**Goal:** Apply an iterative UI/UX polish pass across Premium, Sharing, and Notifications to improve clarity, consistency, and feedback while preserving the existing placeholder (fake) subscription behavior.

**Planned changes:**
- Polish the Premium flow (Go Premium, Premium Success, Profile, App Drawer): improve copy/layout hierarchy, add clearer plan comparison and selected-state feedback, protect Subscribe from accidental double-taps, and clarify Premium status + cancellation wording.
- Ensure premium gating polish: consistently hide all ad placements for premium users; keep non-premium ad placeholders consistent without layout jumps; make premium-only/locked story states intentional with clear labels/CTAs (no awkward blank spaces).
- Improve sharing UX for “Share App” and “Share Story”: add success/cancel/failure feedback, handle errors gracefully, provide a clear copy-link fallback when system share is unavailable, and show loading/disabled states during share.
- Polish Notifications UX: keep toggle state aligned with browser permission state, clearly explain outcomes (granted/denied/dismissed) and how to enable when denied, and restyle the “New story today!” simulation banner to match the app theme.
- Apply consistent UI styling across these surfaces: align button variants/sizes, icon sizing/spacing, card padding/separators, typography scale, and microcopy tone (English).

**User-visible outcome:** Premium, sharing, and notifications screens feel more consistent and understandable, provide clearer feedback for actions and permission states, avoid accidental repeat actions, and present premium/ad/locked states more intentionally—without adding real payments.
