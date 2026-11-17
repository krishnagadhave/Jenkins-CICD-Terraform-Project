# Terraform Infrastructure as Code Verification Script (PowerShell)
# Used in Jenkins Pipeline Terraform Validation Stage
$ErrorActionPreference = "Stop"

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "🏗️  Terraform Infrastructure as Code (IaC) Validation" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $PSScriptRoot
$tfDir = Join-Path $rootDir "terraform"

Write-Host "1. Checking Terraform Canonical Formatting (terraform fmt)..." -ForegroundColor Yellow
terraform -chdir="$tfDir" fmt -check
if ($LASTEXITCODE -eq 0) {
    Write-Host "✔ Terraform configuration files are cleanly formatted." -ForegroundColor Green
} else {
    Write-Error "Terraform files are not formatted properly. Run 'terraform fmt' to fix."
}

Write-Host "`n2. Validating Terraform Configuration Syntax & Schema..." -ForegroundColor Yellow
terraform -chdir="$tfDir" validate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✔ Terraform configuration syntax and schema are 100% VALID!" -ForegroundColor Green
} else {
    Write-Error "Terraform validation failed."
}

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "🎉 TERRAFORM VALIDATION COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host "================================================================`n" -ForegroundColor Green
