# One-time adoption of objects created by hand (zone at signup, bucket before
# IaC, rules on 2026-10-30). Once the first apply has recorded them in state,
# these blocks are no-ops and can be deleted along with the *_id variables.

import {
  to = cloudflare_zone.sharedpair
  id = var.zone_id
}

import {
  to = cloudflare_ruleset.waf_custom
  id = "zones/${var.zone_id}/${var.waf_custom_ruleset_id}"
}

import {
  to = cloudflare_ruleset.cache
  id = "zones/${var.zone_id}/${var.cache_ruleset_id}"
}

import {
  to = cloudflare_workers_custom_domain.apex
  id = "${var.account_id}/${var.apex_domain_id}"
}

import {
  to = cloudflare_workers_custom_domain.www
  id = "${var.account_id}/${var.www_domain_id}"
}

# Jurisdiction "default": the bucket isn't EU- or FedRAMP-restricted.
import {
  to = cloudflare_r2_bucket.apt
  id = "${var.account_id}/${var.apt_bucket}/default"
}
