# Shared Pair One-Page Site

## Goal

Turn `sharedpair.dev` into a documentation-first, one-page site. The primary
navigation becomes an in-page table of contents that scrolls to canonical
sections on `/`. Keep `/about/` as the only separate editorial page.

The result should make the whole project understandable without navigating a
collection of thin pages. Installation, the application catalogue and its
technical evidence, runtime details and decisions, security obligations, and
live publication status all belong in one document.

## Product decision

The public information architecture will be:

| Destination | Purpose |
|---|---|
| `/#install` | Repository URL, supported platform, trust warning, and install commands |
| `/#applications` | Published and held applications, filters, and inline technical reports |
| `/#runtimes` | Runtime packages, compatibility matrices, package boundaries, reproducibility, and maintenance |
| `/#security` | Patch ownership, release evidence, reporting, rollback, and retirement policy |
| `/#status` | Current repository state, verification date, holds, and concise operational facts |
| `/about/` | Project identity, name, scope, independence, and contact |
| `https://apt.sharedpair.dev/` | The actual package archive and machine-browsable repository tree |
| `/feed.xml` | Machine-readable application/release feed; not a navigational page |

There will be no separate `/install/`, `/applications/`, `/runtimes/`,
`/security/`, or `/status/` content pages. Individual application and runtime
report routes will also be removed. The user has explicitly rejected legacy
URLs, so removed routes should return `404`; do not add redirects.

## Design principles

1. One fact has one home. Do not repeat the application catalogue, runtime
   notes, or status summaries elsewhere on the page.
2. The top navigation is a compact set of anchor links, not page tabs in the
   ARIA widget sense. Use ordinary links so browser history, copyable URLs,
   keyboard navigation, and no-JavaScript behavior work naturally.
3. Keep the active-navigation underline; remove decorative hero graphics and
   all other ambient motion.
4. Put useful content before framing copy. Each section should begin with the
   answer or action a visitor came for.
5. Keep every report in the document, but use native disclosure controls to
   prevent the page from feeling like an unbroken wall of text.
6. The page must remain fully usable without JavaScript. JavaScript may improve
   filtering, active-section tracking, URL synchronization, and copy feedback.

## Desktop mockup

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  ◉ SHARED PAIR   Install  Applications  Runtimes  Security  Status  About │
│                  ─────── active-section underline                         │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SHARED ELECTRON RUNTIMES FOR LINUX                                        │
│  One runtime. More room.                                                    │
│  A short, plain-language project statement.                                │
│                                                                            │
│  [ Install packages ]   [ Open APT repository ↗ ]                          │
│                                                                            │
├─ INSTALL ───────────────────────────────────────────────────────────────────┤
│  Repository live · Ubuntu 26.04 · amd64                 [apt.sharedpair.dev]│
│                                                                            │
│  1  Add key        2  Add repository        3  Install                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ curl …                                                               │  │
│  │ echo …                                                               │  │
│  │ sudo apt update                                                      │  │
│  └──────────────────────────────────────────────────────────── [Copy] ──┘  │
│  Trust model and signing fingerprint shown immediately below.              │
│                                                                            │
├─ APPLICATIONS ──────────────────────────────────────────────────────────────┤
│  11 published · 2 held                         [Search] [Runtime] [Status]  │
│                                                                            │
│  LosslessCut          Electron 42    Tested    35 MiB          [Details +] │
│  draw.io Desktop      Electron 42    Tested    21 MiB          [Details +] │
│  …                                                                         │
│  ┌ Details: LosslessCut ────────────────────────────────────────────────┐  │
│  │ Boundary · provenance · package contents · exact test · limitations │  │
│  │ Evidence image, when it adds information                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  Under consideration                                                       │
│  Compact searchable candidate table; voting remains inline.                │
│                                                                            │
├─ RUNTIMES ──────────────────────────────────────────────────────────────────┤
│  Electron 42.9.3                         Electron 44.0.0                    │
│  package · archive · installed · bounds   package · archive · bounds       │
│  compatible-app matrix                   compatible-app matrix             │
│                                                                            │
│  Runtime decisions and obligations                                         │
│  ▾ R–01  What belongs where                                                │
│  ▸ R–02  Can we build it twice?                                            │
│  ▸ R–03  One runtime, one responsibility                                   │
│                                                                            │
├─ SECURITY ──────────────────────────────────────────────────────────────────┤
│  Before release        With every package        When something breaks     │
│  concise obligations   SBOM/provenance/tests     advisories/rollback       │
│                                                                            │
├─ STATUS ────────────────────────────────────────────────────────────────────┤
│  ● REPOSITORY LIVE     2 runtimes     11 apps     verified 1 Sept 2026      │
│  [ Open APT repository ↗ ]                                                  │
│  Publication holds: Audex Player · Thorium Reader                           │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│  Shared Pair · independent project                         About · RSS · APT│
└────────────────────────────────────────────────────────────────────────────┘
```

## Mobile mockup

```text
┌──────────────────────────────┐
│ ◉ SHARED PAIR        About → │
│ ┌──────────────────────────┐ │
│ │Install Apps Runtime …  → │ │  horizontal, sticky anchor rail
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ One runtime.                 │
│ More room.                   │
│                              │
│ [Install packages]           │
│ [Open APT repository ↗]      │
├─ INSTALL ────────────────────┤
│ Repository live              │
│ Ubuntu 26.04 · amd64         │
│                              │
│ 1 Add key                    │
│ ┌──────────────────────────┐ │
│ │ curl …            [Copy] │ │
│ └──────────────────────────┘ │
│ 2 Add repository             │
│ 3 Install                    │
├─ APPLICATIONS ───────────────┤
│ [Search applications       ] │
│ [Any runtime] [Any status]   │
│                              │
│ LosslessCut                  │
│ Electron 42 · Tested         │
│ [Technical details +]        │
│ ──────────────────────────── │
│ draw.io Desktop              │
│ Electron 42 · Tested         │
│ [Technical details +]        │
├─ RUNTIMES ───────────────────┤
│ Electron 42.9.3              │
│ facts + app matrix           │
│                              │
│ Electron 44.0.0              │
│ facts + app matrix           │
│                              │
│ [R–01 What belongs where  +] │
│ [R–02 Reproducibility     +] │
│ [R–03 Maintenance         +] │
├─ SECURITY ───────────────────┤
│ Three concise obligations    │
├─ STATUS ─────────────────────┤
│ ● Repository live            │
│ [Open repository ↗]          │
│ Holds                        │
├──────────────────────────────┤
│ About · RSS · APT            │
└──────────────────────────────┘
```

## Interaction mockup: navigation and disclosures

```text
URL on arrival                   Highlighted item       Page behavior
────────────────────────────────────────────────────────────────────────
/                                none / overview        top of document
/#install                        Install                scroll to Install
/#applications                   Applications           scroll to catalogue
/#applications-losslesscut       Applications           scroll + open report
/#runtimes                       Runtimes               scroll to runtime facts
/#runtime-package-boundary       Runtimes               scroll + open R–01
/#security                       Security               scroll to obligations
/#status                         Status                 scroll to live state
/about/                          About                  separate document
```

Use `<details>` and `<summary>` for application reports and runtime notes. Give
each disclosure a stable ID on a wrapper. A small enhancement may open the
matching disclosure when its hash is loaded. The same script should update only
the navigation's visible active state while scrolling; it should not replace
the URL on every scroll event or create noisy browser history.

## About-page mockup

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  ◉ SHARED PAIR   Install  Applications  Runtimes  Security  Status  About │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ABOUT                                                                     │
│                                                                            │
│  ┌────────────────┐   A shared pair, not another bundle.                   │
│  │   ╭───╮╭───╮   │                                                       │
│  │  ●  •────•  ●  │   Shared Pair builds versioned Electron runtimes and  │
│  │   ╰───╯╰───╯   │   compatible Linux desktop packages.                  │
│  │  SHARED PAIR   │                                                       │
│  └────────────────┘   Independent of Electron, OpenJS, Debian, and Ubuntu. │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│  THE NAME                  THE SCOPE                 THE PRINCIPLE          │
│  2c–2e shared-pair         Debian-family Linux       auditable boundaries  │
│  chemistry, stated         packages and tested       and faster shared     │
│  accurately                runtime lines             security updates      │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│  Contact             Source              APT repository                    │
│  packages@…          project link        apt.sharedpair.dev ↗              │
├────────────────────────────────────────────────────────────────────────────┤
│  ◉ SHARED PAIR                                      Home · RSS · APT       │
└────────────────────────────────────────────────────────────────────────────┘
```

The About page uses the standard static Shared Pair logo at a larger size. It
must not introduce a separate hero illustration or animated brand variant.

## Content architecture

### 1. Overview

- Keep the existing concise headline and lede.
- Replace “Installation status” with “Install packages” linked to `#install`.
- Keep a direct external button to `https://apt.sharedpair.dev/`.
- Keep the measured headline facts, but avoid a second catalogue or report list.
- Remove the chemistry explanation from the overview if it repeats About;
  retain at most one sentence explaining the name.

### 2. Install

- Move the complete content of `src/pages/install/index.astro` into an `Install`
  section component.
- Put repository live state, platform, architecture, and direct repository URL
  before the commands.
- Preserve copy buttons, signing fingerprint, trust model, and package examples.
- Keep commands as three explicit steps. Do not hide security information in a
  disclosure.

### 3. Applications

- Move the useful parts of `src/pages/applications/index.astro` into the page.
- Retain filters, published/held grouping, candidate search, and voting.
- Replace links to `/applications/<slug>/` with native inline disclosures.
- Move each application's current report fields into its disclosure: package
  boundary, provenance, runtime constraint, release channel, exact test,
  evidence, limitations, and publication state.
- Give each application wrapper a canonical anchor such as
  `applications-losslesscut`.
- Render interface screenshots only inside an opened report or use
  `loading="lazy"`; they are evidence, not hero art.
- Keep candidate rows compact. Candidate discovery data is supporting content,
  not a second primary catalogue.

### 4. Runtimes

- Move the complete runtime matrices and all three already-consolidated reports
  from `src/pages/runtimes/index.astro` into the page.
- Use side-by-side runtime facts on wide screens and stacked facts on mobile.
- Keep R–01, R–02, and R–03 as `<details>` blocks, with the conclusion visible
  in each summary area and the full reasoning inside.
- Keep the package-size accounting note once, adjacent to the runtime facts.
- Do not create report routes.

### 5. Security

- Move `sections.security` into one compact section.
- Merge overlapping security language already present in runtime maintenance;
  Security should own reporting channels, deadlines, release evidence, and
  incident/rollback policy. Runtime maintenance should own dependency impact,
  app-wide retesting, and retirement of old majors.
- Link directly to the repository's public key and signed metadata where useful.

### 6. Status

- Move only current operational facts from `src/pages/status/index.astro`.
- Lead with `Repository live` and a direct link to the APT repository.
- Keep runtime count, application count, target, verification date, and
  publication holds.
- Do not repeat application lists, runtime matrices, candidate discoveries, or
  roadmap prose here.

### 7. About

- Keep `/about/` and the existing content in `sections.about`.
- Add contact, independence statement, source/repository links if available,
  and the short name/chemistry explanation here rather than on the homepage.
- About remains linked at the far right of the header and in the footer.

## Component plan

Create section components so `src/pages/index.astro` remains readable:

```text
src/
├── components/
│   ├── SiteNav.astro
│   ├── InstallSection.astro
│   ├── ApplicationsSection.astro
│   ├── ApplicationReport.astro
│   ├── RuntimesSection.astro
│   ├── SecuritySection.astro
│   ├── StatusSection.astro
│   └── CopyCommand.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro or about/index.astro
│   └── feed.xml.ts
└── data/
    └── project.ts
```

`BaseLayout.astro` should accept whether the current document is the one-page
home or About. On home, primary links point to `#install`, `#applications`,
`#runtimes`, `#security`, and `#status`. On About, those links point to
`/#install`, etc., so the header remains useful.

Do not introduce a client-side router or SPA framework. Astro should emit a
normal static document; “one-page app” describes the user experience, not the
rendering architecture.

## Navigation behavior

1. Use stable section IDs and ordinary `<a href="#…">` links.
2. Keep the header sticky and preserve the active underline.
3. Add `scroll-margin-top` to each section so headings are not hidden under the
   sticky header.
4. Use `IntersectionObserver` to set `aria-current="location"` on the link for
   the most visible section.
5. On click, allow the browser's native hash update and scrolling.
6. Respect `prefers-reduced-motion`; native scrolling becomes immediate.
7. On narrow screens, make the anchor rail horizontally scrollable with every
   label fully readable. Do not disguise it as an ARIA tablist.
8. Give focus to the target heading only when needed for keyboard/screen-reader
   navigation; never steal focus during ordinary scrolling.

## Route removal

After content parity is verified, remove:

- `src/pages/install/index.astro`
- `src/pages/applications/index.astro`
- `src/pages/applications/[app].astro`
- `src/pages/runtimes/index.astro`
- `src/pages/status/index.astro`
- the dynamic security route produced by `src/pages/[section].astro`

Replace the dynamic `[section].astro` route with an explicit About page so no
other accidental section pages are generated. Remove dead CSS, components,
imports, route-specific tests, and Worker redirects. Confirm the deleted routes
return `404` in preview and production.

## Data and state

- Keep `src/data/project.ts` and generated registry files as the single source
  for package, runtime, report, status, and accounting facts.
- Separate data shape from presentation. Consolidation must not duplicate
  application records in page markup or a new hand-maintained dataset.
- Candidate filters and votes continue to use data attributes and the existing
  Worker/Durable Object endpoint.
- Application disclosure state does not need persistence. Hash-targeted reports
  open on arrival; otherwise all reports default closed.

## Accessibility requirements

- Preserve the skip link; it should target the overview or first meaningful
  heading.
- Every major section has a unique `<h2>` and an accessible landmark or
  `aria-labelledby` relationship.
- Use `<details>/<summary>` instead of custom accordion roles.
- Ensure filters retain explicit labels and result counts use a polite live
  region.
- Copy controls announce success without relying on animation.
- Active navigation uses text/`aria-current`, not underline color alone.
- Anchor targets have visible keyboard focus and adequate scroll offset.
- Validate the full page at 320 px without horizontal page overflow; only the
  deliberate navigation rail and candidate table may scroll horizontally.

## Performance requirements

- Keep the initial document useful with JavaScript disabled.
- Lazy-load report screenshots and avoid loading hidden full-resolution images
  eagerly.
- Remove CSS and JavaScript belonging to deleted routes and the abandoned
  motion system.
- Aim for one shared stylesheet plus page-specific CSS emitted for `/` and
  `/about/`.
- Do not hydrate every report. One small navigation/hash script and the existing
  filter/vote script are sufficient.
- Verify the large candidate dataset does not make interaction sluggish. If the
  HTML becomes excessive, show the viable candidate table in a single closed
  disclosure while retaining it in the document.

## Implementation phases

### Phase 1: Establish the one-page skeleton

1. Add canonical sections and anchor navigation to `/`.
2. Make header links work correctly from both `/` and `/about/`.
3. Add scroll offsets, active-section observation, and reduced-motion behavior.
4. Verify desktop and mobile navigation before moving content.

### Phase 2: Consolidate action and status content

1. Move Install into `#install`.
2. Move concise operational facts into `#status`.
3. Put direct `apt.sharedpair.dev` links in both sections.
4. Remove duplicated homepage status and install teaser content.

### Phase 3: Consolidate technical content

1. Move the application catalogue, filters, holds, candidates, and voting into
   `#applications`.
2. Convert every per-application report to an inline disclosure.
3. Move runtime facts and all R–01/R–03 content into `#runtimes`.
4. Move and deduplicate security policy into `#security`.
5. Verify every fact from the old pages has either one new home or an explicit
   deletion rationale.

### Phase 4: Remove routes and dead code

1. Delete the old page sources and dynamic report routes.
2. Replace dynamic `[section].astro` with explicit About.
3. Remove route redirects from the Worker; removed URLs should be `404`.
4. Remove unused page CSS, components, imports, and tests.
5. Confirm Astro builds only `/`, `/about/`, application feed endpoints, and
   required static assets.

### Phase 5: Verify and publish

1. Run data verification, Astro type checks, production build, and built-site
   verification.
2. Test the page without JavaScript.
3. Test keyboard navigation, disclosures, copy controls, filters, voting, and
   hash-targeted arrival.
4. Test 320, 375, 768, 1024, and 1440 px layouts.
5. Confirm `/about/` works and all removed content routes return `404`.
6. Deploy to Cloudflare and smoke-test `/`, every canonical hash, `/about/`,
   `/feed.xml`, the vote API, and `apt.sharedpair.dev`.

## Acceptance criteria

- The main header has Install, Applications, Runtimes, Security, and Status
  anchor links plus a separate About link.
- Clicking a primary item scrolls to the matching section on `/` and preserves
  a copyable hash URL.
- The active navigation underline follows the visible section.
- No decorative hero graphic or ambient animation is present.
- Install instructions and the direct APT repository link are visible on `/`.
- Every published and held application has its complete technical report inline
  on `/`; there are no per-application pages.
- Runtime facts and R–01 through R–03 are complete inline on `/`; there are no
  runtime report pages.
- Security and status each appear once and do not repeat catalogues or matrices.
- `/about/` is the only separate human-facing editorial page.
- Removed content routes return `404` with no legacy redirect rules.
- The page works without JavaScript and meets keyboard, focus, reduced-motion,
  and mobile overflow requirements.
- The production build and live smoke checks pass before publication is called
  complete.

## Non-goals

- Do not merge `apt.sharedpair.dev` into the marketing/documentation document.
- Do not replace Astro with a client-side SPA or add a routing framework.
- Do not recreate report pages in modals, drawers, or hidden client-only views.
- Do not add more hero art, motion variants, or a motion-settings interface.
- Do not preserve obsolete routes merely for analytics or speculative SEO.
