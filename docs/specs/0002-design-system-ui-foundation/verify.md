# Verify: design system & UI foundation · spec 0002 · updated 2026-08-12

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Open the built page at desktop, tablet (834px), and mobile (390px) widths → nav, avatar, name, title, and bio render with no horizontal overflow or clipped content at any width → AC-5
- [x] Compare the rendered page against the Figma BioPage and ProjectPage frames → nav layout (name left, About/Projects/Resume right), avatar + name + title composition, bio column width, and the project card row proportions visually match → AC-5
- [x] Resize a long project title/subtitle to a longer string → ProjectCard wraps the text without breaking the card's image proportions or the row layout → AC-5
- [x] Tab through the page from the top with only a keyboard → focus visits About, Projects, Resume (and any in-body link) in visual order, each stop showing a `focus-visible` outline clearly different from the resting and hover state → AC-3
- [x] Inspect every text/background pair used on the page (body text, meta text, links) with a contrast checker → each meets 4.5:1 (normal text) or 3:1 (large text/UI) → AC-2
- [x] View page source / network tab → only Inter loads (no serif or mono font request), and the font request is same-origin (self-hosted), not a request to fonts.googleapis.com → AC-6

## Commands

- [x] `pnpm typecheck` → 0 errors → supports AC-1, AC-4
- [x] `pnpm build` → completes, and the built CSS contains only the project's own utility classes (no leaked classes from `.agents/`, `.claude/`, or `docs/`) → AC-4
- [x] `grep -c "@theme" src/styles/global.css` → the nine spec tokens (`--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-accent-hover`, `--color-border`, `--font-sans`, `--space-section`) are all present → AC-1, AC-4

## Acceptance-criteria coverage

- AC-1 (complete token set) · covered by the `@theme` grep step and the manual layout checks
- AC-2 (WCAG AA contrast) · covered by the contrast-checker step (also independently verified at build time: text-primary 15.99:1, text-secondary 6.86:1, accent 6.96:1, accent-hover 9.60:1, all on `bg-primary`; similarly on `bg-secondary`)
- AC-3 (visible focus states) · covered by the keyboard tab-through step
- AC-4 (Tailwind v4 theme tokens, not hardcoded) · covered by the `@theme` grep and build CSS inspection
- AC-5 (base components match Figma proportions) · covered by the responsive rendering and Figma comparison steps
- AC-6 (Fonts API, self-hosted, preloaded, single face) · covered by the font request inspection step
