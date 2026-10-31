# Cloudflare and AWS infrastructure for sharedpair.dev

Everything at the sharedpair.dev edge is code, apart from the two exceptions listed below. Set up 2026‑10‑30 after a crawler flood on `apt.sharedpair.dev` used up the account-wide Workers Free limit and took every Worker offline. See `~/shared-electron/docs/investigations/2026-10-30-apt-flood-cloudflare-1027.md` and the plan `~/shared-electron/docs/plans/2026-10-30-sharedpair-edge-hardening.md`.

## Layout

| Dir | Manages | Credential | State |
|---|---|---|---|
| `cloudflare/bootstrap/` | S3 state bucket `sharedpair-terraform-state` (+ an unused lock table) | AWS `sharedpair-terraform` | local |
| `cloudflare/iam-self/` | Narrow Cloudflare token `sharedpair-cf-token` | one-shot Cloudflare bootstrap token | S3 `iam-self/` |
| `cloudflare/global/` | Zone, WAF block rule, APT cache rule, apex + www Worker domains, `sharedpair-apt` bucket | `sharedpair-cf-token` | S3 `global/` |
| `aws/iam-self/` | `sharedpair-terraform-scoped` IAM policy (the user's only policy) | AWS `sharedpair-terraform` | S3 `aws-iam-self/` |

Locking is S3-native (`use_lockfile = true`).

## Tasks

| Task | What it does |
|---|---|
| `task aws-bootstrap` | First run on a new machine/account: AWS key into `~/.aws`, state backend |
| `task cf-token-rotate` | Mint, widen or rotate `sharedpair-cf-token` with a one-shot bootstrap token (see below) |
| `task tf-validate` | Offline check of all four dirs |
| `task tf-plan` / `task tf-apply` | `global/`, token read from SSM `/sharedpair/cloudflare/api_token` at run time |
| `task tf-apply-aws-iam` | Update the scoped IAM policy |

Every apply prints the plan and waits for `yes`.

## Not in Terraform

- **R2 custom domain `apt.sharedpair.dev` → bucket `sharedpair-apt`** (min TLS 1.2). Provider 5.28.1 can't import `cloudflare_r2_custom_domain`, and adopting it would mean delete-and-recreate (an APT outage plus up to 30 min of cached NXDOMAIN). Recreate it with `POST /accounts/{account}/r2/buckets/sharedpair-apt/domains/custom` `{"domain":"apt.sharedpair.dev","zoneId":"bf188f4376ccd34e05f9a3264a7caceb","enabled":true,"minTLS":"1.2"}`, the same call the `new-web-apt-repo` skill's `bootstrap.sh` makes.
- **Bucket contents** are owned by `~/shared-electron/scripts/deploy-sharedpair-r2.sh` (including `robots.txt`).

## Token rotation

To widen the token's permissions (edit `iam-self/token.tf` first) or to rotate it:

```
task cf-token-rotate
```

It prints what to mint: an **account-owned** custom token with `Account → Account API Tokens → Edit`, created at [Account API Tokens](https://dash.cloudflare.com/f7e1e6cd8b3414a6d2226152533c21f2/api-tokens). It reads the bootstrap token with a hidden prompt, checks it is active (at the account endpoint, then the user one), applies `iam-self` (you confirm the plan) and stores the narrow token in SSM. An `EXIT` trap then revokes the bootstrap token however the run ends, including a declined or failed apply. A token made on the profile page also works, but it can't delete itself, so the task tells you to delete it by hand. The bootstrap token lives only in that process's environment and is never written to SSM or disk. Until 2026‑10‑31 it was parked in SSM between steps, and a dead value outlived a failed run. To force a new token *value* rather than updating the existing one in place, add `-replace=cloudflare_account_token.sharedpair_cf_token` to the `iam-self` apply in `cf-token-rotate`.

### Gate history (2026‑10‑30/31)

Two pre-flight gates refused correctly-built bootstrap tokens. The first required `GET /user/tokens`; three tokens verified as `active` but got `9109 Invalid access token` there. Its replacement required `GET /accounts/{id}/tokens` and refused the next one too. None of the other projects' flows (indri.studio, wald3n.com, invest/claude) checks permissions before Terraform runs, so the gate was removed on 2026‑10‑31: the task now checks only that the token is active, and the `iam-self` plan, which changes nothing until you approve it, is the real test. The flow also follows wald3n.com and indri.studio in using an account-owned token, which can revoke itself through `DELETE /accounts/{id}/tokens/{id}`.

## Emergency access

`sharedpair-terraform` can attach only `sharedpair-*` policies to itself, so it can't regain Admin on its own. The account root (or another admin) can always re-attach `AdministratorAccess` in the IAM console.

## History

- **2026‑10‑30** First apply. Bootstrap backend; minted `sharedpair-cf-token`; imported 6 hand-made objects (`Plan: 6 to import, 0 to add, 0 to change, 0 to destroy`, then `No changes`); narrowed the AWS user (Admin and ReadOnly detached after simulation); revoked the bootstrap token.
