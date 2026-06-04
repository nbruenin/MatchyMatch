# Repository Access Control - Manual Setup Guide

## ⚠️ Token Limitation

The current Personal Access Token lacks the `workflow` scope needed to push GitHub Actions workflow files. This is a GitHub security measure.

## ✅ What's Ready (Can Be Pushed)

The following files are ready and can be pushed with the current token:

1. ✅ `.husky/pre-push` - Pre-push hook (local validation)
2. ✅ `.husky/verify-repo` - Repository verification helper
3. ✅ `.github/REPOSITORY_ACCESS_CONTROL.md` - Security documentation
4. ✅ `.github/REPOSITORY_ACCESS_CONTROL_IMPLEMENTATION.md` - Implementation guide
5. ✅ `scripts/setup-repo-access-control.sh` - Setup script
6. ✅ `README.md` - Updated with security information

## ⚠️ What Needs Manual Setup (Requires `workflow` Scope)

The following file needs to be added manually:

1. ⚠️ `.github/workflows/verify-remote.yml` - GitHub Actions workflow

## 🚀 How to Complete the Setup

### Option 1: Use a Token with `workflow` Scope (Recommended)

1. **Generate a new Personal Access Token with `workflow` scope:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`, `admin:repo_hook`
   - Copy the token

2. **Update git credentials:**
   ```bash
   git remote set-url origin https://<NEW_TOKEN>@github.com/nbruenin/MatchyMatch.git
   ```

3. **Push the changes:**
   ```bash
   git push
   ```

### Option 2: Add Workflow File via GitHub Web Interface

1. **Go to GitHub repository:**
   - https://github.com/nbruenin/MatchyMatch

2. **Create the workflow file:**
   - Click "Add file" → "Create new file"
   - Path: `.github/workflows/verify-remote.yml`
   - Copy content from below

3. **Paste the workflow content:**
   - See "Workflow File Content" section below

4. **Commit the file:**
   - Click "Commit new file"
   - Message: "feat: Add GitHub Actions workflow to verify repository"

### Option 3: Ask Repository Owner

If you don't have access to create tokens or use the web interface, ask the repository owner (nbruenin) to push the workflow file.

---

## 📄 Workflow File Content

Copy this content and create `.github/workflows/verify-remote.yml`:

```yaml
name: Verify Remote Repository

on:
  push:
    branches: ['**']
  pull_request:
    branches: ['**']

jobs:
  verify-remote:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Verify remote URL
        run: |
          REMOTE_URL=$(git config --get remote.origin.url)
          EXPECTED_URL="https://github.com/nbruenin/MatchyMatch.git"
          
          # Remove credentials from URL for comparison
          CLEAN_URL=$(echo "$REMOTE_URL" | sed 's|https://.*@github.com|https://github.com|')
          
          echo "Remote URL: $CLEAN_URL"
          echo "Expected URL: $EXPECTED_URL"
          
          if [[ "$CLEAN_URL" != "$EXPECTED_URL" ]]; then
            echo "❌ ERROR: Remote repository is not the correct one!"
            echo "Expected: $EXPECTED_URL"
            echo "Got: $CLEAN_URL"
            exit 1
          fi
          
          echo "✅ Remote repository verified: nbruenin/MatchyMatch"

      - name: Verify no fork pushes
        run: |
          # Check if this is a fork
          if [ "${{ github.event.repository.fork }}" = "true" ]; then
            echo "❌ ERROR: This repository appears to be a fork!"
            echo "Code should only be pushed to the main repository: nbruenin/MatchyMatch"
            exit 1
          fi
          
          echo "✅ Repository is not a fork"

      - name: Verify repository owner
        run: |
          OWNER="${{ github.repository_owner }}"
          EXPECTED_OWNER="nbruenin"
          
          if [[ "$OWNER" != "$EXPECTED_OWNER" ]]; then
            echo "❌ ERROR: Repository owner is incorrect!"
            echo "Expected owner: $EXPECTED_OWNER"
            echo "Got owner: $OWNER"
            exit 1
          fi
          
          echo "✅ Repository owner verified: $OWNER"
```

---

## ✅ What's Already Implemented

### Pre-Push Hook (Local Validation)

**File:** `.husky/pre-push`

This hook is **already installed** and will:
- Run before every `git push`
- Validate the remote URL
- Block pushes to wrong repositories
- Provide clear error messages

**Status:** ✅ Ready to use immediately

### Setup Script

**File:** `scripts/setup-repo-access-control.sh`

Developers can run this to:
- Verify repository configuration
- Fix common issues
- Ensure hooks are installed

**Usage:**
```bash
bash scripts/setup-repo-access-control.sh
```

### Documentation

**Files:**
- `.github/REPOSITORY_ACCESS_CONTROL.md` - Complete security guide
- `.github/REPOSITORY_ACCESS_CONTROL_IMPLEMENTATION.md` - Implementation details

**Status:** ✅ Ready to reference

---

## 📋 Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Pre-push hook | ✅ Ready | Installed via husky |
| Setup script | ✅ Ready | Can be run by developers |
| Documentation | ✅ Ready | Complete and comprehensive |
| GitHub Actions workflow | ⚠️ Manual | Requires `workflow` scope or web UI |
| Branch protection | ⚠️ Manual | Requires GitHub UI setup |

---

## 🎯 Next Steps

1. **Push the local files** (Option 1 or ask owner)
2. **Add the workflow file** (Option 2 or ask owner)
3. **Setup branch protection** (GitHub UI)
4. **Test the security measures**
5. **Communicate to team**

---

## 🔐 Security Without GitHub Actions (Temporary)

Until the GitHub Actions workflow is added, the pre-push hook provides **local protection**:

✅ **What's protected:**
- Prevents accidental pushes to wrong repository
- Validates remote URL on every push
- Blocks pushes with clear error messages

⚠️ **What's not protected (until workflow is added):**
- Remote verification (GitHub Actions)
- Fork detection
- CI enforcement

---

## 📞 Support

### For Developers

If you encounter issues:

1. **Pre-push hook not working:**
   ```bash
   npm install
   npx husky install
   ```

2. **Need to bypass (emergency only):**
   ```bash
   git push --no-verify
   ```

### For Repository Owner

To complete the setup:

1. Generate token with `workflow` scope
2. Push the workflow file
3. Setup branch protection rules
4. Communicate to team

---

## ✨ Summary

**Current Status:**
- ✅ Pre-push hook: Ready and working
- ✅ Local validation: Active
- ⚠️ GitHub Actions: Needs manual setup
- ⚠️ Branch protection: Needs manual setup

**Next:** Add the GitHub Actions workflow file and setup branch protection rules to complete the enterprise-grade access control.

---

**For detailed information, see:**
- `.github/REPOSITORY_ACCESS_CONTROL.md` - Complete security guide
- `.github/REPOSITORY_ACCESS_CONTROL_IMPLEMENTATION.md` - Implementation details
