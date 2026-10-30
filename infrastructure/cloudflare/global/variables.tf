variable "account_id" {
  description = "Cloudflare account ID. Not secret."
  type        = string
  default     = "f7e1e6cd8b3414a6d2226152533c21f2"
}

variable "domain" {
  description = "Apex domain."
  type        = string
  default     = "sharedpair.dev"
}

variable "worker_name" {
  description = "Wrangler Worker name (matches `name` in wrangler.toml)."
  type        = string
  default     = "sharedpair-dev"
}

variable "apt_bucket" {
  description = "R2 bucket served at apt.<domain>."
  type        = string
  default     = "sharedpair-apt"
}

# IDs of objects created by hand on 2026-10-30, needed only by imports.tf.
# Looked up with the narrow token after bootstrap; none are secret.

variable "zone_id" {
  description = "sharedpair.dev zone ID."
  type        = string
}

variable "waf_custom_ruleset_id" {
  description = "Zone entrypoint ruleset for phase http_request_firewall_custom (holds block-ovh-apt-crawler)."
  type        = string
}

variable "cache_ruleset_id" {
  description = "Zone entrypoint ruleset for phase http_request_cache_settings (holds cache-apt-repo)."
  type        = string
}

variable "apex_domain_id" {
  description = "Workers custom-domain ID for sharedpair.dev."
  type        = string
}

variable "www_domain_id" {
  description = "Workers custom-domain ID for www.sharedpair.dev."
  type        = string
}
