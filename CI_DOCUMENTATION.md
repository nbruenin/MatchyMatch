# Continuous Integration (CI) Documentation

## Overview

This repository uses GitHub Actions for comprehensive CI/CD automation. All workflows are located in `.github/workflows/` and run automatically based on configured triggers.

## Workflows

### 1. 🔄 Main CI Pipeline (`ci.yml`)

**Triggers:**

- Push to any branch
- Pull requests to `main` or `master`

**Jobs:**

1. **🔍 Lint** - ESLint code quality checks
2. **🧪 Test** - Vitest test suite (depends on Lint)
3. **🏗️ Build** - Production build (depends on Lint & Test)

**Features:**

- Sequential execution (fails fast)
- Caches npm dependencies for speed
- Uploads build artifacts (7-day retention)
- Uses Node.js 20

**Status:** ✅ Active

---

### 2. 🔒 Security Scanning (`security.yml`)

**Triggers:**

- Push to `main`
- Pull requests to `main`
- Weekly schedule (Mondays at 04:00 UTC)
- Manual dispatch

**Jobs:**

1. **📦 npm audit** - Dependency vulnerability scanning
   - Fails on high severity in production deps
   - Reports all vulnerabilities
2. **🔬 CodeQL** - Static code analysis
   - JavaScript security and quality queries
3. **🔑 Secret Scan** - TruffleHog secret detection
   - Scans for leaked credentials
4. **📋 Dependency Review** - PR-only dependency analysis
   - Blocks high-severity vulnerabilities
   - Blocks GPL/AGPL licenses

**Status:** ✅ Active

---

### 3. 🛡️ Repository Verification (`verify-remote.yml`)

**Triggers:**

- Push to any branch
- Pull requests to any branch

**Checks:**

1. Remote URL matches `https://github.com/nbruenin/MatchyMatch.git`
2. Repository is not a fork
3. Repository owner is `nbruenin`

**Purpose:** Prevents accidental pushes to wrong repository

**Status:** ✅ Active

---

### 4. 🤖 Auto-merge (`auto-merge.yml`)

**Triggers:**

- Pull request opened, synchronized, or reopened

**Behavior:**

- Only runs for Dependabot PRs
- Auto-merges minor and patch updates
- Comments on major updates (requires manual review)
- Uses squash merge strategy

**Requirements:**

- All status checks must pass
- Branch must be up to date
- Repository must have auto-merge enabled

**Status:** ✅ Active

---

### 5. 📊 Code Coverage (`coverage.yml`)

**Triggers:**

- Push to `main`
- Pull requests to `main`

**Features:**

- Generates coverage report with Vitest
- Uploads to Codecov (requires `CODECOV_TOKEN` secret)
- Comments coverage summary on PRs
- Uses lcov format

**Status:** ✅ Active (requires Codecov token for full functionality)

---

### 6. 🏷️ PR Validation & Labeling (`pr-validation.yml`)

**Triggers:**

- Pull request opened, edited, synchronized, or reopened

**Jobs:**

1. **Validate PR**
   - Enforces semantic PR titles (feat, fix, docs, etc.)
   - Requires meaningful description (min 20 chars)
2. **Auto-label**
   - Labels based on changed files (see `.github/labeler.yml`)
   - Labels based on PR size (xs, s, m, l, xl)

**Status:** ✅ Active

---

### 7. 🧹 Stale Management (`stale.yml`)

**Triggers:**

- Daily at 00:00 UTC
- Manual dispatch

**Behavior:**

- **Issues:** Marked stale after 60 days, closed after 7 more days
- **PRs:** Marked stale after 30 days, closed after 14 more days
- Exempts: `pinned`, `security`, `help wanted`, `work-in-progress`
- Removes stale label when updated

**Status:** ✅ Active

---

### 8. 🚀 Release (`release.yml`)

**Triggers:**

- Push tags matching `v*.*.*` (e.g., v1.0.0)
- Manual dispatch with version input

**Process:**

1. Checkout code
2. Install dependencies
3. Run tests
4. Build production bundle
5. Create release archives (tar.gz, zip)
6. Generate changelog from PRs
7. Create GitHub release with artifacts

**Status:** ✅ Active

---

## Required Status Checks

Pull requests to `main` must pass these checks:

| Check         | Description                    |
| ------------- | ------------------------------ |
| 🔍 Lint       | ESLint passes with no errors   |
| 🧪 Test       | All tests pass                 |
| 🏗️ Build      | Production build succeeds      |
| verify-remote | Repository verification passes |

## Branch Protection Rules

The `main` branch is protected with:

- ✅ Require pull request before merging
- ✅ Require 1 approving review
- ✅ Dismiss stale reviews
- ✅ Require review from code owners
- ✅ Require approval of most recent push
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ Require linear history
- ❌ No force pushes
- ❌ No deletions
- ✅ Include administrators

## Secrets Required

| Secret          | Purpose                        | Required    |
| --------------- | ------------------------------ | ----------- |
| `GITHUB_TOKEN`  | Automatic (provided by GitHub) | ✅ Yes      |
| `CODECOV_TOKEN` | Code coverage reporting        | ⚠️ Optional |

## Dependabot Configuration

Located in `.github/dependabot.yml`:

**npm dependencies:**

- Weekly updates (Mondays at 03:00)
- Groups minor/patch updates
- Separate major updates
- Auto-merge enabled for minor/patch
- Max 5 open PRs

**GitHub Actions:**

- Weekly updates (Mondays at 03:00)
- Keeps workflows up to date

## Auto-labeling Rules

Located in `.github/labeler.yml`:

| Label           | Triggers                                       |
| --------------- | ---------------------------------------------- |
| `documentation` | Changes to `*.md`, `docs/**`                   |
| `ci`            | Changes to `.github/workflows/**`              |
| `dependencies`  | Changes to `package.json`, `package-lock.json` |
| `test`          | Changes to `src/test/**`, `*.test.js`          |
| `component`     | Changes to `src/components/**`                 |
| `data`          | Changes to `src/data/**`                       |
| `style`         | Changes to `*.css`                             |
| `config`        | Changes to config files                        |
| `security`      | Changes to security files                      |
| `build`         | Changes to build config                        |

## Commit Message Format

We follow Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance
- `perf:` - Performance
- `ci:` - CI/CD changes

**Examples:**

```
feat(game): add new puzzle mode
fix(wordle): correct word validation logic
docs(readme): update installation instructions
ci(workflows): add code coverage reporting
```

## Troubleshooting

### CI Failing on Lint

```bash
# Run locally to see errors
npm run lint

# Auto-fix what's possible
npm run lint -- --fix
```

### CI Failing on Tests

```bash
# Run tests locally
npm test

# Run specific test file
npm test -- path/to/test.js

# Run with UI for debugging
npm run test:ui
```

### CI Failing on Build

```bash
# Run build locally
npm run build

# Check for build errors
npm run build 2>&1 | grep -i error
```

### Auto-merge Not Working

Check:

1. Repository has auto-merge enabled (Settings → General)
2. All required status checks pass
3. Branch is up to date with base branch
4. PR is from Dependabot
5. Update is minor or patch (not major)

### Codecov Not Reporting

1. Add `CODECOV_TOKEN` secret to repository
2. Get token from https://codecov.io
3. Add to Settings → Secrets → Actions

## Performance Optimization

**Caching:**

- npm dependencies cached by `actions/setup-node`
- Cache key based on `package-lock.json`

**Parallelization:**

- Security jobs run in parallel
- Independent workflows run concurrently

**Fail Fast:**

- CI pipeline stops on first failure
- Saves compute time and provides quick feedback

## Monitoring

**View workflow runs:**

- Go to Actions tab in GitHub
- Click on specific workflow
- View logs and artifacts

**Workflow badges:**

- CI: `[![CI](https://github.com/nbruenin/MatchyMatch/actions/workflows/ci.yml/badge.svg)](https://github.com/nbruenin/MatchyMatch/actions/workflows/ci.yml)`
- Security: `[![Security](https://github.com/nbruenin/MatchyMatch/actions/workflows/security.yml/badge.svg)](https://github.com/nbruenin/MatchyMatch/actions/workflows/security.yml)`

## Best Practices

1. **Always run tests locally before pushing**

   ```bash
   npm run lint && npm test -- --run && npm run build
   ```

2. **Keep PRs small and focused**
   - Easier to review
   - Faster CI runs
   - Less likely to conflict

3. **Write meaningful commit messages**
   - Follow conventional commits format
   - Explain why, not just what

4. **Update tests with code changes**
   - Maintain test coverage
   - Prevent regressions

5. **Review CI logs when failures occur**
   - Don't just re-run
   - Understand the root cause

## Future Enhancements

Potential additions:

- [ ] Visual regression testing
- [ ] Performance benchmarking
- [ ] Lighthouse CI for web vitals
- [ ] E2E testing with Playwright
- [ ] Automated dependency updates review
- [ ] Deployment previews for PRs
- [ ] Bundle size tracking
- [ ] Accessibility testing

---

**Last Updated:** 2024
**Maintained By:** MatchyMatch Team
