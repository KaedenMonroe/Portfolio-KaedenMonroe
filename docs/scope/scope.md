# Scope: Kaeden Monroe Portfolio

A minimal academic personal portfolio built with Astro: a bio page and a projects showcase with an interactable image carousel, for recruiters, collaborators, and academic contacts to learn about Kaeden's work and get in touch.

**Build approach:** Skateboard (ship the smallest usable whole first, a real visitor could use tomorrow, then grow it release by release).
**Workflow:** Alpha (after `/develop`: `/check verify` on the real app; no separate test suite or review by default).

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | planned |
| 2 | Coding standards & tooling | Foundation | planned |
| 3 | Content & data model | Foundation | planned |
| 4 | Design system & UI foundation | Foundation | planned |
| 5 | Home / bio page | Slice 1 | planned |
| 6 | Projects page (static listing) | Slice 1 | planned |
| 7 | Interactive project carousel | Slice 2 | planned |
| 8 | Contact form | Slice 3 | planned |
| 9 | Privacy-friendly analytics | Slice 4 | planned |

## Foundations

### 1. Stack & architecture · needs a decision
Astro is already decided as the framework. This spec picks the rest: content approach (Astro content collections for bio and project entries), hosting/deploy target, font loading strategy for the serif + sans pairing, and image handling for project assets. Nothing else gets built before this is decided.
**Done when:** the stack is recorded in a spec and an empty Astro scaffold boots locally and passes a build.
- [ ] Decide the stack (spec): `/architect stack & architecture`

### 2. Coding standards & tooling
Capture conventions, then install lint, format, and pre-commit enforcement from the real scaffolded project.
**Done when:** root `AGENTS.md` reflects the real stack, and lint/format/pre-commit run clean.
- [ ] Capture conventions + tooling choices: `/audit`

### 3. Content & data model · needs a decision
The schema every page renders from: project entries (title, subtitle, tags, images, description, links) and the bio content structure. Getting this right now avoids a rewrite once several projects are entered. (basis: a wrong data model is the most expensive thing to redo)
**Done when:** the content schema supports the bio page and the projects listing without a breaking change once real content is entered.
- [ ] Design it (spec): `/architect content & data model`

### 4. Design system & UI foundation · needs a decision
The serif + sans typography pairing, accent color, and a deliberate spacing/whitespace rhythm (so empty space reads as designed, not unfinished), plus base components (nav, links, buttons, focus states).
**Done when:** `design.md` covers type/color/spacing/components, and base components handle focus and keyboard states.
- [ ] Design it (spec): `/architect design system & UI foundation`

## Slice 1: Smallest usable whole

### 5. Home / bio page
Name, nav, avatar, title, bio copy, and a visual cue at the bottom directing to the projects page. This alone is a real "who is this person" page a visitor could use. Includes a plain mailto/resume/LinkedIn link so contact is possible even before the full contact form exists (Slice 3).
**Done when:** the bio renders from real content (no placeholder copy or stray characters left in), the nav and mailto/resume links work, and the page is usable and legible at common viewport widths.
- [ ] Build it: `/develop home / bio page`

### 6. Projects page (static listing)
The projects page rendering real entries from the content model, laid out so it is genuinely browsable (a plain scrollable row or grid) even before the polished drag/swipe carousel interaction is built. Structure cut deliberately: the fancy interaction is not required to be useful today.
**Done when:** a visitor can see and read every project entry (image, title, subtitle) on one page without missing content, using real content entries.
- [ ] Build it: `/develop projects page`

## Slice 2: Interactive project carousel

### 7. Interactive project carousel · needs a decision
Upgrade the static listing to the designed interaction: free drag/swipe scroll with no visible buttons, plus arrow-key keyboard support so it is usable without a mouse or touch. (basis: non-trivial interactive behavior warrants a decision before build)
**Done when:** a visitor can browse all project entries by dragging/swiping, and by keyboard (arrow keys) with visible focus, on both desktop and touch.
- [ ] Design it (spec): `/architect interactive project carousel`

## Slice 3: Contact form

### 8. Contact form · needs a decision
Replace the plain mailto link with a real form (name, email, message) that delivers to Kaeden. Requires deciding the form handling and email delivery approach.
**Done when:** a visitor can submit the form and Kaeden receives the message; invalid input is rejected with a visible error; the mailto fallback remains for visitors who prefer it.
- [ ] Design it (spec): `/architect contact form`

## Slice 4: Analytics

### 9. Privacy-friendly analytics · needs a decision
Add pageview analytics (Plausible/Fathom style, no cookies, no consent banner needed) so Kaeden can see whether the site is getting traffic.
**Done when:** pageviews are visible on the analytics dashboard for real visits, with no cookie consent banner required.
- [ ] Design it (spec): `/architect privacy-friendly analytics`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Project detail / case study pages**: a dedicated page per project beyond the listing entry · needs a decision
- **Dedicated resume page**: rendering the resume as a page rather than a PDF download link · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | `/architect` at spec capture | `Design it` ticked; spec linked; `Build it: /develop <feature>` + 2 to 5 milestones; `Verify it` (Alpha+) |
| `in-progress` (building) | `/develop` | milestone sub-boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | you, when you decide it is; `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; at Alpha, `/check verify` is the suggested point to call it done |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards & tooling). The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `dropped` (de-scoped, kept for history).
- **Workflow** (header line) is the project default, what runs after `/develop`: Alpha = `/check verify`. A feature could carry its own tag (e.g. `· Beta`) to do more.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.

## References

**Project sources**
- The Figma file `PortfolioWebDesign` (BioPage and ProjectPage frames): source of the layout, copy draft, and image placeholders this scope builds toward.
- This conversation's design review and decision rounds: build approach, workflow depth, carousel interaction, typography direction, contact/analytics choices.

**Practices & standards**
- Foundations before features: stack, content model, and design system decided before any page is built.
- A wrong data model is the most expensive thing to redo (data model foundation always gets a spec, never skipped).
- Skateboard: ship the smallest usable whole first, then grow it release by release, cutting structure (not breadth) to get there sooner.
