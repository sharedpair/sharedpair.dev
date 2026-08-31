#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [catalogArg, outputArg] = process.argv.slice(2);
if (!catalogArg || !outputArg) {
  console.error('Usage: generate-candidate-data.mjs <electron-apps/index.json> <output.json>');
  process.exit(2);
}

const catalogPath = resolve(catalogArg);
const outputPath = resolve(outputArg);
const apps = JSON.parse(readFileSync(catalogPath, 'utf8'));
const selectedNames = new Set([
  'losslesscut', 'draw.io desktop', 'marktext', 'joplin', 'teams for linux',
  'jupyterlab desktop', 'netron', 'trilium notes', 'opencomic',
  'jbrowse desktop', 'nerimity desktop', 'penpot desktop', 'effetune',
  'element desktop', 'poi', 'tuta desktop',
]);

const candidates = apps
  .filter((app) => app.repository && !selectedNames.has(app.name.toLowerCase()))
  .map(({ slug, name, description, category, repository }) => ({ slug, name, description, category, repository }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en'));

const revision = process.env.ELECTRON_APPS_REVISION;
if (!revision?.match(/^[0-9a-f]{40}$/)) {
  console.error('ELECTRON_APPS_REVISION must contain the 40-character source revision.');
  process.exit(2);
}
writeFileSync(outputPath, `${JSON.stringify({ source: 'electron/apps', revision, candidates }, null, 2)}\n`);
console.log(`wrote ${candidates.length} candidates to ${outputPath}`);
