# Verify: design system & Blueprint Ledger UI foundation · spec 0003 · updated 2026-07-21

_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Open the dev server at desktop width (1440px); the grid rail, nav, About/Skills columns, and ledger rows visually match `Portfolio - 1a Blueprint Ledger.dc.html`'s colors, type, spacing, and borders → AC-3
- [ ] Tab to a ledger row's summary; press Enter (or Space); the row opens with a visible 2px accent focus ring and the browser's native disclosure semantics expose the open state (inspect the `open` attribute / accessibility tree, no manual `aria-expanded` needed) → AC-4
- [ ] Open two ledger rows at once; confirm both stay open independently, then close one and confirm the other is unaffected → AC-5
- [ ] In a browser that supports `scroll-target-group` (Chrome 140+), scroll between About/Skills/Projects and confirm the corresponding nav link highlights via `:target-current` with no JavaScript; in an unsupported browser, confirm the nav links still navigate correctly with no console error and no visual breakage → AC-7
- [ ] With DevTools' Network tab open, confirm no request is made to `fonts.googleapis.com` or any third party font host; the three IBM Plex Mono weights load from `/fonts/ibm-plex-mono/` → AC-6

## Commands

- [ ] `grep -rE "#[0-9a-fA-F]{3,6}" src/components src/layouts` → no matches (every color comes from a `var(--token)`) → AC-1
- [ ] `grep -n "ink-faint" src/components/*.astro` → only on elements also carrying `aria-hidden="true"` (rail marks, ledger tag) → AC-2 (exempt-from-AA usage stays scoped to non-informational marks)
- [ ] Run a WCAG contrast check on `--ink-muted` (#6b6b66) and `--accent` (#2f6fb8) against `--paper` (#ffffff) → both ≥ 4.5:1 (measured 5.36:1 and 5.14:1) → AC-2
- [ ] `grep -n "@font-face" src/styles/tokens.css` → three declarations (400/500/600), each with `font-display: swap` and a local `/fonts/...` URL → AC-6
- [ ] `grep -n -- "--bp-tablet\|--bp-mobile" src/styles/tokens.css` → both defined (768px, 480px) → AC-8
- [ ] `grep -rn "prefers-color-scheme\|\.dark" src/styles` → no dark color overrides exist (the reduced-motion query is the only `@media` in `global.css`) → AC-9
- [ ] `npm run typecheck && npm run lint && npm run format:check && npm test && npm run build` → all pass

## Acceptance-criteria coverage

- AC-1 (single token vocabulary, no duplicated raw values) · covered by the grep step above
- AC-2 (WCAG AA contrast for real text; `--ink-faint` exempt only on decorative marks) · covered by the contrast + `ink-faint` usage steps
- AC-3 (four components visually match the mockup) · covered by the manual desktop-width check
- AC-4 (native `<details>`/`<summary>`, keyboard operable, visible focus ring, native semantics) · covered by the keyboard manual step
- AC-5 (each ledger row's open state independent) · covered by the two-rows-open manual step
- AC-6 (IBM Plex Mono self hosted, `font-display: swap`) · covered by the Network tab check and the `@font-face` grep
- AC-7 (`scroll-target-group` nav pattern, graceful degradation) · covered by the supporting/unsupported browser manual step
- AC-8 (tablet/mobile breakpoint tokens defined) · covered by the grep step
- AC-9 (no dark mode, flat token values) · covered by the grep step
