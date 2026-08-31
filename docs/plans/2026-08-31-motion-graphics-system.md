# Motion graphics system

## Goal

Give Shared Pair an unmistakable sense of motion drawn from its actual source
material: the 2c–2e bond, paired spins, overlapping electron density, shared
runtime lines, application enrollment, and observable build/test activity.
Motion should explain sharing and progression rather than decorate empty space.

## Principles

- Build graphics as responsive SVG and CSS; use JavaScript only for pointer,
  scroll, or live-state interaction.
- Reuse lime for one centre/runtime side, violet for the other, and neutral
  white for shared electrons or verified artifacts.
- Prefer obvious, legible movement over ambient shimmer that looks accidental.
- Keep each loop between 3 and 10 seconds and avoid simultaneous competing
  loops in the same viewport.
- Pause off-screen animation and avoid layout-triggering properties.
- Under `prefers-reduced-motion: reduce`, render a meaningful static frame.
- Treat decorative animation as `aria-hidden`; retain text alternatives for
  diagrams that carry information.
- Keep the header mark cheap enough to run continuously; reserve richer motion
  for page heroes.

## Selection menu

Choose one option from each group by code, for example `L4 + H2 + F7`.

### Tiny logo variations

| Code | Variation | Motion |
|---|---|---|
| L1 | Paired orbit | Two dots orbit the central diamond in opposite directions, briefly aligning as a pair. |
| L2 | Bond pulse | The two coloured centres remain fixed while the shared middle field expands and contracts visibly. |
| L3 | Electron exchange | Two white electrons travel along crossing arcs between lime and violet centres. |
| L4 | Spin pair | Two dots rotate half a turn around the centre, then their opposite spin arrows flash once. |
| L5 | Shared snap | Separate coloured circles pull together, form the diamond overlap, hold, then release. |
| L6 | Runtime handshake | Lime and violet brackets slide inward around a white shared core, then lock. |
| L7 | Figure-eight pair | One continuous figure-eight path carries two electrons exactly half a loop apart. |
| L8 | Density breathe | A soft orbital cloud breathes behind a completely stable geometric mark. |
| L9 | Version tick | The mark holds still while a tiny `42 → 44` runtime tick rolls beneath it. |
| L10 | Test pass | The bond assembles from two centres; a small lime verification ring sweeps around it once. |

Recommended starting point: **L7**. It reads clearly at small size, directly
expresses a shared pair, and avoids turning the navigation into a loading
indicator.

### Page hero variations

| Code | Variation | Motion |
|---|---|---|
| H1 | Orbital field | Large overlapping electron-density lobes drift, merge, and separate behind the hero copy. |
| H2 | Adoption pipeline | Runtime files flow into a shared core; application tiles connect one by one after audit and test gates. |
| H3 | Runtime constellation | Electron 42 and 44 form two moving hubs with compatible apps orbiting their tested runtime. |
| H4 | Package split | A monolithic app bundle visibly separates into shared runtime and private application layers. |
| H5 | Duplicate collapse | Several Chromium blocks converge into one runtime block while app payloads remain separate. |
| H6 | Paired-spin lab | The existing molecular diagram becomes a large animated scientific plate with moving electrons and field contours. |
| H7 | Test chamber | App windows move through package, launch, behavior, and pass stages like a compact test rig. |
| H8 | Version rails | Parallel Electron 42 and 44 rails carry app packages, showing bounded compatibility and co-installation. |
| H9 | Evidence stream | Hashes, package names, screenshots, and test results travel into a signed release artifact. |
| H10 | Interactive bond | Pointer position changes orbital overlap; the shared pair stabilizes only when the two centres align. |

Recommended starting point: **H2** on the home page, **H3** on Runtimes, and a
lighter **H7** on Applications/Status. This lets motion explain the project
rather than repeat one animation everywhere.

### Header and footer variations

| Code | Variation | Motion |
|---|---|---|
| F1 | Scroll transfer | A tiny electron travels from the header mark toward the active navigation item as the page changes. |
| F2 | Active-route bond | The active nav underline grows from two endpoints and meets in the middle. |
| F3 | Header-to-footer orbit | The logo begins one orbital phase in the header and the footer completes the second phase. |
| F4 | Runtime status rail | A slim header rail periodically shows `42 tested`, `44 tested`, and publication state. |
| F5 | Reading progress bond | Two coloured lines advance from opposite edges and meet according to page-reading progress. |
| F6 | Footer recombination | Three small streams—runtime, apps, evidence—merge into the footer logo when it enters view. |
| F7 | Activity ticker | The footer exposes the newest project-feed entry with a slow, single-step transition and Atom link. |
| F8 | Link magnetism | Nearby footer links subtly pull a small electron toward them on keyboard focus or hover. |
| F9 | Release heartbeat | A restrained pulse beside publication status runs only when there is a new feed entry. |
| F10 | Paired page transition | On same-site navigation, lime and violet fields sweep inward, overlap briefly, then reveal the destination. |

Recommended starting point: **F2 + F7**. The active-route bond provides useful
navigation feedback; the project-feed footer gives the lower page a reason to
exist. Avoid F10 until the site has view-transition testing across browsers.

## Proposed first combination

`L7 + H2/H3/H7 + F2/F7`

- Tiny figure-eight electron pair in the persistent logo.
- Home adoption pipeline, runtime constellation, and test-chamber variants
  sharing one visual grammar.
- Bond-forming active navigation underline.
- Latest shipped/next project-feed item in the footer with an Atom link.

## Variant controls

Implement every variation in the selection menu, not only the recommended
combination. Add a compact **Motion settings** panel so variants can be changed
without editing code or rebuilding the site.

### Initial settings

- Tiny logo: `L7` — Figure-eight pair.
- Home hero: `H2` — Adoption pipeline.
- Runtimes hero: `H3` — Runtime constellation.
- Applications and Status heroes: `H7` — Test chamber.
- Other page heroes: use the nearest relevant recommended scene, falling back
  to `H6` — Paired-spin lab.
- Header: `F2` — Active-route bond.
- Footer: `F7` — Activity ticker.
- All other header/footer effects disabled initially.

### Settings interface

- Open the panel from a small motion/control icon in the footer; do not add
  another persistent item to the primary navigation.
- Use a radio group or select menu for the tiny-logo choice because only one
  logo animation can run at a time.
- Provide a hero selector for each page family: Home, Applications/Status,
  Runtimes, and General content pages.
- Use checkboxes for header/footer effects because compatible effects may be
  combined. Detect and disable combinations that compete for the same visual
  property or interaction.
- Include global checkboxes for **Enable motion**, **Pause ambient loops**, and
  **Show motion labels/debug bounds**.
- Include **Use recommended settings**, **Disable all motion**, and **Reset**
  actions.
- Show the variation code and plain-language name beside every control.
- Preview changes immediately in the current page; do not require submission or
  reload.
- Store preferences in `localStorage` under one versioned key. The server-rendered
  recommended defaults remain the no-storage and no-JavaScript behavior.
- Support a query-string preview mode for shareable reviews, without allowing
  query parameters to overwrite saved settings unless the user explicitly
  chooses **Save these settings**.
- Respect `prefers-reduced-motion` above saved animation choices by default, but
  allow an explicit session-only preview for testing each static/reduced frame.

### Architecture

- Define all variant metadata in one typed registry: code, name, placement,
  compatibility, default state, reduced-motion frame, and component loader.
- Lazy-load hero and header/footer variants only when selected; implementing all
  variants must not ship all animation code on every page.
- Keep a stable component boundary for logo, hero, header, and footer so the
  settings panel swaps variants without duplicating page templates.
- Expose the active codes as data attributes on `<html>` for CSS variants and as
  a small shared state module for SVG/JavaScript variants.
- Use a versioned settings migration so renamed or removed variants fall back to
  the recommendations safely.

## Implementation phases

1. Create the typed variant registry, recommended defaults, persisted settings
   schema, and settings panel.
2. Create shared motion tokens for duration, easing, glow, line weight, and
   reduced-motion behavior.
3. Implement all ten tiny-logo variants behind a common SVG component contract
   and test each at 24–40 px.
4. Build one reusable hero scene shell, then implement all ten hero scenes from
   shared primitives.
5. Implement all ten header/footer behaviors with compatibility rules for
   checkbox combinations.
6. Pause hero animation with `IntersectionObserver` when off-screen.
7. Add static SVG snapshots for reduced motion, print, and metadata previews.
8. Test immediate switching, persistence, reset, shareable preview parameters,
   and settings-schema migration.
9. Measure performance and cap continuous animation to transform/opacity where
   possible.

## Acceptance checks

- No layout shift when animation initializes.
- Navigation and copy/filter interactions remain usable without JavaScript.
- Reduced-motion mode contains no looping or translating elements.
- Tiny logo remains recognizable at 24 px and in monochrome.
- Hero animation remains smooth on a mid-range mobile device.
- All 30 variants can be selected and previewed from the settings panel.
- Recommended settings appear on a first visit and after reset.
- Reloading preserves saved settings; private/no-storage browsing falls back
  cleanly to recommendations.
- Invalid or incompatible selections cannot leave the site without a visible
  logo, hero, or usable navigation.
- Page weight added by the shared motion system stays below 25 KiB compressed,
  for the default selection, excluding existing screenshots. Non-default
  variants are lazy-loaded.
- Lighthouse accessibility and performance checks do not regress materially.
