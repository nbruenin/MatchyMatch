# CI/CD Documentation

This document provides comprehensive information about the CI/CD workflows configured for MatchyMatch.

## Table of Contents

- [Overview](#overview)
- [Workflows](#workflows)
- [Configuration](#configuration)
- [Secrets](#secrets)
- [Branch Protection](#branch-protection)
- [Troubleshooting](#troubleshooting)

## Overview

MatchyMatch uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline includes:

- **Automated testing** on every push and PR
- **Code quality checks** with ESLint
- **Security scanning** with multiple tools
- **Automated dependency updates** via Dependabot
- **Auto-merge** for safe dependency updates
- **Code coverage** reporting
- **PR validation** and auto-labeling
- **Release automation** from version tags

## Workflows

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**

- Push to any branch
- Pull requests to main/master

**Jobs:**

#### 🔍 Lint

- Runs ESLint on all JavaScript/JSX files
- Continues on error (warnings don't fail the build)
- Uses Node.js 20 with npm caching

#### 🧪 Test

- Runs Vitest test suite
- 5-minute timeout to prevent hanging
- Requires lint job to pass first

#### 🏗️ Build

- Creates production build with Vite
- Uploads build artifacts (retained for 7 days)
- Requires both lint and test jobs to pass

**Configuration:**

```yaml
node-version: '20'
install-command: npm install --legacy-peer-deps
timeout: 5 minutes (tests)
```

### 2. Security Scanning (`.github/workflows/security.yml`)

**Triggers:**

- Push to main/master
- Pull requests to main/master
- Weekly schedule (Mondays at 04:00 UTC)
- Manual dispatch

**Jobs:**

#### 📦 npm Audit

- Scans production dependencies for vulnerabilities
- Fails on high-severity issues
- Reports all vulnerabilities

#### 🔬 CodeQL Analysis

- Static code analysis for JavaScript
- Detects security vulnerabilities and code quality issues
- Uses security-and-quality query suite

#### 🔑 Secret Scan

- Scans for accidentally committed secrets
- Uses TruffleHog for detection
- Only reports verified secrets

#### 📋 Dependency Review

- Reviews dependency changes in PRs
- Fails on high-severity vulnerabilities
- Blocks GPL-2.0 and AGPL-3.0 licenses

### 3. Repository Verification (`.github/workflows/verify-remote.yml`)

**Triggers:**

- Push to any branch
- Pull requests to any branch

**Jobs:**

#### 🔍 Verify Repository

- Verifies remote URL is correct
- Ensures repository is not a fork
- Validates repository owner

**Purpose:** Prevents accidental pushes to wrong repository or forks.

### 4. Auto-merge (`.github/workflows/auto-merge.yml`)

**Triggers:**

- Pull request opened, synchronized, or reopened
- Only runs for Dependabot PRs

**Jobs:**

#### Auto-merge minor/patch updates

- Auto-approves minor and patch version updates
- Enables auto-merge (requires CI to pass)
- Comments on major updates for manual review

**Safety:**

- Requires all CI checks to pass
- Requires branch protection rules
- Only affects Dependabot PRs

### 5. Code Coverage (`.github/workflows/coverage.yml`)

**Triggers:**

- Push to main/master
- Pull requests to main/master

**Jobs:**

#### Generate Coverage Report

- Runs tests with coverage enabled
- Uploads to Codecov (if token configured)
- Stores coverage artifacts for 30 days

**Configuration:**

```yaml
timeout: 5 minutes
continue-on-error: true (doesn't fail build)
```

### 6. PR Validation (`.github/workflows/pr-validation.yml`)

**Triggers:**

- Pull request opened, edited, synchronized, or reopened

**Jobs:**

#### Validate PR Title

- Enforces conventional commit format
- Allowed types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
- Subject must start with uppercase letter

#### Auto-label

- Labels PRs based on changed files
- Uses `.github/labeler.yml` configuration

#### Size Label

- Adds size labels (xs/s/m/l/xl)
- Based on lines changed
- Ignores package-lock.json

**Size Thresholds:**

- xs: < 10 lines
- s: < 100 lines
- m: < 500 lines
- l: < 1000 lines
- xl: > 1000 lines

### 7. Stale Management (`.github/workflows/stale.yml`)

**Triggers:**

- Daily schedule (01:00 UTC)
- Manual dispatch

**Configuration:**

**Issues:**

- Marked stale after 60 days of inactivity
- Closed 7 days after marked stale
- Exempt labels: pinned, security, bug, enhancement

**Pull Requests:**

- Marked stale after 30 days of inactivity
- Closed 14 days after marked stale
- Exempt labels: pinned, security, work-in-progress

### 8. Release Automation (`.github/workflows/release.yml`)

**Triggers:**

- Push of version tags (v*._._)
- Manual dispatch with version input

**Jobs:**

#### Create Release

- Runs tests and build
- Generates changelog from PRs
- Creates GitHub release
- Uploads build artifacts (retained for 90 days)

**Changelog:**

- Categorizes PRs by type (feat, fix, docs, etc.)
- Uses `.github/changelog-config.json`
- Includes PR author and number

## Configuration

### Labeler Configuration (`.github/labeler.yml`)

Auto-labels PRs based on changed files:

- `documentation` - Markdown files
- `tests` - Test files
- `components` - Component files
- `games` - Game-specific files
- `data` - Data files
- `ci` - CI/CD files
- `dependencies` - package.json/lock
- `config` - Configuration files
- `security` - Security files
- `styles` - CSS files
- `hooks` - React hooks

### Changelog Configuration (`.github/changelog-config.json`)

Categorizes PRs for release notes:

- 🚀 Features (feat, feature, enhancement)
- 🐛 Bug Fixes (fix, bug, bugfix)
- 📚 Documentation (docs, documentation)
- 🎨 Styling (style, styles, styling)
- ♻️ Refactoring (refactor, refactoring)
- 🧪 Tests (test, tests, testing)
- 🔧 Maintenance (chore, maintenance)
- ⚡ Performance (perf, performance)
- 🔒 Security (security)
- 📦 Dependencies (dependencies, deps)
- 🔨 Build & CI (ci, build)

### Repository Settings (`.github/settings.yml`)

Defines repository configuration:

- Auto-merge enabled
- Squash merge allowed
- Linear history enforced
- Branch protection rules
- Required status checks
- Labels configuration

## Secrets

### Required Secrets

**GITHUB_TOKEN**

- Automatically provided by GitHub
- Used for: PR comments, releases, auto-merge

### Optional Secrets

**CODECOV_TOKEN**

- For code coverage reporting
- Get from: https://codecov.io
- Setup: Repository Settings → Secrets → New secret

## Branch Protection

Main branch is protected with:

### Required Reviews

- 1 approving review required
- Dismiss stale reviews on new commits
- Require code owner review
- Require approval of most recent push

### Required Status Checks

- Branch must be up-to-date
- Required checks:
  - 🔍 Lint
  - 🧪 Test
  - 🏗️ Build
  - 🔍 Verify Repository

### Additional Rules

- Enforce for administrators
- Require linear history
- No force pushes
- No branch deletion
- Require conversation resolution

## Troubleshooting

### Tests Timing Out

**Problem:** Tests run longer than 5 minutes

**Solutions:**

1. Increase timeout in workflow:
   ```yaml
   timeout-minutes: 10
   ```
2. Optimize slow tests
3. Split test suite into parallel jobs

### npm ci Fails

**Problem:** `npm ci` requires package-lock.json

**Solution:** Use `npm install --legacy-peer-deps` instead

- Already configured in all workflows
- Handles React 19 peer dependency conflicts

### Lint Failures

**Problem:** ESLint errors fail the build

**Current:** Lint continues on error (warnings don't fail)

**To enforce:**

```yaml
- name: Run ESLint
  run: npm run lint
  # Remove: continue-on-error: true
```

### Auto-merge Not Working

**Checklist:**

1. ✅ Auto-merge enabled in repository settings
2. ✅ Branch protection configured
3. ✅ All required checks passing
4. ✅ PR is from Dependabot
5. ✅ Update is minor or patch (not major)

### CodeQL Fails

**Problem:** CodeQL analysis fails

**Solutions:**

1. Check if JavaScript files are valid
2. Verify build succeeds
3. Check CodeQL action logs for details

### Coverage Upload Fails

**Problem:** Codecov upload fails

**Solutions:**

1. Add `CODECOV_TOKEN` secret
2. Check Codecov service status
3. Verify coverage files are generated

### Stale Bot Too Aggressive

**Problem:** Issues/PRs closed too quickly

**Solution:** Adjust timeouts in `.github/workflows/stale.yml`:

```yaml
days-before-issue-stale: 90 # Increase from 60
days-before-pr-stale: 45 # Increase from 30
```

## Best Practices

### For Contributors

1. **Write tests** for new features
2. **Run locally** before pushing:
   ```bash
   npm run lint
   npm test -- --run
   npm run build
   ```
3. **Use conventional commits** for PR titles
4. **Keep PRs small** (< 500 lines when possible)
5. **Respond to reviews** promptly

### For Maintainers

1. **Review Dependabot PRs** weekly
2. **Monitor security alerts** from workflows
3. **Update workflows** when dependencies change
4. **Keep secrets** up to date
5. **Review stale issues** before auto-close

## Monitoring

### Check CI Status

**GitHub Actions Tab:**
https://github.com/nbruenin/MatchyMatch/actions

**Badges in README:**

- CI status
- Security status
- Coverage percentage

### Weekly Tasks

- [ ] Review failed workflows
- [ ] Check security scan results
- [ ] Review Dependabot PRs
- [ ] Update stale issues/PRs
- [ ] Monitor coverage trends

### Monthly Tasks

- [ ] Review workflow efficiency
- [ ] Update action versions
- [ ] Audit security settings
- [ ] Review branch protection rules
- [ ] Clean up old artifacts

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Codecov Documentation](https://docs.codecov.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated:** 2024-09-17
