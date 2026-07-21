---
name: blueprint-ledger-design-system
source: extracted-from-mockup ("Portfolio brainstorm for mechanical engineer/Portfolio - 1a Blueprint Ledger.dc.html")
character: 'A technical ledger, not a portfolio brochure: hairline grid rails, a mono index column, and flat borders instead of shadows. Reads like an engineering drawing or a lab notebook, quiet and precise, letting the work (skid-steer chassis, flight controller, FEA study) carry the personality rather than decoration.'
tokens: 'real values live in src/styles/tokens.css; read them there, never duplicated here'
contrast: '--ink-muted 5.36:1 light / --accent 5.14:1 light against --paper (both verified AA, spec 0003 AC-2); --ink-faint intentionally 2.83:1, used only on decorative marks that carry no information (rail index numbers, ledger row IDX tags)'
---

## Build mandate

You are a senior product designer. Every page ships as a complete, professional product surface: brand, real product specific copy, a considered layout with hierarchy, all states (empty, loading, error), supporting content, and a footer where the page warrants one. Maximalist, never a lone form on an empty page. Full disqualifier list: the UI guide's bar.

This system in particular is deliberately spare, not empty: hairline borders and a fixed mono/sans type pairing carry the hierarchy instead of color, shadow, or radius. "Spare" is the aesthetic, not a shortcut on completeness.

## Character & direction

- **Grid rail**: every page sits inside a 36px sidebar rail (`--rail-width`) holding faint mono index marks, plus a 1440px max width content column (`--container-max`), both bordered by hairlines (`--border`). The rail is decoration and orientation, never navigation.
- **Ledger rows, not cards**: list items (projects) are full width rows separated by hairline top borders, not boxed cards with shadows or radius. Zero border radius anywhere in this system; it is a deliberate, permanent choice, not a placeholder.
- **Two type families, one job each**: `--font-mono` (IBM Plex Mono) for anything that is a label, index, tag, or piece of metadata (eyebrows, nav, tags, the ledger tag, captions). `--font-sans` (Helvetica/Arial, system stack) for anything a visitor reads as prose or a heading (titles, body copy). Never swap the two.
- **One accent, used sparingly**: `--accent` marks only links, eyebrow labels, and the current/active state (the nav's CTA link, the ledger row's expand/collapse control, `:target-current` highlighting). It never decorates.
- **No dark mode** (deliberate, spec 0003 AC-9): every token is a single flat value; do not add a `.dark` variant or `@media (prefers-color-scheme: dark)` override without a new spec revisiting this decision.

## Composition patterns

- **Page shell**: `GridRailShell` (the rail + content column) wraps every page; `NavBar` sits at the top of the content column, sticky, bordered on its bottom edge.
- **Section rhythm**: `SectionBlock` is the unit every page section uses: an eyebrow label (rendered as an `h2`, `--accent` colored, mono, uppercase-by-convention) followed by arbitrary section content, padded `--space-40 --space-44`. Two `SectionBlock`s can sit side by side in a page level grid (see `about-skills-row` in `src/pages/index.astro`) when the page calls for it; that layout is page composition, not part of `SectionBlock` itself.
- **Ledger list**: `LedgerRow` instances are full width siblings (not nested inside a padded `SectionBlock`), each a native `<details>` disclosure, so their hairline borders and padding span the whole content column edge to edge.
- **Chips**: the shared `.chip` utility class (global.css) is how any section renders a small bordered, mono labeled inline tag (skills, categories); it is not a component, just a token backed class any section's content can reach for.

## Component & usage rules (do's and don'ts)

- Every color, spacing, and type value a component uses must come from `src/styles/tokens.css`; if a value doesn't have a matching token, that's a signal to double check the token set before hardcoding, not license to invent a new hex or pixel value freely.
- `--ink-faint` only on elements with `aria-hidden="true"` or otherwise no informational content (rail marks, the ledger row's `IDX NN` tag). Anything a visitor is meant to read uses `--ink-muted` or darker.
- Hairline borders (`--border`, `--border-faint`) are dividers and structure, not the sole affordance for an interactive boundary; pair every interactive element with a real focus style, not just a border.
- `<details>`/`<summary>` is the only disclosure mechanism (`LedgerRow`); never reach for a JS accordion or a custom ARIA widget for expand/collapse, the native element already satisfies keyboard and screen reader behavior for free.
- The nav's section links sit inside one `scroll-target-group: auto` container so `:target-current` can highlight the active one; don't add JavaScript scroll-spy alongside it, the CSS degrades safely on its own in unsupported browsers.
- Do not introduce a second accent color, a shadow, or a border radius; if a future page seems to need one, that's a design system change (`/architect`), not a local override.

## Responsive & accessibility direction

- Breakpoint tokens (`--bp-tablet: 768px`, `--bp-mobile: 480px`) are defined but no component reflows yet (spec 0003, deferred to the later responsive layout item); don't add ad hoc `@media` reflow rules to these four base components ahead of that item, it would fragment the decision.
- Every interactive element must show a visible `:focus-visible` ring (2px, `--accent`); `LedgerRow`'s summary and `NavBar`'s links already do, match the same pattern for any new interactive element added later.
- `prefers-reduced-motion: reduce` is handled once, globally, in `global.css`; new components don't need to repeat it, just avoid motion that ignores the global override.
