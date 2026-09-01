# Shared Pair logo rollout

## Goal

Use `public/images/brand/github-avatar.png` as the single visual identity across sharedpair.dev and apt.sharedpair.dev, including a large home-page mark where the removed hero graphic used to sit.

## Asset strategy

- Keep `github-avatar.png` as the untouched 1254×1254 source of truth.
- Generate transparent PNG derivatives at 32, 64, 180, 192, and 512 pixels.
- Use the 64px derivative in compact navigation and footer contexts.
- Use the 512px derivative for the home and About page displays.
- Advertise 32px, 180px Apple touch, and 192px web-app icon sizes in page metadata.
- Copy the required derivatives into the APT repository's tracked static inputs so every generated immutable repository contains the same identity.

## Implementation

- [x] Replace the code-drawn `MotionLogo` mark with the official raster artwork.
- [x] Add a large, responsive logo to the home hero without restoring decorative hero graphics.
- [x] Keep the large official logo on About.
- [x] Add complete favicon and touch-icon metadata to the main site.
- [x] Replace the APT browser's drawn top-left glyph, navigation logo, favicon, and manifest icons.
- [x] Build and run structural verification for sharedpair.dev.
- [x] Generate and verify a signed local APT candidate.
- [x] Perform desktop and mobile browser checks.
- [ ] Publish both sites through their normal release paths.

## Acceptance

- Every Shared Pair brand mark is derived from the supplied original artwork.
- Compact marks remain legible and do not distort the source aspect ratio.
- The home hero visibly features the large logo on desktop and mobile.
- Both domains advertise real raster favicons at appropriate sizes.
- The APT logo assets are part of an immutable signed generation.

## Results

Implementation passed the Astro build and structural verifier. Desktop (1440×1000) and mobile (390×844) home renders show the official mark without clipping or distortion. The generated APT browser was visually checked at 1440×1000. Local signed generation `20260901T191226Z` verified 13 binaries, 13 sources, and 106 manifest objects with signing fingerprint `CB4B214C7E7D250E1F06D319DC957822C3CA4045`. Production publication remains to be recorded after its release gates complete.
