# Develop: git handling (read only when git integration is on)

Read this only when the nearest `AGENTS.md` `## Git` block says `integration: on`. Absent or `off` → do no active git; the engineer manages branches and commits, and the read only freshness checks still apply. Git is the one hard dependency; skip silently if there is no repo.

Read the setting: `integration`, `branch prefix` (default `feat/`), `commit` (`per-milestone` default, `end-of-build`, or `manual`), `worktree` (`on`, `off`, or absent/unset). Local ops (branch, commit, worktree) are offers with a recommendation; **push and PR always confirm** (outward) and PR is `/document`'s job, not this skill's.

**Ensure a repo exists first.** If integration is on and the project is not yet a git repo (`git rev-parse` fails), run `git init` before any branch or commit, and stage what is already there for the first commit. `/audit` normally does this the moment integration is turned on; this is the backup for a project that reached a build without it.

## Branch (before building, in the freshness & collaboration check)

Resuming a half built feature (Step 3) → check out that feature's branch first if it exists and you are not on it, or `cd` into its existing worktree if it was built in one; do not create another branch or worktree for it.

Starting a **new feature** (not a fix/refine, not a resume) on the default branch (`main`/`master`):

- `worktree: on` → **offer to isolate it in its own git worktree** instead of branching in the current working tree: a sibling checkout, `../<repo-basename>-worktrees/<feature-slug>`, on a fresh branch `<prefix><feature-slug>` (kebab case from the scope feature name, e.g. `feat/accounts-sign-in`):
  ```
  git worktree add ../<repo-basename>-worktrees/<feature-slug> -b <prefix><feature-slug>
  ```
  This keeps the feature's dependency install, dev server, and any local run state fully separate from whatever else is being built against the main working tree, so parallel features never collide. After creating it: copy over anything git does not track that the app needs to run (`.env*`, other untracked local config) from the main working tree, then install dependencies fresh inside the new worktree (do not symlink `node_modules`/equivalent across worktrees, each gets its own). Do the rest of this build (Steps 1-4, and the freshness checks above) inside that worktree's directory. Report the worktree path in the Report section below.
  If the engineer declines, fall back to a plain branch in the current working tree (next bullet).
- `worktree: off`, or unset → **offer to branch** (recommended): `<prefix><feature-slug>`. Never build on the default branch.
- On a feature branch already (no worktree in play) → reuse it; do not create another.
- Use the change type for the prefix when it is not a feature (`fix/`, `refine/`), else the setting's default. Worktree isolation applies to new feature builds only; a fix/refine branches in place even when `worktree` is `on`.
- `worktree` unset (integration `on`, no recorded preference) → ask once, inline, before branching: "Build this feature in its own git worktree (a separate checkout, so it can't collide with anything else you're building), or branch in place here?" Recommend the worktree. This is a per-run offer, not persisted; `/develop` does not restructure `AGENTS.md` (that's `/audit` and `/sync`) — mention in the report that recording it in `AGENTS.md`'s `## Git` block via `/audit` would make the choice stick.

## Commit (as milestones land, per the `commit` setting)

- `per-milestone` (default) → when a milestone lands and its typecheck is green, **offer to commit** just that milestone's files.
- `end-of-build` → one commit when the build lands.
- `manual` → never commit; the engineer does.

Message: a **one line Conventional Commit subject**, no prose body, plus the `Co-Authored-By` trailer (required). Type from the work (`feat`, `fix`, `refactor`, `test`, `chore`), optional scope from the feature, summary in the imperative:

```
feat(auth): add session persistence

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

The why lives in the spec and the PR, never in the commit body (single source). Commit only what actually landed and typechecks; never commit a half done milestone. Never `git push` here (that is `/document` at PR time, confirmed).

## Report

Add one line to the `/develop` summary: the branch you are on (and the worktree path, if this build used one), and what you committed (`feat(auth): … · 3 commits`) or that commits are `manual`. If integration is off or absent, say nothing about git.

On a worktree build, also note it stays checked out after the build (this skill never removes it): once the feature ships and merges, remove it with `git worktree remove ../<repo-basename>-worktrees/<feature-slug>`.
