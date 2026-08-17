# src/lib

## Overview

Framework-free helper functions: typed content queries over Astro's Content Collections, and the carousel card sizing math. No components, no Astro runtime code.

## Key files

| File        | Owns                                                                                                                                                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content.ts  | Typed query layer over Content Collections: `getBio()` (single bio entry, throws if missing), `getVisibleProjects()` (draft-filtered, order-sorted project list; validates each cover's aspect ratio via `cardSize.ts` as a side effect of the fetch) |
| cardSize.ts | Carousel card sizing constants and math (spec 0004, AC-9/AC-13): per-breakpoint tier heights, desktop width envelope, `computeDesktopCardWidth()`, and the `assertCardWidthInRange()` build-time guard                                                |

## Conventions

- Card sizing is component-level constants, not design tokens (`src/styles/global.css`); they live in `cardSize.ts`, not global CSS.
- Width scales strictly proportionally with height within a tier, so `assertCardWidthInRange()` checks only the desktop tier; mobile/tablet are treated as smaller proportional versions of the same ratio, not validated separately.
- `getVisibleProjects()` calls `assertCardWidthInRange()` for every visible project as it builds the list, so a cover image outside the allowed aspect ratio range fails the build rather than shipping a broken card, matching the project's explicit error return rule for expected failures (root `AGENTS.md`).

## Gotchas

- `CARD_HEIGHT_DESKTOP` and the desktop width envelope are tuned/confirmed against real project photos (see `docs/specs/0004-interactive-project-carousel/rationale.md`); mobile/tablet tier heights are still starting values, not yet confirmed live.

## Related specs

- [docs/specs/0004-interactive-project-carousel](../../docs/specs/0004-interactive-project-carousel)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
