# Specification

## Summary
**Goal:** Fix the UI regression where buttons appear as plain text by restoring expected button styling across affected screens in both Preview and Production builds.

**Planned changes:**
- Identify why button styles are not being applied on affected pages/components and adjust usage/composition so buttons render with padding, background/border, hover, and focus styles (without modifying read-only UI component source files).
- Verify and restore visible focus styling and readability in both light and dark themes on key CTA locations (e.g., Premium subscribe, RouteErrorFallback navigation, install prompt).
- Add a minimal, repeatable regression check (manual checklist or dev-only verification step) covering at least two representative screens and at least two button variants to confirm styling remains present after builds.

**User-visible outcome:** Buttons across the previously affected pages render as clearly recognizable, properly styled buttons (not plain text) with appropriate hover/focus states in both Preview and Production builds.
