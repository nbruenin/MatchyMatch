# GitHub Actions Workflows — Activation Guide

## Why This Step Is Manual

GitHub requires a Personal Access Token with the **`workflow` scope** to push
files into `.github/workflows/`. The automated tooling used to create this PR
uses a read/write token that intentionally omits that scope (principle of least
privilege). The workflow files have therefore been staged in
`.github/workflow-templates/` and need one copy command to activate.

---

## One-Time Setup (< 1 minute)

Run the following from the repository root **after merging this PR**:

```bash
# 1. Create the workflows directory
mkdir -p .github/workflows

# 2. Copy all workflow templates into place
cp .github/workflow-templates/*.yml .github/workflows/

# 3. Commit and push (requires a token with `workflow` scope)
git add .github/workflows/
git commit -m "ci: activate GitHub Actions workflows"
git push
```

> **Tip:** You can also do this directly in the GitHub UI:
> 1. Go to **Actions → New workflow → Set up a workflow yourself**
> 2. Paste the contents of each file in `.github/workflow-templates/`
> 3. Save each file — GitHub will place them in `.github/workflows/` automatically.

---

## What Each Workflow Does

### `verify-remote.yml`
Runs on **every push and PR**.  
Confirms the correct repository owner, URL, and that the repo is not a fork.
Blocks merges if any check fails.

### `ci.yml`
Runs on **every push and on PRs targeting `main`**.  
Sequential pipeline:
1. **Lint** — ESLint with all security rules
2. **Test** — Vitest test suite
3. **Build** — Vite production build + uploads `dist/` artifact (7-day retention)

Each job depends on the previous one, so a lint failure stops the pipeline early.

### `security.yml`
Runs on **push/PR to `main`** and **every Monday at 04:00 UTC**.  
Four parallel jobs:
1. **npm audit** — gates on `high` severity for production deps
2. **CodeQL** — static analysis with `security-and-quality` query suite
3. **TruffleHog** — scans for verified leaked secrets
4. **Dependency Review** — blocks high-severity / GPL / AGPL-licensed deps on PRs

---

## Branch Protection Rules

The `.github/settings.yml` file is the source-of-truth for all branch
protection settings. If you have the
[Safe Settings Probot app](https://github.com/github/safe-settings) installed,
these rules are applied automatically on every push to `main`.

**Without the app**, apply them once via the GitHub UI:

1. Go to **Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Enable:

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ |
| Required approving reviews | 1 |
| Dismiss stale reviews | ✅ |
| Require review from Code Owners | ✅ |
| Require approval of the most recent push | ✅ |
| Require status checks to pass | ✅ |
| Status checks required | `🔍 Lint`, `🧪 Test`, `🏗️ Build`, `verify-remote` |
| Require branches to be up to date | ✅ |
| Require conversation resolution | ✅ |
| Require linear history | ✅ |
| Do not allow force pushes | ✅ |
| Do not allow deletions | ✅ |
| Include administrators | ✅ |

---

## GitHub Security Settings

Enable these in **Settings → Security & analysis**:

| Setting | Action |
|---|---|
| Dependabot alerts | Enable |
| Dependabot security updates | Enable |
| Secret scanning | Enable |
| Secret scanning push protection | Enable |
| Code scanning (CodeQL) | Enabled automatically by `security.yml` |

---

## Summary Checklist

- [ ] Copy workflow templates → `.github/workflows/` and push
- [ ] Apply branch protection rules to `main`
- [ ] Enable Dependabot alerts + security updates
- [ ] Enable secret scanning + push protection
- [ ] Verify CodeQL appears under Security → Code scanning
