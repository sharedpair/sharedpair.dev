# Mints the narrow sharedpair-cf-token. Runs with the one-shot BOOTSTRAP token
# (User → API Tokens: Edit + Account → Account API Tokens: Edit), which
# `task tf-apply-iam` reads from SSM /sharedpair/cloudflare/bootstrap_token.
# The narrow token deliberately can't manage tokens, so every rotation needs a
# fresh bootstrap token. See ../README.md.

terraform {
  required_version = ">= 1.5"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.28"
    }
  }
}

provider "cloudflare" {
  # api_token sourced from CLOUDFLARE_API_TOKEN env var.
}
