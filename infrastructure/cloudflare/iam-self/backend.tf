terraform {
  backend "s3" {
    bucket         = "sharedpair-terraform-state"
    key            = "iam-self/terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "sharedpair-terraform-locks"
    encrypt        = true
    profile        = "sharedpair-terraform"
  }
}
