#!/bin/bash
# Script to activate GitHub Actions CI workflow
# This script copies the CI workflow template to the workflows directory

set -e

echo "🚀 Activating GitHub Actions CI workflow..."
echo ""

# Check if we're in the repository root
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the repository root"
    exit 1
fi

# Check if the template exists
if [ ! -f ".github/workflow-templates/ci.yml" ]; then
    echo "❌ Error: CI workflow template not found at .github/workflow-templates/ci.yml"
    exit 1
fi

# Create workflows directory if it doesn't exist
if [ ! -d ".github/workflows" ]; then
    echo "📁 Creating .github/workflows directory..."
    mkdir -p .github/workflows
fi

# Copy the CI workflow
echo "📋 Copying CI workflow template..."
cp .github/workflow-templates/ci.yml .github/workflows/ci.yml

echo "✅ CI workflow file created at .github/workflows/ci.yml"
echo ""
echo "Next steps:"
echo "1. Review the workflow file: .github/workflows/ci.yml"
echo "2. Commit the changes:"
echo "   git add .github/workflows/ci.yml"
echo "   git commit -m 'ci: activate GitHub Actions CI workflow'"
echo "3. Push to GitHub (requires a token with 'workflow' scope):"
echo "   git push"
echo ""
echo "Note: If you don't have a token with 'workflow' scope, you can:"
echo "  - Use the GitHub UI to create the workflow (see CI_SETUP_INSTRUCTIONS.md)"
echo "  - Create a Personal Access Token with 'workflow' scope"
echo ""
echo "✨ Done!"
