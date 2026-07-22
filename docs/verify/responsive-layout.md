# Verify: responsive layout · no governing spec · updated 2026-07-21

_No spec governs this feature: the breakpoint tokens and the "no reflow yet" deferral were already recorded in spec 0003, so `/develop` built directly from the scope's "Done when" line. Steps below are derived from that line. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open the dev server at desktop width (1440px) → grid rail visible, nav links shown inline (no MENU toggle), hero and about/skills sections both two column, ledger row summary a single row → Done when: reflows cleanly, nav collapses appropriately
- [x] Resize to tablet width (768px) → grid rail hidden, nav collapses behind a "MENU +" toggle; click it → links appear stacked and the toggle reads "CLOSE −"; hero and about/skills sections stack to one column; ledger row summary stays a single (tighter) row → Done when: grid rail adapts or hides, nav collapses appropriately
- [x] Resize to mobile width (480px and 375px) → nav still collapsed behind the menu toggle; ledger row summary switches to a stacked two by two layout (thumbnail beside the heading, tag and toggle below); expanding a row stacks its detail text above the project image instead of beside it → Done when: reflows cleanly at mobile
- [x] Tab to the nav's "MENU" toggle at a narrow width, press Enter or Space → menu opens with a visible 2px accent focus ring, using native `<details>`/`<summary>` semantics (no custom JS/ARIA) → Done when: nav collapses appropriately
- [x] At mobile width, expand two ledger rows in turn → each opens and closes independently (regression check against spec 0003 AC-5, which this feature's layout changes must not break)
- [x] At 1440px, 768px, 390px, and 375px, run `document.documentElement.scrollWidth` in the console and confirm it never exceeds `document.documentElement.clientWidth` → Done when: no horizontal scroll at any width

## Commands

- [x] `npm run typecheck && npm run lint && npm run format:check && npm test && npm run build` → all pass
- [x] `grep -rE "#[0-9a-fA-F]{3,6}" src/components src/pages` → no matches (every color still comes from a `var(--token)`)

## Done when coverage

- "the layout reflows cleanly at common breakpoints (mobile, tablet)" · covered by the desktop/tablet/mobile resize steps
- "the nav collapses appropriately" · covered by the tablet resize step and the keyboard step
- "the grid rail adapts or hides" · covered by the tablet resize step (hides at 768px)
- "no horizontal scroll at any width" · covered by the `scrollWidth` check at all four widths
