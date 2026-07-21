# Scope: Kaeden Monroe Portfolio

A one page portfolio site for a third year mechanical engineering student, built around the Blueprint Ledger design (grid rail layout, control loop hero diagram, ledger style expandable project rows). Its job is to help the student land engineering internships and jobs.

**Build approach:** Skateboard (ship the thinnest usable whole first, then grow it release by release, each release shippable).
**Weight profile:** mostly lean and medium; nothing full weight (a static portfolio, no compliance or payment surface).

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | done |
| 2 | Coding standards & tooling | Foundation | done |
| 3 | Content model | Foundation | done |
| 4 | Design system & Blueprint Ledger UI foundation | Foundation | done |
| 5 | Walking skeleton | Skeleton | planned |
| 6 | Blueprint Ledger portfolio page | Slice 1 | planned |
| 7 | Responsive layout | Slice 2 | planned |
| 8 | SEO & social metadata | Slice 3 | planned |
| 9 | Real project content | Deferred | planned |

## Foundations

### 1. Stack & architecture (done)
Decide how the static site is built and hosted (plain HTML/CSS/JS versus a static site framework), then scaffold a runnable, deployable project.
**Done when:** the stack is recorded in a spec, and the empty scaffold builds and deploys to a live preview URL.
spec [0001](../specs/0001-static-site-stack-and-hosting/index.md) · code in project root (`src/`, `astro.config.mjs`, `netlify.toml`)
- [x] Decide the stack (spec): `/architect stack & architecture`
- [x] Scaffold from the decision: `/develop stack & architecture`
- [x] Smoke check it runs and deploys: `/test stack & architecture`

### 2. Coding standards & tooling (done)
Capture conventions, then install lint, format, and pre-commit enforcement from the real scaffolded project.
**Done when:** root `AGENTS.md` reflects the real stack, and lint/format/pre-commit run clean.
code in project root (`eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `.husky/`, `.github/workflows/ci.yml`)
- [x] Capture conventions + tooling choices: `/audit`
- [x] Install and configure lint, format, pre-commit, CI: `/develop coding standards & tooling`
- [x] Check it runs clean: `/test coding standards & tooling`

### 3. Content model (done)
Decide how project, skills, and about content is structured and stored, separate from markup, so it is easy to update once real content is ready.
**Done when:** all page content (about copy, skills list, project entries) lives in one structured source, and the page renders from it with no hardcoded duplication.
spec [0002](../specs/0002-content-model/index.md) · code in `src/content.config.ts`, `content/`, `data/skills.ts`, `src/lib/content.ts`
- [x] Design it (spec): `/architect content model`
- [x] Build it: `/develop content model`
  - [x] Content schema and validation set up for Profile and Project (AC-1, AC-3, AC-6)
  - [x] Real content authored: profile, skills, and the three project write ups (AC-1, AC-2, AC-3, AC-4)
  - [x] Typed read functions written, including the position based tag and empty list case (AC-4, AC-5, AC-7)
- [x] Verify it: `/check verify content model`
- [x] Test it: `/test content model`

### 4. Design system & Blueprint Ledger UI foundation (done)
Capture the Blueprint Ledger visual language from the design brainstorm (grid rail, ledger rows, control loop diagram style, type and color tokens, corner marks) into a design spec, plus the base components every section reuses (nav, section block, ledger row, expand and collapse control).
**Done when:** `design.md` covers type, color, spacing, grid, and components; base components handle focus and keyboard; the result matches the 1a Blueprint Ledger concept.
spec [0003](../specs/0003-design-system-blueprint-ledger/index.md) · code in `design.md`, `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/{GridRailShell,NavBar,SectionBlock,LedgerRow}.astro`, `public/fonts/ibm-plex-mono/`
- [x] Design it (spec): `/architect design system & Blueprint Ledger UI foundation`
- [x] Build it: `/develop design system & Blueprint Ledger UI foundation`
  - [x] Design tokens (color, type, spacing, grid, breakpoints) and self hosted IBM Plex Mono set up (AC-1, AC-2, AC-6, AC-8, AC-9)
  - [x] Grid rail shell and nav bar built, including CSS only scroll highlighting (AC-3, AC-7)
  - [x] Section block and ledger row built, ledger row on native details/summary with independent open state (AC-3, AC-4, AC-5)
  - [x] Visual check against the mockup and an automated contrast check pass (AC-2, AC-3)
- [x] Verify it: `/check verify design system & Blueprint Ledger UI foundation`
- [x] Test it: `/test design system & Blueprint Ledger UI foundation`

### 5. Walking skeleton
A thin vertical slice proving the pipeline end to end: the scaffolded site renders the nav bar and hero shell using the design system, and deploys live.
**Done when:** the site deploys to a public URL showing the nav bar and hero placeholder, styled per the design system.
- [ ] Build it: `/develop walking skeleton`

## Slice 1: Smallest usable whole

### 6. Blueprint Ledger portfolio page
The full single page site: hero with the control loop diagram, about, skills, three ledger style expandable project rows (placeholder content), and a footer with résumé download and contact links. A recruiter can visit and get the whole picture in one scroll.
**Done when:** hero, about, skills, and three placeholder projects render in the Blueprint Ledger layout; clicking a project row expands and collapses its detail; the résumé download link and contact links (email, LinkedIn, GitHub) work.
- [ ] Build it: `/develop blueprint ledger portfolio page`

## Slice 2: Grow the usable surface

### 7. Responsive layout
Adapt the Blueprint Ledger layout for tablet and mobile viewports, since recruiters and hiring managers may open the link on a phone.
**Done when:** the layout reflows cleanly at common breakpoints (mobile, tablet); the nav collapses appropriately; the grid rail adapts or hides; no horizontal scroll at any width.
- [ ] Build it: `/develop responsive layout`

## Slice 3: Discoverability

### 8. SEO & social metadata
Add meta tags, Open Graph and social card data, and a sitemap, so the portfolio is discoverable and shares well when linked from a résumé or application.
**Done when:** the page has title and description meta tags and Open Graph tags; a social preview card renders correctly when the link is shared; `sitemap.xml` exists.
- [ ] Build it: `/develop seo & social metadata`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.

### 9. Real project content
- **Real project content**: swap placeholder project write ups, photos, and diagrams for the real ground platform, quadrotor, and suspension bracket FEA content, once it is ready
- **Interactive control loop diagram**: make the hero diagram live/interactive instead of a static SVG, as noted in the original design brainstorm
- **Contact form**: a submission handler, if plain email/LinkedIn/GitHub links stop being enough
- **Alternate layouts (1b Systems Console, 1c Exploded Index)**: the other two design directions from the brainstorm, kept as reference, not built
- **Blog integration**: the nav's "Blog" link currently points off site; an in site blog is not planned
- **Analytics & tracking**: visit and engagement tracking, not needed for a one page static portfolio yet

## Legend

**The decision box.** Every feature carries exactly one, the sub task whose label ends with `(spec)`. Every other box is an execution box; `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | `/architect` at spec capture | `Design it` ticked; spec linked; `Build it: /develop <feature>` + 2 to 5 milestones rolled up from the spec; `Verify it` + `Test it` boxes |
| `in-progress` (building) | `/develop` | milestone sub boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | `/test`, then `/sync` | all boxes ticked; `/sync` captures the slice's conventions into `AGENTS.md` |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards and tooling). The tag drops once the spec is captured.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre workflow) and `dropped` (de scoped, kept for history).
- **Weight tag** `· full` = a fresh model `/check review` warranted; `lean`/`medium` get no tag.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
