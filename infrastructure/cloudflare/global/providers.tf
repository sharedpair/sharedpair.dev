# Cloudflare provider for the sharedpair.dev zone. The S3 state backend is in
# backend.tf.
#
# CLOUDFLARE_API_TOKEN comes from the environment: `task secrets-pull` writes it
# from SSM /sharedpair/cloudflare/api_token (the narrow sharedpair-cf-token
# minted by ../iam-self).

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
