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

## Implementation phases

1. Create shared motion tokens for duration, easing, glow, line weight, and
   reduced-motion behavior.
2. Build the selected tiny-logo variant as a reusable SVG component and test it
   at 24–40 px.
3. Build one reusable hero scene shell, then implement selected page-specific
   scenes from common primitives.
4. Add the selected header/footer behaviors without increasing layout height.
5. Pause hero animation with `IntersectionObserver` when off-screen.
6. Add static SVG snapshots for reduced motion, print, and metadata previews.
7. Measure performance and cap continuous animation to transform/opacity where
   possible.

## Acceptance checks

- No layout shift when animation initializes.
- Navigation and copy/filter interactions remain usable without JavaScript.
- Reduced-motion mode contains no looping or translating elements.
- Tiny logo remains recognizable at 24 px and in monochrome.
- Hero animation remains smooth on a mid-range mobile device.
- Page weight added by the shared motion system stays below 25 KiB compressed,
  excluding existing screenshots.
- Lighthouse accessibility and performance checks do not regress materially.
