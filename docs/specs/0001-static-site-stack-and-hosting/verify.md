# Verify: Stack & architecture · spec 0001 · updated 2026-07-20
_Steps derived from the scope's "Done when" line for this feature (spec 0001 is a decision record, not a feature spec, so it carries no AC-N list). `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [ ] Visit the live preview URL (`https://kaeden-monroe-portfolio.netlify.app`, or the latest draft printed by `netlify deploy`) → the empty Astro scaffold page loads with no errors → Done when: scaffold deploys to a live preview URL

## Commands
- [ ] `npm run build` → completes with 0 errors, writes `dist/` with a static `index.html` → Done when: the empty scaffold builds
- [ ] `npx astro check` → 0 errors (a hint from the unrelated brainstorm HTML folder is expected and fine) → Done when: the scaffold is a sound TypeScript project
- [ ] `npx netlify deploy --dir=dist` (or `--prod` once ready) → prints a live deploy URL that resolves with HTTP 200 → Done when: deploys to a live preview URL

## Acceptance-criteria coverage
- Scope "Done when": stack recorded in a spec → covered by spec 0001's `Status: In Progress` (Astro, TypeScript, plain CSS, npm, Netlify)
- Scope "Done when": empty scaffold builds and deploys to a live preview URL → covered by the build + deploy command steps above
