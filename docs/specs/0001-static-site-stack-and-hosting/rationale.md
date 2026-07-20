# 0001. Static Site Stack and Hosting: Rationale

## Context

This is a greenfield project with no code yet, only a hand built design mockup (the "Blueprint Ledger" brainstorm: a grid rail layout, ledger style expandable project rows, and a custom SVG control loop diagram, styled with plain inline CSS grid, no framework). The site is a one page portfolio for a third year mechanical engineering student, meant to help land internships and jobs. It has no backend, no database, and no user accounts; it is a purely presentational, content driven page.

Several forces shape this decision. The site will be built and maintained solo by someone who is not a professional web developer, so the tooling has to stay approachable. The scope's Foundation "done when" line requires the empty scaffold to build and deploy to a live preview URL, which makes the hosting platform's deploy story load bearing from day one, not an afterthought. The project's declared weight profile is "mostly lean and medium; nothing full weight," ruling out anything built for an application backend. And the existing mockup already has a distinctive, bespoke visual language (grid rail, corner marks, hand drawn SVG diagram) that any chosen styling approach needs to support rather than fight.

Not deciding this leaves every later foundation feature (coding standards and tooling, content model, design system) without a concrete platform to target, risking conflicting ad hoc choices made feature by feature instead of once, deliberately, here.

## Options considered

### Option 1: Astro, TypeScript, plain CSS, npm, Netlify

Astro is a content focused static site generator: it ships zero JavaScript by default, has a real component model, and includes Content Collections for structured content. Paired with TypeScript, plain CSS custom properties for design tokens, npm, and Netlify hosting with automatic preview links.

**Pros**:
- Component reuse for the nav, section block, and ledger row, instead of hand duplicated markup
- Content Collections give the content model decision (feature 3) a typed, structured home
- Ships no JavaScript by default, keeping the page fast
- Netlify's built in preview URLs satisfy the live preview requirement with zero extra config

**Cons**:
- Adds a real build step and `node_modules`, unlike a single hand edited HTML file
- A small syntax learning curve for someone new to static site frameworks

### Option 2: Eleventy (11ty), TypeScript, plain CSS, npm, Netlify

Eleventy is a simpler, lower level static site generator: highly flexible, fast, but with a more manual approach to sharing components and structuring content than Astro's built in system.

**Pros**:
- Very simple mental model, minimal opinions, fast builds
- Long established, stable, widely used for content sites

**Cons**:
- No built in structured content layer equivalent to Astro's Content Collections; the content model decision (feature 3) would need a separate plugin or hand rolled data layer
- More manual wiring to share the nav, section block, and ledger row as reusable pieces

### Option 3: Plain HTML, CSS, and JavaScript with Vite, npm, Netlify

No framework at all: hand written HTML, CSS, and JavaScript, using Vite only as a local dev server and bundler. Closest to how the current design mockup is already built.

**Pros**:
- Zero framework concepts to learn; what you see is exactly what ships
- No abstraction between the developer and the browser

**Cons**:
- The three ledger style project rows and the nav bar get hand duplicated instead of reused as a component, directly working against feature 3's requirement that content live in one structured source with no hardcoded duplication
- No structured content layer; content and markup stay mixed unless a separate system is hand built

### Option 4: Next.js (static export), TypeScript, Tailwind CSS, npm, Vercel

Next.js is a React framework that can export a static build. Paired with Tailwind CSS for utility first styling and Vercel hosting.

**Pros**:
- Mature ecosystem, large community, well documented
- Vercel's preview links and DX are excellent

**Cons**:
- Brings the full React runtime and build toolchain for a page whose only interactivity is expanding and collapsing a project row; the operational and learning overhead is not justified by the actual need
- Tailwind's utility classes push toward a generic, conventional UI look, working against the bespoke grid rail and corner mark aesthetic the mockup already establishes

## Rationale

Astro wins primarily on fit for a solo, non professional maintainer: its `.astro` files read close to plain HTML, which keeps the learning curve gentle, while still giving real component reuse for the nav, section block, and ledger row (the current mockup already repeats the ledger row pattern three times by hand, which Astro removes). Content Collections give the not yet designed content model decision (feature 3) a natural, typed home, whereas Eleventy would need a separate plugin or hand rolled layer to do the same job, and plain HTML would keep content and markup mixed, directly conflicting with feature 3's stated requirement that content live in one structured source with no hardcoded duplication. Astro also ships zero JavaScript by default, preserving the fast, hand crafted feel of the current mockup rather than adding a framework runtime the page does not need.

Plain CSS with custom properties was chosen over Tailwind because the Blueprint Ledger design (a custom grid rail, hand placed corner marks, a bespoke SVG control loop diagram) is closer in spirit to how the mockup is already styled by hand; Tailwind's utility classes are strongest for conventional UI patterns and would nudge a highly bespoke layout toward a more generic look, plus add a build plugin the project does not otherwise need. npm was chosen over pnpm because it ships with Node.js already, avoiding one more tool for a solo maintainer to install and learn, and the project's dependency count is small enough that pnpm's disk and speed advantages would not be felt.

Netlify was chosen over Vercel, Cloudflare Pages, and GitHub Pages because automatic preview links per branch or pull request are a first party, zero configuration feature there, which directly satisfies the scope's Foundation "done when" line (the empty scaffold must deploy to a live preview URL) with the least setup. Vercel offers an equally strong preview flow and would also have worked; Netlify was preferred slightly because its official Agent Skills (`netlify-deploy`, `netlify-config`) were already found and installed, giving first party deploy conventions for the build step ahead. GitHub Pages was ruled out because automatic per pull request preview URLs need extra GitHub Actions configuration there rather than being built in, making it less turnkey for the stated requirement.

## Landscape and tool discovery evidence

A web landscape check (run mid 2026) confirmed the following were current and actively maintained at decision time: Astro 6.x (Cloudflare backed), Eleventy 3.x, Next.js 16.x, Netlify's free tier with automatic PR preview deploys, Vercel's hobby tier, Cloudflare Pages' free tier, Tailwind CSS 4.x, and npm as still the default, zero setup package manager bundled with Node.js.

A separate tool discovery check found official Agent Skills for Astro (`astrolicious/agent-skills`) and Netlify (`netlify/context-and-tools`, covering deploy and config), plus a general TypeScript typing skill (`wshobson/agents`), all installed. It also found official MCP (Model Context Protocol) servers for Netlify (live deploy and site status) and Astro (live documentation lookup), offered to the engineer as a follow up connection step since connecting an MCP server is a client side configuration action.

## References

**Project sources**:
- `docs/scope/scope.md`, feature 1 "Stack & architecture" (the "done when" line: stack recorded in a spec, scaffold deploys to a live preview URL)
- `Portfolio brainstorm for mechanical engineer/Portfolio - 1a Blueprint Ledger.dc.html`, the existing hand styled design mockup (plain CSS grid, hand drawn SVG diagram, no framework)
- Installed Agent Skills: `astro`, `netlify-deploy`, `netlify-config`, `typescript-advanced-types` (`.agents/skills/`)

**Practices & standards**:
- Static site generation for a content driven, low interactivity public page
- Git based continuous deployment with automatic per branch preview URLs

**Links** (web verified):
- Astro official docs: https://docs.astro.build/en/getting-started/
- Eleventy official docs: https://www.11ty.dev/docs/
- Next.js static export guide: https://nextjs.org/docs/app/guides/static-exports
- Netlify pricing and free tier: https://www.netlify.com/pricing/
- Tailwind CSS docs: https://tailwindcss.com/docs
- npm documentation: https://docs.npmjs.com/
- Netlify MCP server (official): https://github.com/netlify/netlify-mcp
- Astro Docs MCP server (official): https://github.com/withastro/docs-mcp
