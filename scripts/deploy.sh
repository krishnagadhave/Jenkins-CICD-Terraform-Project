#!/usr/bin/env bash
# Automated Deployment & Health Verification Script (Bash)
# Used in Jenkins Linux Agent or Docker execution
set -e

TARGET_ENV="${1:-production}"
PORT="${2:-3000}"

echo ""
echo "================================================================"
echo "🚀 Automated Continuous Deployment Stage ($TARGET_ENV)"
echo "================================================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
VERIFY_SCRIPT="$ROOT_DIR/scripts/deploy-verify.js"

export PORT="$PORT"
export NODE_ENV="$TARGET_ENV"
export APP_NAME="Cloud-Native CI/CD Microservice"

node "$VERIFY_SCRIPT"

if [ $? -eq 0 ]; then
    echo "✔ Deployment successfully established on environment '$TARGET_ENV'."
    exit 0
else
    echo "❌ Deployment failed verification."
    exit 1
fi
