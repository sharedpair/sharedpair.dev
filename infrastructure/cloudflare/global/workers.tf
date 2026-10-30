# Bind the sharedpair-dev Worker to the apex and www. Today wrangler.toml also
# declares these as [[routes]] custom domains; once this is applied, those
# blocks come out of wrangler.toml so the two tools never fight over them.
#
# apt.<domain> is deliberately NOT a Worker domain. It's an R2 custom domain on
# the sharedpair-apt bucket, so APT traffic never counts against the
# account-wide Workers request limit. The provider can't import
# cloudflare_r2_custom_domain, so that binding lives outside this config; see
# ../README.md.

resource "cloudflare_workers_custom_domain" "apex" {
  account_id = var.account_id
  zone_id    = cloudflare_zone.sharedpair.id
  hostname   = var.domain
  service    = var.worker_name
}

resource "cloudflare_workers_custom_domain" "www" {
  account_id = var.account_id
  zone_id    = cloudflare_zone.sharedpair.id
  hostname   = "www.${var.domain}"
  service    = var.worker_name
}
