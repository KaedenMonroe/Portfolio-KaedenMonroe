# 0002. Content model for the portfolio site

**Date**: 2026-07-18
**Status**: Accepted

## Summary

This decides where and how the portfolio's real words and data live: the about text, the skills list, and the three project write ups. Structured prose (about bio, project write ups) lives in markdown files with a small set of frontmatter fields, checked against a schema at build time. The skills list, which is just names with no prose, lives in one small typed code file instead. This means editing any copy is a file edit, not a markup change, and a broken or missing field fails the build loudly instead of shipping a broken page.

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

## Decision

**Chosen option**: Option 2: Markdown and frontmatter, split per entity, schema checked.

Profile and Project are markdown files (frontmatter for short structured fields, body for prose), checked against a Zod schema at build time. SkillCategory, which has no prose, is a plain typed array in `data/skills.ts`.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.agents/skills/astro/`); its Content Collections pattern, frontmatter plus body plus a Zod schema, is the direct model for how Profile and Project are structured and validated here

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

- [x] No root `AGENTS.md` exists yet. Once item 2 (coding standards and tooling) runs, the `astro` skill's Content Collections convention (frontmatter plus body plus a Zod schema) belongs there alongside the rest of the stack from spec 0001. Root `AGENTS.md` now exists; its "Folder structure by layer" line still lists `src/content` generically rather than this spec's root level `content/` and `data/` folders — `/sync` should reconcile that line.
- [x] Transcribe the real skill tags and the three real project write ups from the brainstorm files into `data/skills.ts` and `content/projects/*.md` as part of build task 3 and 4 above, rather than placeholder text. Done; the profile's résumé, email, LinkedIn, and GitHub fields are still clearly marked TODO placeholders (the brainstorm's own links are dummy `#` hrefs) — the portfolio owner needs to swap in real values before shipping.
