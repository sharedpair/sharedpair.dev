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

- [x] Replace footer and report language that still says publication is pending.
- [x] Search rendered and source content for contradictory states such as
  “pending approval,” “not yet public,” and “ready for promotion.”
- [x] Build and run the one-page verification gate.
- [x] Capture desktop (1440 px) and mobile (390 px) screenshots of `/` and
  `/about/` from the production build or live deployment.
- [x] Inspect navigation, screenshots, disclosure affordances, command overflow,
  candidate table overflow, About logo, footer, and neon contrast.
- [x] Correct material visual defects and repeat the captures.

## Phase 2: Scoped commits

- [x] Review both worktree diffs and identify every file belonging to this run.
- [x] Commit the website one-page implementation, About page, verifier, plan,
  and synchronized generated registry data in `sharedpair.dev`.
- [x] Commit only the APT browser favicon, stylesheet, and relevant tracked
  landing-page cleanup in `shared-electron`.
- [x] Do not stage `packages/poi/`, `__pycache__/`, or unrelated package work.
- [x] Record commit IDs in the results section.

## Phase 3: Signed immutable APT generation

- [x] Record the currently active generation ID, signed `InRelease` hash,
  generation-manifest hash, and signing fingerprint as the rollback baseline.
- [x] Confirm all configured release-stage binary and source artifacts exist
  before regenerating the repository.
- [x] Generate the complete local APT tree using the containerized publisher.
- [x] Confirm the official logo assets and neon `styles.css` are present in the
  generated tree and its generation manifest.
- [x] Sign `Release`, `InRelease`, and the generation manifest with the configured
  Shared Pair key.
- [x] Run local signature, membership, size, hash, and browser-generation checks.
- [x] Dry-run the R2 publication delta.
- [x] Upload the immutable generation, verify it remotely, and promote signed
  repository metadata last.
- [x] Run the public repository verifier and check representative HTML/CSS/icon
  paths through `apt.sharedpair.dev`.

## Phase 4: Repository rollback drill

- [x] Record the successor generation ID and public metadata hashes.
- [x] Invoke the guarded rollback command with the exact baseline generation ID.
- [x] Verify the baseline generation signature, manifest, package membership,
  and public hostname after promotion.
- [x] Confirm a clean APT client can update against the restored baseline and
  resolve representative packages from both runtime lines.
- [x] Re-promote the exact successor generation with the same guarded command.
- [x] Repeat signature, membership, public metadata, and APT client checks.
- [x] Record timestamps, generation IDs, commands, hashes, and results below.

## Phase 5: Final deployment and verification

- [x] Deploy the final `sharedpair.dev` build after wording and QA corrections.
- [x] Verify `/`, all five canonical hashes, `/about/`, `/feed.xml`, `/api/votes`,
  and `apt.sharedpair.dev`.
- [x] Verify deleted human-facing content routes still return `404`.
- [x] Confirm both worktrees contain no uncommitted changes from this run. Any
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
| Website commit | `2cc5bd7` one-page consolidation; subsequent logo, colophon, About, and candidate-table commits through `545db99` |
| APT browser commit | `0e953ba`, followed by official-logo/colophon work through `83272c2` and rollback hardening through `8b69ae9` |
| Baseline generation | `20260901T051518Z`; 98 objects, 1,891,462,645 bytes; manifest SHA-256 `082cff17e85e8490ba1593dd7741f1ecb136462ecb121d40c648eaf3bca83a1b` |
| Successor generation | `20260901T193234Z`; 106 objects, 1,961,301,675 bytes; downloaded manifest SHA-256 `fcaf575c80de0f3194c244b50edc323b00cc28fc36c9dde289761f1564f80b3a` |
| Baseline rollback verification | Workflow `33553982295` passed; signature/public verifier reported 12 binary/source packages; clean Ubuntu 26.04 client updated and resolved both runtime lines |
| Successor restoration verification | Workflow `33554492011` passed; signature/public verifier reported 13 binary/source packages; prior publication smoke installed representative packages and both runtime lines |
| Desktop/mobile QA | Home, About, colophon, and APT browser inspected at 1440×1000 and/or 390×844; material layout issues corrected |
| Final live verification | Worker `36122bbe-9077-4899-86fb-f3dbd9f97617`; main, About, colophon, feed, votes API, and APT returned 200; five removed routes returned 404 |
