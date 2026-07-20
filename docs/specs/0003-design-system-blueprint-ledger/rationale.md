## Context

The portfolio has no design system yet and no scaffolded code (spec 0001 chose the stack, Astro, TypeScript, plain CSS custom properties, and Netlify hosting, but the scaffold itself has not been built). What does exist is a hand built mockup, `Portfolio brainstorm for mechanical engineer/Portfolio - 1a Blueprint Ledger.dc.html`, with real markup, exact colors, fonts, and spacing for the chosen "1a Blueprint Ledger" concept (a technical, blueprint style look: a grid rail sidebar, hairline borders, IBM Plex Mono labels, ledger style expandable project rows). Two related design directions, 1b Systems Console and 1c Exploded Index, exist as reference only and are explicitly not being built (the scope's deferred list). The "corner marks" motif named in the scope item's description belongs to 1b, not 1a, and does not appear in the chosen mockup; it was checked directly against the source file rather than assumed absent.

Every later foundation and slice item (the walking skeleton, the full portfolio page, responsive layout) depends on this design language existing as reusable tokens and components rather than being copied and adjusted by hand on each page. This is a solo maintained, one page, public site with no other engineer to keep styles consistent by convention, so the tokens are the only thing enforcing consistency.

Two forces pull in different directions and must be resolved explicitly rather than glossed over. First, the scope's done when line asks the result to "match the 1a Blueprint Ledger concept," meaning the exact mockup colors and spacing. Second, it also asks the base components to "handle focus and keyboard," which implies a real accessibility bar. Checking the mockup's own colors shows two of its muted greys fail WCAG contrast on real text, so matching the mockup exactly and meeting a real accessibility bar cannot both hold for every pixel; the design token model in `index.md` is where that tension gets decided.

Spec 0001 already fixed the language, framework, styling approach, and host. Spec 0002 already fixed the shape of Profile, SkillCategory, and Project content, which the components here render, so the ledger row's fields (tag, title, subtitle, detail body, image) are not invented here, they come from Project.

## Options considered

### Option 1: Extract the token set and components directly from the existing 1a Blueprint Ledger mockup (chosen)

Read the real colors, fonts, spacing, and markup already in the `.dc.html` mockup file into a token stylesheet and four Astro components, correcting only the values that fail the accessibility bar.

**Pros**:
- The mockup is not a sketch, it already contains the exact chosen values; extracting them is the most faithful way to satisfy "match the 1a Blueprint Ledger concept."
- Least new design work; the visual decisions were already made when the mockup was built.

**Cons**:
- Inherits the mockup's own flaws (the contrast failures) as something this spec must actively catch and correct, rather than starting from values that were accessible from the outset.

### Option 2: Design a fresh token system from generic best practice, then reskin to the Blueprint Ledger look

Start from a conventional design token scale (a generic type and spacing scale, for example a strict 8pt grid) and restyle it toward the Blueprint Ledger aesthetic afterward, rather than reading the mockup's specific values.

**Pros**:
- Produces a cleaner, more conventional token scale (e.g. a strict 8pt spacing system) that might generalize better to components this spec does not yet know about.

**Cons**:
- The mockup's actual spacing is not a strict 8pt scale (it mixes 10, 14, 22, and other values by hand tuned feel); forcing it into a generic scale would mean the components no longer match the mockup, working against the scope's own goal.
- Recreates values that already exist and are already correct except for the two contrast issues, for no real benefit on a project this size.

### Option 3: Adopt an existing open source design token framework (for example Open Props or Radix tokens) and reskin it

Use a published token framework's naming and scale, mapping Blueprint Ledger's colors and spacing onto it.

**Pros**:
- Comes with a broader, pre named token vocabulary that could save time if the site grows well beyond one page.

**Cons**:
- Adds a dependency and a naming convention foreign to this specific look, for a one page, single author site that spec 0001 already chose to keep dependency free (plain CSS, no framework); the mismatch between a generic framework's assumptions and this bespoke blueprint aesthetic would need constant overriding.

## Rationale

The mockup is not a rough sketch, it is a complete, pixel specific rendering of the chosen concept with real hex colors, real font sizes, and real markup for every piece in scope, so re deriving those values from a generic starting point (Option 2) or reskinning someone else's token framework (Option 3) would only recreate what already exists while risking drift from the actual chosen look. Extracting directly is both the least work and the most faithful to "match the 1a Blueprint Ledger concept" (the scope's own done when line).

The one deliberate departure from the mockup's exact values is the two muted greys that fail WCAG AA contrast on real text (`#9a9a94` at roughly 2.8 to 1, `#7a7a74` at roughly 2.2 to 1, both need 4.5 to 1). Rather than pick one rule to break, the token set keeps the lighter grey only for elements that carry no information (the grid rail's ambient index numbers, hairline notes) where WCAG does not require contrast, and darkens the tone used anywhere real content depends on it (subtitles, tags, footer links) to a value that passes with margin. This keeps the site visually close to the mockup while actually meeting the accessibility bar the same done when line asks for, instead of only appearing to.

The `<details>`/`<summary>` choice for the ledger row follows the same logic as spec 0001's "zero JavaScript by default" reasoning: the browser already implements correct keyboard and focus behavior for a disclosure widget, so building a custom version in JavaScript would spend code to recreate something the platform gives for free, and would need to be tested for the exact same accessibility bar this spec already gets from the browser. The nav's `scroll-target-group: auto` pattern was checked for current browser support before being written in: it is a real, shipping CSS feature (Chrome 140 and newer, confirmed via the Chromium Intent to Ship thread), not an assumption, and it degrades to a plain, working nav with no highlight in browsers that do not yet support it, so it costs nothing to include as a progressive enhancement.

## References

**Project sources** (verifiable, in this repo):
- `Portfolio brainstorm for mechanical engineer/Portfolio - 1a Blueprint Ledger.dc.html`, the source of every color, font, and spacing value in this spec
- [0001](../0001-static-site-stack-and-hosting/index.md), the stack decision (Astro, TypeScript, plain CSS custom properties, zero JavaScript by default) this spec builds on
- [0002](../0002-content-model.md), the content shapes (Profile, SkillCategory, Project) the components here render

**Practices & standards**:
- WCAG 2.1 AA contrast requirements (basis for darkening `--ink-muted`, and for keeping `--ink-faint` restricted to purely decorative use)
- Progressive enhancement (basis for the `scroll-target-group` nav pattern degrading gracefully, and for using the native `<details>` disclosure instead of a custom script)

**Links** (web verified during this conversation):
- [scroll-target-group CSS property, MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-target-group)
- [Creating a scroll spy with 2 lines of CSS, una.im](https://una.im/scroll-target-group/)
- [Intent to Ship: CSS scroll-target-group property, Chromium blink-dev](https://groups.google.com/a/chromium.org/g/blink-dev/c/R_VD_FkYrF8/m/J8EnGU00CAAJ)
