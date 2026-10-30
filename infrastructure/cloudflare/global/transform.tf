# Directory indexes on the APT host. The old Worker rewrote a trailing "/" to
# index.html; an R2 custom domain doesn't, so since the 2026-10-30 cut-over
# https://apt.sharedpair.dev/ returned 404 (verification step 6). APT clients
# never request "/", but people do.
resource "cloudflare_ruleset" "transform" {
  zone_id = cloudflare_zone.sharedpair.id
  name    = "default"
  kind    = "zone"
  phase   = "http_request_transform"

  rules = [
    {
      description = "apt-directory-index"
      expression  = "(http.host eq \"apt.${var.domain}\" and ends_with(http.request.uri.path, \"/\"))"
      action      = "rewrite"
      action_parameters = {
        uri = {
          path = {
            expression = "concat(http.request.uri.path, \"index.html\")"
          }
        }
      }
      enabled = true
    },
  ]
}
