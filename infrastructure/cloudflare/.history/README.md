| Date | Change |
|------|--------|
| [2026-10-31](https://github.com/sharedpair/sharedpair.dev/commit/dad39d9) | cf-token-rotate: gate on the account token API only |
| [2026-10-31](https://github.com/sharedpair/sharedpair.dev/commit/091b939) | cf-token-rotate: record the unresolved 9109 bootstrap-token problem |
| [2026-10-31](https://github.com/sharedpair/sharedpair.dev/commit/0141a36) | cf-token-rotate: keep the bootstrap token in memory, never in SSM |
| [2026-10-30](https://github.com/sharedpair/sharedpair.dev/commit/b353674) | Restore apt directory indexes; add task cf-token-rotate |
| [2026-10-30](https://github.com/sharedpair/sharedpair.dev/commit/360037e) | Hand apex/www custom domains to Terraform; document the infrastructure |

<!--history-meta v1
dad39d9	author	Will Norris
dad39d9	added	3
dad39d9	deleted	3
dad39d9	files	1
dad39d9	body	The gate also required GET /user/tokens. Three correctly-built bootstrap\ntokens got 9109 there and were stopped before the account check or the\niam-self apply ran. No other project's flow makes that call; iam-self\nonly needs the account's token API. Also drops the cfut_ prefix check\nand the nonexistent 'Create additional tokens' template instructions.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01YEenqNkFPpiTzcu2Ec7m34
091b939	author	Will Norris
091b939	added	4
091b939	deleted	0
091b939	files	1
091b939	body	The template-made token was refused the same way as the custom-built\nones, so the template is not the fix. Prompt and README now say so.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01YEenqNkFPpiTzcu2Ec7m34
0141a36	author	Will Norris
0141a36	added	3
0141a36	deleted	3
0141a36	files	1
0141a36	body	The bootstrap token was parked in SSM /sharedpair/cloudflare/bootstrap_token\nbetween steps. A failed run left a dead value there, and aws-bootstrap and\ntf-apply-iam would pick it up again without checking it.\n\n- cf-token-rotate is now one script: hidden prompt, cfut_ prefix check\n  (rejects account-owned cfat_ tokens), active + list-permission checks,\n  iam-self apply with the token in the environment only, narrow token to\n  SSM, and an EXIT trap that revokes the bootstrap token however the run ends.\n- tf-apply-iam is folded into it; aws-bootstrap no longer asks for a\n  Cloudflare token.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01YEenqNkFPpiTzcu2Ec7m34
b353674	author	Will Norris
b353674	added	7
b353674	deleted	4
b353674	files	1
b353674	body	transform.tf rewrites a trailing "/" on the apt host to index.html, the\nbehaviour the Worker used to provide (verification step 6: "/" has\n404'd since the R2 cut-over). The narrow token gains Zone Transform\nRules Write on sharedpair.dev only.\n\ntask cf-token-rotate does the whole bootstrap-token cycle in one\ncommand: hidden prompt, verify, iam-self apply, store the narrow token,\nrevoke and delete the bootstrap token. Run it before task tf-apply.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01YEenqNkFPpiTzcu2Ec7m34
360037e	author	Will Norris
360037e	added	46
360037e	deleted	0
360037e	files	1
360037e	body	wrangler.toml drops [[routes]] now that global/ owns both Worker domains\n(imported, plan shows no changes). README covers layout, tasks, the two\nthings outside Terraform, token rotation and emergency access.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01YEenqNkFPpiTzcu2Ec7m34
-->
