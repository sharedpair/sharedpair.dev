# The APT repo bucket. It was created by hand before this config existed
# (no creation code in either repo's history), so it's imported.

resource "cloudflare_r2_bucket" "apt" {
  account_id = var.account_id
  name       = var.apt_bucket

  lifecycle {
    prevent_destroy = true
  }
}
