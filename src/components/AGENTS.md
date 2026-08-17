# UI components

## Files

- [Avatar](Avatar.astro), [ProjectCard](ProjectCard.astro), [ProjectCarousel](ProjectCarousel.astro), [Nav](Nav.astro), [InlineLink](InlineLink.astro), [SectionWrapper](SectionWrapper.astro), [Tag](Tag.astro)

## Conventions

- Props via a local `interface Props` (no shared prop types file yet).
- A component that accepts a `class` prop destructures it as `class: className` (reserved word) and merges it last: `[baseClasses, className].filter(Boolean).join(" ")`.
- Styling is Tailwind utility classes directly in markup; a design token is referenced as a CSS custom property in an arbitrary value, e.g. `mt-(--space-section)`, not a hardcoded value. Token values live in `src/styles/global.css`.
- An image prop accepts `ImageMetadata | string` (a processed `astro:assets` image, or a plain path) and branches between `astro:assets`' `<Image>` and a plain `<img>`; see `Avatar.astro` / `ProjectCard.astro`.
- Accessibility baseline (WCAG AA, per root `AGENTS.md`): visible `focus-visible` outline on interactive elements, `aria-label` on nav/landmark elements, external links get `target="_blank" rel="noopener noreferrer"`.
- `ProjectCarousel.astro` wraps `ProjectCard.astro` in an Embla Carousel (client `<script>`, progressive enhancement over a native `scroll-snap` fallback so the carousel stays usable with no JS). `ProjectCard` itself is presentation only (cover image plus hover/keyboard gallery cycling); the shared caption, active-card tracking, and keyboard/wheel handling live in `ProjectCarousel`. Per-tier card height/width constants live in `src/lib/cardSize.ts` as plain component-level constants, not `global.css` design tokens.

## Governing spec

[0002](../../docs/specs/0002-design-system-ui-foundation/index.md) has the full design system rationale and token set. [0004](../../docs/specs/0004-interactive-project-carousel/index.md) governs `ProjectCarousel.astro`'s Embla wiring, accessibility, and card sizing.

_Drafted by /sync from the introducing change, worth a quick human pass._
