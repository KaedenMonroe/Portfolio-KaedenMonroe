# 0001. Static Site Stack and Hosting

**Date**: 2026-07-18
**Status**: Proposed

## Summary

This decision picks what the portfolio site is built with and where it lives online. The site will be built with Astro (a tool that generates plain, fast loading web pages) written in TypeScript (a version of JavaScript that catches typos and mismatched data early), styled with plain CSS using custom properties (named values, sometimes called design tokens, for colors, spacing, and type), installed with npm (the package manager that ships with Node.js), and hosted on Netlify with its free tier and automatic preview links. It gives every later foundation feature (coding standards, content model, design system) a real platform to build on.

## Decision

**Chosen option**: Option 1: Astro, TypeScript, plain CSS, npm, Netlify

Build the portfolio as a static Astro site written in TypeScript, styled with plain CSS custom properties, managed with npm, and deployed on Netlify's free tier with automatic preview links per branch.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`) · `netlify-deploy` (`netlify/context-and-tools`, `.agents/skills/netlify-deploy/`) · `netlify-config` (`netlify/context-and-tools`, `.agents/skills/netlify-config/`) · `typescript-advanced-types` (`wshobson/agents`, `.agents/skills/typescript-advanced-types/`)

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript | Catches a mismatched content field or component prop at build time instead of a visual bug in production; Astro supports it with no extra setup. |
| Framework | Astro (static site generator) | Ships zero JavaScript by default, has a real component model for the reused nav, section block, and ledger row, and its Content Collections give the upcoming content model decision (feature 3) a typed, structured home. |
| Styling | Plain CSS with custom properties (design tokens) | Full control for the hand drawn, bespoke Blueprint Ledger look (grid rail, corner marks, control loop diagram); matches how the current design mockup is already styled; no extra dependency. |
| Package manager | npm | Ships with Node.js, zero extra install, simplest choice for a small, solo maintained project. |
| Hosting & deploy | Netlify (free tier) | Automatic preview link on every branch or pull request out of the box, which directly satisfies the foundation's "deploys to a live preview URL" requirement with no extra configuration. |
| Domain | Netlify's free subdomain, for now | Ships the thinnest usable whole first; a custom domain can be pointed at the same site later with no stack change. |

## Consequences

**Positive**:
- Zero JavaScript by default keeps the site fast, which matters for a recruiter opening the link on a phone with no patience for a slow load.
- Reusable components remove the need to hand duplicate the three ledger style project rows and the nav bar.
- Astro's Content Collections give the content model decision (feature 3) a ready, typed place to store project, skills, and about data, separate from markup.
- Netlify's automatic preview links satisfy the foundation's live preview URL requirement with no custom setup.
- TypeScript surfaces a broken content field or component prop before it ships, not after.

**Negative / tradeoffs**:
- Astro introduces a real build step and a `node_modules` folder; the site can no longer be edited by opening a single HTML file directly, unlike the current hand built mockup. Node and npm must be installed to work on it locally.
- There is a small learning curve to Astro's `.astro` file syntax for someone who has not used a static site framework before, though it stays close to plain HTML.
- The free Netlify tier has build minute and bandwidth limits (currently generous, far beyond what a one page personal portfolio needs), so this is a note, not a real constraint today.

**Neutral**:
- The live site sits on a Netlify provided subdomain until a custom domain is bought and pointed at it.
- No database, authentication, background jobs, or file storage layer is needed; this is a static, content only site with no backend surface.

## Follow-up

- [ ] Buy and point a custom domain at Netlify when ready; no stack change needed to do this later.
- [ ] The content model decision (feature 3) should use Astro Content Collections as the storage mechanism for project, skills, and about data, building directly on this stack choice.
- [ ] Root `AGENTS.md` does not exist yet. `/audit` (feature 2, coding standards and tooling) should capture this stack, the installed Agent Skills, and the resulting conventions once the scaffold exists.
- [ ] Connect the official Netlify MCP server (https://github.com/netlify/netlify-mcp) for live access to real deploy and site status; this is a one time config step in your MCP client, after which it is used automatically.
- [ ] Connect the official Astro Docs MCP server (https://github.com/withastro/docs-mcp) for live lookup against current Astro documentation; same one time config step.

## Rationale

Full reasoning, the options weighed, and references: see [rationale.md](rationale.md).
