# Verify: interactive project carousel · spec 0004 · updated 2026-08-13

_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] On a desktop viewport, drag/swipe across the carousel with a mouse; it settles on a card each time with momentum → AC-1
- [ ] On a mobile/touch viewport, swipe across the carousel; it settles on a card each time → AC-1
- [ ] Scroll the carousel with a mouse wheel/trackpad only (no drag) → the active card advances/retreats → AC-2
- [ ] Click a partially visible (not fully centered) card → it scrolls into view/center, no navigation occurs → AC-2, AC-6
- [ ] Tab to the carousel → a single, visible `focus-visible` outline appears around the whole region (not per card) → AC-3
- [ ] With the region focused, press `ArrowRight`/`ArrowLeft` → steps exactly one card at a time, page does not also scroll → AC-3
- [ ] With the region focused, press `Home`/`End` → jumps to the first/last card → AC-3
- [ ] Press `ArrowRight`/`End` repeatedly past the last project → stays on the last project, no wraparound → AC-4
- [ ] Press `ArrowLeft`/`Home` repeatedly past the first project → stays on the first project, no wraparound → AC-4
- [ ] Move the carousel (drag, wheel, click, or keyboard) → the shared caption below crossfades to the new active project's title/subtitle and slides horizontally to stay aligned under it → AC-5
- [ ] Inspect each project card → carries no `href`/link and no click behavior beyond AC-2's scroll-into-view → AC-6
- [ ] Hover a card on a hover-capable (desktop) device → it cycles forward through its cover + gallery images, resets to cover on hover-out → AC-7
- [ ] Tab to the carousel and arrow to a project with gallery images → the active card cycles its gallery while the region has `:focus-visible`, resets on blur → AC-7
- [ ] On a touch device, or for a project with no gallery images → only the cover image ever shows, no cycling → AC-7
- [ ] With `prefers-reduced-motion: reduce` set, move the carousel and hover a card → transitions are instant, not eased → AC-8
- [ ] At a narrow (~320-336px) viewport → cards clamp to `w-[min(18rem,78vw)]` without clipping past the edge → AC-9
- [ ] Visually confirm no prev/next buttons and no dot/progress indicator appear anywhere on the carousel → AC-10
- [ ] With the project list overflowing the viewport, at rest → the adjacent card(s) are visibly, partially cut off at the viewport edge (both sides mid-list, one side at either end) → AC-12
- [ ] With JavaScript disabled, reload the page → every project is still reachable by native touch/wheel/keyboard scroll on the fallback track → AC-1 (progressive enhancement)
- [ ] With a screen reader, move the carousel and wait briefly → one announcement per resting point (not one per intermediate card during a fast flick) → AC-5 (aria-live)

## Commands

- [ ] `pnpm build` → succeeds with `embla-carousel` installed and wired in → AC-11
- [ ] `pnpm typecheck` → 0 errors → AC-11
- [ ] `pnpm lint` → 0 errors → AC-11

## Value sourcing coverage

- [ ] Render a card → cover image + alt text render from `project.data.cover`/`coverAlt` for every seeded project → Value sourcing row 1
- [ ] Hover/focus a card → cycling images come from `project.data.gallery`, video-typed items never appear → Value sourcing row 2
- [ ] Move the carousel → the "active" project used by the caption, gallery cycle, and click target all agree with Embla's `selectedScrollSnap()` (no drift between them) → Value sourcing rows 3–5
- [ ] Resize the window after moving the carousel → the caption's horizontal position re-syncs to the (possibly re-flowed) active card → Value sourcing row 6
- [ ] Toggle OS-level reduced-motion mid-session (not just at page load) → transitions switch live, no reload needed → Value sourcing row 7

## Acceptance-criteria coverage

- AC-1 … drag/swipe + no-JS fallback steps · AC-2 … wheel + click-to-scroll steps · AC-3 … focus region + keyboard steps · AC-4 … bounded stepping steps · AC-5 … caption crossfade + aria-live steps · AC-6 … non-interactive card step · AC-7 … gallery cycling steps (hover, keyboard, touch/empty-gallery) · AC-8 … reduced-motion step · AC-9 … narrow-viewport clamp step · AC-10 … no-buttons/no-indicator step · AC-11 … build/typecheck/lint commands · AC-12 … partial-card-cutoff step
