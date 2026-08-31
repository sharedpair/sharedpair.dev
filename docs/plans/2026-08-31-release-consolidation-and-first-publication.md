# Release consolidation and first publication

**Date:** 2026-08-31

**Status:** in progress

## Outcome

Establish clean, pushed baselines for `sharedpair.dev` and `shared-electron`, then publish only the parts whose evidence and operational gates pass. The website candidate catalogue may ship independently. The first APT repository must remain unpublished until its exact package cohort, source artifacts, independent signing identity, and public install tests are complete.

## Change boundaries

### `sharedpair.dev`

- Candidate catalogue generation and evidence data.
- Search, category browsing, evidence disclosures, and lightweight anonymous voting.
- Cloudflare Durable Object API and deployment migration.
- Generated package-registry and measurement refreshes only when reproducible from their tracked sources.

### `shared-electron`

- Neutral Shared Pair package identity and Debian revisions.
- Release registry, unified feed, exact-artifact staging, and local APT generation.
- EffeTune and Penpot candidate packaging only after their build and clean-container test evidence agrees with the catalogue.
- Catalogue audit data and package-loop integration.

Unrelated user changes are preserved and are not silently folded into either baseline.

## Execution

1. Audit every dirty file and map it to one of the boundaries above.
2. Validate generated files against their generators and reject unexplained generated drift.
3. Run website type/build checks and API-focused checks; commit and push the candidate-catalogue feature if they pass.
4. Run `shared-electron` metadata, license, dependency, feed, shell, and release-registry checks.
5. Build and clean-container test new packages before describing them as verified; otherwise retain an explicit candidate or validation state.
6. Stage the exact first-release manifest and generate an unsigned local APT candidate as a structural dry run.
7. Generate or configure a dedicated Shared Pair signing key only when its private backup and CI secret destination are available. Verify the configured fingerprint before signing.
8. Publish the complete APT tree atomically, verify it through `apt.sharedpair.dev`, and install an application from both runtime lines in fresh Ubuntu 26.04 containers.
9. Only after public APT verification, change the website registry, Status, and Install pages from pre-publication to live; rebuild, deploy, and smoke-test them.
10. Commit and push each repository at its last fully verified boundary.

## Stop conditions

- Do not publish packages missing any exact `.deb`, `.dsc`, `.orig.tar.gz`, or `.debian.tar.xz` artifact.
- Do not publish an application with unresolved redistribution or private-runtime concerns.
- Do not publish unsigned repository metadata or reuse the Foundry signing identity.
- Do not claim `published` or `verified` from the existence of packaging definitions alone.
- Do not activate website installation claims until public-hostname APT tests pass.

## Acceptance criteria

- Both repositories have focused commits, clean worktrees, and commits present on their configured upstream branches.
- Website build and candidate-voting behavior pass locally and on the production deployment.
- Registry, feed, package controls, release manifest, and staged artifacts agree exactly.
- `apt.sharedpair.dev` serves a Shared Pair-signed `resolute` repository containing only the approved cohort.
- Fresh Ubuntu 26.04 containers can install applications backed by Electron 42 and Electron 44 through the public endpoint.
- Website Status and Install copy describe the observed public state, not an intended future state.
