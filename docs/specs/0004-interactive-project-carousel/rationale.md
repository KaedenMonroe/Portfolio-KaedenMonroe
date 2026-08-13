# Rationale: 0004. Interactive project carousel

## Context

Feature 7 in scope (`docs/scope/scope.md`) calls for upgrading the static project listing (built in Slice 1) to a "free drag/swipe scroll with no visible buttons, plus arrow-key keyboard support" carousel, done when a visitor can browse every project by drag, swipe, or keyboard on both desktop and touch. The engineer pointed to oliviercarignan.com as the primary interaction reference and asked to layer extra features on top of its base pattern.

The current implementation (`src/pages/index.astro`, `ProjectCard.astro`) renders a `flex flex-wrap` list of fixed width cards, each with its own title, subtitle, and tags underneath. The content schema (`src/content.config.ts`, spec 0003) already carries a `gallery` field (image or video items) and `liveUrl`/`githubUrl` fields on every project entry, none of which the page currently renders.

This project has zero client side JavaScript today beyond what Astro itself emits; a drag/swipe carousel with momentum is the site's first genuinely interactive, script driven widget. The project's accessibility baseline is WCAG AA (root `AGENTS.md`), which is a hard constraint here: a drag dependent interaction with no visible buttons must still supply a non-drag way to operate it (WCAG 2.5.7, dragging movements), and any animation this feature adds must respect a visitor's reduced motion preference (WCAG 2.3, motion).

A related, larger decision, project detail or case study pages, is listed in scope as a separate, undecided, deferred item. The engineer confirmed cards should stay non-interactive (no click-through) in this spec, so this carousel does not depend on that decision.

## Options considered

### Option 1: Embla Carousel (a lightweight, framework-agnostic drag/scroll library) (chosen)

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

## Rationale

Embla's built-in momentum and snap physics are the closest match to the reference site's feel without the project hand-tuning an easing curve itself (basis: the engineer's stated reference, oliviercarignan.com), and at 7KB it stays consistent with this project's otherwise minimal footprint (basis: `AGENTS.md`, functional/minimal style). Its gap against the native approach, no free wheel/trackpad scroll, is a small, one-time cost (a single wheel handler) against a real requirement either option must meet: WCAG 2.5.7 requires *some* non-drag pointer path regardless of implementation (basis: `.agents/skills/accessibility/SKILL.md`, "Dragging movements (2.5.7)"), so this is not unique overhead introduced by choosing Embla.

The native scroll-snap option (Option 2) is a reasonable alternative, and would get AC-2 for free, but the momentum feel that most directly answers the engineer's reference is something Embla has already solved; re-deriving that with hand-tuned physics is exactly the kind of drag-interaction subtlety (velocity sampling, resize handling) most likely to produce visible bugs first. Splide (Option 3) solves the keyboard/ARIA question out of the box, but that box assumes a different keyboard model (one tab stop per slide) than the single-region pattern this spec settled on for AC-3, so its built-in behavior would be partly overridden anyway, at nearly 4x the weight.

## References

**Project sources** (verifiable, in this repo):
- `AGENTS.md`, functional/minimal style and the WCAG AA accessibility baseline
- `design.md`, the restrained design system (tokens, focus-visible treatment, no decoration beyond the one accent) governed by spec [0002](../0002-design-system-ui-foundation/index.md)
- `src/content.config.ts` and spec [0003](../0003-content-and-data-model/index.md), the `gallery`/`liveUrl`/`githubUrl` fields this feature starts using
- `docs/scope/scope.md`, feature 7 ("Interactive project carousel"), the base interaction requirement this spec builds on

**Practices & standards**:
- WCAG 2.5.7 (Dragging Movements) and WCAG 2.3 (Motion), per `.agents/skills/accessibility/SKILL.md`
- The WAI-ARIA carousel/scrollable-region authoring pattern (a single focusable region with `aria-live` updates, rather than per-item tab stops, for a non-interactive item set)

**Links** (web verified during this spec's research):
- Embla Carousel: https://github.com/davidjerleke/embla-carousel
- Keen Slider (considered, not chosen): https://keen-slider.io/docs
- Splide (Option 3): https://github.com/Splidejs/splide
- CSS scroll-snap (native alternative, Option 2): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Using_scroll_snap_events
