# AWS Provider Configuration
# Project: Cloud Native Jenkins CI/CD + Terraform Mini Project
# Author: Krishna Gadhave (PRN: 202301040250)

provider "aws" {
  region = var.aws_region

  # Default tags automatically applied to all provisioned infrastructure
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Author      = "Krishna Gadhave"
      PRN         = "202301040250"
      Course      = "Cloud Native Computing & DevOps"
    }
  }

  # Safe dry-run & local validation compatibility options
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
}
