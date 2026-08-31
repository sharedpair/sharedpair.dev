# Independent Shared Pair organization, repositories, and domain

**Date:** 2026-08-31

**Owner:** Will

**Status:** in progress; domain, GitHub organization, and repositories created

## Organization avatar

The GitHub organization uses a dedicated Shared Pair mark designed to remain
legible in GitHub's circular avatar crop. The source asset is retained with the
website so the public brand and organization identity use the same canonical
image.

![Shared Pair organization avatar](../../../public/images/brand/github-avatar.png)

## Decision

Shared Pair will become an independent open-source project rather than remain
part of the Foundry Linux repository. Its canonical public identity will use:

- GitHub organization: `sharedpair`
- Package and runtime repository: `sharedpair/shared-electron`
- Independent local package checkout: `/home/will/shared-electron/`
- Website repository: `sharedpair/sharedpair.dev`
- Independent local website checkout: `/home/will/sharedpair.dev/`
- Canonical website: `https://sharedpair.dev/`
- APT repository: `https://apt.sharedpair.dev/`; its hostname and routing are
  configured with the website/domain infrastructure, while its signed contents
  are produced by `shared-electron`

The GitHub organization and repository names remain subject to live availability
at creation time. Will registered `sharedpair.dev` through Cloudflare Registrar
on 31 August 2026 for $12.20/year.

## Repository boundaries

### `sharedpair/shared-electron`

This repository owns the software supply chain:

- versioned shared Electron runtime packages;
- application adaptations and Debian packaging;
- explicit downstream source patches;
- reviewable packaging diffs for adaptations that do not change application
  source;
- compatibility manifests and generated package metadata;
- build, smoke-test, integration-test, and screenshot-evidence tooling where the
  tooling must run against built packages;
- APT repository generation, signing, artifact publication, rollback, and
  verification;
- release notes, security provenance, SBOMs, and machine-readable status inputs.

The APT hostname is not a separate repository. `shared-electron` produces and
publishes the signed repository contents served at `apt.sharedpair.dev`; domain
and routing ownership stays with the `sharedpair.dev` repository.

### `sharedpair/sharedpair.dev`

This repository owns the public website:

- the Astro source and pinned Node/toolchain configuration;
- homepage, install, application, runtime, report, security, status, and about
  pages;
- application screenshots and their provenance records;
- presentation of package measurements and compatibility results imported from
  the package repository;
- website tests, accessibility checks, link checks, and deployment
  configuration;
- DNS and hosting configuration for the `sharedpair.dev` zone, including the
  route or storage binding for `apt.sharedpair.dev`.

The website must consume generated release facts from `shared-electron`; it
must not maintain an independent handwritten copy of package versions,
checksums, support state, or repository health.

## Adaptation review links

Every adapted application report will include a direct GitHub link showing the
change needed to use the shared Electron runtime.

- When application source changes, the link points to the actual downstream
  `.patch` file in `sharedpair/shared-electron`.
- When only packaging changes, the link points to a checked-in unified packaging
  `.diff` that presents the adaptation as a reviewable change.
- Reports must label these accurately as **source patch** or **packaging diff**.
- A package directory, generated binary, or mutable build log must not be
  presented as though it were a patch.
- Website link validation must reject legacy links into
  `foundry-linux/foundrylinux.org` after the migration is complete.

Until the repositories exist publicly, the website may display the eventual
canonical GitHub URLs only when clearly marked pending publication. It must not
claim that an unavailable link is live.

## Domain and service layout

| Host | Responsibility | Publishing source |
| --- | --- | --- |
| `sharedpair.dev` | Canonical website and technical reports | `sharedpair.dev` repository |
| `www.sharedpair.dev` | Redirect to the canonical apex | Website/Cloudflare configuration |
| `apt.sharedpair.dev` | Route/storage configuration in `sharedpair.dev`; signed APT contents produced by `shared-electron` | Both repositories, with separate infrastructure and artifact responsibilities |

Additional hostnames will not be created without an operational need.
Downloads remain in the APT repository or GitHub Releases unless non-APT
artifacts later justify `downloads.sharedpair.dev`.

## Migration sequence

1. **Completed 31 August 2026:** Register `sharedpair.dev` in Will's Cloudflare
   account for $12.20/year. Registrar lock, automatic renewal, DNSSEC, and
   account multi-factor authentication remain configuration checks. The new
   registration is recorded in Will's central
   [`domain-portfolio-dashboard.md`](../../../docs/domain-portfolio-dashboard.md).
2. Confirm the `sharedpair` GitHub organization handle, create the organization,
   require multi-factor authentication, and establish recovery ownership.
3. Create private-empty staging repositories named `shared-electron` and
   `sharedpair.dev`; set their default branch to `main` and configure branch
   protection before public release.
4. Create `/home/will/shared-electron/` as the independent local checkout for
   `sharedpair/shared-electron`. Extract the shared-runtime,
   adapted-application, test, and APT publication files from Foundry Linux into
   it while preserving attribution and useful history. Do not operate the new
   project from inside `/home/will/foundrylinux.org/foundry-apt/` after the
   migration is validated.
5. Make the existing `/home/will/sharedpair.dev/` Astro project the independent
   local checkout of `sharedpair/sharedpair.dev` without copying generated
   output, `node_modules`, secrets, or local preview state.
6. Create and validate the source-patch or packaging-diff artifact for every
   enrolled application, then expose its permanent GitHub URL on the matching
   technical report page.
7. Define the versioned machine-readable interface through which the website
   imports package status, measurements, checksums, and support data.
8. Configure preview deployments for the website. Do not make the apex domain
   canonical until the content and links pass production validation.
9. Create a dedicated Shared Pair APT signing identity, document its
   fingerprint and rotation procedure, and configure `apt.sharedpair.dev` only
   after publication and rollback tests pass.
10. Publish both repositories and the canonical website, then replace or
    redirect the incubating Foundry Linux paths without deleting historical
    attribution.

## Security and ownership gates

Before public package publication:

- Cloudflare and GitHub accounts have multi-factor authentication and recovery
  material under Will's control;
- repository secrets are scoped independently for website previews and APT
  publication;
- the APT signing key is independent of Foundry Linux and is not stored in either
  Git repository;
- protected branches require the relevant build and validation checks;
- release workflows use least-privilege, short-lived credentials where
  supported;
- the site publishes a security contact, supported runtime window, and explicit
  non-affiliation statement;
- rollback of both a website release and an APT repository publication has been
  exercised.

## Acceptance criteria

- `sharedpair.dev` resolves to the independently deployed website over HTTPS.
- `www.sharedpair.dev` redirects to `sharedpair.dev`.
- `apt.sharedpair.dev` exposes only signed, verified repository artifacts.
- The package and website repositories live in the independent `sharedpair`
  organization and contain no absolute dependency on Will's home-directory
  layout or on a Foundry Linux checkout.
- The canonical local checkouts are `/home/will/shared-electron/` and
  `/home/will/sharedpair.dev/`; routine Shared Pair work no longer occurs inside
  the Foundry Linux checkout.
- Every enrolled application's technical report links to its actual source patch
  or packaging diff in `sharedpair/shared-electron`.
- Package facts displayed by the website are generated from a documented,
  versioned data contract.
- Current builds, tests, screenshots, and reports survive the extraction from
  Foundry Linux.
- No DNS change, public repository publication, signing-key publication, or
  package release occurs without Will's explicit approval.

## Immediate next action

Verify the `sharedpair` GitHub organization handle, then create and secure the
organization before creating either repository.
