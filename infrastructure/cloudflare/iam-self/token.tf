# sharedpair-cf-token: the only Cloudflare credential global/ uses.
#
# Scope is exactly what global/ manages, and nothing outside sharedpair.dev:
#
#   Account:
#     - Workers R2 Storage Write — cloudflare_r2_bucket.apt, R2 custom domain script
#     - Workers Scripts Write    — workers/domains API behind cloudflare_workers_custom_domain
#
#   Zone (sharedpair.dev only):
#     - Zone Transform Rules Write — apt directory-index URL rewrite
#     - Workers Routes Write     — apex + www Worker custom domains
#     - Zone Settings Write      — always_use_https (planned)
#     - DNS Write                — records the custom-domain bindings create
#     - Cache Settings Write     — cache rules (http_request_cache_settings)
#     - Zone Write               — cloudflare_zone refresh
#     - Zone WAF Write           — custom rules + rate limiting rulesets
#
# It can't list other zones, mint or revoke tokens, or touch any other
# project's Workers routes.

variable "account_id" {
  description = "Cloudflare account ID. Not secret."
  type        = string
  default     = "f7e1e6cd8b3414a6d2226152533c21f2"
}

variable "zone_id" {
  description = "sharedpair.dev zone ID (same value as global/terraform.tfvars). Not secret."
  type        = string
  default     = "bf188f4376ccd34e05f9a3264a7caceb"
}

# Permission-group IDs are Cloudflare-managed and stable. Resolved 2026-10-30
# from GET /accounts/{id}/tokens/permission_groups with the bootstrap token.
locals {
  permission_groups = {
    # Account scope
    workers_r2_storage_write = "bf7481a1826f439697cb59a20b22293e"
    workers_scripts_write    = "e086da7e2179491d91ee5f35b3ca210a"
    # Zone scope
    zone_transform_rules_write = "0ac90a90249747bca6b047d97f0803e9"
    workers_routes_write = "28f4b596e7d643029c524985477ae49a"
    zone_settings_write  = "3030687196b94b638145a3953da2b699"
    dns_write            = "4755a26eedb94da69e1066d98aa820be"
    cache_settings_write = "9ff81cbbe65c400b97d92c3c1033cab6"
    zone_write           = "e6d2666161e84845a636613608cee8d5"
    zone_waf_write       = "fb6778dc191143babbfaa57993f1d275"
  }
}

resource "cloudflare_account_token" "sharedpair_cf_token" {
  account_id = var.account_id
  name       = "sharedpair-cf-token"

  # The provider matches policies and permission groups by list index, and the
  # API returns them in its own order: the account policy first, then the zone
  # policy, and groups sorted by UUID ascending (learned on indri.studio,
  # 2026-05-14). Keep both lists in that order or every apply reports
  # "inconsistent result".
  policies = [
    {
      effect = "allow"
      resources = jsonencode({
        "com.cloudflare.api.account.${var.account_id}" = "*"
      })
      permission_groups = [
        { id = local.permission_groups.workers_r2_storage_write }, # bf74…
        { id = local.permission_groups.workers_scripts_write },    # e086…
      ]
    },
    {
      effect = "allow"
      resources = jsonencode({
        "com.cloudflare.api.account.zone.${var.zone_id}" = "*"
      })
      permission_groups = [
        { id = local.permission_groups.zone_transform_rules_write }, # 0ac9…
        { id = local.permission_groups.workers_routes_write }, # 28f4…
        { id = local.permission_groups.zone_settings_write },  # 3030…
        { id = local.permission_groups.dns_write },            # 4755…
        { id = local.permission_groups.cache_settings_write }, # 9ff8…
        { id = local.permission_groups.zone_write },           # e6d2…
        { id = local.permission_groups.zone_waf_write },       # fb67…
      ]
    },
  ]
}

output "token_value" {
  description = "Narrow token value. task cf-token-rotate pushes it to SSM /sharedpair/cloudflare/api_token."
  value       = cloudflare_account_token.sharedpair_cf_token.value
  sensitive   = true
}
