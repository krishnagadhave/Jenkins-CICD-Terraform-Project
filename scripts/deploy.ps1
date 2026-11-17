# Automated Deployment & Health Verification Script (PowerShell)
# Used in Jenkins Pipeline Deployment Stage or standalone execution
param (
    [string]$TargetEnv = "production",
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "🚀 Automated Continuous Deployment Stage ($TargetEnv)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $PSScriptRoot
$verifyScript = Join-Path $rootDir "scripts/deploy-verify.js"

$env:PORT = "$Port"
$env:NODE_ENV = "$TargetEnv"
$env:APP_NAME = "Cloud-Native CI/CD Microservice"

node "$verifyScript"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✔ Deployment successfully established on environment '$TargetEnv'." -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Deployment failed verification." -ForegroundColor Red
    exit 1
}
