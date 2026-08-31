#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [inputArg, outputArg = inputArg] = process.argv.slice(2);
if (!inputArg) {
  console.error('Usage: audit-application-candidates.mjs <enriched-candidates.json> [output.json]');
  process.exit(2);
}

const data = JSON.parse(readFileSync(resolve(inputArg), 'utf8'));
const inactiveBefore = new Date('2024-09-01T00:00:00Z');
const permissiveOrCopyleft = new Set([
  '0BSD', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'BSL-1.0', 'CC0-1.0',
  'EPL-1.0', 'EPL-2.0', 'GPL-2.0', 'GPL-2.0-only', 'GPL-2.0-or-later',
  'GPL-3.0', 'GPL-3.0-only', 'GPL-3.0-or-later', 'ISC', 'LGPL-2.1',
  'LGPL-2.1-only', 'LGPL-2.1-or-later', 'LGPL-3.0', 'LGPL-3.0-only',
  'LGPL-3.0-or-later', 'MIT', 'MPL-2.0', 'Unlicense',
]);

function electronDeclaration(packageText) {
  if (!packageText) return null;
  try {
    const pkg = JSON.parse(packageText);
    const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    for (const section of sections) if (pkg[section]?.electron) return String(pkg[section].electron);
    return null;
  } catch {
    return null;
  }
}

function electronMajor(declaration) {
  if (!declaration) return null;
  const match = declaration.match(/(?:^|[^0-9])(\d{1,3})(?:\.|$)/);
  return match ? Number(match[1]) : null;
}

for (const candidate of data.candidates) {
  const repo = candidate.github;
  let state = 'manual';
  let reason = 'Non-GitHub source requires a manual repository, license, Electron, Linux, runtime-separation, and testability audit.';
  const declaration = repo && !repo.unavailable ? electronDeclaration(repo.packageJson) : null;
  const major = electronMajor(declaration);

  if (repo) {
    if (repo.unavailable) {
      state = 'rejected';
      reason = 'The source repository is unavailable through GitHub; the package cannot be audited or reproduced.';
    } else if (repo.archived) {
      state = 'rejected';
      reason = 'The source repository is archived; Shared Pair will not launch a new package with no active upstream maintenance path.';
    } else if (repo.pushedAt && new Date(repo.pushedAt) < inactiveBefore) {
      state = 'rejected';
      reason = 'The source repository has no push in the last 24 months; it is too inactive for a new browser-runtime package.';
    } else if (!repo.license || !permissiveOrCopyleft.has(repo.license)) {
      state = 'rejected';
      reason = 'No recognized machine-readable open-source license is exposed by the repository; redistribution is not cleared.';
    } else if (!repo.packageJson) {
      reason = 'No root package.json is available; locate the desktop workspace before judging Electron, Linux, runtime separation, and testability.';
    } else if (!declaration) {
      reason = 'The root package.json does not declare Electron; inspect workspaces or confirm that the project is still an Electron application.';
    } else if (major === null) {
      reason = `Electron is declared as ${declaration}, but its supported major cannot be determined automatically.`;
    } else if (major < 30) {
      state = 'rejected';
      reason = `The root package declares legacy Electron ${declaration}; porting it across at least ${44 - major} major versions is outside the launch scope.`;
    } else {
      state = 'viable';
      reason = `Active, licensed source declares Electron ${declaration}; Linux packaging, runtime separation, native payloads, updater behavior, and the smoke-test contract require package-level confirmation.`;
    }
  }

  candidate.audit = { state, reason, electronDeclaration: declaration, electronMajor: major };
}

data.audit = {
  generatedAt: new Date().toISOString(),
  inactiveBefore: inactiveBefore.toISOString(),
  methodology: 'Conservative repository-level screen; viable entries still require package-level Linux/runtime/test validation.',
};
writeFileSync(resolve(outputArg), `${JSON.stringify(data, null, 2)}\n`);

const counts = data.candidates.reduce((result, candidate) => {
  result[candidate.audit.state] = (result[candidate.audit.state] ?? 0) + 1;
  return result;
}, {});
console.log(JSON.stringify(counts));
