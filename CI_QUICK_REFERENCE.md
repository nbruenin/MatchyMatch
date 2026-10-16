# CI/CD Quick Reference

Quick reference for developers working with MatchyMatch CI/CD.

## 🚀 Quick Commands

```bash
# Run all checks locally before pushing
npm run lint              # Lint code
npm test -- --run         # Run tests once
npm run build             # Build for production

# Development
npm run dev               # Start dev server
npm test                  # Run tests in watch mode
npm run test:ui           # Run tests with UI
```

## 📋 Workflow Status

| Workflow      | Trigger                 | Purpose                    |
| ------------- | ----------------------- | -------------------------- |
| CI            | Push, PR                | Lint, test, build          |
| Security      | Push (main), PR, Weekly | Security scans             |
| Verify Remote | Push, PR                | Prevent wrong repo pushes  |
| Auto-merge    | Dependabot PR           | Auto-merge safe updates    |
| Coverage      | Push (main), PR         | Code coverage reporting    |
| PR Validation | PR                      | Validate title, auto-label |
| Stale         | Daily                   | Manage inactive issues/PRs |
| Release       | Version tag             | Automate releases          |

## ✅ Required Checks

Before merging to main:

- ✅ 🔍 Lint
- ✅ 🧪 Test
- ✅ 🏗️ Build
- ✅ 🔍 Verify Repository
- ✅ 1 approving review
- ✅ All conversations resolved

## 🏷️ PR Title Format

Use conventional commit format:

```
<type>(<scope>): <description>

Examples:
feat(game): add new puzzle mode
fix(ui): correct dark mode toggle
docs(readme): update installation steps
test(game): add unit tests for scoring
chore(deps): update dependencies
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance
- `perf` - Performance
- `ci` - CI/CD changes
- `build` - Build system

## 🏷️ Auto Labels

PRs are automatically labeled based on changed files:

| Label         | Files                               |
| ------------- | ----------------------------------- |
| documentation | `*.md`, `docs/**`                   |
| tests         | `src/test/**`, `*.test.js`          |
| components    | `src/components/**`                 |
| games         | Game-specific files                 |
| data          | `src/data/**`                       |
| ci            | `.github/**`, `*.yml`               |
| dependencies  | `package.json`, `package-lock.json` |
| config        | `*.config.js`, `.env*`              |
| security      | `SECURITY.md`, security workflows   |
| styles        | `*.css`                             |
| hooks         | `src/hooks/**`                      |

## 📏 PR Size Labels

| Label   | Lines Changed |
| ------- | ------------- |
| size/xs | < 10          |
| size/s  | < 100         |
| size/m  | < 500         |
| size/l  | < 1000        |
| size/xl | > 1000        |

**Tip:** Keep PRs under 500 lines for easier review!

## 🤖 Dependabot Auto-merge

**Automatically merged:**

- Minor version updates (1.2.0 → 1.3.0)
- Patch version updates (1.2.0 → 1.2.1)

**Requires manual review:**

- Major version updates (1.0.0 → 2.0.0)

**Requirements:**

- All CI checks pass
- No merge conflicts
- Branch protection rules satisfied

## 🔒 Security Scans

### npm Audit

- Runs on every push to main and PRs
- Fails on high-severity vulnerabilities in production deps
- Weekly scheduled scan

### CodeQL

- Static code analysis
- Detects security vulnerabilities
- Runs on main branch and PRs

### Secret Scan

- Detects accidentally committed secrets
- Uses TruffleHog
- Only reports verified secrets

### Dependency Review

- Reviews dependency changes in PRs
- Blocks high-severity vulnerabilities
- Blocks GPL-2.0 and AGPL-3.0 licenses

## 📊 Code Coverage

**Current setup:**

- Runs on main branch and PRs
- Uploads to Codecov (if token configured)
- Stores artifacts for 30 days
- Doesn't fail build

**View coverage:**

- Check Codecov badge in README
- Download artifacts from workflow run
- Run locally: `npm test -- --run --coverage`

## 🏷️ Issue/PR Lifecycle

### Issues

- **60 days** inactive → marked stale
- **7 days** after stale → closed
- **Exempt:** pinned, security, bug, enhancement

### Pull Requests

- **30 days** inactive → marked stale
- **14 days** after stale → closed
- **Exempt:** pinned, security, work-in-progress

**To keep open:**

- Add a comment
- Remove stale label
- Add exempt label

## 🚀 Creating a Release

### Automatic (Recommended)

1. Create and push a version tag:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Workflow automatically:
   - Runs tests and build
   - Generates changelog
   - Creates GitHub release
   - Uploads artifacts

### Manual

1. Go to Actions → Release workflow
2. Click "Run workflow"
3. Enter version (e.g., v1.0.0)
4. Click "Run workflow"

## 🔧 Common Issues

### Tests timeout

**Solution:** Tests have 5-minute timeout. Optimize slow tests or increase timeout in workflow.

### Lint fails

**Current:** Continues on error (warnings don't fail build)
**To fix:** Address ESLint warnings in code

### Build warnings

**Current:** Bundle size > 500KB warning
**To fix:** Consider code splitting or lazy loading

### Auto-merge not working

**Check:**

1. Is PR from Dependabot?
2. Is it minor/patch update?
3. Are all checks passing?
4. Is auto-merge enabled in repo settings?

## 📝 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**

```
feat(game): add new puzzle game mode

Add a new puzzle game mode with 20 unique puzzles.
Includes game logic, UI components, and test suite.

Closes #123
```

## 🔗 Quick Links

- [Actions Dashboard](https://github.com/nbruenin/MatchyMatch/actions)
- [Security Alerts](https://github.com/nbruenin/MatchyMatch/security)
- [Dependabot](https://github.com/nbruenin/MatchyMatch/network/updates)
- [Codecov](https://codecov.io/gh/nbruenin/MatchyMatch)
- [Full Documentation](CI_DOCUMENTATION.md)
- [Contributing Guide](CONTRIBUTING.md)

## 💡 Tips

1. **Run checks locally** before pushing
2. **Keep PRs small** (< 500 lines)
3. **Write descriptive commit messages**
4. **Add tests** for new features
5. **Respond to reviews** promptly
6. **Use conventional commits** for PR titles
7. **Check CI status** before requesting review
8. **Keep dependencies updated** (Dependabot helps!)

## 🆘 Getting Help

- Check [CI_DOCUMENTATION.md](CI_DOCUMENTATION.md) for detailed info
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- Open an issue for CI/CD problems
- Ask in discussions for questions

---

**Last Updated:** 2024-09-17
