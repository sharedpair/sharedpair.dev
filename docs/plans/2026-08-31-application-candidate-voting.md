# Application candidate catalogue and voting

**Date:** 2026-08-31

**Status:** candidate audit in progress; publication paused until the active set is evidence-backed

## Objective

Publish every Electron showcase application that survived the first viability cut on `https://sharedpair.dev/applications/`, clearly separate candidates from tested packages, and let visitors cast lightweight anonymous votes for future packaging priority.

## Scope

- Import the 373 entries from the pinned `electron/apps` snapshot that list a public source repository and are not already represented by a launch application.
- Treat inclusion as consideration only. It does not claim Linux support, current maintenance, compatible Electron, licensing clearance, or eventual publication.
- Preserve the upstream name, description, category, and source-repository link.
- Separate GitHub-hosted projects into a popularity/capability table ordered by repository evidence. Show repository URL, stars, forks, watchers, open issues, primary language, license identifier, archive state, last push, releases, and repository size where GitHub exposes them. Keep non-GitHub source candidates in a separate list.
- Treat repository statistics as prioritization signals only: stars are not proof of licensing, Linux compatibility, maintainability, or suitability for a shared runtime.
- Audit every source-listed candidate before exposing it as viable. Check repository availability/archive state and recency, license evidence, current Electron declaration, Linux build intent, separability of the Electron runtime, native/private payload risks, updater behavior, and whether a meaningful clean-container test can be defined.
- Move rejected candidates into collapsed disclosure groups keyed by the first decisive rejection reason. Keep ambiguous monorepos in a manual-audit queue rather than rejecting them from incomplete root metadata.
- Add candidate search and category filtering without mixing candidates into tested-package counts.
- Group viable candidates by category. Within each category, rank GitHub projects by repository evidence and keep non-GitHub source projects visibly separate.
- Add one-click voting with no account, email address, profile, or identity provider.

## Voting design

1. Add a Cloudflare Durable Object bound to the existing Worker as `VOTE_COUNTER`; its deployment migration creates the storage namespace with the Worker.
2. Expose `GET /api/votes` for aggregate counts and `POST /api/votes/:slug` to increment a known candidate.
3. Reject unknown slugs, non-POST writes, oversized requests, and non-site origins.
4. Use a browser-local record to disable repeat voting for the same application. This is intentionally lightweight and can be bypassed by clearing browser data; the UI must say so plainly.
5. Store only aggregate counts in one serialized Durable Object. Do not request or deliberately store names, emails, account identifiers, IP addresses, or user-agent fingerprints.
6. Make voting progressively enhanced: candidate discovery and source links remain usable if JavaScript, KV, or the API is unavailable.

## Implementation

- Add a generated candidate registry pinned to the exact Electron showcase revision.
- Enrich GitHub candidates through GitHub's GraphQL API and record the retrieval timestamp so stale statistics are visible.
- Generate a deterministic audit result and reason for each candidate. The website must consume only candidates that passed the audit or are explicitly labeled as still awaiting manual review.
- Render a compact candidate grid below the tested and blocked package sections.
- Add candidate-specific search, category filtering, visible result count, source links, vote buttons, vote totals, loading states, and accessible live announcements.
- Extend the Worker with candidate validation, JSON responses, origin checks, and serialized aggregate updates.
- Add the production Durable Object binding and migration to `wrangler.toml`.
- Validate Astro/TypeScript, build the site, create the KV namespace, deploy, and smoke-test the live page and API.

## Acceptance criteria

- Every one of the 373 source-listed candidates has a recorded audit disposition and evidence summary.
- Only candidates that pass the audit appear in the public voting list; rejected rows remain in reason-grouped twisties in the launch catalogue.
- Existing tested and blocked application records and counts remain accurate.
- Visitors can vote without creating an account.
- A successful vote updates the displayed aggregate and remains disabled in that browser.
- Candidate source links work without JavaScript.
- The API accepts only known candidate slugs and returns structured errors without leaking internal details.
- The site states that voting is advisory and lightweight, not a strict election or publication commitment.
