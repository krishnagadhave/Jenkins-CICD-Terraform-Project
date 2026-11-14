#!/usr/bin/env bash
# Local Jenkins Pipeline Runner & Verification Harness (Bash)
# Simulates the complete Jenkins Declarative Pipeline locally
set -e

echo "=================================================================="
echo "🚀 LOCAL JENKINS CI/CD PIPELINE EXECUTION SIMULATOR"
echo "Author: Krishna Gadhave (PRN: 202301040250)"
echo "=================================================================="

START_TIME=$(date +%s)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Stage 1: Checkout SCM
echo ""
echo ">>> [STAGE 1/7] CHECKOUT SCM <<<"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "local")
echo "✔ Git Repository: Branch: $BRANCH, Commit: $COMMIT"

# Stage 2: Environment Check
echo ""
echo ">>> [STAGE 2/7] ENVIRONMENT & TOOLING CHECK <<<"
echo "Node.js:   $(node -v)"
echo "NPM:       $(npm -v)"
echo "Terraform: $(terraform -version | head -n 1)"

# Stage 3: Static Code Analysis & Linting
echo ""
echo ">>> [STAGE 3/7] CODE QUALITY & LINTING <<<"
node "$ROOT_DIR/scripts/lint-check.js"

# Stage 4: Automated Testing
echo ""
echo ">>> [STAGE 4/7] AUTOMATED UNIT & INTEGRATION TESTS <<<"
node "$ROOT_DIR/scripts/test-runner.js"

# Stage 5: Build & Packaging
echo ""
echo ">>> [STAGE 5/7] BUILD & PACKAGING <<<"
node "$ROOT_DIR/scripts/build.js"

# Stage 6: Terraform Validation
echo ""
echo ">>> [STAGE 6/7] TERRAFORM VALIDATION <<<"
terraform -chdir="$ROOT_DIR/terraform" fmt -check
terraform -chdir="$ROOT_DIR/terraform" validate

# Stage 7: Automated Deployment
echo ""
echo ">>> [STAGE 7/7] AUTOMATED DEPLOYMENT & HEALTH SMOKE TEST <<<"
node "$ROOT_DIR/scripts/deploy-verify.js"

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo ""
echo "=================================================================="
echo "🎉 ENTIRE CI/CD PIPELINE EXECUTED WITH 100% SUCCESS!"
echo "   Total Stages Passed: 7 / 7"
echo "   Pipeline Duration:   ${ELAPSED} seconds"
echo "   JUnit Test Report:   reports/junit.xml"
echo "   Release Artifact:    dist/"
echo "=================================================================="
echo ""
