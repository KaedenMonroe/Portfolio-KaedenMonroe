# Rationale: 0003. Content and data model

## Context

No content schema exists yet. [0001](../0001-stack-and-architecture/index.md) already committed to Astro Content Collections for both the bio and project content, but only at the level of "which tool", not the concrete entities and fields. Meanwhile `design.md` and the already-built `ProjectCard.astro` component quietly presume a shape (an image, alt text, a title, a subtitle, an optional tag list) without that shape ever being written down as a validated contract.

Two pages depend directly on this decision: the home/bio page (item 5) and the projects listing (item 6), both still `planned`. The scope row for this decision is explicit about the stakes: "a wrong data model is the most expensive thing to redo" once several real projects are entered, since every entry would need retrofitting by hand. Two adjacent decisions bound the schema without dictating it: a per-project detail page and the interactive drag/swipe carousel are both deferred, not dropped, so the schema should not preclude them, but building for them now would be speculative given they are explicitly not yet scoped.

The one dimension not visible from the codebase, since it only surfaced mid-conversation, is that a project can carry a short video instead of, or alongside, its images, which the existing single-`image`-prop `ProjectCard` component does not yet reflect.

## Options considered

### Option 1: Two collections, freeform tags, required cover plus optional tagged gallery (chosen)

`bio` (one entry) and `projects` (many entries) as the only two collections. Tags are plain strings on each project. Each project has one required `cover` image (with its own `coverAlt`), always a processed image, plus an optional `gallery` array for any extra images or short video clips, each item carrying a `type: 'image' | 'video'` tag, so a project can add video without the card's own contract ever changing.

**Pros**:
- Matches 0001's plan exactly, adds nothing beyond concrete fields.
- The tagged gallery absorbs the video requirement that surfaced mid-conversation without a second schema revision, while `cover` guarantees every card has a renderable image today with no component change.
- Fastest to author for a handful of projects; no extra collection to maintain for tag normalization that isn't needed yet.

**Cons**:
- Freeform tags carry no protection against near-duplicate spelling as the project count grows.
- `order` uniqueness and body non-emptiness are conventions, not schema-enforced constraints.
- `cover`/`coverAlt` plus a separate `gallery` is two concepts instead of one, slightly more verbose for a project with just a single image than one unified array.

### Option 2: Three collections, adding a controlled tag vocabulary

Same `bio` and `projects` shape, plus a `tags` collection (a fixed list of allowed tags, each with a label and optionally an icon), referenced by id from each project instead of a raw string.

**Pros**:
- Prevents tag drift ("ML" vs "Machine Learning") across entries by construction.
- Gives a natural place to add a tag icon or color later without touching project entries.

**Cons**:
- A third collection to maintain for a portfolio that will likely hold a modest number of projects; the normalization cost is paid up front for a problem that doesn't exist yet.
- Every new tag becomes a two-file change (the vocabulary entry plus the project referencing it) instead of one.

### Option 3: Single cover image only, no media array

Keep `ProjectCard`'s current shape exactly: one `image` field per project, no array, no video support.

**Pros**:
- Simplest possible schema, zero new concepts beyond what's already built.
- No discriminated union to design or maintain.

**Cons**:
- Cannot represent the project video the engineer flagged mid-conversation at all; adding it later is a breaking schema change across every existing entry.
- Also can't grow into the deferred gallery/detail page without the same breaking change, defeating the point of deciding this now rather than later.

## Rationale

Option 1 wins because it satisfies the two forces from Context directly: it matches 0001's already-decided tool choice with no new collection type, and it absorbs the video requirement that surfaced during design without needing a second pass at this schema later, which is exactly the "expensive to redo" scenario the scope row warns about. Option 2's normalization is real but pays a cost today for a problem (tag drift) that doesn't exist yet at this project's scale; freeform strings can migrate to a vocabulary collection later if the tag list actually grows unruly, and that migration is cheap compared to reworking every project's image field into a media array after the fact. Option 3 was rejected outright: it is the one option that cannot represent what the engineer described (mixed image/video projects) without breaking every existing entry, which is precisely the outcome this spec exists to avoid.

A cross check of the drafted spec caught that Option 1's original shape, a single tagged `media` array with no dedicated cover field, let `media[0]` be a video with no build task or acceptance criterion covering the resulting mismatch against `ProjectCard`'s current single-`image` contract; AC-4's claim that slice-1 pages "can build against real data immediately" would not have held. Splitting into a required `cover`/`coverAlt` (always an image) plus an optional `gallery` for anything else closes that gap directly: it keeps everything Option 1 was chosen for, still absorbs video with no future schema break, while guaranteeing the listing always has a renderable cover without a `ProjectCard` change. The same check also surfaced a real code-level bug in the drafted Zod sample (a non-callable TypeScript type expression) and a deprecated import (`z` from `astro:content` instead of `astro/zod`, per this Astro version's own type declarations); both were fixed directly since they were correctness bugs, not decisions.
