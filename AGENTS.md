# Kaeden Monroe Portfolio

## Stack

- **Language / Runtime**: TypeScript (strict mode), Node ^24.0.0
- **Framework**: Astro 7
- **Key dependencies**: Tailwind CSS, Astro Content Collections, astro:assets, @astrojs/sitemap, Embla Carousel
- **Package manager**: pnpm

## Build approach

**Skateboard**: ship the smallest usable whole first, a real visitor could use tomorrow, then grow it release by release.

## Commands

```bash
pnpm install   # install
pnpm dev       # dev server
pnpm build     # build
# no automated test suite by default (Alpha workflow); see ## Tooling
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`, or `docs/specs/NNNN-title/index.md` (plus `rationale.md`, `verify.md`, etc.) once a spec grows past a single file.

## Rules

- Functional style: pure functions, immutable data (`const`, no in place mutation); side effects (Netlify Forms, content loading) pushed to the edges.
- Prefer plain functions and composition over classes and inheritance.
- Follow Astro's own project layout: `src/pages`, `src/components`, `src/layouts`, `src/content`, `src/lib`.
- One consistent naming convention across files, components, and variables.
- Accessibility baseline: WCAG AA (focus states, alt text, semantic HTML, color contrast).
- Conventional commit messages (`feat:`, `fix:`, `chore:`, ...).
- Handle expected failures (e.g. a malformed Content Collection entry) with explicit error returns, not ad hoc try/catch.
- Design system: build all UI to `design.md` (the restrained, token driven visual system); token values live in `src/styles/global.css`.

## Tooling

- Linting / formatting: ESLint + Prettier, installed (`eslint.config.mjs`, `.prettierrc.json`); `astro-eslint-parser` + `eslint-plugin-astro` cover `.astro` files.
- Pre-commit: husky + lint-staged run lint, format, and typecheck on every commit.
- Testing gate: typecheck + manual `/check verify` only, no dedicated test suite by default (Alpha workflow).
- CI: not yet; Netlify already rebuilds and deploys on push.

## Git

- integration: on, branch prefix: feat/, commit: per-milestone, worktree: on

## Agent skills

- [tailwind-css](.agents/skills/tailwind-css/): `paulrberg/agent-skills`, Tailwind v4 conventions.
- [pnpm](.agents/skills/pnpm/): `onmax/nuxt-skills`, pnpm usage.
- [netlify-deploy](.agents/skills/netlify-deploy/): `netlify/context-and-tools`, Netlify deploy.
- [accessibility](.agents/skills/accessibility/): `addyosmani/web-quality-skills`, WCAG 2.2 audits (picked via `/decide` over `mastepanoski/claude-skills`, `wshobson/agents`).
- [eslint-prettier-config](.agents/skills/eslint-prettier-config/): `patricio0312rev/skills`, ESLint + Prettier setup.
- [astro](.agents/skills/astro/): `astrolicious/agent-skills`, Astro conventions.

Later: the `seo` skill (same `addyosmani/web-quality-skills` bundle) once SEO work starts; Fathom/Umami analytics MCP servers once the analytics feature (item 9) is designed.
Declined: `giuseppe-trisciuoglio/developer-kit`, `josiahsiegel/claude-plugin-marketplace`, `hairyf/skills`, `jwynia/agent-skills`, `antfu/skills`, `mindrally/skills`, `openai/skills`, `mastepanoski/claude-skills`, `wshobson/agents`; an Agent Skill for `embla-carousel` (declined at /sync, 2026-08-17). Removed 2026-08-17 (unused during the UI-design stage): `brainstorming`, `creative-director`, `design-brief`, `design-consultation`, `design-review`, `plan-design-review`, `reference-design-contract` (all `nexu-io/open-design`); `design-tokens` (`julianoczkowski/designer-skills`).
MCP servers: astro-docs (connected).

## Context files

<!-- Nested AGENTS.md files are listed here as they are created -->

- [src/content/AGENTS.md](src/content/AGENTS.md): the content model (schema, query layer, asset conventions).
- [src/components/AGENTS.md](src/components/AGENTS.md): UI component conventions (props, styling, accessibility).
- [src/lib/AGENTS.md](src/lib/AGENTS.md): content query layer and carousel card sizing math.

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
