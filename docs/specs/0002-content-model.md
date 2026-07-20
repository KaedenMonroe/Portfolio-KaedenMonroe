# 0002. Content model for the portfolio site

**Date**: 2026-07-18
**Status**: Proposed

## Summary

This decides where and how the portfolio's real words and data live: the about text, the skills list, and the three project write ups. Structured prose (about bio, project write ups) lives in markdown files with a small set of frontmatter fields, checked against a schema at build time. The skills list, which is just names with no prose, lives in one small typed code file instead. This means editing any copy is a file edit, not a markup change, and a broken or missing field fails the build loudly instead of shipping a broken page.

## Context
The Blueprint Ledger brainstorm already contains real words: an about paragraph, six skill tags (SolidWorks, Ansys FEA, Python and ROS2, C++ and embedded, CNC and 3D print, PCB layout), and three full project write ups (an autonomous ground platform, a quadrotor prototype, and a suspension bracket FEA study), plus profile links (résumé, email, LinkedIn, GitHub). None of this has a home yet. Left alone, it would be typed straight into page markup, so a copy change becomes a code change, and the page build in scope item 6 would have to invent its own shape for it on the spot.

The project is a single author, static, one page portfolio with no compliance scope and no other person editing content. The scope's deferred list rules out a headless CMS or backend for this pass, and the weight profile calls this a lean or medium decision, not a heavyweight one. The number of entries is small and fixed (three projects at launch, likely staying in the single digits for years), so this is not a scale problem.

## Requirements

**User stories**:
- As the portfolio owner, I want to edit my about text, skills, and project write ups without touching layout code, so that updating content is a simple file edit.
- As whoever builds the page next (scope item 6), I want typed, validated content so the page components can trust the shape of the data instead of guessing at it.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):
- **AC-1**: All profile information (name, hero headline and subtext, about bio, résumé link, email, LinkedIn, GitHub, blog link, copyright name) lives in one markdown file, `content/profile.md`, whose frontmatter fields are checked against a schema at build time; a missing or malformed required field fails the build.
- **AC-2**: Skill categories live in one typed data file, `data/skills.ts`, as a list of category name plus tag list; every category has at least one tag.
- **AC-3**: Each project lives in its own markdown file under `content/projects/`, with title, subtitle, and image checked against a schema; the file name is the project's stable slug, and the file body (markdown) becomes the project's detail write up.
- **AC-4**: A project's short display tag ("IDX 01", "IDX 02", and so on) is worked out from the project's position in the list at render time. It is never stored as content.
- **AC-5**: If `content/projects/` has no files in it, reading the project list returns an empty list rather than failing, so a future empty state can be handled without a data model change.
- **AC-6**: Profile fields that are links (résumé, email, LinkedIn, GitHub) and the optional blog link are checked as well formed URLs or emails at build time; a malformed one fails the build instead of shipping a broken link.
- **AC-7**: No value the page shows for profile, skills, or project content is hardcoded in markup. Every one of them is sourced from `content/profile.md`, `data/skills.ts`, or `content/projects/*.md`.

## Options considered

### Option 1: Plain typed data files for everything (no markdown)

Every entity, including the about bio and project write ups, is a plain TypeScript object exported from a data file.

**Pros**:
- Zero dependencies and no markdown parsing step; works under any build tool.
- Fastest to wire up; one mechanism for every entity.

**Cons**:
- The about bio and project write ups are genuine prose, several sentences of narrative each. Writing that as a quoted string literal is awkward to read, format, and edit, and loses simple rich text like bold or a link.

### Option 2: Markdown and frontmatter, split per entity, schema checked (chosen)

Prose bearing entities (Profile, Project) are markdown files: short structured fields in frontmatter, the prose itself as the file body. The skills list, which has no prose, stays a plain typed data file. A schema (Zod, matching the engineer's pick) checks every field at build time.

**Pros**:
- Prose gets a natural home: the file body, with normal markdown formatting, separate from the short structured fields.
- Matches Astro's Content Collections almost exactly (frontmatter plus body, Zod backed schema, a `getCollection` style read), so very little custom plumbing is needed on top of the Astro stack spec 0001 already chose.
- Editing content that already exists is always a file edit: add a project by adding a file, change a bio sentence by editing prose, no code change either way.

**Cons**:
- Couples the concrete loading mechanism to a build tool with a markdown and frontmatter content pipeline. Astro (spec 0001) has that built in, so this is a real dependency satisfied, not an open risk.
- Three different storage shapes across the three entities (markdown files for two, a plain array for one) is one more thing to remember than a single uniform mechanism, even though each shape matches what that entity actually needs.

### Option 3: A headless CMS (for example Contentful or Sanity)

Content is authored through a hosted CMS with a web editing UI, fetched at build or run time.

**Pros**:
- Lets a non technical person edit content through a web UI, with revision history, without touching code.

**Cons**:
- This is a single author who is also the developer, editing their own portfolio directly in code; there is no non technical editor to serve.
- Adds a hosted account, network calls, and a new external service to operate, for a one page site with a handful of entries. The scope's deferred list explicitly rules this out for the current pass.

## Decision

**Chosen option**: Option 2: Markdown and frontmatter, split per entity, schema checked.

Profile and Project are markdown files (frontmatter for short structured fields, body for prose), checked against a Zod schema at build time. SkillCategory, which has no prose, is a plain typed array in `data/skills.ts`.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`); its Content Collections pattern, frontmatter plus body plus a Zod schema, is the direct model for how Profile and Project are structured and validated here

## Rationale

The about bio and project write ups are real prose, several sentences of technical narrative each (see the ground platform, quadrotor, and suspension bracket write ups already drafted in the brainstorm). Option 1's plain string literal either loses formatting or forces manual escaping for anything beyond a single flat sentence, which is the wrong trade for content the owner will keep expanding. Option 3 solves a collaboration and non technical editing problem that does not exist here: one person, who is a developer, edits their own copy, so a hosted CMS only adds an external account and a network dependency the scope's deferred list already rules out.

Option 2 fits both real constraints: prose gets a natural home in the file body, and the skills list, which is genuinely just names with no prose, is not forced into a markdown file it does not need. Schema validation at build time (the engineer's pick, over types alone) matters more here than it might elsewhere, because this is one author working with no second reviewer; a malformed résumé link or a project missing its image should fail the build, not quietly ship.

## Feature design

**Data model sketch**:

*Profile* (singleton, `content/profile.md`, frontmatter plus body):
| Field | Type | Required |
|---|---|---|
| name | string | yes |
| role | string (hero eyebrow line) | yes |
| heroHeadline | string | yes |
| heroSubtext | string | yes |
| resumeUrl | string, URL | yes |
| email | string, email | yes |
| linkedinUrl | string, URL | yes |
| githubUrl | string, URL | yes |
| blogUrl | string, URL | no |
| copyrightName | string | yes |
| body (markdown) | the about bio prose | yes |

*SkillCategory* (list, `data/skills.ts`, plain typed array, no frontmatter):
| Field | Type | Required |
|---|---|---|
| name | string | yes |
| tags | string list, at least one entry | yes |

*Project* (list, one file per project under `content/projects/<slug>.md`, frontmatter plus body):
| Field | Type | Required |
|---|---|---|
| slug | string, derived from the file name, unique | yes |
| title | string | yes |
| subtitle | string | yes |
| image | string, local asset path | yes |
| body (markdown) | the expandable detail write up | yes |
| tag ("IDX 01" and so on) | derived at render time from list position, never stored | n/a |

All three are flat and independent; nothing here references anything else, since a single author static site has no relationships to model.

**State transitions**: none. Content is static and edited by changing files, not by moving through states.

**API surface** (no network endpoints; these are build time content read functions):

| Function | Inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|
| getProfile() | none | one checked Profile record | none (build time only) | throws if `content/profile.md` is missing or fails the schema |
| getSkillCategories() | none | list of SkillCategory | none (build time only) | throws if a category has zero tags |
| getProjects() | none | list of Project, each with its tag worked out from position | none (build time only) | throws if any file fails the schema; returns an empty list if the folder has no files (AC-5) |

**Key invariants**:
- Every Project's slug is unique, guaranteed by unique file names in `content/projects/`.
- A project's tag is always worked out from its position in the list; it is never read from a stored field.
- Every SkillCategory has at least one tag.
- Profile's résumé, email, LinkedIn, and GitHub fields are present and well formed; the blog field, if present, is well formed too.
- No profile, skills, or project value the page shows is hardcoded in markup; each comes from one of the three sources above.

**Security model**: Not applicable. This is public, static content with no sign in, no per user access, and no data beyond what the owner chooses to publish about themselves. There is no runtime write path; content changes only by editing and committing a file.

**Critical test scenarios** (each maps to an acceptance criterion in Requirements):
- Happy path: a build with a filled in `content/profile.md`, `data/skills.ts`, and three project files under `content/projects/` reads back every required field with no errors, verifies **AC-1**, **AC-2**, **AC-3**, **AC-7**.
- Failure case: a project file missing its required `image` field fails the build with a schema error instead of quietly shipping a broken image, verifies **AC-3**, **AC-6**.
- Edge case: `content/projects/` has no files in it; `getProjects()` returns an empty list rather than throwing, verifies **AC-5**.

## Build plan

1. Set up the content schema (Profile and Project frontmatter fields, checked with Zod), satisfies **AC-1**, **AC-3**, **AC-6**.
2. Write `content/profile.md` with the real name, hero copy, links, and about bio from the brainstorm, satisfies **AC-1**.
3. Write `data/skills.ts` with the real skill categories and tags, satisfies **AC-2**.
4. Write the three real project files under `content/projects/` (ground platform, quadrotor prototype, suspension bracket FEA study), using the write ups already drafted in the brainstorm, satisfies **AC-3**, **AC-4**.
5. Write the three read functions (`getProfile`, `getSkillCategories`, `getProjects`), including the position based tag and the empty list case, satisfies **AC-4**, **AC-5**, **AC-7**.
6. Confirm the build fails on a deliberately broken entry (a missing required field, a malformed URL) before removing it, proving validation actually catches bad content, satisfies **AC-1**, **AC-3**, **AC-6**.

## Consequences

**Positive**:
- Editing any copy, the about text, a skill tag, or a project write up, is a file edit; no markup change is needed.
- Bad content fails the build loudly instead of shipping a broken page.
- The shape (schema checked frontmatter plus body, a plain array for skills) is not tied to one specific framework's API; if the stack were ever revisited, only the three read functions would need rewriting, not the file layout or the schemas.

**Negative / tradeoffs**:
- The concrete read mechanism assumes a build tool with a markdown and frontmatter pipeline; it leans on Astro's Content Collections (spec 0001) rather than being framework agnostic.
- Two storage shapes exist side by side (markdown files for Profile and Project, a plain array for SkillCategory), which is one more thing to remember than a single uniform mechanism.
- The project's slug is its file name; renaming a file changes its slug, and no redirect or alias mechanism is included here.

**Neutral**:
- Real project write ups already exist in the brainstorm and can be transcribed directly rather than invented; scope item 9 still tracks the later swap to real photos.

## Follow-up

- [ ] No root `AGENTS.md` exists yet. Once item 2 (coding standards and tooling) runs, the `astro` skill's Content Collections convention (frontmatter plus body plus a Zod schema) belongs there alongside the rest of the stack from spec 0001.
- [ ] Transcribe the real skill tags and the three real project write ups from the brainstorm files into `data/skills.ts` and `content/projects/*.md` as part of build task 3 and 4 above, rather than placeholder text.
