# GitHub Branch Protection Rules - Setup Guide

## Overview

This guide provides step-by-step instructions to set up branch protection rules for the MatchyMatch repository. These rules enforce code quality by requiring pull request reviews and CI checks before merging.

## Why Branch Protection?

Branch protection rules ensure:

- ✅ All code is reviewed before merging
- ✅ CI tests pass before merging
- ✅ Code follows quality standards
- ✅ No accidental direct pushes to main
- ✅ Consistent development process

## Prerequisites

- GitHub repository owner or admin access
- GitHub Actions CI configured (✅ Already done in PR #2)
- Pre-commit hooks configured (✅ Already done in PR #3)

## Step-by-Step Setup

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository: `https://github.com/nbruenin/MatchyMatch`
2. Click **Settings** (top right)
3. Click **Branches** (left sidebar)
4. You should see "Branch protection rules" section

### Step 2: Add Protection Rule for `main` Branch

1. Click **Add rule** button
2. Fill in the following:

#### Branch name pattern

```
main
```

#### Required pull request reviews before merging

- ✅ **Check this box**
- Required number of approvals before merging: `1`
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require review from code owners**

#### Require status checks to pass before merging

- ✅ **Check this box**
- ✅ **Require branches to be up to date before merging**
- Search for and select these status checks:
  - `test (18.x)` - GitHub Actions test on Node 18
  - `test (20.x)` - GitHub Actions test on Node 20

#### Additional settings (optional but recommended)

- ✅ **Include administrators** - Enforce rules even for admins
- ✅ **Restrict who can push to matching branches** - Only allow specific users/teams

#### Click **Create** button

### Step 3: Add Protection Rule for `develop` Branch (Optional)

Repeat Step 2 with these settings:

#### Branch name pattern

```
develop
```

#### Required pull request reviews

- ✅ Check this box
- Required approvals: `1` (can be less strict than main)
- ✅ Dismiss stale approvals
- ✅ Require code owner review

#### Require status checks

- ✅ Check this box
- ✅ Require branches up to date
- Select: `test (18.x)` and `test (20.x)`

### Step 4: Verify CODEOWNERS Configuration

The `.github/CODEOWNERS` file is already configured. Verify it:

1. Go to `.github/CODEOWNERS` in your repository
2. Should contain:

```
* @nbruenin
```

This means all files require review from `@nbruenin` (code owner).

## Expected Behavior After Setup

### When Creating a Pull Request

```
Pull Request Created
  ↓
GitHub Actions CI starts
  ↓
Status checks appear on PR:
  ✅ test (18.x) - running
  ✅ test (20.x) - running
  ✅ Code owner review - required
  ↓
Waiting for reviews...
```

### Before Merging

All of these must be satisfied:

```
✅ All CI tests pass (30 tests on each Node version)
✅ At least 1 approval from code owner
✅ Branch is up to date with main
✅ All conversations resolved
```

### Attempting Direct Push to Main

```bash
git push origin main
# ❌ ERROR: Permission denied
# You must use a pull request
```

## Visual Guide

### PR Status Checks

When you create a PR, you'll see:

```
Checks
├── test (18.x) - ✅ Passed
├── test (20.x) - ✅ Passed
└── Code owner review - ⏳ Waiting

Merge button: DISABLED until all checks pass
```

### After Approval

```
Checks
├── test (18.x) - ✅ Passed
├── test (20.x) - ✅ Passed
└── Code owner review - ✅ Approved

Merge button: ENABLED - Ready to merge
```

## Complete Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes & Commit

```bash
git add .
git commit -m "Add feature"
# Pre-commit hook runs automatically
# ESLint fixes issues
# Prettier formats code
```

### 3. Push & Create PR

```bash
git push origin feature/my-feature
# Go to GitHub and create a pull request
```

### 4. CI Runs Automatically

```
GitHub Actions starts:
✅ Runs 30 tests on Node 18.x
✅ Runs 30 tests on Node 20.x
✅ Reports results on PR
```

### 5. Code Review

```
Code owner reviews PR:
✅ Checks code quality
✅ Provides feedback
✅ Approves changes
```

### 6. Merge to Main

```
All checks pass:
✅ CI tests passed
✅ Code owner approved
✅ Branch up to date
✅ Click "Merge pull request"
```

## Troubleshooting

### "Required status checks are failing"

**Solution:**

1. Click "Details" on the failing check
2. Review the error logs
3. Fix the issues locally
4. Push the fix
5. CI will re-run automatically

### "Require pull request reviews"

**Solution:**

1. Request review from code owner
2. Go to PR → Reviewers → Add reviewer
3. Select the code owner
4. Wait for approval

### "Branch is out of date"

**Solution:**

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
# CI will re-run with updated code
```

### "Cannot merge - branch protection enabled"

**Solution:**

- This is working as intended!
- All checks must pass before merging
- Verify all status checks are green
- Verify you have required approvals

### "I'm an admin but still can't push"

**Solution:**

- This is because "Include administrators" is checked
- Use a pull request like everyone else
- This ensures code quality for all code

## Verification Checklist

After setting up branch protection, verify:

- [ ] Branch protection rule exists for `main`
- [ ] Requires 1 pull request review
- [ ] Requires code owner review
- [ ] Requires status checks: `test (18.x)` and `test (20.x)`
- [ ] Requires branches to be up to date
- [ ] Stale approvals are dismissed
- [ ] `.github/CODEOWNERS` is configured
- [ ] GitHub Actions CI is working

## Testing Branch Protection

### Test 1: Verify Direct Push is Blocked

```bash
git checkout main
echo "test" > test.txt
git add test.txt
git commit -m "test"
git push origin main
# ❌ Should be rejected
```

### Test 2: Verify PR Requires Approval

1. Create a test branch
2. Make a small change
3. Push and create a PR
4. Try to merge without approval
5. Merge button should be disabled

### Test 3: Verify CI Must Pass

1. Create a PR with code that fails tests
2. CI should fail
3. Merge button should be disabled
4. Fix the code and push
5. CI should pass and merge button should enable

## Best Practices

### For Developers

✅ Always create a feature branch
✅ Never push directly to main
✅ Create a PR for all changes
✅ Request review from code owner
✅ Wait for CI to pass before requesting review
✅ Address review feedback promptly

### For Code Owners

✅ Review PRs promptly (within 24 hours)
✅ Provide constructive feedback
✅ Approve when quality standards met
✅ Monitor branch protection settings
✅ Update CODEOWNERS as team grows

### For Maintainers

✅ Monitor GitHub Actions for failures
✅ Review branch protection settings regularly
✅ Update status checks as needed
✅ Communicate changes to team
✅ Enforce rules consistently

## Advanced Configuration (Optional)

### Restrict Push Access

To only allow specific users to push to main:

1. In branch protection settings
2. Check "Restrict who can push to matching branches"
3. Add users/teams who can push
4. This prevents accidental pushes

### Require Conversation Resolution

To require all conversations to be resolved:

1. In branch protection settings
2. Check "Require conversation resolution before merging"
3. All comments must be resolved before merge

### Require Signed Commits

To require commits to be signed:

1. In branch protection settings
2. Check "Require commits to be signed"
3. Developers must sign commits with GPG

## Monitoring & Maintenance

### Weekly Tasks

- [ ] Review failed CI runs
- [ ] Check for stale PRs
- [ ] Monitor Dependabot updates

### Monthly Tasks

- [ ] Review branch protection settings
- [ ] Update CODEOWNERS if needed
- [ ] Analyze code quality trends

### Quarterly Tasks

- [ ] Review security policies
- [ ] Update contributing guidelines
- [ ] Plan for process improvements

## Documentation References

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## Summary

| Setting        | Value                    | Purpose                 |
| -------------- | ------------------------ | ----------------------- |
| Branch         | `main`                   | Protect main branch     |
| PR Reviews     | 1 approval               | Require code review     |
| Code Owner     | Yes                      | Require owner review    |
| Status Checks  | test (18.x), test (20.x) | Require CI to pass      |
| Up to Date     | Yes                      | Prevent merge conflicts |
| Dismiss Stale  | Yes                      | Re-review after changes |
| Include Admins | Yes                      | Enforce for everyone    |

## Next Steps

1. **Setup branch protection** following this guide
2. **Test the workflow** with a test PR
3. **Communicate to team** about the new process
4. **Monitor for issues** and adjust as needed

---

**Questions?** Refer to the [GitHub documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) or contact your repository maintainer.
