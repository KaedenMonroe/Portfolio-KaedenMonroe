# 0002. Design system and UI foundation

**Date**: 2026-08-12
**Status**: In Progress

## Summary

This decision sets the visual design system for Kaeden's portfolio: the colors, type, spacing, and base components every later page builds from. The look is deliberately restrained, one plain sans typeface, a near white background, and University of Delaware blue as the single accent, closely following the zackmurry.com reference Kaeden pointed to (and had already pinned in his own Figma moodboard). It also settles that the bio and projects live on one scrollable page rather than two separate pages. This revises one detail of spec [0001](../0001-stack-and-architecture/index.md): its planned serif plus sans pairing is replaced by a single sans face.

## Requirements

**User stories**:
- As a visitor (recruiter, collaborator, or academic contact), I want the page to read as credible and easy to scan, so that I trust the content over the decoration.
- As Kaeden, I want every later page (bio, projects, contact, and beyond) to draw from one settled token set, so that the site stays visually coherent without redeciding color or type each time.
- As a keyboard user, I want every interactive element to show a clear focus state, so that I can navigate the site without a mouse.

**Acceptance criteria**:
- **AC-1**: A complete token set (color, typography, spacing, layout) exists and covers every value a later page needs, so no page has to invent a new color, font, or one off spacing value.
- **AC-2**: Every text and background color pair defined in the token set meets WCAG AA contrast (4.5:1 for normal text, 3:1 for large text or UI parts).
- **AC-3**: Every interactive element (nav links, in body links) shows a visible focus state that is clearly different from its resting and hover states.
- **AC-4**: The tokens are implemented as Tailwind v4 theme tokens (a `@theme` block in the CSS entry point), not hardcoded one off values, so components reference tokens by name.
- **AC-5**: The base components (nav, avatar, inline link, section wrapper, project card, tag) are built and visually match the layout and spacing proportions of the Figma wireframe (BioPage and ProjectPage frames).
- **AC-6**: Fonts load through Astro's Fonts API (per spec 0001) with the single sans face self hosted and preloaded; no serif or mono face is added.

## Decision

**Chosen option**: Option 1: Single plain sans, near white, one University of Delaware blue accent

**Implementation skills**: `tailwind-css` (`paulrberg/agent-skills`, `.agents/skills/tailwind-css/`) · `design-tokens` (`julianoczkowski/designer-skills`, `.agents/skills/design-tokens/`) · `accessibility` (`addyosmani/web-quality-skills`, `.agents/skills/accessibility/`) · `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`)

## Rationale

Full reasoning: see [rationale.md](rationale.md).

## Feature design

**Design tokens** (the target set; everything a later page needs, so nothing gets invented per page):

| Token | Value | Role |
|---|---|---|
| `--color-bg-primary` | `#F3F4F5` | Page background |
| `--color-bg-secondary` | `#FFFFFF` | Cards, project images, raised surfaces |
| `--color-text-primary` | `#17191C` | Body text, headings |
| `--color-text-secondary` | `#4B5563` | Meta text (title line, captions, tags) |
| `--color-accent` | `#00539F` | Links, focus rings, the one accent (University of Delaware blue) |
| `--color-accent-hover` | `#003F79` | Accent hover state |
| `--color-border` | `#E2E4E7` | Hairline dividers |
| `--font-sans` | `Inter` (self hosted via Astro Fonts API) | The single typeface, used everywhere |
| `--space-section` | `7rem` (112px) | The deliberate gap between the bio section and the projects section on the single scrolling page |

Everything else (the type size scale, the rest of the spacing scale, border radius) reuses Tailwind v4's stock defaults rather than defining new tokens, since the wireframe's plain 16px body text and 20px name land exactly on Tailwind's own `text-base` and `text-xl`, and its ~5px rounded corners land on `rounded-md`. Defining a token only where the value must be exact (color, the one new spacing value, the font family) keeps the system small and matches the "simple, minimalistic" brief; reintroducing a full custom scale here would be over-building for a portfolio this size.

**Component inventory**:
- **Nav**: wordmark or name on the left, "About / Projects / Resume" on the right, plain text links, scrolls away with the page content (not sticky). "About" and "Projects" are same page anchor links (the single scrolling page decision below); "Resume" links out.
- **Avatar**: circular image, fixed at `size-15` (60px, matches the Figma Pfp node), `object-cover`, alt text required.
- **InlineLink**: the one link style used everywhere, `--color-accent` text with an underline, `--color-accent-hover` on hover, a visible `focus-visible` outline.
- **SectionWrapper**: the vertical layout primitive; the wrapper between the bio section and the projects section uses `--space-section`, every other internal gap uses Tailwind's stock spacing scale.
- **ProjectCard**: image (`rounded-md`, `object-cover`) plus title (`text-base font-medium`) and subtitle (`text-sm`, `--color-text-secondary`), matching the Figma ProjectPage frame's proportions. Reused later by the interactive carousel (scope item 7).
- **Tag**: a small text label (`text-xs`, `--color-text-secondary`) for project metadata.
- **Focus state** (a rule applied to every interactive element, not a single component): `focus-visible:outline-2 focus-visible:outline-offset-2`, outline color `--color-accent`, distinct from the resting and hover states.

**State transitions**: none, this is a static visual system with no stateful entities.

**API surface**: none, this spec has no backend or data surface.

**Value sourcing** (every token traced to where its value came from, so nothing downstream has to guess):

| Token / decision | Value | Source |
|---|---|---|
| `--color-bg-primary` | `#F3F4F5` | The Figma wireframe's own placeholder background (BioPage and ProjectPage frames), confirmed by Kaeden as the tone he wants |
| `--color-accent` | `#00539F` | University of Delaware's official brand blue (PMS 2945 C) |
| `--font-sans` | Inter | Architect's pick for a single restrained sans, matching zackmurry.com's plain typography; runner up Noto Sans, the exact face zackmurry.com itself uses |
| Content max width | `650px` (`max-w-[650px]` or an equivalent token if reused often) | Measured from the Figma BioPage frame's bio text block (node `48:60`, width 650) |
| Avatar size | `60px` / `size-15` | Measured from the Figma BioPage frame's Pfp node (`48:61`, 60 by 60) |
| Card corner radius | Tailwind's stock `rounded-md` | Matches the Figma wireframe's rounded rectangle placeholders |
| `--space-section` | `7rem` | No reference source; architect's judgment call sizing the deliberate scroll gap Kaeden asked for between the bio and projects sections |
| Nav behavior | Scrolls away with page content | Kaeden's explicit answer |
| Dark mode | Out of scope for this spec | Kaeden's explicit answer; tokens are structured to extend to a dark palette later without breaking |
| Page structure | Bio and projects share one scrollable page, not two pages | Kaeden's explicit answer during this conversation |

**Key invariants**:
- Every text and background pair in the token set holds WCAG AA contrast (verified: accent on `bg-primary` ~6.96:1, text secondary on `bg-primary` ~6.85:1, text primary on `bg-primary` over 15:1).
- No color is introduced outside the seven defined tokens without a spec update; this is what keeps the one accent restraint from eroding page by page.
- Only one font family (`--font-sans`) loads; adding a serif or mono face means revisiting this spec.

**Security model**: not applicable. This is a static, public, unauthenticated site; these components hold no user data.

**Configuration required**: none. No new environment variables; font loading is a static asset preload, not a runtime credential.

**Critical test scenarios**:
- Happy path: a visitor loads the page and sees nav, avatar, name, title, and bio render with the defined tokens, then scrolls through the `--space-section` gap into the projects row, matching the Figma wireframe's proportions, verifies **AC-1**, **AC-5**.
- Failure case: a long project title or subtitle wraps inside a ProjectCard without breaking the row layout or the card's image proportions, verifies **AC-5**.
- Accessibility: tabbing through the page shows a visible `focus-visible` outline at every nav link and in body link, in the same order as the visual layout, verifies **AC-3**.
- Auth/permission: not applicable, no authenticated surface exists on this site.

## Build plan

1. Install and configure Tailwind CSS v4 (decided in spec 0001 but not yet added to the project) and define the nine tokens above in a `@theme` block in the CSS entry point, satisfies **AC-1**, **AC-4**
2. Configure Inter through Astro's Fonts API, self hosted and preloaded, satisfies **AC-6**
3. Verify all token text and background pairs against WCAG AA contrast; adjust any that fail before moving on, satisfies **AC-2**
4. Build the base components: Avatar, InlineLink (with the shared focus state rule), Nav, SectionWrapper (using `--space-section` between bio and projects), Tag, satisfies **AC-3**, **AC-5**
5. Build ProjectCard matching the Figma ProjectPage frame's proportions, satisfies **AC-5**
6. Keyboard only pass: tab through every nav link and in body link, confirm a visible focus state at each stop in visual order, satisfies **AC-3**
7. Visual check against the Figma BioPage and ProjectPage frames at mobile, tablet, and desktop widths, satisfies **AC-5**

## Consequences

**Positive**:
- Every later page (bio, projects, contact, and beyond) builds against one settled, contrast checked token set instead of inventing color or type per page
- One typeface keeps type discipline effortless to maintain, matching the "minimal" identity goal directly
- The accent ties authentically to Kaeden's real University of Delaware affiliation instead of an arbitrary brand color
- WCAG AA is verified now, in the token set itself, not audited after pages are built

**Negative / tradeoffs**:
- Revises spec 0001's "serif plus sans pairing": that plan assumed two type families, this spec ships one. The underlying font loading strategy (Astro's Fonts API) is unchanged, only the pairing itself
- A very restrained, single accent palette leaves little room for a second color later (for example, error or success states on the future contact form, scope item 8) without a deliberate follow up decision
- Light mode only for now; a future dark mode request is a real follow up pass, not a toggle that already works

**Neutral**:
- Tokens live in Tailwind v4's CSS first `@theme` block, not a separate JS config file
- The Figma file stays a rough wireframe reference for layout and spacing, not a pixel exact handoff; component spacing is derived from it, not pixel matched to it

## Follow-up

- [x] Spec 0001's "Proposed stack" table stated a serif plus sans pairing for Fonts; added a note there pointing to this spec, since that detail is now superseded
- [ ] Tailwind CSS is decided in spec 0001 but is not yet a project dependency (no `tailwind.config` or CSS entry point exists); this spec's Build plan step 1 covers installing it, flagging it here so `/develop` does not treat it as already done
- [ ] The single page bio and projects structure decided here affects scope items 5 (Home / bio page) and 6 (Projects page): they may need reconciling into one page spec with two sections rather than two separate page specs, worth a look at the next `/scope` or `/architect` pass on those items
- [ ] Real project content and images are still placeholders (scope item 3, content and data model, is not yet decided); ProjectCard's proportions are derived from the Figma wireframe's placeholder images and may need a second look once real assets exist
- [ ] The `brainstorming` and `design-consultation` entries in root `AGENTS.md`'s Agent skills list are Open Design catalogue stubs, not installed upstream bundles; they could not actually be run as workflows during this design conversation. Worth either installing the real upstream bundle (`obra/superpowers`, `garrytan/gstack`) or annotating the catalogue entries so a future run does not expect more from them than they provide
