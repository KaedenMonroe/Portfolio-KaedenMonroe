# 0003. Content and data model

**Date**: 2026-08-12
**Status**: In Progress

## Summary

This decision sets the exact shape of the content that every page renders from: a `bio` collection with one entry (name, title, avatar, contact links, and a written bio) and a `projects` collection with one entry per project (title, subtitle, tags, a required cover image, an optional gallery of extra images or short video clips, links, and display order). Both live in Astro Content Collections, already chosen in [0001](../0001-stack-and-architecture/index.md), and are validated at build time so a broken entry fails the build instead of shipping a broken page. Getting this settled now means the home and projects pages (items 5 and 6) can be built against real content from the start.

## Context

See [rationale.md](rationale.md).

## Requirements

**User stories**:
- As a visitor, I want to see Kaeden's name, title, avatar, and bio so I understand who he is.
- As a visitor, I want to see every project entry (a cover image, title, subtitle, tags) so I can browse his work.
- As Kaeden, I want to add or edit a project by adding one markdown file with frontmatter, without touching code.
- As Kaeden, I want to mark an in-progress project entry as a draft so it never appears on the live site until it's ready.

**Acceptance criteria**:
- **AC-1**: `src/content.config.ts` defines a `bio` collection (one entry) and a `projects` collection (many entries), each with a Zod schema that fails the build when a required frontmatter field is missing or malformed (bio: `name`, `title`, `avatar`, `avatarAlt`, `email`, `resumeUrl`, `linkedinUrl`; projects: `title`, `subtitle`, `cover`, `coverAlt`, `order`).
- **AC-2**: The bio avatar (`avatarAlt`), every project's cover (`coverAlt`), and every gallery item (`alt`) require a non-empty alt string; the build fails if any is missing.
- **AC-3**: `getVisibleProjects()` (`src/lib/content.ts`) filters out `draft: true` entries and returns the remainder sorted by `order` ascending, exactly the set and order intended for the projects listing.
- **AC-4**: The repository has one real bio entry (`src/content/bio/index.md`) and at least one real project entry (`src/content/projects/<slug>.md`) with every required field populated and a non-empty body, not placeholder content, so slice 1 pages (items 5, 6) can build against real data immediately.
- **AC-5**: `pnpm build` succeeds against the seeded real content, and deliberately removing a required field (e.g. `coverAlt` or `order`) from a project entry fails the build with a schema error rather than a silent or runtime failure.

## Options considered

See [rationale.md](rationale.md).

## Decision

**Chosen option**: Option 1: Two collections, freeform tags, required cover plus optional tagged gallery

Two Content Collections, `bio` (one entry) and `projects` (many entries). Projects carry freeform string tags (no separate vocabulary collection), a required `cover` image with its own `coverAlt` (always a processed image, so every card has a renderable, optimized cover today), an optional `gallery` array for any extra images or short video clips (each item tagged `image` or `video`, absorbing the video requirement that surfaced mid-design without touching `cover`), a manual `order` field for curated display order, and a `draft` boolean so in-progress entries can be committed without going live.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.claude/skills/astro/`)

## Rationale

See [rationale.md](rationale.md).

## Feature design

**Data model sketch**:

**Bio** (singleton, `src/content/bio/index.md`, exactly one entry by convention)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | |
| `title` | string | yes | role/credential line under the name |
| `avatar` | `image()` | yes | local file, processed via astro:assets |
| `avatarAlt` | string | yes | accessible alt text for the avatar |
| body (markdown) | markdown | not schema-enforced, expected non-empty | the entry's own body; the bio paragraphs. Zod validates frontmatter only, so this is an authoring convention, the same as the project body below |
| `email` | string (email) | yes | mailto link |
| `resumeUrl` | string (URL or local path) | yes | accepts either a full URL or a local file path (e.g. `/resume.pdf`), since the resume is more likely a self-hosted PDF than an external link |
| `linkedinUrl` | string (URL) | yes | |

**Project** (collection, `src/content/projects/<slug>.md`, one file per project, filename is the slug)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `subtitle` | string | yes | short one-line meta, rendered on the card today |
| body (markdown) | markdown | not schema-enforced, expected non-empty | the long-form description; mirrors the bio body pattern. Not rendered by any page yet, reserved for a future click-to-expand or detail page |
| `tags` | string[] | no, default `[]` | freeform |
| `cover` | `image()` | yes | always a processed image, never video, so `ProjectCard` always has a renderable, optimized cover with no component change needed |
| `coverAlt` | string | yes | accessible alt text for the cover |
| `gallery` | `GalleryItem[]`, default `[]` | no | extra images or short video clips for a future detail page or expanded view; each item `{ type: 'image' \| 'video', src, alt }`. Not rendered by any page yet |
| `liveUrl` | string (URL) | no | |
| `githubUrl` | string (URL) | no | |
| `order` | integer | yes | manual display order; distinct values expected by convention, not schema-enforced |
| `date` | date | no | when the project happened; ties broken here when two entries share an `order` |
| `draft` | boolean | no, default `false` | excluded from every production query when `true` |

**Relationships**: none. Bio is an unrelated singleton; Project entries are independent, ordered only by `order` (no foreign keys).

**Zod schema** (`src/content.config.ts`):

```ts
import { defineCollection } from "astro:content";
import type { ImageFunction } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const galleryItem = (image: ImageFunction) =>
  z.discriminatedUnion("type", [
    z.object({ type: z.literal("image"), src: image(), alt: z.string().min(1) }),
    z.object({ type: z.literal("video"), src: z.string().startsWith("/videos/"), alt: z.string().min(1) }),
  ]);

const bio = defineCollection({
  loader: glob({ pattern: "index.md", base: "./src/content/bio" }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      title: z.string().min(1),
      avatar: image(),
      avatarAlt: z.string().min(1),
      email: z.email(),
      resumeUrl: z.union([z.url(), z.string().startsWith("/")]),
      linkedinUrl: z.url(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      tags: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string().min(1),
      gallery: z.array(galleryItem(image)).default([]),
      liveUrl: z.url().optional(),
      githubUrl: z.url().optional(),
      order: z.number().int(),
      date: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { bio, projects };
```

Video `src` is constrained to `/videos/...` (self-hosted, served from `public/`, not run through the image pipeline; mp4/h.264 is the target format). Image `src` fields resolve relative to the entry file; add a `~assets` path alias to `src/assets/` (in `tsconfig.json`'s `compilerOptions.paths`) so frontmatter can write a stable `~assets/projects/<slug>/cover.png` instead of a fragile `../../` relative path.

**Query helpers** (`src/lib/content.ts`, the only place pages read content from):

```ts
import { getCollection, getEntry } from "astro:content";

export async function getBio() {
  const bio = await getEntry("bio", "index");
  if (!bio) throw new Error("Missing src/content/bio/index.md");
  return bio;
}

export async function getVisibleProjects() {
  const projects = await getCollection("projects", (entry) => !entry.data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order);
}
```

`draft` filtering happens only here, the same way in every environment (dev and production alike); there is no separate preview mode. Author a draft locally, run `pnpm build && pnpm preview` to see the site as a visitor would.

**State transitions**: `draft` is a simple boolean toggle (not published → published), not a formal state machine. No other entity has lifecycle states.

**API surface** (build-time content queries via `src/lib/content.ts`, not HTTP endpoints, this is a static site):

| Query | Type | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `getBio()` | read | none | `name`, `title`, `avatar`, `avatarAlt`, `email`, `resumeUrl`, `linkedinUrl`, body | public, build-time | throws if `src/content/bio/index.md` is missing |
| `getVisibleProjects()` | read | none | array of project entries: `title`, `subtitle`, `tags`, `cover`, `coverAlt`, `gallery`, `liveUrl`, `githubUrl`, `order`, `date`, body; non-draft, sorted by `order` ascending | public, build-time | returns `[]` if no non-draft entries exist, not an error |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Home page bio render | `name`, `title`, `avatar`, `avatarAlt`, `email`, `resumeUrl`, `linkedinUrl`, bio paragraphs | `bio` singleton entry via `getBio()` |
| Nav name / resume link | `name`, `resumeUrl` | `bio` singleton entry via `getBio()` (same source as the bio render, not a separate hardcoded value) |
| Projects listing render | `title`, `subtitle`, `cover`, `coverAlt`, `tags` | `projects` collection entries via `getVisibleProjects()` |
| Projects listing order | display order | that entry's `order` field, tie-broken by `date` ascending if two entries share an `order`, otherwise by filename |
| Projects listing visibility | whether an entry is shown | that entry's `draft` field, filtered inside `getVisibleProjects()` |
| Cover image accessible name | `alt` attribute on the rendered `<img>` | that entry's `coverAlt` |
| Gallery item accessible name (future use, not rendered yet) | accessible name for an extra image or video | that gallery item's own `alt`: an image item maps `alt` to the `<img>` `alt` attribute; a video item maps `alt` to `aria-label`, since `<video>` has no native `alt`. Video playback is a silent, looping preview: `autoplay muted loop playsinline`, no visible controls |
| Page `<title>` / meta description / OG image | — | out of scope for this spec; owned by the deferred SEO work noted in [0001](../0001-stack-and-architecture/index.md) |

**Key invariants**:
- Every project has exactly one `cover`, always a processed image (never video), so the listing always has a renderable, Sharp-optimized cover with no `ProjectCard` change required.
- `avatarAlt`, `coverAlt`, and every `gallery` item's `alt` are non-empty.
- `draft: true` entries never appear from `getVisibleProjects()`; filtering happens in one place, the same in every environment, there is no separate dev-only view.
- `order` values are expected to be distinct per entry (documented authoring convention, not schema-enforced); a collision ties, broken by `date` ascending if set, otherwise by filename.
- The `bio` collection has exactly one entry, enforced by the fixed `index.md` glob pattern, not a runtime check.
- A video `gallery` item's `src` always starts with `/videos/` (self-hosted, served from `public/`, unprocessed); an image `src` (avatar, cover, or a gallery image) resolves through the `~assets` alias.

**Security model**: not applicable. All content here is intentionally public, a personal academic portfolio with no private or regulated data. No authentication, no roles, no per-entry access control.

**Configuration required**: none. No new environment variables or credentials.

**Critical test scenarios**:
- Happy path: a real bio entry and at least one real project entry (with a cover, and one with a gallery video) validate, `getVisibleProjects()` returns it correctly ordered, and the site builds cleanly, verifies **AC-1**, **AC-3**, **AC-4**, **AC-5**.
- Failure case: a project entry missing `coverAlt`, or missing `order`, fails `pnpm build` with a schema validation error instead of a runtime crash or silent bad render, verifies **AC-2**, **AC-5**.
- Failure case: deleting `src/content/bio/index.md` makes `getBio()` throw a clear error at build time instead of silently rendering an empty page, verifies **AC-1**.
- Auth/permission: not applicable, every query is a public build-time read with no access control to test.

## Build plan

1. Define `src/content.config.ts` with the `bio` and `projects` collections and the Zod schemas above (glob loader, `image()` helper, the `gallery` discriminated union), satisfies **AC-1**, **AC-2**.
2. Add a `~assets` path alias to `src/assets/` in `tsconfig.json`, satisfies **AC-1**.
3. Add asset locations: `src/assets/projects/<slug>/` for images (referenced via `~assets`, processed through `image()`), `public/videos/<slug>/` for any self-hosted project gallery video (served as-is at `/videos/<slug>/...`, not run through the image pipeline), satisfies **AC-2**.
4. Add `src/lib/content.ts` exporting `getBio()` and `getVisibleProjects()` as shown above, satisfies **AC-3**.
5. Write the real bio entry `src/content/bio/index.md` with Kaeden's actual name, title, avatar, `avatarAlt`, contact links, and bio body, satisfies **AC-4**.
6. Write at least one real project entry under `src/content/projects/` with every required field populated (`cover`, `coverAlt`, `order`) and a non-empty body, satisfies **AC-4**.
7. Run `pnpm build` to confirm it succeeds against the seeded content and `getVisibleProjects()` returns the expected order, then temporarily remove a required field (`coverAlt` or `order`) from a test entry to confirm the build fails with a schema error, then restore it, satisfies **AC-3**, **AC-5**.

## Consequences

**Positive**:
- Every future page (bio, listing, and any later detail page) reads from one validated, typed source through `src/lib/content.ts`; no duplicate or drifting content shapes, and no page invents its own filter/sort.
- A malformed entry fails the build immediately, matching AGENTS.md's rule to handle expected failures with explicit error returns rather than ad hoc try/catch; `getBio()` extends that same guarantee to a missing singleton, which Content Collections' own validation doesn't catch on its own.
- `cover` is always a required, always-processed image, so `ProjectCard` needs no changes to build against real data today; the optional tagged `gallery` absorbs the project video requirement that surfaced mid-design without touching the card's contract.
- The `draft` flag lets Kaeden commit in-progress projects without exposing them, fitting the Skateboard approach of growing content incrementally.

**Negative / tradeoffs**:
- Video assets get no Sharp-style optimization the way images do through astro:assets; file size discipline for self-hosted clips is on the author, not the tooling.
- `order` uniqueness is a documented convention, not schema-enforced; two entries sharing an `order` tie-break by `date` if set, otherwise by filename, rather than failing the build.
- The long-form description (the project body) and the `gallery` field are both written and validated but unused by any page until a future expand or detail feature ships; it's authored effort with no visible payoff yet.
- A required `cover`/`coverAlt` pair plus a separate `gallery` array is two related concepts instead of one, slightly more verbose for the common single-image project than a single array would be.

**Neutral**:
- Freeform tags mean no protection against near-duplicate spelling ("ML" vs "Machine Learning"); acceptable at the current project count, revisit if the tag list grows unruly.
- Bio being a one-entry collection (rather than a plain config object) is a deliberate consistency choice, matching 0001's decision to put bio content in Content Collections alongside projects.

## Follow-up

- [ ] If the tag list grows large or messy, revisit the controlled-vocabulary option declined here (a dedicated tags collection or enum).
- [ ] The project body (long-form description) and the `gallery` field are written and validated but not rendered anywhere yet; wire them up when the click-to-expand interaction or a project detail page gets designed (both currently deferred in the scope).
- [ ] `order` uniqueness is a manual authoring convention, not enforced by the Zod schema; if entries start colliding, consider a build-time uniqueness check inside `getVisibleProjects()`.
- [ ] Watch self-hosted project gallery video file sizes; there's no CDN transcoding for video the way there is for images. Revisit hosting if usage grows beyond a short clip or two.
