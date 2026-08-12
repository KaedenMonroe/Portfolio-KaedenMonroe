# Rationale: 0002. Design system and UI foundation

## Context

The scope's foundation phase names design system and UI foundation (item 4) as the last undecided piece blocking every later page (items 5 through 9: bio, projects, the carousel, contact, analytics). Spec 0001 fixed the framework, hosting, and content approach, and named a "serif plus sans pairing" as the intended typography direction, but left the actual visual identity, color, type, spacing, and components, completely open. The only real UI artifact in the repository is a single unstyled placeholder page (`src/pages/index.astro`).

The project's own Figma file (`PortfolioWebDesign`) holds a rough wireframe: a BioPage frame (nav, avatar, name, title, bio paragraph) and a ProjectPage frame (a horizontal row of project image cards). Both use default black on white styling with a placeholder near white background (`#f3f4f5`) and no real type or color decision, exactly as Kaeden described them: "still needs to be decided." The same Figma file also holds a separate "Hero Design" frame that turned out to be a pasted moodboard: a screenshot of an Olivier Carignan style portfolio, a "Will" style minimal hero, and a screenshot of zackmurry.com itself, confirming independently that the zackmurry.com direction Kaeden named in conversation was already the intended reference before this conversation started.

The audience (recruiters, collaborators, academic contacts) rewards fast, credible signal over visual flourish, which favors restraint. Two forces genuinely pulled against each other during this decision: Kaeden's explicit, repeated request for "simple, minimalistic," reinforced by the zackmurry.com and Olivier Carignan references, against spec 0001's original assumption of a serif plus sans pairing (written before any concrete reference existed). The conversation resolved this in favor of Kaeden's restated preference once the real reference was on the table; see Options considered below.

A second decision surfaced during the same conversation: Kaeden wants the bio and the projects listing on one scrollable page, not the two separate pages the scope's items 5 and 6 currently imply, with a deliberate scroll required to reach the projects. This shapes the spacing token set (the new `--space-section` token) and the nav's behavior (it scrolls away with the page, per Kaeden's answer, rather than staying fixed for a multi page structure).

## Options considered

### Option 1: Single plain sans, near white, one University of Delaware blue accent

One sans typeface everywhere (name, nav, body), a near white `#F3F4F5` background, near black text, and University of Delaware blue (`#00539F`) as the only accent color, closely following zackmurry.com (a site Kaeden had already saved into his own Figma moodboard as inspiration).

**Pros**:
- Matches Kaeden's explicit ask for "simple, minimalistic" as closely as any option can
- One typeface means less to load, less to keep consistent, and no pairing decisions on every later page
- The accent ties directly and legibly to Kaeden's real affiliation (a current University of Delaware student) without inventing an arbitrary brand color

**Cons**:
- Drops the "serif plus sans pairing" spec 0001 originally called for, so 0001 needs a small correction
- Very little room for visual flourish later; a future page that wants more personality will need a deliberate follow up decision, not a quick tweak

### Option 2: Serif plus sans pairing (spec 0001's original intent)

A display serif for the name or headline, a plain sans for body and nav, following through on what spec 0001 assumed before the design conversation happened.

**Pros**:
- Fulfills spec 0001 exactly as written, no correction needed
- A serif accent adds a point of typographic personality that a single sans cannot

**Cons**:
- Directly conflicts with Kaeden's explicit preference, stated after seeing the zackmurry.com reference, for a single restrained sans
- A second type family is one more thing to load, preload, and keep visually balanced against the first

### Option 3: Dark, instrument panel style palette

A near black background with a single bright signal color accent, styled after sensor or oscilloscope readouts, a nod to Kaeden's gait biomechanics sensor research.

**Pros**:
- The most distinctive, memorable option of the three
- Genuinely grounded in Kaeden's own research subject, not decoration for its own sake

**Cons**:
- Both of Kaeden's named references (zackmurry.com, the Figma wireframe) are light, not dark; this option matches neither
- A dark background plus one bright accent is a common enough AI generated design pattern that it works against, not for, the "simple, minimalistic" and reference driven brief

## Rationale

Option 1 (single plain sans, near white, University of Delaware blue accent) won because it is the option every piece of concrete evidence gathered during this conversation actually points to, not a generic "minimal portfolio" default chosen without grounding:

- **The reference is real and specific, not implied.** Kaeden did not just say "minimal"; he named zackmurry.com and Olivier Carignan by name, and the project's own Figma file had already pinned zackmurry.com as inspiration before this conversation began. Pulling the real CSS from zackmurry.com confirmed it runs on one plain sans face (Noto Sans) with no serif anywhere, and default style blue underlined links as its only color. Option 1 matches that evidence; Option 2 (the serif pairing) does not.
- **Spec 0001's serif plus sans pairing predates any reference.** It was a reasonable default when written (before a Figma wireframe or a named reference site existed), but once Kaeden pointed at a concrete, single sans reference and said so directly ("None of these, let's talk it through" in response to a serif leaning option, followed by "single plain sans everywhere"), holding onto the original plan over the engineer's now informed preference would be exactly the kind of "hedge to avoid being wrong" this role should not do. The font loading mechanism spec 0001 chose (Astro's Fonts API) is untouched, only the pairing itself changes.
- **The accent color is not arbitrary.** University of Delaware blue (`#00539F`, PMS 2945 C, cross checked against two independent sources) ties directly to content already in the bio ("Mechanical Engineering Junior at the University of Delaware"). A generic "nice blue" would have been a weaker, less grounded choice for the one color this whole system gets.
- **Option 3 (dark instrument panel) was a legitimate, subject grounded idea, raised deliberately during the earlier brainstorm** as a genuine alternative rather than a strawman, but it matches neither of Kaeden's two named references, both of which are light backgrounds, and the `frontend-design` skill's own guidance flags a dark background with one bright accent as one of the most common AI generated design defaults. Choosing it over two directly named light references would have substituted the architect's own aesthetic preference for the engineer's stated one.
- **The near white background value (`#F3F4F5`) is not invented.** It is the exact placeholder background already sitting in the Figma wireframe, and Kaeden confirmed it directly ("close to F3F4F5... not quite offwhite or cream but not pure white") when asked to choose between pure white and a warmer off white.

## Sources consulted (for the record, not cited inline per the References setting Kaeden chose)

- Figma file `PortfolioWebDesign` (`GZFFZap4T9dsDq93yGSQvx`): `get_metadata` on the page canvas (node `0:1`) to locate the BioPage, ProjectPage, and Hero Design frames; `get_design_context` on BioPage (`58:8`) and ProjectPage (`61:24`) for layout and spacing measurements; `get_screenshot` on Hero Design (`1:10`) to read the pasted moodboard.
- `https://zackmurry.com/`: fetched the live HTML and its two Next.js CSS bundles directly (`WebFetch` alone only returned a generic summary with no real font or color data; a direct `curl` of the page and its compiled CSS files found the actual `font-family: Noto Sans` declarations and the site's plain black on white, blue link styling).
- `https://www.oliviercarignan.com/`: blocked bot protection returned HTTP 403 to both `WebFetch` and a direct `curl`; no CSS or markup could be pulled. Its influence here rests on Kaeden's own description (a drag and swipe project carousel, referenced already in the Figma moodboard screenshot) rather than a direct fetch.
- University of Delaware brand blue: cross checked via a web search and a direct fetch of `brandcolorcode.com`'s University of Delaware entry; both independently returned `#00539F` (PMS 2945 C).
- `.agents/skills/tailwind-css/SKILL.md` and `.agents/skills/design-tokens/SKILL.md`: read in full to ground the token category structure (semantic color/spacing/typography naming) and the "reuse before inventing a new token" principle applied throughout `## Feature design`.
- `.claude/skills/frontend-design/frontend-design/SKILL.md` (the bundled `frontend-design` Skill, distinct from the project's own installed skills): read in full before proposing the first round of brainstormed directions, to avoid landing on one of the three generic AI-portfolio defaults it names without a deliberate reason.
