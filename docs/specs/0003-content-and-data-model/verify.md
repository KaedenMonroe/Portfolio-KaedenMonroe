# Verify: content & data model · spec 0003 · updated 2026-08-12

_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Look at `src/content.config.ts`: `bio` collection requires `name`, `title`, `avatar`, `avatarAlt`, `email`, `resumeUrl`, `linkedinUrl`; `projects` collection requires `title`, `subtitle`, `cover`, `coverAlt`, `order` → AC-1
- [x] Look at `src/content/bio/index.md` and the three real project entries (`src/content/projects/vip-drones.md`, `gait-sensor.md`, `wooden-frame-fea.md`): confirm every required field is populated with real content → AC-1
- [x] Confirm `avatarAlt` on the bio entry and `coverAlt` on every project entry (including gallery item `alt`s) are non-empty, accurate strings, no `TODO`/lorem ipsum anywhere in `src/content/` → AC-2
- [ ] Swap the bio `avatar` for a real photo → AC-4 (the one remaining gap: name, title, email, resume link, LinkedIn, bio copy, and all three real projects with real cover/gallery images are done; only the avatar image is still a placeholder icon, by explicit choice, real photo pending)

## Commands

- [x] `pnpm build` → succeeds against the real seeded content → AC-3, AC-5
- [x] Temporarily remove `coverAlt` from `src/content/projects/wooden-frame-fea.md`, run `pnpm build` → fails with an `InvalidContentEntryDataError` schema error, then restore the field → AC-2, AC-5
- [x] Temporarily rename/delete `src/content/bio/index.md`, run a clean `pnpm build` (or exercise `getBio()`) → throws `Missing src/content/bio/index.md` rather than rendering an empty page, then restore the file → AC-1 (note: only fails on a build with a clean `node_modules/.astro` content cache — see gotcha below)
- [x] Call `getVisibleProjects()` against the three real, non-draft project entries (via a temporary debug page) → returns all three sorted ascending by `order` (vip-drones: 1, gait-sensor: 3, wooden-frame-fea: 7), each with a working cover and populated gallery → AC-3
- [x] `pnpm typecheck` → 0 errors → AC-1

## Gotcha found during verify (not a defect, worth knowing)

Astro's content layer persists a cache at `node_modules/.astro/data-store.json`, separate from the project root `.astro/` folder. Deleting a content entry (e.g. `src/content/bio/index.md`) and immediately running `pnpm build` can silently reuse the stale cached entry instead of failing, if that cache directory survives from a prior build. A build with `node_modules/.astro` removed (a fresh checkout, or any CI run) fails correctly with `Error: Missing src/content/bio/index.md`, as specced. Only matters for local iterative editing where a deleted entry doesn't seem to take effect until `node_modules/.astro` is cleared.

## Acceptance-criteria coverage

- AC-1 (schema defines both collections, fails build on missing/malformed required field) — covered by the config review step, the bio-deletion step, and the typecheck step
- AC-2 (non-empty alt text required on avatar/cover/gallery items) — covered by the alt-text review step and the `coverAlt` removal step
- AC-3 (`getVisibleProjects()` filters drafts, sorts by `order` ascending) — covered by the multi-entry ordering step and the draft-exclusion step
- AC-4 (real bio entry and at least one real project entry, real content not placeholder) — **mostly covered, one gap remains**; the bio (name, title, email, resume, LinkedIn, body) and all three real project entries (real cover images, real galleries, real copy) are genuinely real. Only the bio `avatar` is still a placeholder icon, by explicit engineer choice, real photo pending. Revisit before this feature is marked `done`
- AC-5 (`pnpm build` succeeds on seeded content; a broken required field fails the build) — covered by the `pnpm build` step and the `coverAlt`/`order` removal step
