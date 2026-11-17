# Local Jenkins Pipeline Runner & Verification Harness (PowerShell)
# Simulates the complete Jenkins Declarative Pipeline locally
$ErrorActionPreference = "Stop"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "🚀 LOCAL JENKINS CI/CD PIPELINE EXECUTION SIMULATOR" -ForegroundColor Cyan
Write-Host "Author: Krishna Gadhave (PRN: 202301040250)" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

$startTime = Get-Date
$rootDir = Split-Path -Parent $PSScriptRoot

# Stage 1: Checkout SCM
Write-Host "`n>>> [STAGE 1/7] CHECKOUT SCM <<<" -ForegroundColor Yellow
$branch = (git rev-parse --abbrev-ref HEAD)
$commit = (git rev-parse --short HEAD)
Write-Host "✔ Git Repository detected: Branch: $branch, Commit: $commit" -ForegroundColor Green

# Stage 2: Environment Check
Write-Host "`n>>> [STAGE 2/7] ENVIRONMENT & TOOLING CHECK <<<" -ForegroundColor Yellow
Write-Host "Node.js:   $(node -v)" -ForegroundColor Green
Write-Host "NPM:       $(npm -v)" -ForegroundColor Green
$tfVer = (terraform -version | Select-Object -First 1)
Write-Host "Terraform: $tfVer" -ForegroundColor Green

# Stage 3: Static Code Analysis & Linting
Write-Host "`n>>> [STAGE 3/7] CODE QUALITY & LINTING <<<" -ForegroundColor Yellow
node (Join-Path $rootDir "scripts/lint-check.js")
if ($LASTEXITCODE -ne 0) { throw "Stage 3 failed." }

# Stage 4: Automated Testing
Write-Host "`n>>> [STAGE 4/7] AUTOMATED UNIT & INTEGRATION TESTS <<<" -ForegroundColor Yellow
node (Join-Path $rootDir "scripts/test-runner.js")
if ($LASTEXITCODE -ne 0) { throw "Stage 4 failed." }

# Stage 5: Build & Production Packaging
Write-Host "`n>>> [STAGE 5/7] BUILD & PACKAGING <<<" -ForegroundColor Yellow
node (Join-Path $rootDir "scripts/build.js")
if ($LASTEXITCODE -ne 0) { throw "Stage 5 failed." }

# Stage 6: Terraform Infrastructure as Code Validation
Write-Host "`n>>> [STAGE 6/7] TERRAFORM VALIDATION <<<" -ForegroundColor Yellow
$tfDir = Join-Path $rootDir "terraform"
terraform -chdir="$tfDir" fmt -check
if ($LASTEXITCODE -ne 0) { throw "Terraform formatting check failed." }
terraform -chdir="$tfDir" validate
if ($LASTEXITCODE -ne 0) { throw "Terraform validation failed." }

# Stage 7: Automated Deployment & Verification
Write-Host "`n>>> [STAGE 7/7] AUTOMATED DEPLOYMENT & HEALTH SMOKE TEST <<<" -ForegroundColor Yellow
node (Join-Path $rootDir "scripts/deploy-verify.js")
if ($LASTEXITCODE -ne 0) { throw "Stage 7 failed." }

$elapsed = ((Get-Date) - $startTime).TotalSeconds
Write-Host "`n==================================================================" -ForegroundColor Green
Write-Host "🎉 ENTIRE CI/CD PIPELINE EXECUTED WITH 100% SUCCESS!" -ForegroundColor Green
Write-Host "   Total Stages Passed: 7 / 7" -ForegroundColor Green
Write-Host "   Pipeline Duration:   $([math]::Round($elapsed, 2)) seconds" -ForegroundColor Green
Write-Host "   JUnit Test Report:   reports/junit.xml" -ForegroundColor Green
Write-Host "   Release Artifact:    dist/" -ForegroundColor Green
Write-Host "==================================================================`n" -ForegroundColor Green
