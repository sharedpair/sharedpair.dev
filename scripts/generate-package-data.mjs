import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync, zstdDecompressSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const aptRoot = process.env.SHARED_ELECTRON_ROOT ?? '/home/will/shared-electron';
const distRoot = resolve(aptRoot, 'dist');
const statusPath = resolve(aptRoot, 'shared-electron/status.json');
const configPath = resolve(root, 'config/package-registry.json');
const registryPath = resolve(root, 'src/data/generated/package-registry.json');
const manifestPath = resolve(root, 'public/data/shared-pair-measurements.json');
const checkOnly = process.argv.includes('--check');

const status = JSON.parse(readFileSync(statusPath, 'utf8'));
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const distFiles = readdirSync(distRoot);
const round1 = (value) => Math.round(value * 10) / 10;
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

function arMembers(buffer) {
  if (buffer.subarray(0, 8).toString() !== '!<arch>\n') throw new Error('Invalid Debian ar archive.');
  const members = new Map();
  for (let offset = 8; offset + 60 <= buffer.length;) {
    const header = buffer.subarray(offset, offset + 60);
    const name = header.subarray(0, 16).toString().trim().replace(/\/$/, '');
    const size = Number(header.subarray(48, 58).toString().trim());
    const start = offset + 60;
    members.set(name, buffer.subarray(start, start + size));
    offset = start + size + (size % 2);
  }
  return members;
}

function tarFile(buffer, wanted) {
  for (let offset = 0; offset + 512 <= buffer.length;) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name = header.subarray(0, 100).toString().replace(/\0.*$/, '');
    const sizeText = header.subarray(124, 136).toString().replace(/\0.*$/, '').trim();
    const size = Number.parseInt(sizeText || '0', 8);
    const start = offset + 512;
    if (name === wanted || name === `./${wanted}`) return buffer.subarray(start, start + size);
    offset = start + Math.ceil(size / 512) * 512;
  }
  throw new Error(`Missing ${wanted} in control archive.`);
}

function parseDebianControl(text) {
  const fields = {};
  let current = null;
  for (const line of text.split('\n')) {
    if (/^[ \t]/.test(line) && current) fields[current] += ` ${line.trim()}`;
    else {
      const split = line.indexOf(':');
      if (split > 0) {
        current = line.slice(0, split);
        fields[current] = line.slice(split + 1).trim();
      }
    }
  }
  return fields;
}

function debFields(path) {
  const members = arMembers(readFileSync(path));
  const controlName = [...members.keys()].find((name) => name.startsWith('control.tar.'));
  if (!controlName) throw new Error(`${path}: missing control archive`);
  const compressed = members.get(controlName);
  const tar = controlName.endsWith('.zst') ? zstdDecompressSync(compressed) : controlName.endsWith('.gz') ? gunzipSync(compressed) : compressed;
  return parseDebianControl(tarFile(tar, 'control').toString());
}

function exactArtifact(packageName, version) {
  const expected = `${packageName}_${version}_${status.architecture}.deb`;
  const matches = distFiles.filter((file) => file === expected);
  if (matches.length !== 1) throw new Error(`${packageName}: expected exactly one ${expected}; found ${matches.length}`);
  return resolve(distRoot, matches[0]);
}

function optionalExactArtifact(packageName, version) {
  const expected = `${packageName}_${version}_${status.architecture}.deb`;
  return distFiles.includes(expected) ? resolve(distRoot, expected) : null;
}

function latestUniqueArtifact(packageName) {
  const matches = distFiles.filter((file) => file.startsWith(`${packageName}_`) && file.endsWith(`_${status.architecture}.deb`));
  if (matches.length !== 1) throw new Error(`${packageName}: expected one blocked-package artifact; found ${matches.length}`);
  return resolve(distRoot, matches[0]);
}

function packageFact(path) {
  const fields = debFields(path);
  const archiveBytes = statSync(path).size;
  const installedKiB = Number(fields['Installed-Size']);
  const depends = fields.Depends ?? '';
  const runtimeMatch = depends.match(/(electron-runtime-(\d+))/);
  const lowerMatch = depends.match(/electron-runtime-\d+ \(>= ([^)]+)\)/);
  const upperMatch = depends.match(/electron-runtime-\d+ \(<< ([^)]+)\)/);
  return {
    packageName: fields.Package,
    version: fields.Version,
    architecture: fields.Architecture,
    archiveBytes,
    archiveMiB: round1(archiveBytes / 1048576),
    installedKiB,
    installedMiB: round1(installedKiB / 1024),
    sha256: sha256(path),
    sourceArtifact: path.split('/').at(-1),
    artifactModifiedAt: statSync(path).mtime.toISOString(),
    depends,
    runtime: runtimeMatch?.[1] ?? null,
    runtimeMajor: runtimeMatch ? Number(runtimeMatch[2]) : null,
    runtimeLower: lowerMatch?.[1] ?? null,
    runtimeUpper: upperMatch?.[1] ?? null
  };
}

const packages = {};
const unresolvedStatusPackages = {};
for (const [packageName, version] of Object.entries(status.packages)) {
  const artifact = optionalExactArtifact(packageName, version);
  if (artifact) packages[packageName] = packageFact(artifact);
  else if (config.discoveredNotEnrolled[packageName]) unresolvedStatusPackages[packageName] = { version, reason: config.discoveredNotEnrolled[packageName] };
  else throw new Error(`${packageName}: status.json declares ${version}, but its artifact is missing`);
}
for (const packageName of config.blockedApplications) {
  packages[packageName] = packageFact(latestUniqueArtifact(packageName));
}

const tested = config.testedApplications.map((name) => packages[name]);
for (const fact of tested) {
  if (!fact) throw new Error('Tested cohort names a package absent from generated facts.');
  if (!fact.runtime || !packages[fact.runtime]) throw new Error(`${fact.packageName}: runtime dependency is absent from status.json`);
  if (fact.runtimeMajor !== Number(packages[fact.runtime].version.split('.')[0])) throw new Error(`${fact.packageName}: runtime major disagrees with runtime package version`);
}

const runtimeNames = [...new Set(tested.map((fact) => fact.runtime))];
const appArchiveBytes = tested.reduce((sum, fact) => sum + fact.archiveBytes, 0);
const appInstalledKiB = tested.reduce((sum, fact) => sum + fact.installedKiB, 0);
const sharedRuntimeArchiveBytes = runtimeNames.reduce((sum, name) => sum + packages[name].archiveBytes, 0);
const sharedRuntimeInstalledKiB = runtimeNames.reduce((sum, name) => sum + packages[name].installedKiB, 0);
const bundledRuntimeArchiveBytes = tested.reduce((sum, fact) => sum + packages[fact.runtime].archiveBytes, 0);
const bundledRuntimeInstalledKiB = tested.reduce((sum, fact) => sum + packages[fact.runtime].installedKiB, 0);
const sharedArchiveBytes = appArchiveBytes + sharedRuntimeArchiveBytes;
const bundledArchiveBytes = appArchiveBytes + bundledRuntimeArchiveBytes;
const sharedInstalledKiB = appInstalledKiB + sharedRuntimeInstalledKiB;
const bundledInstalledKiB = appInstalledKiB + bundledRuntimeInstalledKiB;

const monolithic = {};
for (const [packageName, version] of Object.entries(config.monolithicComparisons)) {
  monolithic[packageName] = packageFact(exactArtifact(packageName, version));
}

const measuredAt = new Date(Math.max(statSync(statusPath).mtimeMs, ...Object.values(packages).map((fact) => Date.parse(fact.artifactModifiedAt)))).toISOString();
const accounting = {
  testedApplications: tested.length,
  runtimeLines: runtimeNames.length,
  sharedArchiveBytes,
  sharedArchiveMiB: round1(sharedArchiveBytes / 1048576),
  bundledModelArchiveBytes: bundledArchiveBytes,
  bundledModelArchiveMiB: round1(bundledArchiveBytes / 1048576),
  archiveSavedBytes: bundledArchiveBytes - sharedArchiveBytes,
  archiveSavedMiB: round1((bundledArchiveBytes - sharedArchiveBytes) / 1048576),
  archiveSavedPercent: round1((bundledArchiveBytes - sharedArchiveBytes) / bundledArchiveBytes * 100),
  sharedInstalledKiB,
  sharedInstalledMiB: round1(sharedInstalledKiB / 1024),
  bundledModelInstalledKiB: bundledInstalledKiB,
  bundledModelInstalledMiB: round1(bundledInstalledKiB / 1024),
  installedSavedKiB: bundledInstalledKiB - sharedInstalledKiB,
  installedSavedMiB: round1((bundledInstalledKiB - sharedInstalledKiB) / 1024),
  installedSavedPercent: round1((bundledInstalledKiB - sharedInstalledKiB) / bundledInstalledKiB * 100),
  methodology: 'Actual split application archives plus one actual runtime archive per application versus one actual runtime archive per represented runtime line.'
};

const registry = {
  schemaVersion: 1,
  generatedAt: measuredAt,
  suite: status.suite,
  architecture: status.architecture,
  signingFingerprint: status.signingFingerprint,
  testedApplications: config.testedApplications,
  blockedApplications: config.blockedApplications,
  discoveredNotEnrolled: config.discoveredNotEnrolled,
  unresolvedStatusPackages,
  packages,
  accounting,
  monolithicComparisons: monolithic
};

const registryText = `${JSON.stringify(registry, null, 2)}\n`;
const manifest = {
  schemaVersion: 1,
  generatedAt: measuredAt,
  suite: status.suite,
  architecture: status.architecture,
  cohort: config.testedApplications,
  runtimeLines: runtimeNames,
  accounting,
  sources: Object.fromEntries([...config.testedApplications, ...runtimeNames].map((name) => [name, { version: packages[name].version, archiveBytes: packages[name].archiveBytes, installedKiB: packages[name].installedKiB, sha256: packages[name].sha256 }])),
  monolithicComparisons: Object.fromEntries(Object.entries(monolithic).map(([name, fact]) => [name, { version: fact.version, archiveBytes: fact.archiveBytes, installedKiB: fact.installedKiB, sha256: fact.sha256 }]))
};
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;

if (checkOnly) {
  if (readFileSync(registryPath, 'utf8') !== registryText) throw new Error('Generated package registry is stale; run npm run generate:data.');
  if (readFileSync(manifestPath, 'utf8') !== manifestText) throw new Error('Measurement manifest is stale; run npm run generate:data.');
} else {
  writeFileSync(registryPath, registryText);
  writeFileSync(manifestPath, manifestText);
}

console.log(`${checkOnly ? 'Verified' : 'Generated'} ${tested.length} tested applications, ${runtimeNames.length} runtime lines, ${accounting.archiveSavedMiB} MiB modeled archive savings.`);
