# Edge rules added by hand during the 2026-10-29 apt flood and imported here.
# See ~/shared-electron/docs/investigations/2026-10-30-apt-flood-cloudflare-1027.md

# Block the two OVH Public Cloud /48s that flooded apt.sharedpair.dev
# (2026-09-30 and 2026-10-29). Blocked at the edge: no Worker run, no R2 read.
resource "cloudflare_ruleset" "waf_custom" {
  zone_id = cloudflare_zone.sharedpair.id
  name    = "default"
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  rules = [
    {
      description = "block-ovh-apt-crawler"
      expression  = "(ip.src in {2001:41d0:701::/48 2001:41d0:801::/48})"
      action      = "block"
      enabled     = true
    },
  ]
}

# Cache the APT repo at the edge, honouring the Cache-Control values that
# scripts/deploy-sharedpair-r2.sh sets on upload (immutable generations,
# 300 s indexes, 60 s Release files).
resource "cloudflare_ruleset" "cache" {
  zone_id = cloudflare_zone.sharedpair.id
  name    = "default"
  kind    = "zone"
  phase   = "http_request_cache_settings"

  rules = [
    {
      description = "cache-apt-repo"
      expression  = "(http.host eq \"apt.${var.domain}\")"
      action      = "set_cache_settings"
      # Edge TTL defaults to the origin's Cache-Control, so nothing else is set
      # (matches the rule as created in the dashboard).
      action_parameters = {
        cache = true
      }
      enabled = true
    },
  ]
}
