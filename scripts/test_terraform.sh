#!/usr/bin/env bash
# Terraform Infrastructure as Code Verification Script (Bash)
# Used in Jenkins Pipeline Terraform Validation Stage
set -e

echo ""
echo "================================================================"
echo "🏗️  Terraform Infrastructure as Code (IaC) Validation"
echo "================================================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF_DIR="$(dirname "$SCRIPT_DIR")/terraform"

echo "1. Checking Terraform Canonical Formatting (terraform fmt)..."
terraform -chdir="$TF_DIR" fmt -check
echo "✔ Terraform configuration files are cleanly formatted."

echo ""
echo "2. Validating Terraform Configuration Syntax & Schema..."
terraform -chdir="$TF_DIR" validate
echo "✔ Terraform configuration syntax and schema are 100% VALID!"

echo ""
echo "================================================================"
echo "🎉 TERRAFORM VALIDATION COMPLETED SUCCESSFULLY"
echo "================================================================"
echo ""
