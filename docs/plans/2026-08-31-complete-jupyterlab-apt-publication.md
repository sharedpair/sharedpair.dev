# Complete JupyterLab Desktop APT Publication

## Goal

Add JupyterLab Desktop to the live Shared Pair APT repository, verify a clean
public installation, update the website to advertise the complete catalogue,
and leave no permanent administrative upload surface behind.

## Context

The first signed repository is live at `https://apt.sharedpair.dev/` with nine
binary packages, including the two shared Electron runtime lines. JupyterLab
Desktop is the only held application because both its binary package and
upstream source archive exceed Wrangler's 300 MiB direct R2 upload limit. The
artifacts have already been built locally; the remaining issue is transport,
not packaging or compatibility.

## Implementation plan

1. Add a narrowly scoped, bearer-authenticated multipart-upload API to the APT
   hostname in the Cloudflare Worker.
   - Accept only keys beneath `pool/main/j/jupyterlab-desktop/`.
   - Support multipart creation, part upload, completion, and abort.
   - Validate methods, part numbers, request data, and authorization.
   - Return `Cache-Control: no-store` on every administrative response.
2. Store a random upload token as a short-lived Worker secret and deploy the
   temporary endpoint.
3. Upload the JupyterLab Desktop `.deb` and `.orig.tar.gz` in parts below the
   Cloudflare request-size ceiling. Upload its smaller source-control artifacts
   with the normal R2 command.
4. Remove JupyterLab Desktop from the release exclusion list, regenerate the
   complete repository indexes, and sign `Release`, `Release.gpg`, and
   `InRelease` with the Shared Pair APT signing identity.
5. Publish package indexes and metadata, writing the signed top-level release
   metadata last so clients never observe a partially updated release.
6. Verify the public repository:
   - validate the `InRelease` signature and signing fingerprint;
   - confirm all ten expected binary packages are indexed;
   - install JupyterLab Desktop from `apt.sharedpair.dev` in a fresh Ubuntu
     26.04 container;
   - confirm its dependency on the intended shared runtime is satisfied.
7. Update the website registry and Install/Status copy to include JupyterLab
   Desktop and the complete eight-application catalogue, then build, deploy,
   and smoke-test the public pages.
8. Remove the temporary multipart API and delete its Worker secret. Redeploy
   and verify that upload requests are no longer accepted while normal APT
   downloads still work.
9. Commit and push both repositories as a new verified baseline.

## Safety and rollback

- Never expose the upload token in source, logs, commits, or command output.
- Do not allow arbitrary R2 keys through the temporary endpoint.
- Keep existing signed metadata live until all new artifacts are present.
- If verification fails, retain the current nine-package metadata and remove
  the temporary endpoint; uploaded unindexed objects are harmless and can be
  cleaned up separately.
- The task is complete only after the administrative endpoint and secret have
  both been removed.

## Acceptance criteria

- `apt.sharedpair.dev` serves valid signed metadata containing JupyterLab
  Desktop and all previously published packages.
- A clean Ubuntu 26.04 system installs JupyterLab Desktop solely through the
  documented public APT setup.
- The website presents JupyterLab Desktop as installable and no longer describes
  it as the next publication item.
- The final Worker has no upload API or upload-token binding.
- `shared-electron` and `sharedpair.dev` are committed, pushed, and clean.
