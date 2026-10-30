# The sharedpair.dev zone (Free plan). Imported, never created here, and
# protected so a stray destroy can't take the domain off Cloudflare.

resource "cloudflare_zone" "sharedpair" {
  account = {
    id = var.account_id
  }
  name = var.domain
  type = "full"

  lifecycle {
    prevent_destroy = true
  }
}
