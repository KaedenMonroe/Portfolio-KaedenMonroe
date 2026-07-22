# 0004. SEO and social metadata: rationale

## Context

`src/layouts/BaseLayout.astro` currently renders only a `<title>` and an optional `<meta name="description">`. There is no Open Graph tag, no Twitter card tag, no canonical link, no structured data, no sitemap, and no robots file. `astro.config.mjs` has no `site` field set, so the site has no single resolved production URL to build absolute links from.

This site is the primary link Kaeden shares with recruiters and hiring managers, dropped into a résumé, a LinkedIn message, or an application form. The resulting preview card is often the first impression, before anyone clicks through. Scope item 8 ("SEO & social metadata") names this directly: title and description tags, Open Graph and social card data, and a sitemap, so the portfolio "is discoverable and shares well when linked from a résumé or application."

The site currently lives on Netlify's automatically assigned subdomain (`kaeden-monroe-portfolio.netlify.app`); spec 0001 explicitly defers a custom domain to later, "a custom domain can be pointed at the same site later with no stack change." Any URL this feature bakes in (canonical, `og:url`, the sitemap) is correct today but will need a follow up pass once that domain changes.

The site is one page (`src/pages/index.astro` is the project's only route), built and maintained solo by someone who described themselves, in spec 0001's rationale, as "not a professional web developer." The project's declared build approach is Skateboard, shipping the thinnest usable whole first, and its weight profile is "mostly lean and medium; nothing full weight." The existing Blueprint Ledger design system (`design.md`) already defines the full token vocabulary, color, type, spacing, and the grid rail motif, that any new visual surface must draw from rather than inventing new values. Feature 6 (spec 0003's design system plus the walking skeleton and portfolio page work) already set a precedent for how a bespoke visual asset gets built here: the hero's control loop diagram was hand authored as a static SVG, with "the make it live/interactive item" explicitly deferred to the backlog (scope item 9), rather than built as a generated or dynamic asset from day one.

## Options considered

### Option 1: No dedicated share image, ship tags only

Add the meta, Open Graph, and Twitter tags, but skip authoring a share image entirely, either omitting `og:image` or reusing the existing favicon scaled up.

**Pros**:
- Fastest to ship, zero design work.
- No new asset to keep in sync with content changes.

**Cons**:
- Most link preview platforms render a blank or visibly wrong card without a proper `og:image` at the expected aspect ratio, which directly undermines the stated goal of "shares well when linked from a résumé or application." A favicon stretched to 1200 by 630 looks broken, not designed.

### Option 2: A hand authored static image, committed once (chosen)

Hand author the share card as an SVG that draws on `design.md`'s tokens directly (name, role, the grid rail motif, no photo), then rasterize it once to a 1200 by 630 PNG and commit both files to `public/images/`.

**Pros**:
- No new build time dependency; the current toolchain (Astro, plain CSS, no image pipeline) is untouched.
- Matches the project's own precedent: the hero diagram (spec 0003, feature 6) was already built this way, a static, hand authored SVG, with dynamic behavior explicitly deferred.
- Full manual control over the exact composition, with no risk of a headless rendering pipeline behaving differently in Netlify's build environment than it does locally.

**Cons**:
- The image does not regenerate itself. If `profile.name`, `profile.role`, or the design tokens change, someone has to remember to re author and re export it.

### Option 3: Build time generated from a template

Use an image generation library (for example `astro-og-canvas`, or `satori` paired with a raster renderer) to render the card from `profile.md`'s content at every build.

**Pros**:
- Always in sync with content; no manual regeneration step, no drift possible.
- Scales cleanly if the site later grows more pages that each need a distinct card.

**Cons**:
- Adds a new build time dependency, typically including a native binary, that has to keep working in Netlify's build environment; more moving parts for a solo, non professional web developer maintained site whose name and role rarely change.
- Meaningful setup and template authoring cost for a single page site with exactly one card to produce.

## Rationale

Option 2 is the better fit for this project specifically, not as a general rule. The site has exactly one page and one card to produce; the content that card shows (name and role) changes rarely, unlike a blog or a multi page site where new content constantly needs new cards. Under those conditions, the reason to reach for a build time generation library, keeping many cards in sync automatically, does not apply, while its cost, a new dependency with a native rendering step that must behave identically on Netlify's build image, still does.

The project has already made this exact call once, for a visually comparable asset. The hero's control loop diagram (spec 0003) was built as a static, hand authored SVG, with the dynamic version explicitly deferred (scope item 9). Building the share card the same way keeps the project internally consistent and matches its stated Skateboard approach: ship the thinnest usable whole, and its solo, lean maintenance profile, one new dependency avoided is one fewer thing to operate.

Option 1 was rejected because it fails the feature's actual goal. A recruiter's first impression of a shared link is the preview card; shipping tags with no real image, or a stretched favicon, reads as unfinished rather than "spare," which is not the same thing this design system intentionally aims for elsewhere.
