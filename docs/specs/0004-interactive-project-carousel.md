# 0004. Interactive project carousel

**Date**: 2026-08-13
**Status**: Proposed

## Summary

The projects section moves from a plain wrapping row of cards to a horizontally scrollable carousel: visitors can drag or swipe through project cards with momentum, use the arrow keys to step through them, and scroll with a mouse wheel or trackpad. A single caption below the carousel shows the active project's title and subtitle, crossfading as you move. On hover or keyboard focus, a card cycles through that project's extra gallery images. The look is modeled on oliviercarignan.com's carousel, with no visible prev/next buttons, kept restrained per this project's design system.

## Context

Feature 7 in scope (`docs/scope/scope.md`) calls for upgrading the static project listing (built in Slice 1) to a "free drag/swipe scroll with no visible buttons, plus arrow-key keyboard support" carousel, done when a visitor can browse every project by drag, swipe, or keyboard on both desktop and touch. The engineer pointed to oliviercarignan.com as the primary interaction reference and asked to layer extra features on top of its base pattern.

The current implementation (`src/pages/index.astro`, `ProjectCard.astro`) renders a `flex flex-wrap` list of fixed width cards, each with its own title, subtitle, and tags underneath. The content schema (`src/content.config.ts`, spec 0003) already carries a `gallery` field (image or video items) and `liveUrl`/`githubUrl` fields on every project entry, none of which the page currently renders.

This project has zero client side JavaScript today beyond what Astro itself emits; a drag/swipe carousel with momentum is the site's first genuinely interactive, script driven widget. The project's accessibility baseline is WCAG AA (root `AGENTS.md`), which is a hard constraint here: a drag dependent interaction with no visible buttons must still supply a non-drag way to operate it (WCAG 2.5.7, dragging movements), and any animation this feature adds must respect a visitor's reduced motion preference (WCAG 2.3, motion).

A related, larger decision, project detail or case study pages, is listed in scope as a separate, undecided, deferred item. The engineer confirmed cards should stay non-interactive (no click-through) in this spec, so this carousel does not depend on that decision.

## Requirements

**User stories**:
- As a recruiter or collaborator browsing the site, I want to drag, swipe, or scroll through Kaeden's projects so I can see all of them without hunting for a next button.
- As a visitor who cannot use a mouse, I want to reach and step through every project with the keyboard, with a visible focus indicator, so the carousel does not lock me out.
- As a sighted desktop visitor, I want a quick peek at each project's extra photos by hovering, so I can get a fuller sense of the work without leaving the page.

**Acceptance criteria** (the contract, each criterion is independently checkable):
- **AC-1**: A visitor can browse all visible project entries by dragging or swiping (mouse or touch), with momentum and snap-to-card settling, at common desktop and mobile viewport widths.
- **AC-2**: A visitor can also move the carousel without dragging: a mouse wheel or trackpad scrolls it, and clicking a partially visible card (not a link, no navigation) scrolls it into view. Together these satisfy WCAG 2.5.7's single-pointer, non-drag alternative without adding a visible button.
- **AC-3**: The whole carousel is one focusable region (not one tab stop per card) with a visible `focus-visible` outline; `ArrowLeft`/`ArrowRight` step exactly one card at a time (each preventing the page from also scrolling), `Home`/`End` jump to the first/last card, all with the same snap behavior as drag. When the carousel has only one snap position (nothing to scroll), the region drops its `tabindex`/`role` entirely rather than becoming a focus stop that does nothing (see Key invariants).
- **AC-4**: Scrolling and keyboard stepping are bounded: the carousel stops at the first and last project in both directions, no infinite loop.
- **AC-5**: A single title/subtitle label below the carousel updates to the currently active (centered) project as the carousel moves (drag, wheel, click, or keyboard), crossfading its text and sliding horizontally to stay aligned under that card, replacing today's per-card caption. Its horizontal position is the visitor's cue for which card it describes; the update is also exposed to assistive tech (not a purely visual change). Tags are not shown in this view.
- **AC-6**: Project cards carry no link and no navigation of any kind, unchanged from today; a card's only click behavior is the AC-2 scroll-into-view (paging the carousel, not opening anything).
- **AC-7**: On hover-capable devices (`(hover: hover)`), a card cycles forward through its cover image plus its `gallery` image items (crossfade, video-typed gallery items filtered out) while the pointer hovers it, or while it is the active card and the carousel region has `:focus-visible`; it resets to the cover image on hover-out or blur. It never auto-cycles on load or otherwise. On touch devices, and for any project whose `gallery` has no image items, only the cover image is shown.
- **AC-8**: When the visitor has `prefers-reduced-motion: reduce` set, the drag/snap animation and the caption and gallery crossfades are instant (no eased transition) instead of animated.
- **AC-9**: Cards keep today's width at every real desktop/tablet size (`w-72`, clamped to `w-[min(18rem,78vw)]` so a card cannot clip past the viewport edge below about 336px wide) and existing `rounded-md` / `bg-secondary` styling from `design.md`; no color or spacing token is introduced beyond the existing seven.
- **AC-10**: No visible previous/next buttons and no position indicator (dots or progress bar) appear anywhere on the carousel.
- **AC-11**: `pnpm build` succeeds with the new carousel dependency installed and wired in.
- **AC-12**: At rest, whenever the project list overflows the carousel's viewport (which stays inside the page's existing `max-w-4xl px-6` container), the adjacent card(s) are visibly, partially cut off at the viewport's edge (both sides when the active card is not the first or last, one side at either end), the only cue that more content exists, consistent with AC-10's no-buttons/no-indicator constraint.

## Options considered

### Option 1: Embla Carousel (a lightweight, framework-agnostic drag/scroll library)

A small (about 7KB gzipped), dependency-free, MIT licensed carousel engine with built-in velocity-based drag momentum and snap-point handling, used via its vanilla JS API inside an Astro `<script>` tag. Actively maintained (major version 8).

**Pros**:
- Momentum and snap physics are pre-tuned and battle-tested, closely matching the reference site's feel without hand-tuning easing curves.
- Small footprint for what it replaces (hand-written drag, momentum, and snap-point math).
- Framework-agnostic vanilla JS API drops cleanly into an Astro `<script>` tag with no build tooling changes.

**Cons**:
- The first real JavaScript dependency this project has taken on.
- Its core operates on transform-based scrolling, not the browser's native `overflow` scroll, so mouse wheel and trackpad scroll do not move it for free; a small wheel handler has to be added to satisfy AC-2.
- Keyboard arrow support is not built in; it has to be wired by hand against Embla's `scrollPrev`/`scrollNext` API (needed regardless, since AC-3 wants one focusable region rather than Embla's default expectation).

### Option 2: Hand-rolled native CSS scroll-snap + vanilla JS

`overflow-x: auto` with `scroll-snap-type: x mandatory` on the card row, native browser touch and trackpad scrolling for free, plus a small hand-written `mousedown`/`mousemove`/`mouseup` handler to translate desktop mouse drags into `scrollLeft` changes.

**Pros**:
- Zero new dependencies; native scroll-snap gives touch momentum, snap points, and mouse wheel/trackpad scrolling (AC-2) for free, with no extra wiring.
- Full control over every behavior, nothing to configure around a library's defaults.

**Cons**:
- Matching the reference site's specific momentum/deceleration feel for desktop mouse drag has to be hand-tuned (easing curve, velocity sampling) rather than reusing a pre-tuned implementation.
- More custom code for this project to own and maintain long term (drag physics is a known source of subtle bugs: velocity calculation, resize handling, RTL).

### Option 3: Splide

A fuller-featured carousel library (about 27KB gzipped, MIT) with built-in momentum physics and native keyboard arrow support plus ARIA wiring out of the box.

**Pros**:
- Keyboard navigation and ARIA attributes ship built in, less custom wiring than Option 1 for AC-3.

**Cons**:
- About 4x Embla's weight for a single carousel on an otherwise dependency-free static site.
- Its keyboard model assumes one tab stop per slide, the opposite of the single-region pattern AC-3 asks for, so its built-in behavior has to be partly overridden anyway.

## Decision

**Chosen option**: Option 1: Embla Carousel

Build the carousel on Embla Carousel's vanilla JS core, with a hand-written wheel/trackpad handler, a single focusable region wired to Embla's `scrollPrev`/`scrollNext`/`select` API, and `prefers-reduced-motion` handling layered on top.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`) · `tailwind-css` (`paulrberg/agent-skills`, `.agents/skills/tailwind-css/`) · `accessibility` (`addyosmani/web-quality-skills`, `.agents/skills/accessibility/`) · `pnpm` (`onmax/nuxt-skills`, `.agents/skills/pnpm/`)

## Rationale

Embla's built-in momentum and snap physics are the closest match to the reference site's feel without the project hand-tuning an easing curve itself (basis: the engineer's stated reference, oliviercarignan.com), and at 7KB it stays consistent with this project's otherwise minimal footprint (basis: `AGENTS.md`, functional/minimal style). Its gap against the native approach, no free wheel/trackpad scroll, is a small, one-time cost (a single wheel handler) against a real requirement either option must meet: WCAG 2.5.7 requires *some* non-drag pointer path regardless of implementation (basis: `.agents/skills/accessibility/SKILL.md`, "Dragging movements (2.5.7)"), so this is not unique overhead introduced by choosing Embla.

The native scroll-snap option (Option 2) is a reasonable alternative, and would get AC-2 for free, but the momentum feel that most directly answers the engineer's reference is something Embla has already solved; re-deriving that with hand-tuned physics is exactly the kind of drag-interaction subtlety (velocity sampling, resize handling) most likely to produce visible bugs first. Splide (Option 3) solves the keyboard/ARIA question out of the box, but that box assumes a different keyboard model (one tab stop per slide) than the single-region pattern this spec settled on for AC-3, so its built-in behavior would be partly overridden anyway, at nearly 4x the weight.

## Feature design

**Data model sketch**: no changes. Reuses the existing `projects` collection (`src/content.config.ts`, spec 0003) as is: `title`, `subtitle`, `cover`, `coverAlt`, `gallery` (image or video items, now rendered for the first time), `tags` (unused in this view). `order` continues to control carousel sequence via the existing `getVisibleProjects()` sort.

**API surface**: none. This is a static, client side rendering change; no new route, endpoint, or server logic.

**Value sourcing** (every value this feature displays, and where it comes from):

| Action | Value produced / displayed | Source |
|---|---|---|
| Render a card | cover image, alt text | `project.data.cover`, `project.data.coverAlt` (existing) |
| Hover/focus a card (hover-capable only) | the cycling gallery images (image items only, `type: "video"` filtered out; `loading="lazy"`) | `project.data.gallery` (existing) |
| Move the carousel | which project is "active" | derived client side from Embla's `selectedScrollSnap()`, not stored |
| Update the shared caption | active project's title, subtitle | `project.data.title`, `project.data.subtitle` (existing), keyed off the active index above |
| Click a partially visible card | scroll target index | the clicked card's own snap index, read from its position in the track (a non-drag AC-2 path, not a link) |
| Position the shared caption | the caption's horizontal offset | derived client side from the active (centered) card's `offsetLeft` and width relative to the carousel viewport, recalculated on `select`/`settle` and on resize |
| Animate or not | whether to skip transitions | `window.matchMedia('(prefers-reduced-motion: reduce)')`, a browser API, not content data |

**Key invariants**:
- The carousel must remain operable without a drag gesture: mouse wheel and trackpad scrolling always move it (AC-2), independent of whether Embla's own drag handling is active.
- Embla is configured explicitly, not left at defaults: `align: 'center'`, `containScroll: 'trimSnaps'`, `loop: false`, `dragFree: false`. "Active card" is defined once, the card centered in the viewport per `selectedScrollSnap()` under this config, and drives the shared caption's text and horizontal position (AC-5), the hover/keyboard-triggered gallery cycle (AC-7), and the click-to-scroll target (AC-2); there is exactly one definition of "active", not two. The visual crossfade and caption repositioning follow Embla's `select` event; the `aria-live` announcement follows `settle` only, debounced about 150ms, so a fast flick fires one assistive-tech announcement, not one per intermediate card.
- The carousel container is the only new tab stop this feature adds: `role="region"`, `aria-label="Projects"`, `tabindex="0"` (no `aria-roledescription="carousel"`: this markup has no slides or controls for that authoring pattern to describe, and AC-10 rules out the controls an AT user would expect to find from it), using the existing `focus-visible:outline-2 focus-visible:outline-offset-2` treatment with `--color-accent` (design.md). `ArrowLeft`/`ArrowRight`/`Home`/`End` call `preventDefault()` so they do not also scroll the page.
- If the project list does not overflow the viewport (few projects, or a wide enough viewport), Embla reports a single snap position: the region drops `tabindex`, `role`, and keyboard handling entirely after init, rendering as a plain static row rather than a focusable stop that does nothing.
- Progressive enhancement: the track's base (pre-JS) state is a native `overflow-x: auto; scroll-snap-type: x mandatory` row with `scroll-snap-align: center` on each card (matching Embla's centered alignment once hydrated), already scrollable by touch, wheel, and keyboard with zero script. Embla's `<script>` upgrades it (switching to its own `overflow-hidden` viewport) only after it initializes; if the script fails to load, visitors keep native scroll-snap browsing. The caption is server-rendered, statically positioned, with the first visible project's title/subtitle so it is never empty before hydration.
- The shared caption's text change is exposed to assistive tech (`aria-live="polite"` on the caption region), not a purely visual crossfade.
- `prefers-reduced-motion` is read live via a `MediaQueryList` `change` listener, not once at load, and triggers `emblaApi.reInit()` with its scroll duration zeroed; drag tracking itself stays 1:1 with the pointer either way (direct manipulation, not animation), only the eased settle/snap and the crossfades are affected.
- Window resize is handled by Embla's built-in `ResizeObserver`-driven re-init, which preserves the selected index; the caption needs no manual re-sync on resize.
- No color, spacing, or radius value is introduced outside the seven tokens already defined in `src/styles/global.css`; the one new value this feature needs, the crossfade duration and easing, is added as its own token, `--duration-fade: 200ms` / `ease-out` in the `@theme` block, reused by both the caption and gallery crossfades (and zeroed under reduced motion, above).

**Security model**: not applicable. Fully public, static content; no user input is collected and no auth is involved.

**Configuration required**: none (no new env vars or credentials; `embla-carousel` is a build-time npm dependency only).

**Critical test scenarios**:
- Happy path: drag through every project card on a touch viewport and a desktop viewport, confirm momentum and snap settle on a card each time, verifies **AC-1**.
- Keyboard only: tab to the carousel region, confirm a visible focus outline, then step through every project with `ArrowLeft`/`ArrowRight`, confirm it stops (does not wrap) at the first and last project, verifies **AC-3**, **AC-4**.
- Non-drag pointer: scroll the carousel with a mouse wheel/trackpad only, and separately click a partially visible card, with no drag gesture performed either way, confirm both move the carousel and the caption updates its text and horizontal position to the new centered card, verifies **AC-2**, **AC-5**.
- Reduced motion: with `prefers-reduced-motion: reduce` set, move the carousel and hover a card, confirm transitions are instant rather than eased, verifies **AC-8**.
- Touch gallery fallback: on a touch viewport, confirm a card shows only its cover image (no gallery cycle) while the caption still updates correctly, verifies **AC-7**.
- No overflow: with the viewport wide enough (or projects few enough) that the row does not overflow, confirm the region is not a dead focus stop and drag/wheel/keys are no-ops, verifies **AC-3**, **AC-12**.
- No script: with JavaScript disabled, confirm every project is still reachable by native touch/wheel/keyboard scrolling on the fallback track, verifies AC-1's intent is not lost when the script fails to load.

## Build plan

1. Add the `embla-carousel` dependency pinned to its current major version (`pnpm add embla-carousel@^8`); create `ProjectCarousel.astro` with a native `overflow-x: auto; scroll-snap-type: x mandatory` track as its base markup (progressive enhancement, see Key invariants), replacing the `flex flex-wrap` list in `src/pages/index.astro`, keeping the existing card width (clamped per AC-9) and `ProjectCard` visuals; server-render the caption from the first visible project. Confirm the installed version's `align`/`containScroll`/`loop` defaults against its docs before wiring steps 2 to 4. Satisfies **AC-1**, **AC-9**, **AC-11**, **AC-12**.
2. Initialize Embla on top of that base markup with `align: 'center'`, `containScroll: 'trimSnaps'`, `loop: false`, `dragFree: false`, so drag is bounded, momentum-tuned, and snaps to card, centered, on both mouse and touch. Satisfies **AC-1**, **AC-4**, **AC-12**.
3. Add a wheel/trackpad handler that moves the carousel via Embla's scroll API on horizontal wheel/trackpad input (`deltaX`; a plain vertical mouse wheel's `deltaY` is left alone so the page still scrolls normally), calling `preventDefault()` only when the carousel can still move further (`canScrollNext()`/`canScrollPrev()`); and a click handler on each card that scrolls it to center via `scrollTo(index)` (no navigation). Satisfies **AC-2**.
4. Make the carousel container a single focusable region (`role="region"`, `aria-label="Projects"`, `tabindex="0"`, the existing focus-visible treatment, no `aria-roledescription`) and wire `ArrowLeft`/`ArrowRight` to `scrollPrev`/`scrollNext` and `Home`/`End` to the first/last snap, each calling `preventDefault()`, bounded at the ends; after init, if Embla reports only one snap position, drop the region's `tabindex`/`role`/keyboard handling entirely. Satisfies **AC-3**, **AC-4**.
5. Replace `ProjectCard`'s per-card title/subtitle/tag block with one shared caption below the carousel; subscribe to Embla's `select` event to read the active (centered) card's index, crossfade the caption's title/subtitle text (`--duration-fade`), and translate it horizontally to the active card's `offsetLeft`/width so its position is the cue for which card it names; also recompute that position on resize. Subscribe to `settle` (debounced about 150ms) to update an `aria-live="polite"` copy of the same text for assistive tech. Drop tags from this view. Satisfies **AC-5**.
6. Add `prefers-reduced-motion` handling via a live `MediaQueryList` `change` listener: when set, remove the caption/gallery crossfade transition and call `emblaApi.reInit()` with a zeroed scroll duration. Satisfies **AC-8**.
7. Add gallery crossfade cycling through `cover` + image-typed `gallery` items (`--duration-fade`, forward-only, loops back to cover), triggered by pointer hover under `(hover: hover)` or by the active card having `:focus-visible`, resetting to cover on hover-out/blur, never on load; confirm touch viewports and empty-gallery projects show only the cover image, and gallery images use `loading="lazy"`. Satisfies **AC-7**.
8. Confirm cards carry no `href` and no navigation, only the AC-2 scroll-into-view click handler, and that no position indicator was added anywhere. Satisfies **AC-6**, **AC-10**.
9. `pnpm build`; manual pass at mobile/tablet/desktop widths (including a narrow ~320px phone width), a keyboard-only pass, a mouse-wheel-only pass, a no-JS pass (confirm the native scroll-snap fallback), and a `prefers-reduced-motion` check. Satisfies **AC-11**, re-verifies **AC-1** through **AC-12**.

## Consequences

**Positive**:
- Matches the reference interaction the engineer asked for, while staying inside this project's existing token and component system.
- Puts the `gallery` schema field (spec 0003) to real use for the first time.
- Small dependency footprint (about 7KB) for what would otherwise be substantial hand-written drag/momentum/snap code.

**Negative / tradeoffs**:
- This is the site's first real client side JavaScript dependency; previously the build was Astro-only with no runtime library.
- The shared caption means a card scrolled partway off-screen no longer shows its own caption inline, a real change from today's per-card layout, in exchange for the reference's motion feel.
- Gallery cycling only reaches hover-capable (desktop) visitors; touch visitors do not get the extra gallery images anywhere in this view.
- Wiring wheel-scroll support, the single-region ARIA pattern, and reduced-motion handling by hand adds custom code Embla does not provide out of the box.
- With only 3 seeded projects and roughly 80px of desktop overflow past the `max-w-4xl` container, Embla's drag-momentum feel (its main advantage over Option 2) is barely exercisable today; if it does not read as materially better than native scroll-snap once built, that is the signal to fall back to Option 2, which would also satisfy AC-2 with no wheel handler at all.

**Neutral**:
- Tags stop appearing in the projects section for now (an explicit, deliberate cut, not an oversight); the `tags` field stays in the schema, unused here, until a later feature restores their display.
- `liveUrl`/`githubUrl` remain unused; card click-through stays out of scope pending the separate, deferred project-detail-pages decision.
- `design.md`'s Composition patterns paragraph (spec 0002) currently describes each ProjectCard as carrying "a title/subtitle/tag stack below it"; AC-5 makes that line stale (see Follow-up).

## Follow-up

- [ ] Project detail / case study pages is still an undecided, deferred scope item; revisit whether cards should become clickable once that spec exists.
- [ ] Tag display was intentionally dropped from this view at the engineer's request; design where tags reappear (e.g. per-card, in the shared caption, or a filter) in a later pass.
- [ ] The `gallery` schema supports `type: "video"` items, but no seeded project uses one yet. This spec has the crossfade filter video items out entirely for now; revisit (poster frame vs. autoplay) before a project with video content is added.
- [ ] Update `design.md`'s Composition patterns paragraph (governed by spec [0002](0002-design-system-ui-foundation/index.md)): it still describes each ProjectCard as carrying "a title/subtitle/tag stack below it", which AC-5 makes stale once this ships.

## References

**Project sources** (verifiable, in this repo):
- `AGENTS.md`, functional/minimal style and the WCAG AA accessibility baseline
- `design.md`, the restrained design system (tokens, focus-visible treatment, no decoration beyond the one accent) governed by spec [0002](0002-design-system-ui-foundation/index.md)
- `src/content.config.ts` and spec [0003](0003-content-and-data-model/index.md), the `gallery`/`liveUrl`/`githubUrl` fields this feature starts using
- `docs/scope/scope.md`, feature 7 ("Interactive project carousel"), the base interaction requirement this spec builds on

**Practices & standards**:
- WCAG 2.5.7 (Dragging Movements) and WCAG 2.3 (Motion), per `.agents/skills/accessibility/SKILL.md`
- The WAI-ARIA carousel/scrollable-region authoring pattern (a single focusable region with `aria-live` updates, rather than per-item tab stops, for a non-interactive item set)

**Links** (web verified during this spec's research):
- Embla Carousel: https://github.com/davidjerleke/embla-carousel
- Keen Slider (considered, not chosen): https://keen-slider.io/docs
- Splide (Option 3): https://github.com/Splidejs/splide
- CSS scroll-snap (native alternative, Option 2): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Using_scroll_snap_events
