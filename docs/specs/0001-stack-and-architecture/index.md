# 0001. Stack and architecture

**Date**: 2026-08-11
**Status**: Accepted

## Summary

This decision sets the rest of the technical stack for Kaeden's portfolio site, since only the Astro framework was fixed beforehand. It picks TypeScript, Astro Content Collections for the bio and project content, Tailwind CSS for styling, Netlify for hosting, and a handful of smaller tools (pnpm, astro:assets, a sitemap integration). The main reason behind these picks is that Netlify's built in form handling means the contact form planned for later can be built with no backend code at all. Nothing here is locked forever, but it is the foundation every other feature in the scope will build on.

## Decision

**Chosen option**: Option 1: The Netlify integrated stack

Build the portfolio as a static Astro site in TypeScript (strict mode), with Astro Content Collections for the bio and project content, Tailwind CSS for styling, Netlify for hosting and deploy, pnpm as the package manager, astro:assets for image handling, Astro's built in Fonts API for the serif plus sans pairing, and @astrojs/sitemap plus a small hand built component for SEO.

**Implementation skills**: `tailwind-css` (`paulrberg/agent-skills`, `.claude/skills/tailwind-css/`) · `design-tokens` (`julianoczkowski/designer-skills`, `.claude/skills/design-tokens/`) · `pnpm` (`onmax/nuxt-skills`, `.claude/skills/pnpm/`) · `netlify-deploy` (`netlify/context-and-tools`, `.claude/skills/netlify-deploy/`)

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro (already decided) | Fixed starting point for this project before this spec was written |
| Language | TypeScript, strict mode | Type safe Content Collection schemas catch a malformed project entry at build time instead of a broken page at runtime |
| Rendering / output | Static (prerendered), no adapter installed yet | Netlify Forms covers the future contact form with no server code, so nothing needs an on demand route yet |
| Content | Astro Content Collections | Zod validated, git versioned frontmatter colocated with the code; matches what the scope foundation already anticipated |
| Styling | Tailwind CSS | Gives the "deliberate spacing rhythm" design goal a structural token scale instead of relying on hand discipline |
| Fonts | Astro's built in Fonts API (experimental) | Automates self hosting and preloading for the serif plus sans pairing; flagged as newer with a documented fallback below |
| Images | astro:assets | Built in Sharp based optimization and responsive components, no extra dependency for a modest image count |
| SEO | @astrojs/sitemap plus a hand built meta/OG component | Keeps discoverability tooling minimal and dependency light |
| Hosting | Netlify | Git based deploys, generous free tier, and Netlify Forms solves the future contact form for free |
| Package manager | pnpm | Faster installs and lower disk usage, a common default in the Astro ecosystem |

## Consequences

**Positive**:
- The Slice 3 contact form (a later, separate decision) has a free, backend free path already available through Netlify Forms
- Tailwind's constrained token scale gives the upcoming design system spec (item 4) something structural to enforce spacing and type discipline against, not just prose intent
- TypeScript strict plus Content Collections turns a malformed project entry into a build failure instead of a silently broken page
- The whole stack runs on free tiers appropriate for a personal, low traffic portfolio

**Negative / tradeoffs**:
- The contact form's simplest path is now tied to Netlify specifically; moving hosts later means rebuilding that feature on whatever the new host offers instead
- Astro's Fonts API is a newer, less battle tested feature than self hosting fonts by hand; it could require a fallback mid build
- Tailwind adds a class heavy authoring style that needs discipline to keep matching a "minimal" visual ethos rather than fighting it

**Neutral**:
- pnpm needs a one time global install on any machine that does not already have it
- @astrojs/sitemap and the meta/OG component are a small amount of code to write once, not a dependency to maintain

## Follow-up

- [ ] No root `AGENTS.md` exists yet (scope item 2, coding standards and tooling, owned by `/audit`, will create it). Once it exists, capture this stack (Astro, TypeScript strict, Tailwind CSS, Astro Content Collections, Netlify, pnpm) in its `## Rules`, since these apply to every file in the project
- [ ] Record the four installed Agent Skills in root `AGENTS.md`'s `## Agent skills` section once it exists: `tailwind-css`, `design-tokens`, `pnpm`, `netlify-deploy` (each pointing at `.claude/skills/<name>/`)
- [ ] Record the connected `astro-docs` MCP server (`https://mcp.docs.astro.build/mcp`) on root `AGENTS.md`'s `MCP servers:` line once it exists
- [ ] Record these declined/not selected candidates so a later stage does not re-offer them: Tailwind, `giuseppe-trisciuoglio/developer-kit` (skill source could not be located), `josiahsiegel/claude-plugin-marketplace` (bundled in a larger plugin), `hairyf/skills` (6+ months stale); CSS, `jwynia/agent-skills` (aesthetic tooling, not a fit for token/CSS fundamentals); pnpm, `antfu/skills`, `mindrally/skills`; Netlify, `openai/skills` (source repository officially deprecated)
- [ ] Astro's Fonts API is experimental as of this decision. If it proves unstable during scaffolding, fall back to self hosting the serif plus sans pair via Fontsource packages instead
- [ ] This decision leans on Netlify Forms to fulfill the Slice 3 contact form with no backend code. The contact form spec (`/architect contact form`) should confirm this still fits before building, since requirements may have grown by then
- [ ] Pin the current Node.js LTS version in `package.json` engines and in Netlify's build settings once the scaffold exists; not pinned here since no web check ran during this design conversation

## Rationale

Reasoning and the options weighed: see [rationale.md](rationale.md).
