# Application catalog filters

## Goal

Make the application catalog easy to scan as it grows while keeping the
existing runtime-grouped technical presentation and a useful no-JavaScript
fallback.

## Filter model

- Free-text search across application name and purpose.
- Category: media, productivity, communication, or data science.
- Runtime version: the Electron 42 or Electron 44 shared-runtime line.
- Publication status: tested or blocked.
- Release channel: stable, prerelease, or candidate snapshot.

Application package versions remain visible on each record but are not a
filter: every application has a distinct version, so that control would not
narrow the catalog meaningfully.

## Implementation

1. Add explicit category and release-channel metadata to every application.
2. Render an accessible filter form above the runtime groups.
3. Annotate records with filter metadata and update results client-side.
4. Hide empty runtime groups, show a result count and empty state, and provide
   a one-click reset.
5. Mirror active filters in the URL query string so filtered views can be
   bookmarked and shared.
6. Preserve all records when JavaScript is unavailable.

## Verification

- Run Astro diagnostics and the production build.
- Run rendered-page link, image, report, and local-path verification.
- Confirm controls, result metadata, empty state, and filter script appear in
  the built applications page.
- Check desktop and narrow-screen layouts through the responsive CSS.
