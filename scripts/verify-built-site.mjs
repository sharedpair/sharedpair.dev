import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import registry from '../src/data/generated/package-registry.json' with { type: 'json' };

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const source = resolve(root, 'src');
const failures = [];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
}

const htmlFiles = walk(dist).filter((path) => path.endsWith('.html'));
const sourceFiles = walk(source).filter((path) => /\.(astro|ts)$/.test(path));

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  if (!/<html[^>]+lang="en"/.test(html)) failures.push(`${path}: missing document language`);
  if ((html.match(/<main\b/g) ?? []).length !== 1) failures.push(`${path}: expected exactly one main landmark`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) failures.push(`${path}: expected exactly one h1`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${path}: missing title`);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]*"/.test(image[0])) failures.push(`${path}: image missing alt text`);
  for (const href of html.matchAll(/href="(\/[^"]*)"/g)) {
    const url = href[1].split('#')[0].split('?')[0];
    if (url.startsWith('/_astro/')) {
      if (!statSafe(resolve(dist, url.slice(1)))) failures.push(`${path}: missing asset ${url}`);
    } else if (url.endsWith('/')) {
      if (!statSafe(resolve(dist, url.slice(1), 'index.html'))) failures.push(`${path}: missing route ${url}`);
    }
  }
  if (html.includes('/home/will/')) failures.push(`${path}: exposes an absolute local path`);
}

const provenance = JSON.parse(readFileSync(resolve(root, 'public/images/applications/provenance.json'), 'utf8'));
for (const [url, record] of Object.entries(provenance.images)) {
  const image = resolve(root, 'public', url.slice(1));
  if (!statSafe(image) || statSync(image).size === 0) failures.push(`provenance: missing or empty ${url}`);
  if (record.kind === 'captured-evidence' && (!record.package || !record.runtime || !record.platform || !record.method || !record.captured)) failures.push(`provenance: incomplete captured evidence ${url}`);
  if (record.kind === 'upstream-interface' && !record.source) failures.push(`provenance: missing upstream source ${url}`);
}

const homeHtml = readFileSync(resolve(dist, 'index.html'), 'utf8');
for (const id of ['install', 'applications', 'runtimes', 'security', 'status']) if (!homeHtml.includes(`id="${id}"`)) failures.push(`home: missing #${id} section`);
for (const packageName of [...registry.testedApplications, ...registry.blockedApplications]) if (!homeHtml.includes(`id="applications-${packageName}"`)) failures.push(`${packageName}: missing inline application report`);
for (const removedRoute of ['install', 'applications', 'runtimes', 'security', 'status']) if (statSafe(resolve(dist, removedRoute, 'index.html'))) failures.push(`${removedRoute}: obsolete route still rendered`);
if (!statSafe(resolve(dist, 'about', 'index.html'))) failures.push('about: missing separate page');

for (const path of sourceFiles) {
  const text = readFileSync(path, 'utf8');
  if (/lorem ipsum|nothing to install|no public packages/i.test(text)) failures.push(`${path}: contains stale placeholder language`);
  for (const match of text.matchAll(/src:\s*['"](\/images\/[^'"]+)['"]/g)) {
    const image = resolve(root, 'public', match[1].slice(1));
    if (!statSafe(image) || statSync(image).size === 0) failures.push(`${path}: missing or empty image ${match[1]}`);
  }
}

function statSafe(path) {
  try { return statSync(path); } catch { return null; }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} rendered pages, one-page sections, inline application reports, removed routes, images, and local-path hygiene.`);
