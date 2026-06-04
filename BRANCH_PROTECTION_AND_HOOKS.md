# Branch Protection Rules & Pre-commit Hooks Setup

## Overview

This document provides setup instructions for:

1. **Pre-commit Hooks** - Automated code quality checks before commits (✅ IMPLEMENTED)
2. **Branch Protection Rules** - GitHub UI configuration to enforce code quality standards

---

## Part 1: Pre-commit Hooks (✅ IMPLEMENTED)

### What's Installed

- **husky** - Git hooks manager
- **lint-staged** - Run linters on staged files
- **prettier** - Code formatter

### How It Works

When you run `git commit`, the pre-commit hook automatically:

1. **Lints staged JavaScript/TypeScript files** with ESLint
2. **Auto-fixes linting issues** where possible
3. **Formats all staged files** with Prettier
4. **Prevents commits** if there are unfixable linting errors

### Configuration

The configuration is in `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

### Usage

#### For Developers

**Normal workflow - no changes needed:**

```bash
git add .
git commit -m "Your message"
# Pre-commit hook runs automatically
```

**If linting fails:**

- ESLint auto-fixes most issues
- Review any remaining errors
- Fix manually if needed
- Try committing again

**To bypass hooks (not recommended):**

```bash
git commit --no-verify
```

#### First Time Setup

After cloning the repository:

```bash
npm install
# Husky hooks are automatically installed via "prepare" script
```

### What Gets Checked

✅ **JavaScript/TypeScript files:**

- ESLint rules (security, best practices, React hooks)
- Code formatting (indentation, spacing, line length)
- Unused variables and imports
- Security issues

✅ **JSON/Markdown/YAML files:**

- Consistent formatting
- Proper indentation

---

## Part 2: Branch Protection Rules (⚠️ REQUIRES GITHUB UI)

### Why Branch Protection?

Branch protection rules enforce code quality by:

- Requiring pull request reviews before merging
- Requiring CI checks to pass
- Preventing direct pushes to main branches
- Ensuring code quality standards

### Setup Instructions

**You must do this manually in GitHub UI:**

1. **Go to Repository Settings**
   - Navigate to: `https://github.com/nbruenin/MatchyMatch/settings/branches`

2. **Add Rule for `main` Branch**
   - Click "Add rule"
   - Branch name pattern: `main`
   - Enable the following:
     - ✅ **Require a pull request before merging**
       - Required number of approvals: `1`
       - Dismiss stale pull request approvals: `✓`
       - Require review from code owners: `✓`
     - ✅ **Require status checks to pass before merging**
       - Require branches to be up to date: `✓`
       - Status checks required:
         - `test (18.x)` (from GitHub Actions)
         - `test (20.x)` (from GitHub Actions)
     - ✅ **Require code to pass status checks**
     - ✅ **Include administrators** (optional but recommended)

3. **Add Rule for `develop` Branch** (optional)
   - Repeat the above with slightly relaxed requirements:
     - Only require 1 approval (instead of 2)
     - Still require CI to pass

4. **Verify CODEOWNERS**
   - The `.github/CODEOWNERS` file is already configured
   - It requires review from code owners for all files

### Expected Behavior After Setup

**When you create a PR:**

```
✅ CI checks running (GitHub Actions)
✅ Code review required (1 approval needed)
✅ Status checks must pass before merge
```

**Before merging:**

```
✅ All CI tests pass (30 tests)
✅ At least 1 approval from code owner
✅ Branch is up to date with main
✅ All conversations resolved
```

**Direct pushes to main:**

```
❌ BLOCKED - Must use pull request
```

---

## Complete Development Workflow

### Step 1: Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### Step 2: Make Changes

```bash
# Edit files
npm run lint        # Check for issues
npm test            # Run tests
```

### Step 3: Commit (Pre-commit Hooks Run)

```bash
git add .
git commit -m "Add my feature"
# ✅ Pre-commit hook runs automatically
# ✅ ESLint fixes issues
# ✅ Prettier formats code
# ✅ Commit succeeds if no errors
```

### Step 4: Push & Create PR

```bash
git push origin feature/my-feature
# Go to GitHub and create a pull request
```

### Step 5: CI Checks Run

```
GitHub Actions automatically:
✅ Runs 30 tests on Node 18.x
✅ Runs 30 tests on Node 20.x
✅ Reports results on PR
```

### Step 6: Code Review

```
✅ Code owner reviews PR
✅ Approves changes
✅ Merges to main (if all checks pass)
```

---

## Troubleshooting

### Pre-commit Hook Issues

**Problem: "husky not found"**

```bash
npm install
npm run prepare
```

**Problem: "lint-staged not found"**

```bash
npm install --legacy-peer-deps
```

**Problem: Hook not running**

```bash
# Check if .husky/pre-commit exists and is executable
ls -la .husky/pre-commit

# Reinstall husky
npm run prepare
```

**Problem: Want to skip hook temporarily**

```bash
git commit --no-verify
# ⚠️ Not recommended - use only for emergency fixes
```

### Branch Protection Issues

**Problem: "Required status checks are failing"**

- Wait for GitHub Actions to complete
- Check the CI logs for errors
- Fix the issues and push again

**Problem: "Require pull request reviews"**

- You need at least 1 approval from a code owner
- Request review from someone with write access

**Problem: "Branch is out of date"**

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

---

## Monitoring & Maintenance

### GitHub Actions

- View CI runs: https://github.com/nbruenin/MatchyMatch/actions
- Check test results and coverage
- Monitor for failures

### Dependabot

- Automated PRs for dependency updates (weekly)
- Auto-merges minor/patch updates
- Requires approval for major updates

### Code Quality Trends

- Monitor test coverage over time
- Track linting violations
- Review security alerts

---

## Best Practices

### For Developers

✅ Run `npm test` before committing
✅ Run `npm run lint` to check for issues
✅ Keep commits small and focused
✅ Write clear commit messages
✅ Request reviews from code owners

### For Code Owners

✅ Review PRs promptly
✅ Provide constructive feedback
✅ Approve when quality standards met
✅ Monitor branch protection settings
✅ Update CODEOWNERS as team grows

### For Maintainers

✅ Monitor GitHub Actions for failures
✅ Review Dependabot PRs weekly
✅ Update security policies as needed
✅ Keep documentation current
✅ Enforce branch protection rules

---

## Summary

| Feature              | Status          | Details                          |
| -------------------- | --------------- | -------------------------------- |
| Pre-commit Hooks     | ✅ Implemented  | Husky + lint-staged configured   |
| ESLint Integration   | ✅ Implemented  | Auto-fixes on commit             |
| Prettier Integration | ✅ Implemented  | Formats code on commit           |
| GitHub Actions CI    | ✅ Implemented  | Runs 30 tests on 2 Node versions |
| Branch Protection    | ⚠️ Manual Setup | Follow instructions above        |
| Code Owners          | ✅ Implemented  | `.github/CODEOWNERS` configured  |
| Dependabot           | ✅ Implemented  | Weekly dependency updates        |

---

## Next Steps

1. **Setup Branch Protection Rules** (GitHub UI)
   - Follow Part 2 instructions above
   - Test with a PR to verify it works

2. **Test the Workflow**
   - Create a test branch
   - Make a small change
   - Commit and verify pre-commit hook runs
   - Create a PR and verify CI runs
   - Verify branch protection blocks direct merge

3. **Team Communication**
   - Share this document with your team
   - Explain the new workflow
   - Answer questions about the process

---

## Questions?

Refer to:

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
