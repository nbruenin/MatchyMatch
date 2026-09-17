# CI Quick Reference

## Pre-Push Checklist

Before pushing code, run:

```bash
npm run lint          # Check code quality
npm test -- --run     # Run all tests
npm run build         # Verify build works
```

Or run all at once:

```bash
npm run lint && npm test -- --run && npm run build
```

## PR Requirements

### Title Format

Use semantic commit format:

```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add tests
chore: update dependencies
ci: modify workflows
```

### Description

- Minimum 20 characters
- Explain what changed and why
- Reference related issues: `Closes #123`

### Status Checks

Must pass before merge:

- ✅ 🔍 Lint
- ✅ 🧪 Test
- ✅ 🏗️ Build
- ✅ verify-remote

## Common CI Failures

### Lint Errors

```bash
# See errors
npm run lint

# Auto-fix
npm run lint -- --fix
```

### Test Failures

```bash
# Run tests
npm test

# Run specific test
npm test -- path/to/test.js

# Debug with UI
npm run test:ui
```

### Build Errors

```bash
# Build locally
npm run build

# Check for errors
npm run build 2>&1 | grep -i error
```

## Workflow Triggers

| Workflow      | Trigger                   |
| ------------- | ------------------------- |
| CI            | Every push, every PR      |
| Security      | Push to main, PRs, weekly |
| Coverage      | Push to main, PRs         |
| Auto-merge    | Dependabot PRs            |
| PR Validation | PR opened/updated         |
| Stale         | Daily at 00:00 UTC        |
| Release       | Version tags (v*._._)     |

## Auto-merge

Dependabot PRs auto-merge if:

- ✅ Update is minor or patch (not major)
- ✅ All CI checks pass
- ✅ Branch is up to date

Major updates require manual review.

## Creating Releases

```bash
# Tag a version
git tag v1.0.0

# Push the tag
git push origin v1.0.0

# Release workflow runs automatically
```

## Viewing CI Results

1. Go to **Actions** tab
2. Click on workflow run
3. View logs and artifacts

## Getting Help

- 📖 [CI_DOCUMENTATION.md](CI_DOCUMENTATION.md) - Full reference
- 📖 [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
- 🐛 Actions tab - View workflow logs
- 💬 GitHub Discussions - Ask questions

## Useful Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run all checks (like CI)
npm run lint && npm test -- --run && npm run build

# View test coverage
npm test -- --run --coverage

# Preview production build
npm run build && npm run preview
```

## Branch Protection

`main` branch requires:

- 1 approving review
- All status checks passing
- Branch up to date
- Conversations resolved
- Linear history

## Labels

PRs are auto-labeled based on:

- **Changed files**: `documentation`, `ci`, `test`, `component`, etc.
- **Size**: `size/xs`, `size/s`, `size/m`, `size/l`, `size/xl`

## Security

Weekly security scans check for:

- 📦 Dependency vulnerabilities
- 🔬 Code security issues
- 🔑 Leaked secrets
- 📋 License compliance

---

**Quick Links:**

- [Actions](https://github.com/nbruenin/MatchyMatch/actions)
- [Pull Requests](https://github.com/nbruenin/MatchyMatch/pulls)
- [Issues](https://github.com/nbruenin/MatchyMatch/issues)
