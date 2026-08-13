# Kaeden Monroe Portfolio

## Stack

- **Language / Runtime**: TypeScript (strict mode), Node ^24.0.0
- **Framework**: Astro 7
- **Key dependencies**: Tailwind CSS, Astro Content Collections, astro:assets, @astrojs/sitemap
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

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`.

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
- [design-tokens](.agents/skills/design-tokens/): `julianoczkowski/designer-skills`, design tokens.
- [pnpm](.agents/skills/pnpm/): `onmax/nuxt-skills`, pnpm usage.
- [netlify-deploy](.agents/skills/netlify-deploy/): `netlify/context-and-tools`, Netlify deploy.
- [accessibility](.agents/skills/accessibility/): `addyosmani/web-quality-skills`, WCAG 2.2 audits (picked via `/decide` over `mastepanoski/claude-skills`, `wshobson/agents`).
- [eslint-prettier-config](.agents/skills/eslint-prettier-config/): `patricio0312rev/skills`, ESLint + Prettier setup.
- [astro](.agents/skills/astro/): `astrolicious/agent-skills`, Astro conventions.
- [brainstorming](.agents/skills/brainstorming/): `nexu-io/open-design`, turns rough ideas into design alternatives through structured questioning.
- [creative-director](.agents/skills/creative-director/): `nexu-io/open-design`, creative critique and concepting across ideation methodologies (SIT, TRIZ, SCAMPER).
- [design-brief](.agents/skills/design-brief/): `nexu-io/open-design`, parses I-Lang design briefs into concrete design specs.
- [design-consultation](.agents/skills/design-consultation/): `nexu-io/open-design`, builds a design system from scratch with product mockups.
- [design-review](.agents/skills/design-review/): `nexu-io/open-design`, visual audit and atomic-commit fixes for shipped UI.
- [plan-design-review](.agents/skills/plan-design-review/): `nexu-io/open-design`, senior-designer style review gate before merging UI work.
- [reference-design-contract](.agents/skills/reference-design-contract/): `nexu-io/open-design`, turns taste references (screenshots, URLs, notes) into a grounded design.md handoff.

Later: the `seo` skill (same `addyosmani/web-quality-skills` bundle) once SEO work starts; Fathom/Umami analytics MCP servers once the analytics feature (item 9) is designed.
Declined: `giuseppe-trisciuoglio/developer-kit`, `josiahsiegel/claude-plugin-marketplace`, `hairyf/skills`, `jwynia/agent-skills`, `antfu/skills`, `mindrally/skills`, `openai/skills`, `mastepanoski/claude-skills`, `wshobson/agents`.
Remove once design is finalized and development begins: `brainstorming`, `creative-director`, `design-brief`, `design-consultation`, `design-review`, `plan-design-review`, `reference-design-contract` (all `nexu-io/open-design`). UI-design-stage-only skills; keeping them loaded past that point is unneeded token overhead during build work.
MCP servers: astro-docs (connected).

## Context files

<!-- Nested AGENTS.md files are listed here as they are created -->

- [src/content/AGENTS.md](src/content/AGENTS.md): the content model (schema, query layer, asset conventions).
- [src/components/AGENTS.md](src/components/AGENTS.md): UI component conventions (props, styling, accessibility).

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
