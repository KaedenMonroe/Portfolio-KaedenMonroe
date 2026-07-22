# Kaeden Monroe Portfolio

## Stack

- **Language / Runtime**: TypeScript (strict mode, `astro/tsconfigs/strict`), Node >=22.12.0
- **Framework**: Astro 7 (static site generator, ships zero JS by default)
- **Key dependencies**: astro, @astrojs/check, @astrojs/sitemap, netlify-cli
- **Styling**: Plain CSS with custom properties (design tokens), no CSS framework
- **Package manager**: npm
- **Hosting**: Netlify (free tier, automatic preview links per branch); production URL set via `site` in `astro.config.mjs` (currently `https://kaeden-monroe-portfolio.netlify.app/`, a Netlify subdomain pending a custom domain, spec 0001)

## Build approach

Skateboard, ship the thinnest usable whole first, then grow it release by release, each release shippable.

## Commands

```bash
npm install       # Install
npm run dev        # Dev server
npm run build       # Build
npm run preview      # Preview a production build
npm run typecheck    # Typecheck (astro check; the project's test gate for now, see Rules)
npm run lint        # Lint
npm run format       # Format
npm test          # Run tests (Vitest)
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`, promoted to `docs/specs/NNNN-title/{index.md, rationale.md, verify.md}` once verify steps are saved.

## Rules

- Functional style: prefer plain functions and pure logic over classes; push side effects (data reads, browser APIs) to the edges.
- Immutable data: use `const`, never mutate in place; prefer `map`/`filter`/`reduce` over imperative loops.
- Named exports only, no default exports.
- Consistent naming: PascalCase component files (`Hero.astro`), camelCase functions and variables, kebab-case content slugs.
- Folder structure by layer: `src/components`, `src/layouts`, `src/styles`, `src/lib` (typed read functions, e.g. `src/lib/content.ts`). Content lives at the project root, not under `src/content`: `content/` (Profile and Project markdown, frontmatter plus body) and `data/` (typed data, e.g. `data/skills.ts`), defined and validated via `src/content.config.ts`.
- Type strictness: strict TypeScript, no `any`.
- Conventional commit messages (`feat:`, `fix:`, `chore:`).
- Lint and format with ESLint + Prettier (`eslint-plugin-astro` for `.astro` files); lint and format run on staged files before every commit via husky + lint-staged. Typecheck and build are not part of the pre-commit hook, they run in CI.
- Test suite: Vitest, added where a feature's complexity warrants it (not every feature); otherwise `astro check` (typecheck) and manual `/check verify` remain the gate, matching the scope's lean/medium weight profile. Astro components (`.astro` files) cannot be rendered by the current Vitest setup (no Astro aware Vite config wired in); their runtime behavior is proven by `/check verify` instead.
- CI: a basic GitHub Actions workflow on push (lint, format check, typecheck, build).
- Design system: build all UI to `design.md` (art direction and the build mandate); token values live in `src/styles/tokens.css`, shared resets and the `.chip` utility in `src/styles/global.css`.
- Self hosted fonts: web font files are downloaded once into `public/fonts/<family>/` and loaded via `@font-face` with `font-display: swap` in `src/styles/tokens.css`, never fetched from a third party host like fonts.googleapis.com.
- Disclosure pattern: expand and collapse UI (e.g. the ledger row) uses the native `<details>`/`<summary>` element, not a custom JS/ARIA widget.
- Social share image: the Open Graph/Twitter card is a hand authored static asset (`public/images/og-card.svg`, rasterized once to `og-card.png`, 1200x630), the same pattern as the hero diagram (spec 0003); regenerate manually if `profile.name`, `profile.role`, or the design tokens change, no build time image generation.

## Agent skills

- [astro](.agents/skills/astro/): `astrolicious/agent-skills`, Astro framework conventions, component model, and CLI usage.
- [netlify-config](.agents/skills/netlify-config/): `netlify/context-and-tools`, `netlify.toml` configuration reference.
- [netlify-deploy](.agents/skills/netlify-deploy/): `netlify/context-and-tools`, deploying and managing the site on Netlify.
- [typescript-advanced-types](.agents/skills/typescript-advanced-types/): `wshobson/agents`, advanced TypeScript type patterns.
- [eslint-prettier-husky-config](.agents/skills/eslint-prettier-husky-config/): `hopeoverture/worldbuilding-app-skills`, ESLint v9 flat config, Prettier, husky/lint-staged pre-commit, and a lint CI workflow.
- [github-actions-templates](.agents/skills/github-actions-templates/): `wshobson/agents`, GitHub Actions workflow templates for CI.
- [vitest](.agents/skills/vitest/): `antfu/skills`, Vitest unit testing conventions (mocking, coverage config, test filtering and fixtures).

MCP servers: Netlify MCP (recommended, `netlify/netlify-mcp`), Astro Docs MCP (recommended, `withastro/docs-mcp`), ESLint MCP (recommended, `@eslint/mcp`)

## Context files

<!-- Nested AGENTS.md files are listed here as they are created -->

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
