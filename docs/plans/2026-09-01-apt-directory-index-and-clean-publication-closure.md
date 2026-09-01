# APT directory indexes and clean publication closure

## Status

Implemented and live-verified 2026-09-01. The routing repair is published as
`f1c6d16`; Worker version `49428a05-dc5e-482f-909f-a04caf1fbefc` passed the
enhanced public verifier.

## Goal

Close the gap between the generated Shared Pair APT repository and its public
Cloudflare Worker: every generated directory index must resolve through its
trailing-slash URL, the public verifier must make that behavior gate-fatal, and
the website must be rebuilt and deployed from a coherent release registry
without carrying unrelated working-tree output.

## Current evidence

- `gen/repository/gen-index.py` already writes `index.html` recursively under
  `public/dists/`, `public/pool/`, and their descendants.
- R2 contains those files and direct APT metadata requests return HTTP 200.
- The Worker previously translated `/pool/` to the nonexistent key `pool/`
  instead of `pool/index.html`; `f1c6d16` repairs that mapping.
- `/pool/`, `/dists/`, and
  `/dists/resolute/main/binary-amd64/` now return generated HTML indexes live.
- The website release-data gate previously stopped on an Element Desktop
  version whose exact artifact was absent. That exact artifact now exists in
  `shared-electron/dist`; it must pass the normal generator rather than receive
  a bypass or hand-authored record.

## Scope and ownership

`shared-electron` owns repository generation and public APT verification.
`sharedpair.dev` owns trailing-slash R2 resolution, website data synchronization,
site validation, and Worker deployment.

No APT payload, signed Release metadata, or generated repository HTML will be
hand-edited. No existing uncommitted package work will be discarded or folded
into an unrelated commit.

## Phase 1 — pin directory-index routing

1. Keep the Worker rule deterministic:
   - `/` resolves to `index.html`;
   - any trailing-slash path resolves to `<path>/index.html`;
   - non-directory paths continue to resolve to their exact R2 key;
   - GET and HEAD remain the only accepted methods.
2. Verify root, first-level, and nested index paths against the deployed Worker.
3. Confirm exact APT objects such as `InRelease` and `Packages.gz` are unchanged.

## Phase 2 — make the regression gate-fatal

Extend `scripts/verify-sharedpair-public.sh` to download and inspect:

- `/`;
- `/pool/`;
- `/dists/`;
- `/dists/resolute/main/binary-amd64/`.

Each request must return successfully and contain the exact generated `Index of
<path>` marker plus one representative child link. This must fail against the
old Worker behavior and must not rely on browser JavaScript.

Also retain signature, manifest, immutable-generation, and exact binary/source
membership checks. Directory browsing is additive evidence, not a replacement
for APT correctness.

## Phase 3 — restore coherent website generation

1. Run the existing release-registry and package-data generators against the
   exact `shared-electron` artifacts.
2. Require Element Desktop's declared version to match exactly one `.deb`; do
   not suppress the missing-artifact failure.
3. Review the generated registry and measurements so only the intended release
   cohort changes.
4. Run the full website check, build, and built-site verifier.

## Phase 4 — clean deployment and public proof

1. Deploy from a checkout whose source and generated inputs pass the normal
   build gates.
2. Record Wrangler's asset delta before accepting deployment. Every changed
   asset must be explained by the intended release-data update or the routing
   repair.
3. Run the enhanced public APT verifier after deployment.
4. Recheck GET and HEAD for both directory indexes and signed metadata.
5. Record the Worker version, repository generation, package counts, and live
   verification result in the broader APT publication plan.

## Verification commands

```bash
# shared-electron
task sharedpair-verify-public

# sharedpair.dev
npm run generate:data
npm run check
npm run build
npm run verify:site
npx wrangler deploy --dry-run

# after deployment
curl -fsSL https://apt.sharedpair.dev/pool/
curl -fsSL https://apt.sharedpair.dev/dists/
curl -fsSL https://apt.sharedpair.dev/dists/resolute/main/binary-amd64/
curl -fsSI https://apt.sharedpair.dev/dists/resolute/InRelease
```

## Acceptance criteria

- Root, `/pool/`, `/dists/`, and a nested directory return the generated HTML
  index with HTTP 200 for GET; HEAD also succeeds.
- Exact package and signed metadata URLs retain their existing behavior.
- The public verifier demonstrably fails if trailing-slash index resolution is
  removed.
- Element Desktop is consumed from its exact artifact and all website data
  generation/build/verification commands pass without exceptions.
- The final deployment is produced from coherent inputs, its asset delta is
  reviewed, and the live public verifier passes afterward.
- The routing fix, verifier change, generated-data update, and closure evidence
  are committed in their owning repositories without absorbing unrelated work.

## Rollback

If directory routing breaks APT object delivery, roll the Worker back to the
previous Cloudflare version immediately; R2 content and signed metadata remain
unchanged. If a website asset delta is not explainable, do not deploy it: retain
`f1c6d16`, repair the source/generated-data mismatch, rebuild, and retry from a
clean checkout.

## Verification result — PASS

- The public verifier now requires GET and HEAD success, exact path markers,
  and representative child links for `/`, `/pool/`, `/dists/`, and the nested
  `binary-amd64/` index.
- Public `InRelease` and generation-manifest signatures validate with key
  `CB4B214C7E7D250E1F06D319DC957822C3CA4045`.
- Generation `20260901T034454Z` exposes exactly 12 binary and 12 source packages
  and matches its immutable manifest.
- Element Desktop's exact declared artifact was consumed by the normal data
  generator. No missing-artifact exception or registry suppression was added.
- Data generation reports 10 tested applications, two runtime lines, and 717.1
  MiB modeled archive savings. Astro reports zero diagnostics; all 22 rendered
  pages, links, application reports, images, and local paths pass verification.
- The final deployment uploaded one reviewed generated measurements asset and
  published Worker version `49428a05-dc5e-482f-909f-a04caf1fbefc`.
- The post-deployment public verifier passed recursive indexes, signatures,
  immutable-generation equality, and exact package membership.
