# One-Page Site and APT Release Closure

## Goal

Close the 1 September 2026 Shared Pair website and repository-browser work as
one auditable release operation:

1. remove stale pre-publication language;
2. visually verify the one-page site at desktop and mobile sizes;
3. commit the intended changes in `sharedpair.dev` and `shared-electron`
   separately, without absorbing unrelated work;
4. publish the APT browser icon and stylesheet through a complete signed,
   immutable repository generation rather than leaving them as root-only object
   updates;
5. prove repository metadata rollback and restoration, and record what the
   exercise does and does not prove about installed-package downgrade.

## Scope and safety boundaries

- `sharedpair.dev` owns the one-page document, explicit About page, Worker,
  verification checks, and this plan.
- `shared-electron` owns the generated APT browser assets, signed repository
  tree, immutable generations, publication, verification, and rollback tooling.
- Preserve unrelated `packages/poi/` work and existing cache directories. They
  are excluded from commits and release membership.
- Do not invent a package-version upgrade merely to exercise repository
  rollback. This run proves immutable repository generation promotion and
  restoration. A true installed-package upgrade/downgrade requires a subsequent
  Debian revision with rebuilt binary/source artifacts and remains separate.
- Never delete or overwrite an immutable R2 generation.
- Never promote unsigned or locally unverified metadata.

## Phase 1: Website correctness

- [ ] Replace footer and report language that still says publication is pending.
- [ ] Search rendered and source content for contradictory states such as
  “pending approval,” “not yet public,” and “ready for promotion.”
- [ ] Build and run the one-page verification gate.
- [ ] Capture desktop (1440 px) and mobile (390 px) screenshots of `/` and
  `/about/` from the production build or live deployment.
- [ ] Inspect navigation, screenshots, disclosure affordances, command overflow,
  candidate table overflow, About logo, footer, and neon contrast.
- [ ] Correct material visual defects and repeat the captures.

## Phase 2: Scoped commits

- [ ] Review both worktree diffs and identify every file belonging to this run.
- [ ] Commit the website one-page implementation, About page, verifier, plan,
  and synchronized generated registry data in `sharedpair.dev`.
- [ ] Commit only the APT browser favicon, stylesheet, and relevant tracked
  landing-page cleanup in `shared-electron`.
- [ ] Do not stage `packages/poi/`, `__pycache__/`, or unrelated package work.
- [ ] Record commit IDs in the results section.

## Phase 3: Signed immutable APT generation

- [ ] Record the currently active generation ID, signed `InRelease` hash,
  generation-manifest hash, and signing fingerprint as the rollback baseline.
- [ ] Confirm all configured release-stage binary and source artifacts exist
  before regenerating the repository.
- [ ] Generate the complete local APT tree using the containerized publisher.
- [ ] Confirm the new `favicon.svg` and neon `styles.css` are present in the
  generated tree and its generation manifest.
- [ ] Sign `Release`, `InRelease`, and the generation manifest with the configured
  Shared Pair key.
- [ ] Run local signature, membership, size, hash, and browser-generation checks.
- [ ] Dry-run the R2 publication delta.
- [ ] Upload the immutable generation, verify it remotely, and promote signed
  repository metadata last.
- [ ] Run the public repository verifier and check representative HTML/CSS/icon
  paths through `apt.sharedpair.dev`.

## Phase 4: Repository rollback drill

- [ ] Record the successor generation ID and public metadata hashes.
- [ ] Invoke the guarded rollback command with the exact baseline generation ID.
- [ ] Verify the baseline generation signature, manifest, package membership,
  and public hostname after promotion.
- [ ] Confirm a clean APT client can update against the restored baseline and
  resolve representative packages from both runtime lines.
- [ ] Re-promote the exact successor generation with the same guarded command.
- [ ] Repeat signature, membership, public metadata, and APT client checks.
- [ ] Record timestamps, generation IDs, commands, hashes, and results below.

## Phase 5: Final deployment and verification

- [ ] Deploy the final `sharedpair.dev` build after wording and QA corrections.
- [ ] Verify `/`, all five canonical hashes, `/about/`, `/feed.xml`, `/api/votes`,
  and `apt.sharedpair.dev`.
- [ ] Verify deleted human-facing content routes still return `404`.
- [ ] Confirm both worktrees contain no uncommitted changes from this run. Any
  preserved unrelated changes must be listed explicitly.

## Acceptance criteria

- No public page describes the already-live repository as pending approval.
- Desktop and mobile captures have been inspected and material defects fixed.
- Both repositories contain separate, scoped commits.
- The active APT tree comes from a signed immutable generation whose manifest
  includes the Shared Pair favicon and neon stylesheet.
- The previous generation is successfully restored and publicly verified, then
  the successor is re-promoted and publicly verified.
- A clean APT client updates and resolves packages after both promotions.
- The final site, feed, vote API, and APT host return expected responses.
- Unrelated `packages/poi/` and cache files remain untouched and uncommitted.

## Execution results

To be completed during the run.

| Item | Result |
|---|---|
| Website commit | Pending |
| APT browser commit | Pending |
| Baseline generation | Pending |
| Successor generation | Pending |
| Baseline rollback verification | Pending |
| Successor restoration verification | Pending |
| Desktop/mobile QA | Pending |
| Final live verification | Pending |
