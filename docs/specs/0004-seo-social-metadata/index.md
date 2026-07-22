# 0004. SEO and social metadata

**Date**: 2026-07-21
**Status**: Accepted

## Summary

This decision adds the metadata that makes the portfolio discoverable and share well: title and description tags, Open Graph and Twitter card tags, a Person structured data block, a sitemap, and a robots file. The centerpiece is a purpose built social preview (Open Graph) card image showing the name, role, and grid rail motif from the existing design system, hand authored as a static image rather than generated at build time. This mirrors how the hero diagram was already built (spec 0003, feature 6), and needs no new build dependency.

## Requirements

**User stories**:
- As Kaeden, I want the link I share on a résumé, LinkedIn, or in an email to render a designed preview card, so that it looks like a considered product before anyone clicks through.
- As a recruiter searching for Kaeden's name, I want a search result with a clear title and description, so that I can quickly tell this is the right person and site.
- As a search engine or link unfurling bot, I want a sitemap, a canonical URL, and structured data, so that I can index and represent the site correctly.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):
- **AC-1**: The page's head includes a `<title>`, a `<meta name="description">` sourced from a dedicated SEO description (not the hero subtext), and a `<link rel="canonical">` pointing at the resolved production URL.
- **AC-2**: The page's head includes Open Graph tags (`og:title`, `og:type`, `og:url`, `og:site_name`, `og:locale`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`) and Twitter card tags (`twitter:card` set to `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`) that a link preview tool (Facebook's Sharing Debugger, LinkedIn's Post Inspector, or a Slack unfurl) resolves correctly.
- **AC-3**: `og:image` and `twitter:image` resolve to a stable, absolute URL for a 1200 by 630 pixel PNG showing the name, role, and the Blueprint Ledger grid rail motif, built from the design system's own tokens, with no photo.
- **AC-4**: A schema.org Person JSON-LD block sits in the page head, with `name`, `jobTitle`, `url`, `sameAs` (LinkedIn and GitHub), and `email` populated from profile content.
- **AC-5**: `sitemap.xml` exists at the site root and lists the page; `robots.txt` allows all crawling and points at the sitemap.
- **AC-6**: `astro.config.mjs` sets `site` to the resolved production URL, so canonical, Open Graph, and sitemap URLs are absolute rather than relative.

## Decision

**Chosen option**: Option 2: A hand authored static image, committed once

The Open Graph and Twitter share image is hand authored as an SVG that draws directly on the design system's own tokens, rendered once to a 1200 by 630 PNG and committed to `public/images/`, rather than generated at build time from a template.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`)

## Rationale

See `rationale.md`.

## Feature design

**Data model sketch**:
- `profile` content collection (`src/content.config.ts`): add one field, `seoDescription: z.string()`, required. Authored in `content/profile.md` frontmatter alongside the existing `heroSubtext`. This is the source for `meta description`, `og:description`, and `twitter:description`; it stays a separate string from `heroSubtext` on purpose, since a search snippet and an on page subhead read differently.
- No new content field for the share image path. The site is a single page (`src/pages/index.astro` is the only route), so one image, at a fixed path (for example `public/images/og-card.png`), covers every share. A per page image is out of scope until the site has more than one page (see Follow-up).
- `BaseLayout.astro`'s `Props` interface grows from `{ title, description }` to also accept the values the head block needs to render Open Graph, Twitter, canonical, and JSON-LD tags: the resolved page description (now `seoDescription`), and the profile fields the JSON-LD block needs (`name`, `role`, `email`, `linkedinUrl`, `githubUrl`). `index.astro` already loads the full `Profile` object via `getProfile()`, so the simplest shape is passing that object (or the needed subset) straight through, not duplicating it as separate props.

**API surface**:
Not applicable. This is a static site with no backend routes; every tag here renders at build time from local content.

**Key invariants**:
- `og:image` and `twitter:image` are always absolute URLs built from `Astro.site`, never a relative path (a relative `og:image` is silently ignored by most crawlers).
- `og:image:width` and `og:image:height` always match the committed PNG's real pixel dimensions (1200 by 630) exactly; a mismatch causes some platforms to crop or reject the image.
- `seoDescription` stays within roughly 155 characters, the point most search engines and link previews truncate at.

**Security model**:
Not applicable. Every field rendered here (name, role, email, social links) is already public on the page itself; this feature adds no new data exposure, no authentication, and no access control surface.

**Critical test scenarios** (each maps to an acceptance criterion in `## Requirements`):
- Happy path: pasting the production URL into Facebook's Sharing Debugger, LinkedIn's Post Inspector, and a Slack message each render the title, the dedicated description, and the 1200 by 630 grid rail card, verifies **AC-2**, **AC-3**.
- Failure case: a build run without `site` set in `astro.config.mjs` would emit relative Open Graph and canonical URLs; the build plan sets `site` explicitly so this cannot happen in the deployed output, verifies **AC-6**.
- Auth or permission: not applicable, every surface here is public with no auth boundary.

## Build plan

1. Add `seoDescription: z.string()` to the `profile` collection schema in `src/content.config.ts`, and author the value in `content/profile.md`, satisfies **AC-1**.
2. Set `site` in `astro.config.mjs` to the resolved production URL (`https://kaeden-monroe-portfolio.netlify.app/`), satisfies **AC-6**.
3. Hand author the share card as an SVG built from `design.md`'s tokens (grid rail motif, name, role, the mono and sans pairing, `--accent` used sparingly, no photo), then rasterize it once to a 1200 by 630 PNG; commit both the SVG source and the PNG to `public/images/`, satisfies **AC-3**.
4. Extend `BaseLayout.astro`'s head block with the canonical link, the full Open Graph tag set, and the Twitter card tag set, wired to `seoDescription`, the new share image, and `Astro.site`, satisfies **AC-1**, **AC-2**, **AC-3**.
5. Add the Person JSON-LD `<script type="application/ld+json">` block to `BaseLayout.astro`, sourced from the profile fields already loaded by `index.astro`, satisfies **AC-4**.
6. Add the official sitemap integration (`npx astro add sitemap`), and add `public/robots.txt` allowing all crawling and pointing at `/sitemap-index.xml`, satisfies **AC-5**.
7. Build the site, inspect the generated head markup and `sitemap.xml`, and check the share card in a real link preview tool, satisfies **AC-1** through **AC-6**.

## Consequences

**Positive**:
- A link shared from a résumé, LinkedIn, or an application form now renders a designed card that matches the site's own visual identity, instead of a blank or generic fallback preview.
- The site becomes properly indexable, with one canonical URL, avoiding duplicate content confusion if a custom domain is added later.

**Negative / tradeoffs**:
- The share image does not regenerate itself. If `profile.name`, `profile.role`, or the design tokens change, someone has to manually re author and re export the SVG and PNG; there is no automatic drift detection.
- The Person JSON-LD block is a second place (alongside `profile.md`) that has to be kept in sync with the real name, role, and contact links, for a payoff that is hard to measure on a single page personal site.
- The production URL is still Netlify's assigned subdomain (per spec 0001, a custom domain is deferred); everything built here (canonical, `og:url`, sitemap) is correct today but points at a subdomain that is expected to change.

**Neutral**:
- Adds one new content field (`seoDescription`) and one new npm dependency (`@astrojs/sitemap`).
- No new environment variables or credentials.

## Follow-up

- [ ] When a custom domain is bought and pointed at Netlify (spec 0001's deferred item), update `astro.config.mjs`'s `site` value, regenerate the sitemap, and re check the share card in each platform's cache busting debugger tool, since these platforms cache old previews per URL.
- [ ] If a real headshot is added to the site later, revisit the share card's composition; this spec deliberately leaves the photo out.
- [ ] If the site grows beyond one page (for example, individual project pages get their own URL), revisit whether every page needs its own share card or the sitewide one still fits.
