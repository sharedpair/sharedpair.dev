terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  profile = "sharedpair-terraform"
  region  = "us-west-2"

  default_tags {
    tags = {
      Project     = "sharedpair"
      ManagedBy   = "Terraform"
      Environment = "prod"
    }
  }
}

data "aws_caller_identity" "current" {}

data "aws_iam_user" "self" {
  user_name = "sharedpair-terraform"
}
