# Repository Access Control & Security

This document explains the security measures in place to ensure code can only be committed, pushed, and merged to the correct repository: **nbruenin/MatchyMatch**.

## 🔒 Security Layers

### 1. **Pre-Push Git Hook** (Local - Prevents Accidental Pushes)

**File:** `.husky/pre-push`

**What it does:**
- Runs automatically before every `git push`
- Verifies the remote URL is `https://github.com/nbruenin/MatchyMatch.git`
- Blocks pushes to any other repository
- Provides clear error messages and fix instructions

**How it works:**
```bash
$ git push
🔒 Pre-push verification...
Repository: https://github.com/nbruenin/MatchyMatch.git
✅ Repository verified: nbruenin/MatchyMatch
```

**If wrong repository:**
```bash
$ git push
🔒 Pre-push verification...
Repository: https://github.com/wrong-user/wrong-repo.git
❌ PUSH BLOCKED: Incorrect repository!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are attempting to push to: https://github.com/wrong-user/wrong-repo.git
But this repository should only push to: https://github.com/nbruenin/MatchyMatch.git
...
```

### 2. **GitHub Actions Verification** (Remote - Prevents Merges from Wrong Repo)

**File:** `.github/workflows/verify-remote.yml`

**What it does:**
- Runs on every push and pull request
- Verifies the repository owner is `nbruenin`
- Verifies the remote URL is correct
- Checks that the repository is not a fork
- Blocks CI/CD if any verification fails

**Checks performed:**
1. ✅ Remote URL verification
2. ✅ Fork detection
3. ✅ Repository owner verification

**Result:**
- If any check fails, the CI workflow fails
- Pull requests cannot be merged without passing CI
- Prevents code from wrong repositories from being merged

### 3. **Branch Protection Rules** (GitHub - Prevents Direct Merges)

**Configuration:**
- Require pull request reviews before merge
- Require CI checks to pass (including verify-remote)
- Require code owner approval
- Dismiss stale pull request approvals

**Effect:**
- No direct pushes to `main` or `develop`
- All code must go through pull requests
- All CI checks (including repository verification) must pass
- Code owners must review and approve

---

## 🛡️ Security Guarantees

| Scenario | Protection | How |
|----------|-----------|-----|
| Accidental push to wrong repo | ✅ Blocked | Pre-push hook |
| Cloned from fork | ✅ Blocked | Pre-push hook + CI |
| Wrong remote URL configured | ✅ Blocked | Pre-push hook + CI |
| Direct push to main | ✅ Blocked | Branch protection |
| Merge from wrong repo | ✅ Blocked | CI verification |
| Fork attempting to merge | ✅ Blocked | CI fork detection |

---

## 🚀 Setup Instructions

### For Developers

After cloning the repository, the security measures are **automatically active**:

```bash
# Clone the repository
git clone https://github.com/nbruenin/MatchyMatch.git
cd MatchyMatch

# Install dependencies (includes husky setup)
npm install

# Husky automatically installs git hooks
# Pre-push hook is now active!
```

**Verify setup:**
```bash
# Check that pre-push hook is installed
ls -la .husky/pre-push

# Should output:
# -rwxr-xr-x  1 user  group  1234 Jun  4 16:47 .husky/pre-push
```

### For Repository Administrators

1. **Verify GitHub Actions is enabled:**
   - Go to: Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected

2. **Verify branch protection rules:**
   - Go to: Settings → Branches → Branch protection rules
   - Ensure `main` and `develop` have protection enabled
   - Require status checks to pass (including `verify-remote`)

3. **Monitor CI runs:**
   - Go to: Actions tab
   - Verify `verify-remote` workflow runs on all pushes/PRs

---

## 🔍 How to Verify It's Working

### Test 1: Verify Pre-Push Hook

```bash
# Try to change the remote to a wrong URL
git remote set-url origin https://github.com/wrong-user/wrong-repo.git

# Try to push
git push

# Expected output:
# ❌ PUSH BLOCKED: Incorrect repository!
# ...
```

**Fix it:**
```bash
git remote set-url origin https://github.com/nbruenin/MatchyMatch.git
```

### Test 2: Verify CI Workflow

1. Create a test branch
2. Make a small change
3. Push to GitHub
4. Go to Actions tab
5. Verify `Verify Remote Repository` workflow runs
6. Verify it passes

### Test 3: Verify Branch Protection

1. Try to push directly to `main` (should fail)
2. Create a pull request instead
3. Verify CI checks run
4. Verify code owner review is required

---

## 📋 Configuration Details

### Pre-Push Hook Configuration

**Location:** `.husky/pre-push`

**Checks:**
- Remote URL matches `https://github.com/nbruenin/MatchyMatch.git`
- Handles both HTTPS and SSH URLs
- Strips credentials for safe comparison
- Provides clear error messages

**Bypass (NOT RECOMMENDED):**
```bash
# Only if absolutely necessary
git push --no-verify

# ⚠️ This disables ALL pre-push hooks
# Use only in emergencies
```

### GitHub Actions Configuration

**Location:** `.github/workflows/verify-remote.yml`

**Triggers:**
- On every push to any branch
- On every pull request
- On pull request synchronization

**Checks:**
1. Remote URL verification
2. Fork detection
3. Repository owner verification

**Failure handling:**
- Workflow fails if any check fails
- CI status shows as failed
- Pull requests cannot be merged

---

## ⚠️ Important Notes

### Credentials in Git Config

The `.git/config` file may contain credentials in the remote URL:
```
[remote "origin"]
    url = https://ghp_xxxxx@github.com/nbruenin/MatchyMatch.git
```

**Security notes:**
- ✅ This file is NOT committed to the repository (in `.gitignore`)
- ✅ Credentials are stripped before comparison
- ✅ Never commit `.git/config` to the repository
- ✅ Use GitHub Personal Access Tokens (not passwords)
- ✅ Rotate tokens regularly

### SSH vs HTTPS

Both are supported:
- HTTPS: `https://github.com/nbruenin/MatchyMatch.git`
- SSH: `git@github.com:nbruenin/MatchyMatch.git`

The verification normalizes both formats for comparison.

---

## 🆘 Troubleshooting

### Issue: Pre-push hook not running

**Solution:**
```bash
# Reinstall husky
npm install

# Or manually install hooks
npx husky install
```

### Issue: "PUSH BLOCKED: Incorrect repository"

**Solution:**
```bash
# Check current remote
git remote -v

# Fix remote URL
git remote set-url origin https://github.com/nbruenin/MatchyMatch.git

# Verify
git remote -v
```

### Issue: CI workflow not running

**Solution:**
1. Verify GitHub Actions is enabled in Settings
2. Check that `.github/workflows/verify-remote.yml` exists
3. Verify branch protection rules are configured
4. Check Actions tab for any errors

### Issue: Can't bypass pre-push hook

**Emergency bypass (NOT RECOMMENDED):**
```bash
git push --no-verify
```

**⚠️ WARNING:** This disables ALL pre-push hooks. Use only in emergencies and notify the team.

---

## 📚 Related Documentation

- **CONTRIBUTING.md** - Development guidelines
- **SECURITY.md** - Security policy and vulnerability reporting
- **GITHUB_BRANCH_PROTECTION_SETUP.md** - Branch protection configuration
- **PRE_COMMIT_HOOKS_SETUP_SUMMARY.md** - Pre-commit hook details

---

## 🎯 Summary

Your repository is now secured with **three layers of protection**:

1. ✅ **Local validation** - Pre-push hook prevents wrong pushes
2. ✅ **Remote validation** - GitHub Actions verifies on every push/PR
3. ✅ **Branch protection** - Requires reviews and CI to pass before merge

**Result:** Code can ONLY be committed, pushed, and merged to `nbruenin/MatchyMatch`. No other repository is accessible.
