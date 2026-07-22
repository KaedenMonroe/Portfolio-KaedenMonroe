# Verify: SEO and social metadata · spec 0004 · updated 2026-07-21

_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Paste the production URL into Facebook's Sharing Debugger, LinkedIn's Post Inspector, and a Slack message; each renders the page title, the dedicated SEO description, and the 1200 by 630 share card showing name, role, and the grid rail motif → AC-2, AC-3
- [ ] Open `public/images/og-card.png` (or the committed share image path); confirm it visually matches `design.md`'s tokens (no shadow, no border radius, `--accent` used only on the role or eyebrow, mono for the label, sans for the name, no photo) → AC-3

## Commands

- [ ] `npm run build`, then inspect `dist/index.html`'s `<head>` for a `<title>`, a `<meta name="description">` sourced from `seoDescription`, and a `<link rel="canonical">` with an absolute URL → AC-1
- [ ] `grep -n "og:title\|og:type\|og:url\|og:site_name\|og:locale\|og:description\|og:image" dist/index.html` → all present with absolute URLs → AC-2
- [ ] `grep -n "twitter:card\|twitter:title\|twitter:description\|twitter:image" dist/index.html` → all present, `twitter:card` set to `summary_large_image` → AC-2
- [ ] `grep -n "og:image:width\|og:image:height\|og:image:alt" dist/index.html` → present, width and height match the committed PNG's real pixel dimensions (1200 by 630) → AC-3
- [ ] `grep -n "application/ld+json" dist/index.html` and inspect the block → contains `Person`, `name`, `jobTitle`, `url`, `sameAs` (LinkedIn and GitHub), and `email` populated from `content/profile.md` → AC-4
- [ ] Confirm `dist/sitemap-index.xml` (or `dist/sitemap.xml`) exists and lists the page → AC-5
- [ ] `cat dist/robots.txt` → allows all crawling and references the sitemap → AC-5
- [ ] `grep -n "site:" astro.config.mjs` → set to the resolved production URL → AC-6
- [ ] `npm run typecheck && npm run lint && npm run format:check && npm test && npm run build` → all pass

## Acceptance criteria coverage

- AC-1 (title, dedicated meta description, canonical link) · covered by the head inspection step
- AC-2 (Open Graph and Twitter card tags resolve correctly) · covered by the link preview manual step and the tag grep steps
- AC-3 (share image is a 1200 by 630 PNG matching the design system, no photo) · covered by the visual check and the dimension grep step
- AC-4 (Person JSON-LD populated from profile content) · covered by the JSON-LD grep and inspection step
- AC-5 (sitemap exists, robots.txt allows and points at it) · covered by the sitemap and robots.txt steps
- AC-6 (`site` set to the resolved production URL) · covered by the `astro.config.mjs` grep step
