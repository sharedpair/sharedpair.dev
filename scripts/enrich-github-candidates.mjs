#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [inputArg, outputArg = inputArg] = process.argv.slice(2);
if (!inputArg) {
  console.error('Usage: enrich-github-candidates.mjs <candidate-data.json> [output.json]');
  process.exit(2);
}

const inputPath = resolve(inputArg);
const outputPath = resolve(outputArg);
const data = JSON.parse(readFileSync(inputPath, 'utf8'));
const pause = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

function githubRepo(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') return null;
    const [owner, rawName] = parsed.pathname.split('/').filter(Boolean);
    if (!owner || !rawName) return null;
    return { owner, name: rawName.replace(/\.git$/, '') };
  } catch {
    return null;
  }
}

const githubCandidates = data.candidates
  .map((candidate, index) => ({ candidate, index, repo: githubRepo(candidate.repository) }))
  .filter((item) => item.repo);

for (let offset = 0; offset < githubCandidates.length; offset += 25) {
  const batch = githubCandidates.slice(offset, offset + 25);
  const fields = batch.map((item, index) => {
    const owner = JSON.stringify(item.repo.owner);
    const name = JSON.stringify(item.repo.name);
    return `r${index}: repository(owner: ${owner}, name: ${name}) {
      url stargazerCount forkCount diskUsage isArchived isFork pushedAt
      watchers { totalCount }
      issues(states: OPEN) { totalCount }
      pullRequests(states: OPEN) { totalCount }
      releases { totalCount }
      latestRelease { publishedAt tagName }
      licenseInfo { spdxId }
      primaryLanguage { name }
      packageJson: object(expression: "HEAD:package.json") { ... on Blob { text } }
    }`;
  }).join('\n');
  const query = `query { ${fields} }`;
  let response;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const result = spawnSync('gh', ['api', 'graphql', '-f', `query=${query}`], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
      if (!result.stdout) throw new Error(result.stderr || 'GitHub returned no data');
      response = JSON.parse(result.stdout);
      if (!response.data) throw new Error(result.stderr || JSON.stringify(response.errors));
      break;
    } catch (error) {
      if (attempt === 3) throw error;
      const backoff = 15_000 * (2 ** attempt);
      console.warn(`GitHub request failed; retrying in ${backoff / 1000}s`);
      await pause(backoff);
    }
  }
  batch.forEach((item, index) => {
    const repo = response.data[`r${index}`];
    data.candidates[item.index].github = repo ? {
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      watchers: repo.watchers.totalCount,
      openIssues: repo.issues.totalCount,
      openPullRequests: repo.pullRequests.totalCount,
      releases: repo.releases.totalCount,
      latestRelease: repo.latestRelease,
      license: repo.licenseInfo?.spdxId ?? null,
      language: repo.primaryLanguage?.name ?? null,
      diskKiB: repo.diskUsage,
      archived: repo.isArchived,
      fork: repo.isFork,
      pushedAt: repo.pushedAt,
      packageJson: repo.packageJson?.text ?? null,
    } : { unavailable: true };
  });
  console.log(`GitHub metadata: ${Math.min(offset + batch.length, githubCandidates.length)}/${githubCandidates.length}`);
  if (offset + batch.length < githubCandidates.length) await pause(3_000);
}

data.githubMetadataAt = new Date().toISOString();
writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`wrote ${githubCandidates.length} GitHub records to ${outputPath}`);
