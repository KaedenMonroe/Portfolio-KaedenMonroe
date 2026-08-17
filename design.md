---
name: kaeden-monroe-portfolio-design-system
source: figma:GZFFZap4T9dsDq93yGSQvx (file "PortfolioWebDesign", frames BioPage 58:8, ProjectPage 61:24)
character: "Restrained and academic-credible: one plain sans typeface, a near white canvas, near black text, and a single University of Delaware blue accent. Closely follows zackmurry.com's plain typographic style. No decoration beyond the one accent."
tokens: "real values live in src/styles/global.css's @theme block; read them there, never duplicated here"
contrast: "accent on bg-primary ~6.96:1, text-secondary on bg-primary ~6.85:1, text-primary on bg-primary >15:1 (all verified AA, see spec 0002 index.md Key invariants)"
spec: docs/specs/0002-design-system-ui-foundation/index.md
---

## Build mandate

Every page ships as a complete, credible, single scrolling surface: real content, considered spacing, no lone form on an empty page, no naked unstyled elements. This is a personal academic portfolio, not a marketing site: restraint is the design decision, not a placeholder state. Full disqualifier list: the develop skill's UI guide bar.

## Character & direction

One typeface (Inter) used everywhere: nav, name, body, meta. A near white background (`#F3F4F5`), near black text, and exactly one accent color, University of Delaware blue (`#00539F`), tying to Kaeden's real academic affiliation rather than an arbitrary brand color. No serif, no mono, no second accent, no shadows beyond what Tailwind's stock `rounded-md` implies. The restraint itself is the aesthetic: empty space reads as designed, not unfinished, via one deliberate large gap (`--space-section`, 112px) between the bio and the projects sections.

## Composition patterns

Bio and projects share one scrollable page (`src/pages/index.astro`), not two routes. Top to bottom: a non-sticky Nav (name/wordmark left, "About / Projects / Resume" right, scrolls away with the page), then the bio section (a `size-15` circular Avatar inline with the name and title line, followed by bio paragraphs), then a `--space-section` gap, then the projects section: a horizontally scrollable carousel of ProjectCards, each card's own width set by its cover image's aspect ratio rather than one fixed width, with no caption on the card itself. One shared caption below the carousel carries the active card's title and subtitle instead, crossfading between cards (`--duration-fade`, 200ms) and also updated for assistive tech, not a purely visual change (spec [0004](docs/specs/0004-interactive-project-carousel/index.md)).

At the `lg` breakpoint (`min-width: 64rem`) the page splits into two regions of different widths rather than staying one column throughout: the bio region stays inside the page's `max-w-4xl` column, itself narrowed further and centered to `--content-width-narrow` (42rem); the projects region breaks out of that column into its own full width section (capped and centered past 1800px). That is what lets the carousel's neighbor cards show clipped at the edge, spanning a width the narrower bio column never could. Below `lg`, both regions share the page's one `max-w-4xl` column as before.

"About" and "Projects" are same-page anchor links; "Resume" links out. The Figma wireframe (both frames) is a rough layout and spacing reference only, not a pixel handoff: composition and proportion are matched, not exact coordinates, and predates the carousel and the split into two regions added since.

## Component & usage rules (do's and don'ts)

- The accent (`--color-accent`) is used for links and focus rings only, never as a decorative fill or background.
- `InlineLink` is the one link style used everywhere: `--color-accent` text with an underline, `--color-accent-hover` on hover, and the shared focus-visible rule below. Never a bare unstyled `<a>`.
- Every interactive element (every nav link, every in-body link) carries `focus-visible:outline-2 focus-visible:outline-offset-2` with `--color-accent` as the outline color. This must read as visibly distinct from both the resting and hover states.
- Cards and raised surfaces (ProjectCard images) use `--color-bg-secondary` (white) against the page's `--color-bg-primary`; corner radius is Tailwind's stock `rounded-md`, never a one-off radius value.
- Meta text (title line under the name, the carousel's shared caption subtitle) uses `--color-text-secondary`, never a raw gray. `Tag` is currently unused (dropped from the projects view by spec 0004; still in the schema, pending a later pass).
- No color outside the seven defined tokens. No serif or mono face. No dark mode yet (light mode only; tokens are structured so a dark palette can extend them later without breaking).

## Responsive & accessibility direction

WCAG AA is the floor for every token pair (verified in spec 0002, not just audited after the fact). Tab order follows visual order: Nav links, then in-body links, then the carousel's one focusable region, each stopping at a visible focus-visible outline. No project content or nav item may be reachable only by mouse; the carousel also keeps a way to operate it without dragging (wheel or trackpad, clicking a card to scroll it into view, arrow keys) per WCAG 2.5.7, and its crossfades respect `prefers-reduced-motion` per WCAG 2.3 (spec 0004). Layout is one column below `lg` and splits into the two regions described under Composition patterns at `lg` and up; both need a mobile behavior since the Figma wireframe is drawn at a wide desktop size only. Use Tailwind's responsive variants rather than a fixed desktop-only layout.
