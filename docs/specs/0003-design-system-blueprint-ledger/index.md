# 0003. Design system and Blueprint Ledger UI foundation

**Date**: 2026-07-20
**Status**: Proposed

## Summary

This decision turns the hand built Blueprint Ledger mockup into a real design system: a single set of design tokens (color, type, spacing, grid, breakpoints) plus four reusable base components (the grid rail shell, nav bar, section block, and ledger row with its expand and collapse control). Every later page in the portfolio builds from these instead of each page inventing its own colors and spacing. Two of the mockup's grey text colors are darkened slightly so the site meets accessibility contrast rules, and the interactive project rows use the browser's own expand and collapse widget so no extra code has to ship to make them keyboard usable.

## Requirements

**User stories**:
- As the site's builder, I want one place that defines every color, type size, and spacing value, so that building each later page is choosing from a fixed vocabulary instead of guessing new values by hand.
- As a visitor using a keyboard or a screen reader, I want the project rows to open and close with normal keyboard operation and clear focus, so the site is usable without a mouse.
- As a recruiter opening the link on a phone, I want the page to load fast with no unnecessary third party requests.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):
- **AC-1**: A single token stylesheet defines every color, type, spacing, grid, and breakpoint value the Blueprint Ledger look uses; no component hardcodes a raw hex, pixel, or font value that has a matching token.
- **AC-2**: Every color token used on real text content (not purely decorative marks) passes WCAG 2.1 AA contrast (4.5 to 1 for normal text, 3 to 1 for large text or UI marks) against the background it appears on.
- **AC-3**: The four base components (grid rail shell, nav bar, section block, ledger row) render visually matching the 1a Blueprint Ledger mockup's colors, type, spacing, and borders at desktop width.
- **AC-4**: The ledger row's expand and collapse control is a native `<details>`/`<summary>` disclosure: operable by mouse click and by keyboard (Enter or Space, using the browser's built in behavior), exposes its open or closed state to assistive technology through native semantics, and shows a visible focus ring when reached by keyboard.
- **AC-5**: Each ledger row's open or closed state is independent; expanding one project row does not close another row that is already open.
- **AC-6**: IBM Plex Mono is self hosted from the project's own assets, not fetched from fonts.googleapis.com, and loads with `font-display: swap` so text stays visible while the font loads.
- **AC-7**: The nav's section links (About, Skills, Projects) sit inside a `scroll-target-group: auto` container so browsers that support it highlight the current section automatically via `:target-current`, with no JavaScript; in a browser without support the links still navigate correctly with no visual breakage.
- **AC-8**: Breakpoint tokens for tablet (768px) and mobile (480px) are defined and exported, even though no component reflow behavior ships in this pass (deferred to the later responsive layout item).
- **AC-9**: No dark mode ships in this pass; every color token is a single flat value, not a light and dark pair.

## Decision

**Chosen option**: Option 1: Extract the token set and components directly from the existing 1a Blueprint Ledger mockup.

Build the design system by reading the real values already in `Portfolio - 1a Blueprint Ledger.dc.html` (colors, fonts, spacing, layout) into a CSS custom property token file, correcting only what fails the accessibility bar, then build the four base components (grid rail shell, nav bar, section block, ledger row) as Astro components styled from those tokens.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`); its component model (scoped `<style>` blocks per component, consuming shared tokens) is the direct pattern these four components follow

## Feature design

**Design token model**:

*Color*:
| Token | Value | Use |
|---|---|---|
| `--paper` | `#ffffff` | page background |
| `--rail-bg` | `#fafaf8` | grid rail sidebar background |
| `--ink` | `#161616` | primary text, headings |
| `--ink-body` | `#3a3a36` | body and prose text |
| `--ink-muted` | `#6b6b66` (darkened from the mockup's `#7a7a74`) | subtitles, tags, footer links, captions that carry real information; passes AA at 5.35 to 1 |
| `--ink-faint` | `#9a9a94` (unchanged) | purely decorative marks only: the grid rail's index numbers, hairline notes; exempt from AA since they carry no information |
| `--accent` | `#2f6fb8` | links, eyebrow labels, active state; passes AA at 5.13 to 1 |
| `--accent-hover` | `#1e4f8a` | hover and active state |
| `--border` | `#e3e2de` | hairline dividers, component borders |
| `--border-faint` | `#f0efec` | secondary, lighter dividers |
| `--placeholder-a`, `--placeholder-b` | `#eceae5`, `#e2e0da` | diagonal hatch pattern used where a real photo is not yet available (project thumbnails and detail images, per the deferred real content item) |

*Type*:
| Token | Value | Use |
|---|---|---|
| `--font-mono` | `'IBM Plex Mono', ui-monospace, monospace` (self hosted, weights 400/500/600) | eyebrow labels, nav, tags, captions, footer |
| `--font-sans` | `Helvetica, Arial, sans-serif` (system, no webfont) | headings, body prose |
| `--text-2xs` … `--text-3xl` | `9px, 10.5px, 11px, 11.5px, 13px, 14px, 15px, 18px, 54px` | the exact sizes used across the mockup, named smallest to largest |

*Spacing* (named by pixel value, the exact set the mockup uses, not a generic 8pt scale): `--space-8, --space-10, --space-14, --space-16, --space-20, --space-22, --space-28, --space-40, --space-44`.

*Grid*: `--container-max: 1440px` (outer page width), `--rail-width: 36px` (grid rail sidebar), `--border-width: 1px` (every hairline).

*Breakpoints* (values only, per AC-8; no component reflow behavior yet): `--bp-tablet: 768px`, `--bp-mobile: 480px`.

**State transitions**:
Each ledger row has two states, closed (default) and open, toggled independently per row by its native `<details>` element. No coordination between rows; opening one has no effect on any other (AC-5). No other component in this spec carries state.

**Component interface surface** (props and behavior, not a network API; this is a static site with no backend):
| Component | Props / content | Interaction & keyboard | Key states |
|---|---|---|---|
| `GridRailShell` | `children` (page content) | none, purely structural | static |
| `NavBar` | `name: string`, `links: { label, href, external? }[]` | section links sit in a `scroll-target-group: auto` container; keyboard focus and activation come free from native `<a>` elements | current section highlighted via `:target-current` where supported (Chrome 140+), otherwise no highlight, links still work |
| `SectionBlock` | `eyebrow: string`, `children` (section content) | none | static |
| `LedgerRow` | `tag: string` (e.g. "IDX 01"), `title: string`, `subtitle: string`, `thumbnail?: image` (falls back to the placeholder hatch pattern), `detail: string` (body), `image?: image` (falls back to the placeholder hatch pattern) | native `<details>`/`<summary>`; Enter or Space toggles via the browser's built in behavior; visible focus ring on the summary row | `open` / `closed`, independent per row (AC-5) |

A small "chip" style pattern (the skill tags) is a shared token backed style, not a fifth top level component: a bordered, mono labeled inline element that `SectionBlock`'s content can use directly.

**Key invariants**:
- Every color, spacing, and type value a component's markup uses maps to a token defined above; no hand copied hex, pixel, or font value duplicates a token.
- `--ink-faint` is used only where the text carries no information; anything a visitor actually reads uses `--ink-muted` or darker.
- Each `LedgerRow`'s open or closed state never affects any other row.
- No component issues a network request to a third party domain to render its type (IBM Plex Mono is self hosted).

**Security model**:
Not applicable. This is public, static content with no accounts, no user data beyond what spec 0002 already scoped as public profile information, and no write path. Same as spec 0002's security model.

**Configuration required**:
None. No new environment variables or credentials; the self hosted font files are static assets committed to the project.

**Critical test scenarios** (each maps to an acceptance criterion in Requirements):
- Happy path: with the token stylesheet applied, the four components render matching the 1a mockup's colors, type, spacing, and borders at desktop width, verifies **AC-1**, **AC-3**.
- Keyboard and focus: a keyboard only visitor tabs to a ledger row's summary and presses Enter; the detail panel opens with a visible focus ring and the correct open state exposed through native semantics, with no effect on any other row, verifies **AC-4**, **AC-5**.
- Accessibility: an automated contrast check confirms `--ink-muted` and `--accent` pass 4.5 to 1 against `--paper`, and that `--ink-faint` is only ever applied to elements with no informational content, verifies **AC-2**.
- Progressive enhancement: in a browser without `scroll-target-group` support, the nav's section links still scroll to and land on the correct section, with no console error and no layout break, verifies **AC-7**.

## Build plan

1. Create the token stylesheet (color, type, spacing, grid, breakpoints) as CSS custom properties, satisfies **AC-1**, **AC-2**, **AC-8**, **AC-9**.
2. Self host the IBM Plex Mono weights actually used (400, 500, 600) and wire `@font-face` with `font-display: swap` into the token file, satisfies **AC-6**.
3. Build `GridRailShell` and `NavBar`, including the `scroll-target-group` nav pattern; these two are the thinnest usable whole (the walking skeleton, scope item 5, needs exactly this pair first), satisfies **AC-3**, **AC-7**.
4. Build `SectionBlock`, satisfies **AC-3**.
5. Build `LedgerRow` on native `<details>`/`<summary>` with independent open state and a visible focus ring, satisfies **AC-3**, **AC-4**, **AC-5**.
6. Check every component against the mockup by eye and run an automated contrast check on the color token set, satisfies **AC-2**, **AC-3**.

## Consequences

**Positive**:
- One token source removes the risk of colors or spacing drifting apart across later pages built by the same one person over time.
- The ledger row's flagship interaction ships with zero JavaScript and correct keyboard behavior for free, since `<details>` provides both.
- Self hosting the font removes a third party request from every page load, which matters for a recruiter opening the link on a phone.
- The nav's scroll highlighting costs nothing (no JavaScript, no added markup) and simply does not activate in browsers that do not yet support it.

**Negative / tradeoffs**:
- The shipped page will not be pixel identical to the mockup's exact muted grey values; two tokens are intentionally darkened to pass contrast, a deliberate, documented departure from "match the mockup exactly."
- `scroll-target-group` nav highlighting only works in Chrome 140 and newer as of this decision; most visitors on Firefox, Safari, or older Chrome will see a static nav with no highlight, though nothing breaks for them.
- Native `<details>` styling is constrained to what CSS can do on top of the browser's built in disclosure widget; an exact custom open and close animation matching some future redesign would need extra work or a different mechanism.

**Neutral**:
- Breakpoint tokens exist now but nothing consumes them until the later responsive layout item builds actual reflow behavior.
- The hero's control loop diagram and the 1b concept's corner marks motif are intentionally not part of this foundation; they remain page specific or out of scope concerns.

## Follow-up

- [ ] No root `AGENTS.md` exists yet (same gap spec 0002 already flagged). Once coding standards and tooling (scope item 2) runs, it should record: the token file's location, the `astro` skill, the self hosted font strategy, and the native `<details>` disclosure pattern as project wide conventions.
- [ ] When the responsive layout item (scope item 7) is designed, it should read this spec's `--bp-tablet` and `--bp-mobile` tokens rather than inventing new breakpoint values.
- [ ] When the full portfolio page (scope item 6) is built, the hero's control loop diagram and any 1b style corner mark decoration are page specific work, not part of this design system; they were explicitly scoped out here.
- [ ] Revisit dark mode only if a real need for it comes up later; it is not in the current scope or deferred list.

## Rationale

Full reasoning, the options weighed, and references: see [rationale.md](rationale.md).
