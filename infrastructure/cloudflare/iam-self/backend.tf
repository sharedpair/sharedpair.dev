terraform {
  backend "s3" {
    bucket         = "sharedpair-terraform-state"
    key            = "iam-self/terraform.tfstate"
    region         = "us-west-2"
    use_lockfile   = true
    encrypt        = true
    profile        = "sharedpair-terraform"
  }
}
