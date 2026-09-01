# Shared Pair colophon

## Goal

Add one concise, useful colophon that documents how both sharedpair.dev and apt.sharedpair.dev are made. Keep the information canonical and avoid creating another thin page on the APT domain.

## Reference direction

The plan borrows the strongest ideas from the local references without copying their visual systems:

- `worldfoundry.org/src/pages/colophon.astro`: compact labeled rows for stack and typography.
- `indri.studio/src/pages/colophon.astro`: honest palette, motif, hosting, and attribution notes.
- Shared Pair remains denser and more technical: neon lime/violet, ruled records, mono labels, and the official paired-orbit logo.

## Information architecture

Create one canonical route at `/colophon/` with two substantial sections:

1. **Website** — Astro 7, plain generated HTML/CSS, Cloudflare Workers Static Assets, R2 binding, typography, palette, motion policy, source, and deployment.
2. **APT repository** — Ubuntu 26.04/resolute, aptly-generated `deb`/`deb-src` metadata, GnuPG signing, immutable R2 generations, rollback promotion, package-browser generator, CI smoke tests, and source.

Both site footers link to the same page:

- sharedpair.dev footer: `/colophon/`
- apt.sharedpair.dev footer: `https://sharedpair.dev/colophon/#apt-repository`

This provides a colophon for both properties without duplicating prose or adding a second APT-only page.

## Desktop mockup — canonical page

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [official logo] SHARED PAIR      INSTALL APPS RUNTIMES SECURITY STATUS ABOUT │
├──────────────────────────────────────────────────────────────────────────────┤
│ /// COLOPHON                                                                │
│ How the pair is made.                                  [large orbit logo]   │
│ Two surfaces, one publishing system: the public guide and signed archive.   │
├──────────────────────────────────────────────────────────────────────────────┤
│ 01  WEBSITE                                                                │
│                                                                             │
│ Generator       Astro 7             static HTML, CSS, minimal JS            │
│ Delivery        Cloudflare Workers  Static Assets + custom domains          │
│ Type            System sans / mono  no third-party font dependency          │
│ Palette         ● lime  ● violet    #b9ff66 / #a58bff                       │
│ Motion          section underline   reduced-motion respected                │
│ Source          GitHub ↗             sharedpair/sharedpair.dev               │
├──────────────────────────────────────────────────────────────────────────────┤
│ 02  APT REPOSITORY                                            #apt-repository│
│                                                                             │
│ Target          Ubuntu 26.04 amd64  suite: resolute                          │
│ Metadata        aptly               deb + deb-src                            │
│ Trust           OpenPGP             fingerprint + signed manifests           │
│ Storage         Cloudflare R2       immutable generation, promoted active    │
│ Release         GitHub Actions      verify → publish → clean-client smoke    │
│ Source          GitHub ↗             sharedpair/shared-electron              │
├──────────────────────────────────────────────────────────────────────────────┤
│ [logo] SHARED PAIR      About · Colophon · RSS · APT repository             │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Mobile mockup — canonical page

```text
┌──────────────────────────────┐
│ [logo] SHARED PAIR   ABOUT → │
│ INSTALL APPS RUNTIMES ...    │
├──────────────────────────────┤
│       [official logo]        │
│ /// COLOPHON                 │
│ How the pair is made.        │
│ Two surfaces, one publishing │
│ system.                      │
├──────────────────────────────┤
│ 01  WEBSITE                  │
│ Generator                    │
│ Astro 7                      │
│ static HTML / CSS            │
│ ──────────────────────────── │
│ Delivery                     │
│ Cloudflare Workers           │
│ ──────────────────────────── │
│ Type / Palette / Motion ...  │
├──────────────────────────────┤
│ 02  APT REPOSITORY           │
│ Target                       │
│ Ubuntu 26.04 · amd64         │
│ ──────────────────────────── │
│ Trust                        │
│ OpenPGP signed               │
│ ──────────────────────────── │
│ Metadata / Storage ...       │
├──────────────────────────────┤
│ About · Colophon · RSS · APT │
└──────────────────────────────┘
```

## APT footer mockup

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SHARED PAIR APT  ·  signed packages for Ubuntu 26.04                        │
│ Repository colophon ↗   Main project ↗   RSS                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

On narrow screens the three links wrap into a vertical list with full-row click targets.

## Implementation plan

- [x] Add `src/pages/colophon/index.astro` using the existing `BaseLayout`.
- [x] Keep all claims derived from repository configuration and release scripts; avoid aspirational stack claims.
- [x] Use structured arrays for website and APT fact rows so content stays terse and scannable.
- [x] Include the official 512px logo in the page introduction at a restrained scale.
- [x] Add palette swatches for the existing lime, violet, background, surface, ink, and muted tokens.
- [x] Add direct source links for both repositories and direct links to Astro, Cloudflare Workers, R2, aptly, OpenPGP, and GitHub Actions.
- [x] Add `Colophon` to the sharedpair.dev footer only; do not add it to the already dense top navigation.
- [x] Extend the site verifier to require the route, both system sections, all local asset references, and the APT anchor.
- [x] Add an APT footer link to `https://sharedpair.dev/colophon/#apt-repository` in the tracked generator/template.
- [x] Extend APT publication verification to assert the generated footer link.
- [x] Build both properties and visually inspect desktop and 390px mobile renders.
- [x] Check link focus, wrapping, contrast, and `prefers-reduced-motion` behavior.
- [ ] Commit website and APT changes separately.
- [ ] Publish sharedpair.dev, then publish the APT change in a new immutable signed generation.
- [ ] Verify both live URLs and record generation/version evidence below.

## Acceptance criteria

- `/colophon/` gives meaningful construction and attribution details for both domains.
- APT visitors land directly on `#apt-repository` from its footer.
- No separate or duplicated APT colophon page exists.
- The page reads as a technical ledger, not promotional filler.
- Desktop and mobile layouts match the mockup hierarchy.
- All technical claims, repository links, and versioned platform details are accurate at publication time.
- The main-site deploy and signed APT generation both pass their normal verification gates.

## Publication evidence

Astro rendered three pages and the structural verifier passed. The colophon was checked at 1440×1000 and 390×844 against the approved mockup. The APT browser includes the deep-link and icon-only copy affordance; local signed generation `20260901T192531Z` verified 13 binaries, 13 sources, and 106 objects. Production version and generation remain to be recorded after publication.
