# Browser Cache TTL = 0 means "respect existing headers": clients get the
# Cache-Control that deploy-sharedpair-r2.sh stored on each object. The zone
# default (14400 s) was overriding InRelease's max-age=60, so a downstream
# proxy could serve a stale InRelease for up to 4 h after a publish (found by
# the 2026-10-30 verification run, step 3).
resource "cloudflare_zone_setting" "browser_cache_ttl" {
  zone_id    = cloudflare_zone.sharedpair.id
  setting_id = "browser_cache_ttl"
  value      = 0
}
