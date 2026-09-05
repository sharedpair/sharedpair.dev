import registryData from './generated/package-registry.json';

export type State = 'tested' | 'blocked' | 'planned';

interface GeneratedFact {
  version: string;
  archiveMiB: number;
  installedMiB: number;
  runtime: string | null;
  runtimeMajor: number | null;
  runtimeLower: string | null;
  runtimeUpper: string | null;
}

const generated = registryData as typeof registryData & { packages: Record<string, GeneratedFact> };
const displayDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(generated.generatedAt));

function appFacts(packageName: string) {
  const fact = generated.packages[packageName];
  if (!fact?.runtime) throw new Error(`${packageName} has no generated runtime dependency.`);
  const runtimeFact = generated.packages[fact.runtime];
  if (!runtimeFact) throw new Error(`${packageName} references missing runtime ${fact.runtime}.`);
  return {
    version: fact.version,
    electron: runtimeFact.version.split('-')[0],
    runtime: fact.runtime,
    archiveMiB: fact.archiveMiB,
    installedMiB: fact.installedMiB,
  };
}

export interface AppRecord {
  slug: string;
  name: string;
  purpose: string;
  version: string;
  electron: string;
  runtime: string;
  state: State;
  category: 'media' | 'productivity' | 'communication' | 'data-science' | 'books' | 'development' | 'games';
  releaseChannel: 'stable' | 'prerelease' | 'candidate';
  proof: string;
  test: string;
  notes: string[];
  screenshot?: {
    src: string;
    alt: string;
    caption: string;
  };
  interfaceScreenshot?: {
    src: string;
    alt: string;
    source: string;
  };
  archiveMiB?: number;
  installedMiB?: number;
}

export const projectStatus = {
  Status: 'Published · public install verified',
  Runtimes: `${generated.accounting.runtimeLines} tested runtime lines`,
  Applications: `${generated.accounting.testedApplications} packaged and tested`,
  Target: `Ubuntu 26.04 · ${generated.architecture}`,
  Updated: displayDate,
} as const;

export const applications: AppRecord[] = [
  {
    slug: 'losslesscut',
    ...appFacts('losslesscut'),
    name: 'LosslessCut',
    purpose: 'Lossless video and audio cutting',
    state: 'tested',
    category: 'media',
    releaseChannel: 'stable',
    proof: 'Split from its bundled runtime and tested alongside the Electron 42 application set.',
    test: 'Starts through the shared runtime; its private FFmpeg remains with the app.',
    notes: ['Application payload and private FFmpeg stay app-owned.', 'Depends on Electron 42 rather than carrying Chromium.', 'The earlier monolithic package remains the rollback path until publication.'],
    interfaceScreenshot: { src: '/images/applications/losslesscut/upstream-interface.jpg', alt: 'LosslessCut application interface with video preview, segment controls, and timeline.', source: 'https://github.com/mifi/lossless-cut/blob/master/main_screenshot.jpg' },
  },
  {
    slug: 'drawio-desktop',
    ...appFacts('drawio-desktop'),
    name: 'draw.io Desktop',
    purpose: 'Offline diagram editor',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Packaged without Electron; clean-container CLI export passed.',
    test: 'draw.io and LosslessCut co-install on Electron 42; CLI diagram export works.',
    notes: ['Uses the shared sandbox owned by the runtime.', 'Keeps application resources separate from Electron files.', 'CLI export is tested, not merely GUI startup.'],
    screenshot: {
      src: '/images/applications/drawio-desktop/drawio-desktop-31.3.1-electron-42.9.3.png',
      alt: 'draw.io Desktop editor showing its menus, shape palette, diagram canvas, and style panel with a Shared Electron 42 sample document open.',
      caption: 'draw.io Desktop 31.3.1-1sharedpair1 · electron-runtime-42 42.9.3 · Ubuntu 26.04 clean-container capture',
    },
  },
  {
    slug: 'marktext',
    ...appFacts('marktext'),
    name: 'MarkText',
    purpose: 'Visual Markdown editor',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Packaged without Electron; its packaged-mode adaptation preserves electron-log and its ABI 146 native modules.',
    test: 'A fresh-container test opens and renders a real Markdown document on Electron 42.',
    notes: ['Native modules remain in the application package.', 'Dependency bounds require Electron 42.9.3.', 'The test requires a rendered editor window and rejects main-process JavaScript errors.'],
    interfaceScreenshot: { src: '/images/applications/marktext/upstream-interface.png', alt: 'MarkText Markdown editor interface.', source: 'https://github.com/marktext/marktext/blob/develop/docs/assets/marktext.png' },
    screenshot: {
      src: '/images/applications/marktext/marktext-0.19.1-electron-42.9.3.png',
      alt: 'MarkText rendering a Shared Pair Markdown document with headings, emphasis, lists, and a block quotation.',
      caption: 'MarkText 0.19.1-1sharedpair1 · electron-runtime-42 42.9.3 · Ubuntu 26.04 clean-container capture',
    },
  },
  {
    slug: 'joplin',
    ...appFacts('joplin'),
    name: 'Joplin',
    purpose: 'Notes and knowledge management',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'prerelease',
    proof: 'The 3.7 prerelease package persists and reopens its SQLite profile.',
    test: 'Fresh-container profile creation, persistence, and reopen passed.',
    notes: ['This package follows Joplin’s 3.7 prerelease channel.', 'SQLite state survives a full close and reopen.', 'The app depends on Electron 42.9.3.'],
    interfaceScreenshot: { src: '/images/applications/joplin/upstream-interface.png', alt: 'Joplin desktop note-taking interface shown across desktop and mobile layouts.', source: 'https://github.com/laurent22/joplin/blob/dev/Assets/WebsiteAssets/images/home-top-img.png' },
  },
  {
    slug: 'teams-for-linux',
    ...appFacts('teams-for-linux'),
    name: 'Teams for Linux',
    purpose: 'Unofficial Microsoft Teams wrapper',
    state: 'tested',
    category: 'communication',
    releaseChannel: 'stable',
    proof: 'Initializes and reopens its profile through the shared runtime.',
    test: 'Fresh-container initialization and profile reopen passed.',
    notes: ['Unofficial and not affiliated with Microsoft.', 'The wrapper no longer carries its own Electron copy.', 'Persistent application state is exercised by the test.'],
    screenshot: {
      src: '/images/applications/teams-for-linux/teams-for-linux-2.18.1-electron-42.9.3.png',
      alt: 'Teams for Linux 2.18.1 running with a fresh profile under Electron 42.9.3.',
      caption: 'Teams for Linux 2.18.1-1sharedpair1 · electron-runtime-42 42.9.3 · Ubuntu 26.04 clean-container capture',
    },
  },
  {
    slug: 'jupyterlab-desktop',
    ...appFacts('jupyterlab-desktop'),
    name: 'JupyterLab Desktop',
    purpose: 'Desktop notebooks and data tools',
    state: 'tested',
    category: 'data-science',
    releaseChannel: 'stable',
    proof: 'Runs its private Jupyter environment and persists its desktop profile.',
    test: 'Jupyter server startup and desktop-profile persistence passed.',
    notes: ['The offline Python/Jupyter environment remains app-private.', 'Only the generic Electron runtime is shared.', 'Both server and desktop behavior are tested.'],
    interfaceScreenshot: { src: '/images/applications/jupyterlab-desktop/upstream-interface.png', alt: 'JupyterLab Desktop welcome page and session launcher.', source: 'https://github.com/jupyterlab/jupyterlab-desktop/blob/master/media/jupyterlab-desktop.png' },
  },
  {
    slug: 'netron',
    ...appFacts('netron'),
    name: 'Netron',
    purpose: 'Neural-network model viewer',
    state: 'tested',
    category: 'data-science',
    releaseChannel: 'stable',
    proof: 'Packaged as a plain app payload without Electron, Chromium, or its upstream self-updater.',
    test: 'An unprivileged user opened a model on Electron 44 in a fresh container.',
    notes: ['Exact runtime bounds require Electron 44 and reject Electron 45.', 'The upstream self-updater is removed in favor of package updates.', 'Model opening—not just process startup—is verified.'],
    interfaceScreenshot: { src: '/images/applications/netron/upstream-interface.png', alt: 'Netron displaying a neural-network model graph.', source: 'https://github.com/lutzroeder/netron/blob/main/.github/screenshot.png' },
  },
  {
    slug: 'trilium-notes',
    ...appFacts('trilium-notes'),
    name: 'Trilium Notes',
    purpose: 'Hierarchical notes and personal knowledge bases',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'candidate',
    proof: 'The pinned development snapshot is packaged as an application-only payload with its private SQLite module and no bundled Electron or Chromium.',
    test: 'A fresh unprivileged profile initialized a valid SQLite database and reopened successfully on Electron 44.',
    notes: ['This is an immutable candidate snapshot, not a stable upstream release.', 'The application retains its N-API better-sqlite3 module.', 'Exact dependency bounds require Electron 44 and reject Electron 45.', 'APT is the only package update path.'],
    interfaceScreenshot: { src: '/images/applications/trilium-notes/upstream-interface.png', alt: 'Trilium Notes interface with a hierarchical note tree, rich-text note, and navigation controls.', source: 'https://github.com/TriliumNext/Trilium/blob/main/docs/app.png' },
    screenshot: {
      src: '/images/applications/trilium-notes/trilium-notes-0.105.0-electron-44.0.0.png',
      alt: 'Trilium Notes running with its demo knowledge base, showing the note hierarchy, Journal calendar, navigation, and side panel.',
      caption: 'Trilium Notes 0.105.0~git20260831.d2df448d-1sharedpair1 · electron-runtime-44 44.0.0 · Ubuntu 26.04 clean-container capture',
    },
  },
  {
    slug: 'penpot-desktop',
    ...appFacts('penpot-desktop'),
    name: 'Penpot Desktop',
    purpose: 'Unofficial desktop client for hosted or self-hosted Penpot design workspaces',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Built from the immutable v0.24.0 source tag without Electron, Chromium, native modules, or an active self-updater.',
    test: 'A fresh Ubuntu 26.04 container verified package bounds and started the client unprivileged on Electron 44.',
    notes: [
      'This is an unofficial client and is not endorsed by the Penpot project.',
      'The default hosted experience needs network access; self-hosted instances remain separately managed.',
      'The optional Docker-based local-instance workflow is not exercised by the headless startup test.',
      'APT is the only application update path.',
    ],
    interfaceScreenshot: { src: '/images/applications/penpot-desktop/upstream-interface.png', alt: 'Penpot design canvas as packaged for the Flatpak store listing, showing the vector editing interface with layers panel and toolbars.', source: 'https://github.com/author-more/penpot-desktop/blob/main/build/flatpak/screenshots/penpot-1.png' },
  },
  {
    slug: 'effetune',
    ...appFacts('effetune'),
    name: 'EffeTune',
    purpose: 'Real-time audio effects and DSP processing',
    state: 'tested',
    category: 'media',
    releaseChannel: 'candidate',
    proof: 'Built from an immutable source snapshot without Electron or Chromium; the optional OpenHome helper is built from checksum-pinned source.',
    test: 'A fresh Ubuntu 26.04 container verified the native sidecar and launched the application unprivileged on Electron 44.',
    notes: [
      'This is a pinned candidate because upstream’s own version history still labels 2.7.0 TBD.',
      'The OpenHome sidecar passed its source-build test suite and dynamically uses Ubuntu’s libnl packages.',
      'Headless startup does not validate physical audio hardware, WebAssembly DSP output, or network discovery.',
      'APT is the only application update path.',
    ],
    interfaceScreenshot: { src: '/images/applications/effetune/upstream-interface.png', alt: "EffeTune's effect pipeline interface showing chained real-time audio effect modules with their controls.", source: 'https://github.com/Frieve-A/effetune/blob/main/images/screenshot.png' },
  },
  {
    slug: 'element-desktop',
    ...appFacts('element-desktop'),
    name: 'Element Desktop',
    purpose: 'Matrix messaging and collaboration client',
    state: 'tested',
    category: 'communication',
    releaseChannel: 'candidate',
    proof: 'Built from one immutable web-and-desktop monorepo snapshot as an application-only payload without Electron or Chromium.',
    test: 'A fresh Ubuntu 26.04 container rendered a visible Element window as an unprivileged user on Electron 44.',
    notes: [
      'This is a pinned development snapshot, not a stable upstream release.',
      'Optional matrix-seshat local encrypted-room indexing is intentionally omitted from this candidate.',
      'The test verifies startup and profile creation without requiring a Matrix account.',
      'The launcher disables upstream update activity; APT is the update authority.',
    ],
    interfaceScreenshot: { src: '/images/applications/element-desktop/upstream-interface.png', alt: 'Element desktop app rendering its welcome/login view, captured by the project\'s own Playwright launch test.', source: 'https://github.com/element-hq/element-desktop/blob/develop/playwright/snapshots/launch/launch.spec.ts/App-launch-should-launch-and-render-the-welcome-view-successfully-1-linux.png' },
  },
  {
    slug: 'poi',
    ...appFacts('poi'),
    name: 'poi',
    purpose: 'Browser and tool viewer for the Kantai Collection web game',
    state: 'tested',
    category: 'games',
    releaseChannel: 'candidate',
    proof: 'Built from the checksum-pinned v12.0.1 tag archive; the production graph is pure JavaScript with no .node module, and both electron-updater feed assignments are removed.',
    test: 'A fresh Ubuntu 26.04 container checked dependency bounds, sandbox mode, file ownership, and updater-feed removal, then started poi unprivileged on Electron 44 and required configuration state to be created.',
    notes: [
      'This is a pinned candidate snapshot; it is not presented as a stable upstream release.',
      'Upstream excludes the poi icon and SVG artwork from its MIT grant; the copyright file records that restriction.',
      'The application uses webviews with Node integration exactly as upstream designed it.',
      'Game availability, authentication, and plugin installation are outside the startup test.',
    ],
    interfaceScreenshot: { src: '/images/applications/poi/upstream-interface.png', alt: "Poi's main window showing the KanColle browser game overlay/toolbox interface (fleet and ship management panels).", source: 'https://user-images.githubusercontent.com/3816900/58731579-ae9fb480-8421-11e9-8a28-f7002f84c0ae.png' },
  },
  {
    slug: 'tuta-desktop',
    ...appFacts('tuta-desktop'),
    name: 'Tuta Desktop',
    purpose: 'Encrypted mail and calendar desktop client',
    state: 'tested',
    category: 'communication',
    releaseChannel: 'candidate',
    proof: 'Built from the pinned commit archive plus three independently checksummed gitlink sources, retaining the source-built SQLCipher and Rust mail-importer N-API modules and no updater metadata.',
    test: 'A fresh Ubuntu 26.04 container verified dependency bounds, file ownership, both x86-64 native modules, and absence of update metadata, then started Tuta unprivileged on Electron 44 and required per-user configuration to be created.',
    notes: [
      'Upstream’s tag name says 357.260824.2 while the tagged tree says 357.260827.0; the package uses the tree’s honest version.',
      'The two native modules use N-API, so they stay application-private while Electron is shared.',
      'Login, mailbox decryption, mail import, and calendar sync are not exercised by the startup test.',
      'Upstream’s custom-desktop-release mode ships no update feed; APT is the only update path.',
    ],
    interfaceScreenshot: { src: '/images/applications/tuta-desktop/upstream-interface.png', alt: "Tuta Mail's mobile app interface (Play Store listing screenshot) showing the mailbox/inbox view — the repository has no desktop-client screenshot.", source: 'https://github.com/tutao/tutanota/blob/master/app-android/app/src/main/play/listings/en-US/graphics/phone-screenshots/1.png' },
  },
  {
    slug: 'jbrowse-desktop',
    ...appFacts('jbrowse-desktop'),
    name: 'JBrowse Desktop',
    purpose: 'Genome browser for local and remote annotation tracks',
    state: 'tested',
    category: 'data-science',
    releaseChannel: 'prerelease',
    proof: 'Built from the checksum-pinned 5.0.0-beta.1 development commit with a frozen pnpm lockfile; the installed payload is architecture-neutral JavaScript with no .node or private shared library.',
    test: 'A fresh Ubuntu 26.04 container checked dependency bounds and ownership exclusions, then launched the start screen unprivileged on Electron 44 and required a live renderer and a created user-data directory.',
    notes: [
      'This is a development snapshot of the 5.0.0-beta.1 line, not a stable upstream release.',
      'Both the background and Help-menu update paths are patched to no-ops and the launcher enforces the suppression flag.',
      'The launcher sets an APT-package marker because app.isPackaged is false under a shared runtime.',
      'The official Node 24 toolchain is used as a build tool only and creates no runtime dependency.',
    ],
    interfaceScreenshot: { src: '/images/applications/jbrowse-desktop/upstream-interface.png', alt: 'The JBrowse Desktop start screen showing "Launch new session" and "Recently opened sessions" panels with favorite genomes and quickstart list.', source: 'https://jbrowse.org/jb2/img/desktop-landing.png' },
  },
  {
    slug: 'nerimity-desktop',
    ...appFacts('nerimity-desktop'),
    name: 'Nerimity Desktop',
    purpose: 'Desktop client for the Nerimity chat service',
    state: 'tested',
    category: 'communication',
    releaseChannel: 'stable',
    proof: 'Repacked from the checksum-verified official v2.3.2 Debian artifact; the upstream Electron executable and every Chromium file are discarded and the packaged updater window is patched out.',
    test: 'A fresh Ubuntu 26.04 container verified dependency bounds, native-module presence, and updater removal, then started Nerimity unprivileged on Electron 44 and required a live Electron process and created configuration.',
    notes: [
      'uiohook-napi and the active-window modules use N-API, so they remain application-private.',
      'X11 libraries needed by the global-hook binary are explicit package dependencies.',
      'The Windows-only loopback audio capture addon is removed; that path is unsupported on Linux.',
      'The exact tag ships no LICENSE file, so the copyright record supplies the declared ISC grant and documents the gap.',
    ],
  },
  {
    slug: 'opencomic',
    ...appFacts('opencomic'),
    name: 'OpenComic',
    purpose: 'Comic and manga reader for archives and PDFs',
    state: 'tested',
    category: 'books',
    releaseChannel: 'candidate',
    proof: 'Built from the checksum-pinned commit archive with lockfile-fixed npm inputs; sharp, node-zstd, libvips, and the 7-Zip helpers are retained byte-for-byte as application files.',
    test: 'A fresh Ubuntu 26.04 container verified ownership boundaries, native-module presence, and disabled update polling, then started OpenComic unprivileged on Electron 44 and required configuration state to be created.',
    notes: [
      'The commit is later than upstream tag v1.6.5, so the package uses a snapshot version rather than claiming a release.',
      'The native helpers use N-API rather than Electron’s V8 ABI; only the Linux amd64 glibc selection is retained.',
      'A patch disables the startup release poll and defaults release checking to false.',
      'Optional AI image helpers, archive, EPUB, and network-server workflows are outside the startup test.',
    ],
    interfaceScreenshot: { src: '/images/applications/opencomic/upstream-interface.png', alt: 'OpenComic\'s comic reader showing two overlapping app windows open to "Pepper & Carrot" comic pages with page thumbnails in a side panel.', source: 'https://github.com/ollm/OpenComic/blob/master/images/screenshots/main.png' },
  },
  {
    slug: 'min-browser',
    ...appFacts('min-browser'),
    name: 'Min',
    purpose: 'Minimal, privacy-focused web browser',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Repacked from the checksum-verified official Debian artifact into a 5.6 MiB application package, against roughly 310 MiB extracted upstream; no private Electron, sandbox, crash handler, .node module, or shared object survives.',
    test: 'A fresh Ubuntu 26.04 container verified ownership and dependency bounds, then started Min unprivileged on Electron 43 and required per-user configuration with no missing-module, native-ABI, or uncaught-exception diagnostics.',
    notes: [
      'Min configures no self-updater and sets its crash reporter to uploadToServer: false; APT owns updates.',
      'The shipped payload retains 58 licence and notice files, including Mozilla-derived components.',
      'Web compatibility, media codecs, and password-manager integration are outside the startup test.',
      'The source tree publishes no npm lockfile, so the official artifact is checksum-verified rather than rebuilt.',
    ],
    interfaceScreenshot: { src: '/images/applications/min-browser/upstream-interface.png', alt: "Min browser's address/search bar showing inline DuckDuckGo instant-answer results, from the official screenshots section of the README.", source: 'https://minbrowser.org/tour/img/searchbar_duckduckgo_answers.png' },
  },
  {
    slug: 'leafview',
    ...appFacts('leafview'),
    name: 'LeafView',
    purpose: 'Minimal image viewer with pan and zoom',
    state: 'tested',
    category: 'media',
    releaseChannel: 'stable',
    proof: 'Repacked from the official v4.4.2 Debian artifact at its attested SHA-256; the ASAR contains no .node addon, and app-update.yml plus the startup update check are removed.',
    test: 'A fresh Ubuntu 26.04 container generated a known 2×2 PNG and opened it through LeafView as an unprivileged user on Electron 44, requiring a live renderer and rejecting updater, native-ABI, and uncaught-exception diagnostics.',
    notes: [
      'Images are decoded by Chromium and Leaflet; the package ships no private decoder library.',
      'The desktop entry associates BMP, GIF, PNG, JPEG, WebP, SVG, and ICO and passes files through %U.',
      'The test covers deterministic PNG startup, not animation, colour management, or printing.',
      'APT is the only update path.',
    ],
    interfaceScreenshot: { src: '/images/applications/leafview/upstream-interface.png', alt: "Screenshot of LeafView's image viewer window showing a photo with pan/zoom controls.", source: 'https://github.com/sprout2000/leafview/assets/52094761/138f527e-14f8-45f3-b310-2c0c82b5dada' },
  },
  {
    slug: 'ebtcalc',
    ...appFacts('ebtcalc'),
    name: 'EBTCalc',
    purpose: 'Programmable reverse Polish notation calculator',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'candidate',
    proof: 'Built from a checksum-pinned commit archive; the production payload carries no .node addon or shared library, and the npm Electron peer stub is removed.',
    test: 'A fresh Ubuntu 26.04 container drove the real rendered calculator through Chromium’s debugging protocol and verified sqrt(3² + 4²) = 5 on Electron 44.',
    notes: [
      'The active repository has no tag or release, so the package pins a commit and uses a snapshot version.',
      'A single test-tree file is retained deliberately because production serialization code imports it.',
      'There is no electron-updater; the optional upstream version check only presents download information.',
      'Arbitrary-precision arithmetic, custom JavaScript buttons, and graphing beyond the fixed workflow are untested.',
    ],
    interfaceScreenshot: { src: '/images/applications/ebtcalc/upstream-interface.png', alt: 'EBTCalc main window showing the calculator interface with expense/budget calculation fields.', source: 'https://www.ericbt.com/uploaded_images/ebtcalc_github.png' },
  },
  {
    slug: 'fluent-reader',
    ...appFacts('fluent-reader'),
    name: 'Fluent Reader',
    purpose: 'Local-first RSS, Atom, and JSON Feed reader',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Built from the checksum-pinned v1.2.2 tag archive; the webpack output contains no .node addon, shared library, Chromium resource, or updater metadata.',
    test: 'A fresh Ubuntu 26.04 container imported an OPML subscription from a loopback-only RSS fixture, read the rendered article back, and re-exported OPML with the fixture name and URL intact on Electron 44.',
    notes: [
      'Feeds and articles are stored through Lovefield in Chromium’s IndexedDB, not a native SQLite binding.',
      'Test hooks bypass only the native file chooser; the real file, parser, Redux, and database paths run.',
      'No account is required for local feeds; Fever, Feedbin, Miniflux, and Nextcloud News integrations are optional and untested.',
      'The source contains no self-installing updater, so APT owns installed files.',
    ],
    interfaceScreenshot: { src: '/images/applications/fluent-reader/upstream-interface.jpg', alt: 'Fluent Reader desktop RSS reader showing the three-pane layout with feed list, article list, and reading pane in its Fluent Design-inspired UI.', source: 'https://github.com/yang991178/fluent-reader/blob/master/docs/imgs/screenshot.jpg' },
  },
  {
    slug: 'github-desktop-linux',
    ...appFacts('github-desktop-linux'),
    name: 'GitHub Desktop (community Linux build)',
    purpose: 'Graphical Git client for local and hosted repositories',
    state: 'tested',
    category: 'development',
    releaseChannel: 'stable',
    proof: 'Repacked from the shiftkey/desktop 3.4.13-linux1 Debian artifact at its published SHA-256; the bundled Electron 32 tree is discarded while Git 2.45.3, Git LFS, and Git Credential Manager 2.6.1 are retained as application tools.',
    test: 'A fresh Ubuntu 26.04 container created a real local repository with one commit and one uncommitted line, completed the account-free welcome and identity screens, added the repository, and verified its name, changed file, and added content rendered on Electron 44.',
    notes: [
      'This is the community Linux fork, not GitHub’s own Windows or macOS release, and no affiliation is claimed.',
      'The MIT grant excludes GitHub trademark rights, so a neutral icon replaces upstream logo artwork.',
      'keytar-forked, fs-admin-forked, and desktop-notifications use N-API rather than an Electron-major ABI.',
      'Clone, publish, pull-request, and issue workflows need a service account and are outside the account-free test.',
    ],
    interfaceScreenshot: { src: '/images/applications/github-desktop-linux/upstream-interface.png', alt: 'GitHub Desktop application window showing a diff of changes being viewed and committed with two attributed co-authors.', source: 'https://user-images.githubusercontent.com/634063/202742985-bb3b3b94-8aca-404a-8d8a-fd6a6f030672.png' },
  },
  {
    slug: 'electorrent',
    ...appFacts('electorrent'),
    name: 'Electorrent',
    purpose: 'Remote control interface for torrent daemons',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Repacked from the official v2.16.0 Debian asset at its publisher-supplied SHA-256; the private Electron and Chromium tree is discarded and the updater entry point is replaced with a local up-to-date response.',
    test: 'A fresh Ubuntu 26.04 container started Electorrent with upstream’s own in-process mock client, completed the connection form without credentials, inserted a synthetic transfer through the real preload/IPC boundary, and required exactly one matching row in the torrent table on Electron 42.',
    notes: [
      'Electorrent is a client, not a torrent engine; it needs a separately operated qBittorrent, Transmission, Deluge, rTorrent, uTorrent, or aria2 service.',
      'Upstream’s Linux updater would download and launch a replacement AppImage; that path is removed.',
      'No tracker, swarm, external account, or remote torrent service is used by the test.',
      'The retained 55 MiB ASAR contains no .node addon or application-owned shared library.',
    ],
    interfaceScreenshot: { src: '/images/applications/electorrent/upstream-interface.png', alt: 'Electorrent torrent client main window (Windows build) showing the torrent list and details panel.', source: 'https://github.com/tympanix/Electorrent/blob/master/assets/screen0-win.png' },
  },
  {
    slug: 'weltenschaft',
    ...appFacts('weltenschaft'),
    name: 'Weltenschaft',
    purpose: 'Offline procedural terrain and world generator',
    state: 'tested',
    category: 'media',
    releaseChannel: 'candidate',
    proof: 'Built from a checksum-pinned commit archive with a locked three-module production graph; a patch moves mutable preferences from the read-only install tree into Electron’s per-user data directory.',
    test: 'A fresh Ubuntu 26.04 container fixed the seed at 0.4242, generated a 64×64 world through the real renderer, switched draw modes, asserted a non-empty canvas, and validated the exported world object’s seed and both maps on Electron 44.',
    notes: [
      'Upstream has no stable 0.4.3 release, so the package pins the branch commit and uses a snapshot version.',
      'The same run proves settings land under the test user’s XDG hierarchy and not in /usr/lib.',
      'Both halves of the preferences patch are asserted at build time after an earlier partial application went undetected.',
      'There is no updater, crash reporter, account, or required service.',
    ],
    interfaceScreenshot: { src: '/images/applications/weltenschaft/upstream-interface.png', alt: "Screenshot of Weltenschaft's terrain generator UI showing a rendered biome-colored world map alongside generation controls.", source: 'https://github.com/HoubkneghteS/Weltenschaft/blob/master/assets/Screenshots/Screenshot1.png' },
  },
  {
    slug: 'git-it',
    ...appFacts('git-it'),
    name: 'Git-it',
    purpose: 'Interactive Git and GitHub tutorial',
    state: 'tested',
    category: 'development',
    releaseChannel: 'stable',
    proof: 'Built from the checksum-pinned v6.0.1 release tarball of the maintained Git-it-App continuation; the tree carries no .node addon and no updater of any kind, and the .deb rebuilds to an identical SHA-256.',
    test: 'A fresh Ubuntu 26.04 container performed the learner’s side of the first three challenges for real, then drove the rendered UI and required all eight verification checks to pass with no credentials and no GitHub account on Electron 44.',
    notes: [
      'Five of the eleven challenges are entirely local; the test asserts their verifiers contain no HTTP client or URL.',
      'Git is not vendored — the package depends on the distribution’s git, which the challenge verifiers shell out to.',
      'Two challenges depend on reporobot.jlord.us, which returned HTTP 500 on 2026-09-02; that is an upstream tutorial property.',
      'A packaging adaptation anchors the translation bundles to the installed tree; the test proves it by switching the UI to German.',
    ],
    interfaceScreenshot: { src: '/images/applications/git-it/upstream-interface.png', alt: 'Screenshot of the Git-it Electron app showing its lesson list and instructions panel for learning Git/GitHub.', source: 'https://github.com/Git-it-App/git-it-electron/blob/master/assets/screenshots/app.png' },
  },
  {
    slug: 'mattermost-desktop',
    ...appFacts('mattermost-desktop'),
    name: 'Mattermost Desktop',
    purpose: 'Official desktop client for Mattermost collaboration servers',
    state: 'tested',
    category: 'communication',
    releaseChannel: 'stable',
    proof: 'Repacked unpatched from the official v6.3.0 Debian asset at its verified SHA-256; the private Electron and Chromium tree is discarded and exactly one native object — the Node-API Koffi addon — ships.',
    test: 'A fresh Ubuntu 26.04 container asserted an empty first-run server list and upstream defaults, changed four real preferences through the app’s own configuration path, verified they reached config.json on disk, restarted, and confirmed every value survived on Electron 43.',
    notes: [
      'Electron 44 was probed first and rejected on concrete behaviour: it removes app.isUnityRunning, which this release calls on Linux.',
      'Five Linux ELF objects belonging to darwin- and win32-only modules are dropped, but their JavaScript wrappers are kept because Electron serves an unpacked module’s whole directory.',
      'enableSentry and enableMetrics are upstream defaults and are documented rather than silently patched out; the test demonstrates the user control.',
      'Server connection, messaging, and notification delivery are deliberately not exercised.',
    ],
    interfaceScreenshot: { src: '/images/applications/mattermost-desktop/upstream-interface.png', alt: "Screenshot of the Mattermost Desktop client showing the channel sidebar and a message thread, embedded directly in the repo's README.", source: 'https://user-images.githubusercontent.com/52460000/146078917-e1ba8c1f-24e5-4613-8b4b-f3507422f4f2.png' },
  },
  {
    slug: 'blockbench',
    ...appFacts('blockbench'),
    name: 'Blockbench',
    purpose: 'Low-poly 3D model editor and animation tool',
    state: 'tested',
    category: 'media',
    releaseChannel: 'stable',
    proof: 'Rebuilt from the checksum-pinned v5.1.6 source rather than upstream’s Electron-bearing artifacts, producing a 6.9 MB package with a 30 MB footprint against a 100 MB upstream .deb; the tree holds no .node addon, shared object, or WebAssembly payload.',
    test: 'A fresh Ubuntu 26.04 container blackholed every Blockbench service host, built a two-cube project through the real toolbar actions, exported OBJ deterministically with 16 vertices, 12 faces, and 2 objects, and round-tripped the saved .bbmodel back through the app’s own parser on Electron 44.',
    notes: [
      'The electron-updater import and update block are patched out, and the build asserts no autoUpdater reference survives.',
      'The optional electron-color-picker helper is guarded rather than shipped — upstream uninstalls it before its own Linux builds.',
      'Third-party notices are harvested mechanically from esbuild’s metafile; the build fails if fewer than 30 packages are found.',
      'Upstream’s plugin store and anonymised install counters remain available and are documented rather than patched out.',
    ],
    interfaceScreenshot: { src: '/images/applications/blockbench/upstream-interface.png', alt: "Screenshot of Blockbench's model editor showing the 3D viewport, outliner, and texture/UV panels.", source: 'https://github.com/JannisX11/blockbench/blob/master/content/front_page_app.png' },
  },
  {
    slug: 'balena-etcher',
    ...appFacts('balena-etcher'),
    name: 'balenaEtcher',
    purpose: 'Writes and verifies OS images to USB and SD storage',
    state: 'tested',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Repacked from the official v2.1.6 Debian artifact at its verified SHA-256; the private Electron and Chromium payload is removed while the upstream etcher-util Node 20 sidecar and two N-API renderer addons are retained unrewritten.',
    test: 'A disposable QEMU/KVM virtual machine with a throwaway file-backed USB disk ran the real packaged GUI end to end: it flashed and verified through the pkexec-elevated sidecar, reported Flash Completed!, and an independent host-side SHA-256 comparison matched on two clean runs.',
    notes: [
      'The boot disk was present but correctly marked a system drive and never selectable as a target.',
      'A container-only test was rejected as insufficient: the SDK write path needs a genuine block device, and Docker shares the host device namespace.',
      'VM testing surfaced two real packaging gaps — the polkit dependency had to become pkexec | policykit-1, and the Docker test needed librsvg2-common.',
      'The embedded electron-updater is inert for a Debian install; APT owns updates.',
    ],
    interfaceScreenshot: { src: '/images/applications/balena-etcher/upstream-interface.png', alt: 'Screenshot of an early balenaEtcher (then resin-io/etcher) release showing the drive-selection and flash-progress UI.', source: 'https://github.com/balena-io/etcher/blob/v1.0.0/screenshot.png' },
  },
  {
    slug: 'exifcleaner',
    ...appFacts('exifcleaner'),
    name: 'ExifCleaner',
    purpose: 'Removes metadata from images, media, and PDF documents',
    state: 'tested',
    category: 'media',
    releaseChannel: 'stable',
    proof: 'Application-only package retaining the bundled ExifTool distribution; no private Electron executable and no app-update.yml remain, and the launcher execs the shared runtime against app.asar.',
    test: 'A fresh Ubuntu 26.04 container wrote an Artist tag to a PNG with the bundled ExifTool, read it back, stripped all metadata, confirmed the tag was gone, then started ExifCleaner unprivileged on Electron 43 with no missing-module or native-ABI diagnostics.',
    notes: [
      'Metadata handling is performed by the bundled ExifTool at /usr/lib/exifcleaner/nix/bin/exiftool.',
      'Dependency bounds require electron-runtime-43 (>= 43.4.1) and (<< 44).',
      'The package depends on the distribution’s perl for ExifTool.',
      'APT is the only application update path.',
    ],
    interfaceScreenshot: { src: '/images/applications/exifcleaner/upstream-interface.png', alt: "ExifCleaner's interface showing a batch of images, videos, and PDFs queued for metadata cleaning.", source: 'https://github.com/szTheory/exifcleaner/blob/master/static/screenshot.png' },
  },
  {
    slug: 'zulip-desktop',
    ...appFacts('zulip-desktop'),
    name: 'Zulip Desktop',
    purpose: 'Desktop client for Zulip team chat organizations',
    state: 'tested',
    category: 'communication',
    releaseChannel: 'stable',
    proof: 'Repacked from the official v5.12.4 Debian asset at its matching GitHub digest; only app.asar, desktop integration, and the upstream icon are retained, and the electron-builder app-update.yml is excluded.',
    test: 'A fresh Ubuntu 26.04 container queried Chromium’s debugging target to prove the bundled first-run organization picker loaded, verified the writable profile hierarchy and canonical icon, and confirmed continued process health on Electron 42.',
    notes: [
      'The archive carries no unpacked native Node addon.',
      'The account-free boundary is the local organization picker; chat requires a Zulip server account.',
      'Upstream initializes Sentry error reporting, so this package does not claim to be telemetry-free.',
      'Upstream’s first-run logger emits harmless rejected-read diagnostics while creating absent log files; the test records rather than hides them.',
    ],
    interfaceScreenshot: { src: '/images/applications/zulip-desktop/upstream-interface.webp', alt: "Zulip Desktop's light-theme interface showing the chat/streams layout of the client.", source: 'https://github.com/zulip/zulip-desktop/blob/main/docs/images/zulip-desktop-screenshot-light.webp' },
  },
  {
    slug: 'recode-converter',
    ...appFacts('recode-converter'),
    name: 'Recode Converter',
    purpose: 'Batch video and audio transcoding front end',
    state: 'tested',
    category: 'media',
    releaseChannel: 'stable',
    proof: 'Extracted from the checksum-pinned v2.1.1 AppImage; the 68 MiB FFmpeg and 79 MiB FFprobe payloads are replaced with symlinks to Ubuntu’s ffmpeg package, leaving no ELF executable or shared library in the application tree.',
    test: 'A fresh Ubuntu 26.04 container followed the application’s resolved FFmpeg symlinks to create a one-second video, copy its video stream, transcode PCM audio to FLAC, preserve deterministic metadata, inspect both codecs, and compare a frame-level digest on Electron 42.',
    notes: [
      'The package preserves upstream’s installer-module path contract while owning no duplicate codec binaries.',
      'There is no electron-updater; a renderer component may show a link-only availability dialog.',
      'Aptabase telemetry is initialized by upstream, so this package is not presented as telemetry-free.',
      'Dependency bounds require electron-runtime-42 (>= 42.9.3) and (<< 43).',
    ],
    interfaceScreenshot: { src: '/images/applications/recode-converter/upstream-interface.png', alt: "Recode Converter's dark-mode interface showing the audio codec conversion UI for video files.", source: 'https://github.com/murgatt/recode-converter/blob/main/public/app-dark.png' },
  },
];

export const blockedApplications: AppRecord[] = [
  {
    slug: 'audex-player',
    ...appFacts('audex-player'),
    name: 'Audex Player',
    purpose: 'Media player and downloader',
    state: 'blocked',
    category: 'media',
    releaseChannel: 'stable',
    proof: 'The package builds and its media/profile test passes, but it is not cleared for publication.',
    test: 'Media helpers and persistent GUI profile passed on shared Electron 42.',
    notes: ['Publication is blocked pending redistribution review.', 'The concern is its bundled Chrome/Widevine payload.', 'A successful build does not override redistribution requirements.'],
    interfaceScreenshot: { src: '/images/applications/audex-player/upstream-interface.png', alt: 'Audex Player dark-theme music library interface.', source: 'https://github.com/MishaSok/audex-player/blob/main/docs/screenshots/library-dark.png' },
  },
  {
    slug: 'thorium-reader',
    name: 'Thorium Reader',
    purpose: 'Accessible EPUB, PDF, DAISY, and audiobook reader',
    version: '3.4.0',
    electron: '41.1.1 → 42.9.3 attempted',
    runtime: 'electron-runtime-42',
    state: 'blocked',
    category: 'books',
    releaseChannel: 'stable',
    proof: 'The UI starts on Electron 42, but the externally injected LCP module is ABI 145 and the shared runtime requires ABI 146.',
    test: 'Ubuntu 26.04 container startup passed; direct LCP module loading failed deterministically with NODE_MODULE_VERSION 145 versus 146.',
    notes: [
      'The exact v3.4.0 tag does not contain the LCP module source or a reproducible build recipe.',
      'Publishing without the plugin would silently remove protected EPUB, PDF, and audiobook support.',
      'Reconsider when upstream publishes a compatible or reproducibly rebuildable plugin.',
      'Official amd64 Debian artifact SHA-256: 9920e2d1bd61ffb17f12b7002abf76208bca30caed683bc2dcde0d25329fa550.',
    ],
    interfaceScreenshot: { src: '/images/applications/thorium-reader/upstream-interface.png', alt: "Thorium Reader's reader view showing an open EPUB with reading controls, as embedded in the project README.", source: 'https://github.com/edrlab/thorium-reader/blob/master/img/reader.png' },
    archiveMiB: 104.5,
    installedMiB: 368.7,
  },
  {
    slug: 'quba-viewer',
    ...appFacts('quba-viewer'),
    name: 'Quba E-Invoice Viewer',
    purpose: 'Viewer for CII, UBL, ZUGFeRD, and Factur-X electronic invoices',
    state: 'blocked',
    category: 'productivity',
    releaseChannel: 'stable',
    proof: 'Built from checksum-pinned v1.5.1 source with no native modules and the electron-updater wiring patched out, but its entire rendering engine is Saxonica’s closed-source, binary-only saxon-js.',
    test: 'A fresh Ubuntu 26.04 container drove the packaged payload on Electron 44 and rendered a synthetic CII invoice completely, recovering its invoice number, parties, currency, and computed 400,00 net / 76,00 VAT / 476,00 gross totals.',
    notes: [
      'Held: saxon-js 2.4.0 is a 2.5 MB obfuscated blob under the Saxonica Public License, not a free-software licence.',
      'Its clause 2 forbids reverse engineering, so there is no preferred form for modification to place in the Debian source package.',
      'Its clause 4 bars copying the software to a site whose primary purpose is making it available to third parties — arguable for a public APT repository in both directions.',
      'The compiled .sef.json stylesheets only Saxon can execute, so a free XSLT processor would be a rewrite of the rendering core, not a port.',
      'Revisit if upstream drops Saxon-JS, Saxonica relicenses or grants written permission, or the project owner rules that a proprietary component may ship.',
    ],
    interfaceScreenshot: { src: '/images/applications/quba-viewer/upstream-interface.png', alt: 'The QUBA E-Rechnungsviewer app window showing its empty state with menu bar and instructions to open XML/PDF invoice files.', source: 'https://github.com/ZUGFeRD/quba-viewer/blob/master/000resources/screenshots/Screenshot%202022-08-01%20173610.png' },
  },
  {
    slug: 'tabby-terminal',
    name: 'Tabby Terminal',
    purpose: 'Terminal emulator with SSH, serial, and local shell backends',
    version: '1.0.235',
    electron: '38 required; 42–44 unsupported',
    runtime: 'none',
    state: 'blocked',
    category: 'development',
    releaseChannel: 'stable',
    proof: 'The MIT licence permits redistribution and the official payload separates app.asar, its unpacked tree, and twelve builtin plugins from the private Electron cleanly — but the local-shell backend imports node-pty, whose shipped addons are fixed-ABI linux-x64-139 builds.',
    test: 'No package was built and no acceptance test was run: a terminal emulator needs a real local PTY running a deterministic command, and that cannot pass with the audited artifact on any supported shared runtime.',
    notes: [
      'Parked: the tagged source declares Electron 38, whose Node module ABI is 139; the supported shared runtimes are 42 through 44.',
      'node-pty, fontmanager-redux, native-process-working-directory, serialport bindings, and glasstron all ship as fixed-ABI addons.',
      'Copying the ABI-139 files would defer the failure to terminal creation; deleting them would guarantee it.',
      'Rebuilding the addons for Electron 44 would produce a materially different, untested build across the main process, preload, plugins, SSH, serial, and shell-integration contracts.',
      'Revisit when a stable Tabby release moves to a supported shared Electron major, or upstream documents and tests one.',
    ],
    interfaceScreenshot: { src: '/images/applications/tabby-terminal/upstream-interface.png', alt: 'Tabby terminal split-pane view showing a shell session, an editor (nano), and system monitor widgets (CPU, memory, process list) in one window.', source: 'https://github.com/Eugeny/tabby/blob/master/docs/readme-terminal.png' },
  },
  {
    slug: 'colorpicker',
    name: 'Colorpicker',
    purpose: 'Screen colour picker with shading tools and a saved colour book',
    version: '2.3.0',
    electron: '44.0.0 probed',
    runtime: 'none',
    state: 'blocked',
    category: 'media',
    releaseChannel: 'stable',
    proof: 'Upstream’s pinned RobotJS fork rebuilds reproducibly for Electron 44 with a one-line C23 include fix and sampled three painted colours exactly under Xvfb, so the native module is not the obstacle.',
    test: 'On Electron 44 the colour workspace passed: a typed hex value propagated to the RGB fields and persisted to the on-disk colorsbook. The eyedropper half could not pass, so no package, launcher, or acceptance test was created.',
    notes: [
      'Parked: the Linux eyedropper needs a second native module that upstream’s own Linux release does not contain and that is bound to Electron 38’s ABI.',
      'Underneath it, RobotJS calls XGetImage on the root window, which returns BadMatch under rootless Xwayland and terminates the process — the default session on Ubuntu 26.04.',
      'Making it work would mean routing colour picking through the XDG desktop portal, which is upstream functionality that does not exist in any release.',
      'A licensing question is also unresolved: the fork vendors snprintf.c under the Frontier Artistic License alongside its MIT declaration.',
      'Revisit when upstream ships a Linux release whose eyedropper functions on Wayland; the RobotJS half of the problem is already solved.',
    ],
    interfaceScreenshot: { src: '/images/applications/colorpicker/upstream-interface.png', alt: "The Colorpicker Electron app's color picker/eyedropper interface.", source: 'https://github.com/Toinane/colorpicker/blob/master/.github/screenshots/colorpicker.png' },
  },
];

export const runtimes = ['electron-runtime-42', 'electron-runtime-43', 'electron-runtime-44'].map((packageName) => {
  const fact = generated.packages[packageName];
  const major = Number(packageName.split('-').at(-1));
  return { major, version: fact.version.split('-')[0], packageName, packageVersion: fact.version, archiveMiB: fact.archiveMiB, installedMiB: fact.installedMiB, lower: fact.version.split('-')[0], upper: String(major + 1) };
});

export const sizeAccounting = {
  ...generated.accounting,
  losslesscutMonolithicArchiveMiB: generated.monolithicComparisons.losslesscut.archiveMiB,
  losslesscutSplitAppArchiveMiB: generated.packages.losslesscut.archiveMiB,
  measured: displayDate,
} as const;

export const registryStatus = {
  suite: generated.suite,
  architecture: generated.architecture,
  signingFingerprint: generated.signingFingerprint,
  generatedAt: displayDate,
  discoveredNotEnrolled: generated.discoveredNotEnrolled,
  unresolvedStatusPackages: generated.unresolvedStatusPackages,
};

export interface ReportRecord {
  index: string;
  slug: string;
  title: string;
  detail: string;
  state: string;
  updated: string;
  conclusion: string;
  sections: { title: string; paragraphs: string[]; points?: string[] }[];
}

export const reports: ReportRecord[] = [
  {
    index: 'R–01',
    slug: 'package-boundary',
    title: 'What belongs where',
    detail: 'Which files belong to the runtime, which stay with each app, and why.',
    state: 'Architecture',
    updated: '31 Aug 2026',
    conclusion: 'Share the generic Electron distribution. Keep application identity, code, native modules, private helpers, and mutable state with the application.',
    sections: [
      { title: 'The shared side', paragraphs: ['A versioned runtime package owns Electron, Chromium, common locales and resources, and the setuid sandbox for one Electron major. Electron 42 and Electron 44 install beside one another rather than competing for a single global executable.'], points: ['One immutable path per runtime major.', 'One sandbox owned and permissioned by the runtime package.', 'Applications declare bounded dependencies on the runtime they passed against.'] },
      { title: 'The private side', paragraphs: ['Application resources remain app-owned. That includes ASAR content, desktop files, icons, native Node modules, product-specific helpers, and components whose redistribution or update policy differs from Electron itself.'], points: ['LosslessCut retains its private FFmpeg.', 'MarkText retains ABI-specific native modules.', 'JupyterLab Desktop retains its offline Python and Jupyter environment.', 'Audex remains held because sharing Electron does not settle Chrome or Widevine redistribution.'] },
      { title: 'Why the line matters', paragraphs: ['A smaller package is not enough. The boundary must preserve application behavior, make ownership inspectable, and allow a runtime security update without silently replacing app-private components. When an application requires a new Electron major, it moves only after its own test passes.'] },
    ],
  },
  {
    index: 'R–02',
    slug: 'reproducible-builds',
    title: 'Can we build it twice?',
    detail: 'Pinned builders, frozen inputs, matching outputs, SBOMs, and provenance.',
    state: 'Build method',
    updated: '31 Aug 2026',
    conclusion: 'The current packages are repeatable build inputs with clean-container behavioral tests; bit-for-bit reproduction, published SBOMs, and signed provenance remain release requirements rather than completed claims.',
    sections: [
      { title: 'What is already controlled', paragraphs: ['Package versions and runtime dependency bounds are explicit. The test suite installs local Debian artifacts into fresh Ubuntu 26.04 containers and exercises application behavior as an unprivileged user.'], points: ['Electron 42.9.3 and 44.0.0 are separate, co-installable artifacts.', 'Every listed application names the runtime major it was tested against.', 'Tests inspect package contents as well as launching or exercising the application.'] },
      { title: 'What the tests prove', paragraphs: ['Behavioral tests establish that the split packages install and perform named operations. Examples include draw.io export, Joplin profile persistence, Jupyter server startup, and Netron model opening. They do not by themselves prove that two independent builders produced identical bytes.'] },
      { title: 'Publication requirements', paragraphs: ['Repository promotion should carry enough material to trace a package back to its inputs and builder. These items remain part of the release checklist.'], points: ['Record and publish source and input hashes.', 'Generate an SBOM for each runtime and application package.', 'Publish builder identity and signed provenance.', 'Attempt an independent rebuild and report whether outputs match.', 'Preserve test results with the exact package versions they describe.'] },
    ],
  },
  {
    index: 'R–03',
    slug: 'runtime-maintenance',
    title: 'One runtime, one responsibility',
    detail: 'Fast patches, app-wide testing, rollback, and a clear end to old runtime lines.',
    state: 'Security',
    updated: '31 Aug 2026',
    conclusion: 'Runtime sharing reduces duplicated Chromium copies only if each runtime line has an owner, bounded dependants, a full retest path, a rollback package, and an explicit retirement rule.',
    sections: [
      { title: 'Patch once, test broadly', paragraphs: ['A runtime update changes a dependency shared by several applications. The unit of security work is therefore the runtime plus every package bound to that line—not the runtime artifact alone.'], points: ['Track upstream Electron and Chromium fixes.', 'Rebuild the runtime without changing its major-version path.', 'Run the complete dependent-application test set.', 'Publish failures and holds alongside passes.'] },
      { title: 'Keep rollback possible', paragraphs: ['Repository metadata and the previous known-good runtime must remain recoverable during promotion. An application should not be forced onto an untested Electron major merely because a newer runtime exists. Exact lower and upper dependency bounds make that constraint visible to APT.'] },
      { title: 'Retire, do not accumulate', paragraphs: ['Co-installable majors are a compatibility tool, not permission to preserve obsolete Chromium indefinitely. A runtime line leaves when its applications have moved to a supported line or when it can no longer be maintained safely. Packages that cannot move must be reported honestly and may need removal.'] },
    ],
  },
];

export const progress = [
  { date: '2026-08-31', displayDate: 'Next', state: 'next', entry: 'Publish the signed APT repository and verify a clean installation from apt.sharedpair.dev.' },
  { date: '2026-08-31', displayDate: '31 Aug 2026', state: 'shipped', entry: 'Trilium Notes passed SQLite profile creation, integrity, and reopen tests on Electron 44.' },
  { date: '2026-08-31', displayDate: '31 Aug 2026', state: 'shipped', entry: 'Netron passed model-opening tests on the new Electron 44 runtime.' },
  { date: '2026-08-31', displayDate: '31 Aug 2026', state: 'shipped', entry: 'Electron 42 and 44 were verified side by side.' },
  { date: '2026-08-30', displayDate: '30 Aug 2026', state: 'shipped', entry: 'The first seven applications were split from their bundled Electron runtimes.' },
] as const;

export const sections = {
  security: {
    eyebrow: 'Security',
    title: 'One runtime. One clear responsibility.',
    intro: 'Sharing a browser runtime is worthwhile only if updates become faster and easier to inspect. Security work belongs in public view, not in the footer.',
    blocks: [
      ['Before release', 'Name primary and backup maintainers, open a private reporting channel, set patch deadlines, and test emergency rollback.'],
      ['With every package', 'Publish input hashes, the builder identity, SBOM, provenance, test results, and signed repository metadata.'],
      ['When something breaks', 'Publish advisories separately from routine news and preserve the history even when a package must be pulled.'],
    ],
  },
  about: {
    eyebrow: 'About',
    title: 'A shared pair, not another bundle.',
    intro: 'Shared Pair is building versioned Electron runtimes and compatible Linux desktop packages. It is an independent project, not part of Electron, OpenJS, Debian, or Ubuntu.',
    blocks: [
      ['The name', 'A covalent bond concentrates electron density between centres through electron sharing. The 2c–2e motif gives the project its shared-pair language.'],
      ['Start small', 'Begin with Debian-family packages, one supported runtime line, and a few applications we can test properly.'],
      ['More than smaller downloads', 'The project should also make updates more consistent, test results easier to inspect, and security fixes faster to ship.'],
    ],
  },
} as const;
