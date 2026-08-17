# Verify: interactive project carousel · spec 0004 · updated 2026-08-17

_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] On a desktop viewport, drag/swipe across the carousel with a mouse; it settles on a card each time with momentum → AC-1
- [x] At a narrow (~500-606px) viewport, drag across the carousel with a mouse; it settles on a card each time, both neighbors visibly clipped → AC-1, AC-12 (2026-08-17: exercised at 500px/606px; true touch/swipe gestures still not exercised, no touch emulation tool available)
- [x] Scroll the carousel with a mouse wheel/trackpad only (no drag) → the active card advances/retreats → AC-2
- [x] Click a partially visible (not fully centered) card → it scrolls into view/center, no navigation occurs → AC-2, AC-6
- [x] Tab to the carousel → a single, visible `focus-visible` outline appears around the whole region (not per card) → AC-3
- [x] With the region focused, press `ArrowRight`/`ArrowLeft` → steps exactly one card at a time, page does not also scroll → AC-3
- [x] With the region focused, press `Home`/`End` → jumps to the first/last card → AC-3
- [x] Press `ArrowRight`/`End` repeatedly past the last project → stays on the last project, no wraparound → AC-4
- [x] Press `ArrowLeft`/`Home` repeatedly past the first project → stays on the first project, no wraparound → AC-4
- [x] Move the carousel (drag, wheel, click, or keyboard) → the shared caption below crossfades to the new active project's title/subtitle → AC-5
- [x] On desktop (`min-width: 64rem`), move the carousel to the last card → the caption's title stays at its fixed x near the bio name's left edge (8px offset), not tracking the active card → AC-5 (2026-08-17: confirmed 520.5px caption left vs 528.5px bio-name left, unchanged before and after moving to the last card)
- [x] Inspect each project card → carries no `href`/link and no click behavior beyond AC-2's scroll-into-view → AC-6
- [x] Hover a card on a hover-capable (desktop) device → it cycles forward through its cover + gallery images, resets to cover on hover-out → AC-7
- [x] Tab to the carousel → the active card cycles its gallery while the region has `:focus-visible`, resets when the region is blurred → AC-7 (2026-08-17: both halves confirmed — cycling observed while focused, reset to cover confirmed after clicking outside the region to blur it)
- [x] On a touch device, or for a project with no gallery images → only the cover image ever shows, no cycling → AC-7 (2026-08-17: engineer manually verified, no tooling available to reproduce in this session)
- [x] With `prefers-reduced-motion: reduce` set, move the carousel and hover a card → transitions are instant, not eased → AC-8 (2026-08-17: engineer manually verified, no tooling available to reproduce in this session)
- [x] Every card shares one height per breakpoint tier; each card's width is derived from its own cover's aspect ratio (not uniform) → AC-9 (2026-08-17: at 1600px wide, 3 cards measured 480px height each, widths 640/360/640px per cover ratio)
- [x] At a ~500-606px viewport, no card's width exceeds the viewport and the page never grows a horizontal scrollbar → AC-9 safety cap (2026-08-17: confirmed `document.documentElement.scrollWidth <= clientWidth` at both 500px and 606px — this closes the horizontal-overflow bug logged below on 2026-08-17 and fixed in `ba376ec`)
- [x] At the exact ~320-336px extreme → cards clamp without clipping past the edge → AC-9 (2026-08-17: engineer manually verified, the window-resize tool had an apparent ~500px floor this session and could not reach below it)
- [x] A cover image outside the desktop tier's `[350, 750]` width range makes `pnpm build` fail naming the project's content entry id → AC-13 (2026-08-17: engineer manually verified)
- [x] Visually confirm no prev/next buttons and no dot/progress indicator appear anywhere on the carousel → AC-10
- [x] With the project list overflowing the viewport, at rest → the adjacent card(s) are visibly, partially cut off at the viewport edge (both sides mid-list, one side at either end) → AC-12 (confirmed at 1440px, 1600px, and 500px widths)
- [x] With JavaScript disabled, reload the page → every project is still reachable by native touch/wheel/keyboard scroll on the fallback track → AC-1 (progressive enhancement) — confirmed structurally: the server-rendered HTML carries `role="region"`, `tabindex="0"`, and `snap-x snap-mandatory overflow-x-auto` before any script runs
- [x] With a screen reader, move the carousel and wait briefly → one announcement per resting point (not one per intermediate card during a fast flick) → AC-5 (aria-live) (2026-08-17: engineer manually verified, no screen reader available in this session's tooling)

## Commands

- [x] `pnpm build` → succeeds with `embla-carousel` installed and wired in → AC-11
- [x] `pnpm typecheck` → 0 errors → AC-11
- [x] `pnpm lint` → 0 errors → AC-11

## Value sourcing coverage

- [x] Render a card → cover image + alt text render from `project.data.cover`/`coverAlt` for every seeded project → Value sourcing row 1
- [ ] Hover/focus a card → cycling images come from `project.data.gallery`, video-typed items never appear → Value sourcing row 2 (image cycling confirmed; the video-filter half isn't exercisable, no video content is seeded yet)
- [x] Move the carousel → the "active" project used by the caption, gallery cycle, and click target all agree with Embla's `selectedScrollSnap()` (no drift between them) → Value sourcing rows 3–5
- [x] Resize the window after moving the carousel → the caption's horizontal position re-syncs correctly → Value sourcing row 6 (2026-08-17: resized repeatedly across 500/606/1440/1600px mid-session, caption position and card layout stayed correct with no glitch at each)
- [x] Toggle OS-level reduced-motion mid-session (not just at page load) → transitions switch live, no reload needed → Value sourcing row 7 (2026-08-17: engineer manually verified)

## Acceptance-criteria coverage

- AC-1 … drag/swipe (desktop + narrow viewport) + no-JS fallback steps · AC-2 … wheel + click-to-scroll steps · AC-3 … focus region + keyboard steps · AC-4 … bounded stepping steps · AC-5 … caption crossfade + fixed desktop anchor + aria-live steps · AC-6 … non-interactive card step · AC-7 … gallery cycling steps (hover, keyboard/focus + blur, touch/empty-gallery) · AC-8 … reduced-motion step · AC-9 … variable card sizing + narrow-viewport safety cap steps · AC-10 … no-buttons/no-indicator step · AC-11 … build/typecheck/lint commands · AC-12 … partial-card-cutoff step (multi-width) · AC-13 … build-time envelope validation step
