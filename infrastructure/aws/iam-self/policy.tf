# Everything sharedpair-terraform may do in AWS. Widen here, never in the console.
#
# The project's AWS footprint is small: the Terraform state bucket and lock
# table, and SSM parameters under /sharedpair/*.

locals {
  account_id = data.aws_caller_identity.current.account_id
}

resource "aws_iam_policy" "scoped" {
  name        = "sharedpair-terraform-scoped"
  description = "Scoped permissions for sharedpair-terraform. Widen here, never in the console."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3ProjectScope"
        Effect = "Allow"
        Action = ["s3:*"]
        Resource = [
          "arn:aws:s3:::sharedpair-*",
          "arn:aws:s3:::sharedpair-*/*",
        ]
      },
      {
        Sid      = "DynamoDBProjectScope"
        Effect   = "Allow"
        Action   = ["dynamodb:*"]
        Resource = "arn:aws:dynamodb:*:${local.account_id}:table/sharedpair-*"
      },
      {
        Sid    = "SSMProjectScope"
        Effect = "Allow"
        Action = [
          "ssm:GetParameter", "ssm:GetParameters", "ssm:GetParametersByPath",
          "ssm:PutParameter", "ssm:DeleteParameter", "ssm:DeleteParameters",
          "ssm:AddTagsToResource", "ssm:RemoveTagsFromResource", "ssm:ListTagsForResource",
          "ssm:GetParameterHistory",
        ]
        Resource = "arn:aws:ssm:*:${local.account_id}:parameter/sharedpair/*"
      },
      {
        # SecureString parameters use the AWS-managed aws/ssm key.
        Sid      = "KMSForSSM"
        Effect   = "Allow"
        Action   = ["kms:Decrypt", "kms:Encrypt", "kms:GenerateDataKey"]
        Resource = "*"
        Condition = {
          StringEquals = { "kms:ViaService" = "ssm.us-west-2.amazonaws.com" }
        }
      },
      {
        # Attach only this project's own policies. Without the condition the
        # user could re-attach AdministratorAccess to itself and undo the
        # narrowing.
        Sid      = "IAMSelfAttachProjectPoliciesOnly"
        Effect   = "Allow"
        Action   = ["iam:AttachUserPolicy"]
        Resource = "arn:aws:iam::${local.account_id}:user/sharedpair-terraform"
        Condition = {
          ArnLike = { "iam:PolicyARN" = "arn:aws:iam::${local.account_id}:policy/sharedpair-*" }
        }
      },
      {
        Sid    = "IAMSelfManagement"
        Effect = "Allow"
        Action = [
          "iam:DetachUserPolicy", "iam:ListAttachedUserPolicies",
          "iam:CreatePolicyVersion", "iam:DeletePolicyVersion", "iam:ListPolicyVersions",
          "iam:GetPolicy", "iam:GetPolicyVersion", "iam:CreatePolicy", "iam:DeletePolicy",
          "iam:GetUser", "iam:TagUser", "iam:UntagUser", "iam:TagPolicy", "iam:UntagPolicy",
          "iam:SimulatePrincipalPolicy",
        ]
        Resource = [
          "arn:aws:iam::${local.account_id}:user/sharedpair-terraform",
          "arn:aws:iam::${local.account_id}:policy/sharedpair-*",
        ]
      },
      {
        Sid      = "ReadOnlyBasics"
        Effect   = "Allow"
        Action   = ["sts:GetCallerIdentity", "ssm:DescribeParameters", "s3:ListAllMyBuckets"]
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_user_policy_attachment" "scoped" {
  user       = data.aws_iam_user.self.user_name
  policy_arn = aws_iam_policy.scoped.arn
}
