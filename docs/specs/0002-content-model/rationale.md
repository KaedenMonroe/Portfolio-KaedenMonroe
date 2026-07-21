# 0002. Content model for the portfolio site: Rationale

## Context

The Blueprint Ledger brainstorm already contains real words: an about paragraph, six skill tags (SolidWorks, Ansys FEA, Python and ROS2, C++ and embedded, CNC and 3D print, PCB layout), and three full project write ups (an autonomous ground platform, a quadrotor prototype, and a suspension bracket FEA study), plus profile links (résumé, email, LinkedIn, GitHub). None of this has a home yet. Left alone, it would be typed straight into page markup, so a copy change becomes a code change, and the page build in scope item 6 would have to invent its own shape for it on the spot.

The project is a single author, static, one page portfolio with no compliance scope and no other person editing content. The scope's deferred list rules out a headless CMS or backend for this pass, and the weight profile calls this a lean or medium decision, not a heavyweight one. The number of entries is small and fixed (three projects at launch, likely staying in the single digits for years), so this is not a scale problem.

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

## Rationale

The about bio and project write ups are real prose, several sentences of technical narrative each (see the ground platform, quadrotor, and suspension bracket write ups already drafted in the brainstorm). Option 1's plain string literal either loses formatting or forces manual escaping for anything beyond a single flat sentence, which is the wrong trade for content the owner will keep expanding. Option 3 solves a collaboration and non technical editing problem that does not exist here: one person, who is a developer, edits their own copy, so a hosted CMS only adds an external account and a network dependency the scope's deferred list already rules out.

Option 2 fits both real constraints: prose gets a natural home in the file body, and the skills list, which is genuinely just names with no prose, is not forced into a markdown file it does not need. Schema validation at build time (the engineer's pick, over types alone) matters more here than it might elsewhere, because this is one author working with no second reviewer; a malformed résumé link or a project missing its image should fail the build, not quietly ship.
