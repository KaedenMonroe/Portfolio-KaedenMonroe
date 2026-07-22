# Kaeden Monroe Portfolio

A personal portfolio site built with [Astro](https://astro.build) — static, zero client-side JS by default, deployed on Netlify.

Live site: https://kaeden-monroe-portfolio.netlify.app/

## Stack

- **Language / runtime**: TypeScript (strict), Node >=22.12.0
- **Framework**: Astro 7 (static site generator)
- **Styling**: Plain CSS with custom properties (design tokens), no CSS framework
- **Hosting**: Netlify

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server at localhost:4321
npm run build     # build the production site to ./dist
npm run preview   # preview the production build locally
```

Other useful commands:

```bash
npm run typecheck   # astro check
npm run lint        # eslint
npm run lint:fix    # eslint --fix
npm run format      # prettier --write
npm run format:check
npm test            # vitest
```

## Project structure

```
content/            profile and project markdown (frontmatter + body)
data/                typed data files, e.g. skills.ts
src/
  components/        Astro components
  layouts/            BaseLayout.astro (page shell, meta tags)
  lib/                typed content-reading helpers
  pages/              route files (index.astro)
  styles/             tokens.css (design tokens), global.css (resets, shared utilities)
public/              static assets served as-is (images, fonts, favicon, robots.txt)
docs/                specs and scope docs behind the build
design.md            art direction / design system reference
```

Content is validated against schemas in `src/content.config.ts` — an invalid edit (e.g. a malformed URL) fails `npm run typecheck` rather than silently rendering broken.

## Customizing content

Everything below is data — no component code needs to change to update the site's content.

### Profile / hero (`content/profile.md`)

Frontmatter fields:

| Field            | Required | Notes                                            |
| ---------------- | -------- | ------------------------------------------------ |
| `name`           | yes      | Displayed name                                   |
| `role`           | yes      | Shown under the name                             |
| `heroHeadline`   | yes      | Large hero text                                  |
| `heroSubtext`    | yes      | Supporting sentence under the headline           |
| `seoDescription` | yes      | Meta description / social share card description |
| `resumeUrl`      | yes      | Must be a valid URL (`z.url()`)                  |
| `email`          | yes      | Must be a valid email (`z.email()`)              |
| `linkedinUrl`    | yes      | Must be a valid URL                              |
| `githubUrl`      | yes      | Must be a valid URL                              |
| `blogUrl`        | no       | Optional, omit if unused                         |
| `copyrightName`  | yes      | Shown in the footer                              |

The body text below the frontmatter is the bio paragraph shown on the page.

> **Before publishing:** `resumeUrl`, `email`, `linkedinUrl`, and `githubUrl` are currently placeholder values marked `# TODO` in `content/profile.md`. Replace them with real links/contact info — the schema validates them as well-formed URLs/emails, but won't catch that they're fake.

### Projects (`content/projects/*.md`)

Each file is one project card. Frontmatter:

| Field      | Notes                                                 |
| ---------- | ----------------------------------------------------- |
| `title`    | Project name                                          |
| `subtitle` | One-line description                                  |
| `image`    | Path under `public/`, e.g. `/images/projects/foo.png` |

The body text is the project's longer description.

To add a project, drop a new `.md` file into `content/projects/` with the same frontmatter shape — no other code changes needed. To remove one, delete its file.

All three current projects (`autonomous-ground-platform.md`, `quadrotor-prototype.md`, `suspension-bracket-fea-study.md`) still point `image` at the shared `public/images/projects/placeholder.svg` — replace with real project photos/renders when available.

### Skills (`data/skills.ts`)

A typed array of categories:

```ts
export const skillCategories: SkillCategory[] = [
  { name: 'Engineering', tags: ['SolidWorks', 'Ansys FEA', ...] },
];
```

Add another `{ name, tags }` entry to add a new category (e.g. "Software", "Tools"), or add/remove strings in `tags` to change what's listed under an existing one.

### Design system

Visual design tokens (colors, spacing, type) live in `src/styles/tokens.css`; shared resets and utilities live in `src/styles/global.css`. See [`design.md`](./design.md) for the art direction and design rationale behind the current look.

## Deployment

Hosted on Netlify (`netlify.toml`), building via `npm run build` and publishing `dist/`. Pushing to `main` triggers a new deploy. The production URL is set via `site` in `astro.config.mjs`.

A custom domain (`kaedenmonroe.me`) has been added to the Netlify project but its DNS is not yet pointed at Netlify — see `docs/specs/0001-static-site-stack-and-hosting/index.md` for status.

## License

MIT — see [LICENSE](./LICENSE).
