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
  category: 'media' | 'productivity' | 'communication' | 'data-science';
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
  archiveMiB: number;
  installedMiB: number;
}

export const projectStatus = {
  Status: 'Built · awaiting publication',
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
      caption: 'draw.io Desktop 31.3.1-1foundry1 · electron-runtime-42 42.9.3 · Ubuntu 26.04 clean-container capture',
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
      caption: 'MarkText 0.19.1-1foundry2 · electron-runtime-42 42.9.3 · Ubuntu 26.04 clean-container capture',
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
      caption: 'Teams for Linux 2.18.1-1foundry1 · electron-runtime-42 42.9.3 · Ubuntu 26.04 clean-container capture',
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
      caption: 'Trilium Notes 0.105.0~git20260831.d2df448d-1foundry1 · electron-runtime-44 44.0.0 · Ubuntu 26.04 clean-container capture',
    },
  },
];

export const blockedApplications: AppRecord[] = [{
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
}];

export const runtimes = ['electron-runtime-42', 'electron-runtime-44'].map((packageName) => {
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
