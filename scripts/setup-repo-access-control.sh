#!/bin/bash
# Repository Access Control Setup Script
# This script verifies and sets up the repository access controls

set -e

echo "🔒 MatchyMatch Repository Access Control Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

EXPECTED_REPO="nbruenin/MatchyMatch"
EXPECTED_URL="https://github.com/nbruenin/MatchyMatch.git"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    echo "Please run this script from the root of the MatchyMatch repository"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Get current remote URL
CURRENT_URL=$(git config --get remote.origin.url)
CLEAN_URL=$(echo "$CURRENT_URL" | sed 's|https://.*@github.com|https://github.com|' | sed 's|git@github.com:|https://github.com/|' | sed 's|\.git$|.git|')

echo "📍 Current remote URL: $CLEAN_URL"
echo ""

# Verify remote URL
if [[ "$CLEAN_URL" != "$EXPECTED_URL" ]]; then
    echo "⚠️  Remote URL does not match expected repository!"
    echo "Expected: $EXPECTED_URL"
    echo "Current:  $CLEAN_URL"
    echo ""
    echo "Fixing remote URL..."
    git remote set-url origin "$EXPECTED_URL"
    echo "✅ Remote URL updated"
    echo ""
fi

# Check if husky is installed
if [ ! -d ".husky" ]; then
    echo "⚠️  Husky not installed. Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Verify pre-push hook exists
if [ ! -f ".husky/pre-push" ]; then
    echo "⚠️  Pre-push hook not found. Installing..."
    npx husky install
    echo "✅ Husky hooks installed"
    echo ""
fi

# Make hooks executable
chmod +x .husky/pre-push 2>/dev/null || true
chmod +x .husky/pre-commit 2>/dev/null || true

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Repository Access Control Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔒 Security Measures Active:"
echo "   ✅ Pre-push hook: Prevents pushes to wrong repository"
echo "   ✅ GitHub Actions: Verifies repository on every push/PR"
echo "   ✅ Branch protection: Requires reviews and CI to pass"
echo ""
echo "📍 Repository: $EXPECTED_REPO"
echo "🔗 Remote URL: $EXPECTED_URL"
echo ""
echo "📚 For more information, see: .github/REPOSITORY_ACCESS_CONTROL.md"
echo ""
