import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = process.env.SHARED_ELECTRON_ROOT ?? '/home/will/shared-electron';
const source = resolve(packageRoot, 'config/sharedpair-release.json');
const target = resolve(root, 'src/data/generated/release-registry.json');
const text = readFileSync(source, 'utf8');
const data = JSON.parse(text);
if (data.websiteUrl !== 'https://sharedpair.dev' || data.repositoryUrl !== 'https://apt.sharedpair.dev') throw new Error('release registry has unexpected public endpoints');
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== text) throw new Error('Generated release registry is stale; run npm run generate:data.');
} else writeFileSync(target, text);
console.log(`${process.argv.includes('--check') ? 'Verified' : 'Synced'} Shared Pair release registry.`);
