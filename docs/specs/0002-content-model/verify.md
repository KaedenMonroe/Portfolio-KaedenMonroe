# Verify: Content model · spec 0002 · updated 2026-07-21

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## Commands

- [ ] `npm run typecheck` → 0 errors → AC-1, AC-2, AC-3, AC-6, AC-7
- [ ] `npm run build` → completes; the "Syncing content" step reports no schema errors → AC-1, AC-3, AC-6
- [ ] Temporarily set an invalid value in `content/profile.md` (e.g. `email: not-an-email`), then `rm -rf node_modules/.astro && npm run build` → build fails with `InvalidContentEntryDataError` citing the field → AC-1, AC-6 → revert the file afterward
- [ ] Temporarily remove the `image` field from a file in `content/projects/`, then `rm -rf node_modules/.astro && npm run build` → build fails with `InvalidContentEntryDataError` citing `image: Required` → AC-3, AC-6 → revert the file afterward
- [ ] Temporarily move every file out of `content/projects/`, then `rm -rf node_modules/.astro && npm run build` → build still succeeds (a "No files found" warning is expected) and `getProjects()` returns `[]` rather than throwing → AC-5 → restore the files afterward
- [ ] Call `getProjects()` (e.g. a temporary `console.log` in a page's frontmatter) → each entry's `tag` reads `IDX 01`, `IDX 02`, `IDX 03` in file order, matching list position and never a stored field → AC-4
- [ ] Set a category in `data/skills.ts` to `tags: []` and call `getSkillCategories()` → throws → AC-2 → revert afterward

## Acceptance-criteria coverage

- AC-1 (Profile schema + required field enforcement) … covered by the typecheck/build steps and the malformed-`content/profile.md` test
- AC-2 (every SkillCategory has ≥1 tag) … covered by the zero-tag throw test
- AC-3 (Project schema, filename as stable slug) … covered by the build step and the missing-`image` test
- AC-4 (position-based tag, never stored) … covered by the `getProjects()` tag-order test
- AC-5 (empty `content/projects/` → empty list, no throw) … covered by the empty-folder test
- AC-6 (malformed URL/email fails the build) … covered by the malformed-`content/profile.md` and missing-`image` tests
- AC-7 (no hardcoded profile/skills/project values in markup) … the read functions exist and are exercised above, but this criterion is only fully provable once the page (scope item 6, not yet built) sources every displayed value from `getProfile`/`getSkillCategories`/`getProjects` with no hardcoded markup — re-check this line when that feature lands
