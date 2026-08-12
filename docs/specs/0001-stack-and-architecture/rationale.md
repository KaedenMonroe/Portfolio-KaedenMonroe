# 0001. Stack and architecture, rationale

## Context

This project has no code yet. Astro is fixed as the framework; beyond that, nothing was decided before this spec. Every other item in the scope depends on this choice landing before any page gets built (basis: docs/scope/scope.md, "Nothing else gets built before this is decided").

Kaeden works solo on this project, so every process choice, from the package manager to how images are handled, has to be usable by one person with no team to onboard.

The site's stated purpose is to be found and read by recruiters, collaborators, and academic contacts, which makes public discoverability (SEO, OG tags, a sitemap) a real requirement rather than a nice to have.

The design system foundation (scope item 4, not yet designed) already commits to a serif plus sans pairing and a deliberate spacing rhythm, so whatever styling approach is picked here needs to give that goal a structural home, not just prose intentions (basis: docs/scope/scope.md, item 4).

Two later slices already imply infrastructure needs: a contact form (Slice 3) that must deliver an email, and privacy friendly analytics (Slice 4). The hosting choice made here either makes those slices close to free or turns them into real backend work later.

The project's stated build approach is Skateboard, ship the smallest usable whole first, then grow (basis: docs/scope/scope.md, "Build approach" line). That favors deferring real backend work until a slice actually needs it, rather than building infrastructure speculatively ahead of need.

## Options considered

### Option 1: The Netlify integrated stack (chosen)

Astro with static output, TypeScript strict, Astro Content Collections, Tailwind CSS, Astro's built in Fonts API, astro:assets, @astrojs/sitemap, Netlify hosting, and pnpm.

**Pros**:
- Every future slice this scope already names is already covered by a chosen layer; Netlify Forms in particular solves the Slice 3 contact form with zero extra infrastructure
- Tailwind's token scale gives the upcoming design system spec something structural to enforce, not just a style guide people can drift from
- The whole stack fits comfortably inside free hosting tiers appropriate to a personal portfolio's expected traffic

**Cons**:
- Ties the contact form's simplest implementation path to staying on Netlify specifically
- Astro's Fonts API is a newer, less proven feature than hand rolled font self hosting

### Option 2: The Vercel centric stack

The same language, content, and styling choices, but Vercel for hosting, with a hand built Astro API route (using the Vercel adapter) for the contact form instead of Netlify Forms.

**Pros**:
- Vercel is an extremely common, well documented Astro pairing with strong preview deploy workflows
- Keeps the contact form's logic in the codebase rather than depending on a host specific feature

**Cons**:
- The contact form now requires writing and maintaining a real serverless function (validation, spam handling, email delivery) instead of getting it for free
- More to build in Slice 3 for no functional gain on a first pass, working against the project's stated Skateboard approach

### Option 3: The minimal footprint stack

Cloudflare Pages for hosting, vanilla CSS with custom properties instead of Tailwind, and npm instead of pnpm.

**Pros**:
- Smallest possible dependency footprint; no utility class framework to learn or enforce discipline around
- Cloudflare's edge network is fast globally, and its free tier is generous

**Cons**:
- The "deliberate spacing rhythm" and constrained type and spacing scale the design system spec wants would have to be hand enforced with plain CSS variables instead of a tool doing it structurally
- Cloudflare has no equivalent to Netlify Forms, so the contact form would still need a hand built Worker or a third party form service either way, without even the styling framework's help elsewhere

## Rationale

Option 1 wins mainly on how it treats the two slices this scope has already named but not yet built. Netlify Forms turns the entire Slice 3 contact form from a build task into a configuration detail, which is exactly what the project's own Skateboard approach asks for: defer real infrastructure until a slice actually forces it (basis: docs/scope/scope.md, "Build approach" line). Option 2 and Option 3 both reopen that work as a real serverless function or third party service, for no benefit visible in the current scope.

Tailwind was chosen over vanilla CSS specifically because the design system foundation (item 4) is itself still an open decision, and it explicitly asks for a "deliberate spacing/whitespace rhythm" rather than an incidental one (basis: docs/scope/scope.md, item 4). A utility framework built on a constrained scale gives that future spec a tool to enforce its scale with, where plain CSS custom properties would depend entirely on hand discipline holding over time as more pages get built.

Astro Content Collections was already the direction the scope's own foundation description anticipated (basis: docs/scope/scope.md, item 1, "content approach (Astro content collections for bio and project entries)"), and nothing surfaced during this conversation argued against it: a solo maintained portfolio has no need for a headless CMS's editing workflow, and plain frontmatter without schema validation trades away exactly the safety a small, infrequently touched content set benefits most from.

The one real risk accepted here is Astro's Fonts API being a newer, less proven feature; that risk is bounded with a documented fallback in Follow-up (self hosting via Fontsource) rather than by choosing a more conservative option outright, since the engineer chose to accept that risk directly during the stack walk.

## References

**Project sources**:
- `docs/scope/scope.md`, the "Stack & architecture" foundation row and its "Build approach" line

**Practices & standards**:
- Type safe content schemas over unchecked frontmatter, for a site with infrequent, hand written content updates
- Deferring backend infrastructure until a feature slice actually requires it (the project's own Skateboard build approach)
