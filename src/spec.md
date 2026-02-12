# Specification

## Summary
**Goal:** Add a fake Premium subscription flow, in-app sharing (app + stories), and a daily notification simulation, with state persisted and UI updated across the app.

**Planned changes:**
- Implement a navigable “Go Premium” flow reachable from both the AppDrawer “Premium” item and the Profile page, including a benefits list, placeholder pricing, and a dedicated subscription success screen.
- Persist `isPremium` using existing user-state persistence (guest localStorage and authenticated `useAppUser.updateUserState`) and update UI immediately (badge/crown by username, ads hidden, premium story locks replaced with “Premium unlocked”).
- Add “Cancel Subscription” in Profile to set `isPremium=false` and instantly revert UI (badge removed, ads return where applicable).
- Add “Invite Friends – Share App” button (Profile or Home) using Web Share API with a copy-link fallback and toast confirmation.
- Upgrade StoryReader sharing to include story title + preview + URL (or app URL fallback), using Web Share API with copy-link fallback and no runtime errors when APIs are unavailable.
- Add daily notification simulation: permission CTA with exact prompt text, Profile toggle “Enable Daily Story Notifications”, persistence across reloads, immediate sample notification on grant, and an in-app “New story today!” banner/badge when real notifications can’t be shown.
- Keep new Premium/Share/Notifications UI consistent with the existing dark theme and component styling, and ensure all flows are testable end-to-end in preview.

**User-visible outcome:** Users can subscribe/cancel a fake Premium plan (with UI changes and ads hidden), share the app or a story via system share or copy-link fallback, and enable a daily story notification simulation via a Profile toggle (with a test notification or an in-app “New story today!” indicator when notifications aren’t available).
