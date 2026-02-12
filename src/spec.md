# Specification

## Summary
**Goal:** Fix Adults/Kids mode filtering and story feed reliability, add Like/Share/Comment actions, and correct profile name/username handling with stable local image fallbacks.

**Planned changes:**
- Persist and consistently apply Adults/Kids mode across Home, Categories, Category Detail, and Story Reader, updating lists immediately when toggled.
- Align story fetching with current UI preferences (language + mode) and ensure seeded fallback stories render when backend fetches fail.
- Add Like, Share, and Comment controls in the Story Reader, with persistence for authenticated users via backend and for guests via local storage.
- Fix profile data model and UI to support editing/saving/displaying both name and username, with stable rendering and clear English fallbacks when unset.
- Ensure generated static assets are present under `frontend/public/assets/generated` and used as cover/avatar/icon fallbacks without relying on backend asset loading.

**User-visible outcome:** Users can switch between Adults and Kids and see correctly filtered categories/stories without refreshing, reliably see stories in Home and open them in the reader, like/share/comment on stories with state retained after reload, and view/edit a profile with correct name/username and dependable local fallback images.
