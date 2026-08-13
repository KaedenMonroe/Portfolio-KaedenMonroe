# Content model

## Files

- Schema: `src/content.config.ts` (the `bio` and `projects` collections, Zod schemas via `astro:content`).
- Query layer: `src/lib/content.ts` (`getBio()`, `getVisibleProjects()`). Pages read content only through these two functions, never `getCollection`/`getEntry` directly, so filtering (`draft`) and sorting (`order`) stay in one place.
- Content data: `src/content/bio/index.md` (one singleton entry), `src/content/projects/<slug>.md` (one file per project).

## Conventions

- A local image (`avatar`, `cover`, a `gallery` image item) is written with the `~assets` alias (`tsconfig.json`, resolves to `src/assets/`), e.g. `cover: ~assets/projects/<slug>/cover.jpg`. It is processed through `astro:assets` at build time.
- A gallery video item's `src` always starts with `/videos/<slug>/...`, served unprocessed from `public/videos/<slug>/`.
- Every alt field (`avatarAlt`, `coverAlt`, a gallery item's `alt`) is required and non-empty; the build fails on a missing one.
- `draft: true` excludes a project from `getVisibleProjects()` in every environment (no separate preview mode).
- `order` sets manual display order (lower first); a collision ties, broken by `date` then filename.

## Governing spec

[0003](../../docs/specs/0003-content-and-data-model/index.md) has the full data model, Zod schema, and rationale.

_Drafted by /sync from the introducing change, worth a quick human pass._
