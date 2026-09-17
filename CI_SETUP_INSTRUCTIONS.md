# CI Setup Instructions

## Overview

This repository has a GitHub Actions CI workflow ready to be activated. The workflow provides automated checks for:

- **Linting** (ESLint)
- **Testing** (Vitest)
- **Building** (Vite production build)

## Why Manual Activation is Required

GitHub requires a Personal Access Token with the `workflow` scope to push files into `.github/workflows/`. The automated tooling uses a token that intentionally omits this scope for security (principle of least privilege).

## Activation Methods

Choose one of the following methods to activate the CI workflow:

### Method 1: Copy via Command Line (Recommended)

After merging this PR, run:

```bash
# Ensure you're on the main branch
git checkout main
git pull

# Copy the workflow file
cp .github/workflow-templates/ci.yml .github/workflows/ci.yml

# Commit and push (requires a token with workflow scope)
git add .github/workflows/ci.yml
git commit -m "ci: activate GitHub Actions CI workflow"
git push
```

### Method 2: GitHub UI (No Special Token Required)

1. Go to your repository on GitHub
2. Navigate to **Actions** → **New workflow** → **Set up a workflow yourself**
3. Copy the contents from `.github/workflow-templates/ci.yml`
4. Paste into the editor
5. Name the file `ci.yml`
6. Click **Commit changes**

### Method 3: Direct File Creation

1. In your repository on GitHub, navigate to `.github/workflows/`
2. Click **Add file** → **Create new file**
3. Name it `ci.yml`
4. Copy the contents from `.github/workflow-templates/ci.yml`
5. Commit the file

## Workflow Details

### Trigger Events

- **Push**: Runs on all branches
- **Pull Request**: Runs on PRs targeting `main` or `master`

### Jobs

#### 1. 🔍 Lint

- Checks out code
- Sets up Node.js 20
- Installs dependencies with `npm ci`
- Runs `npm run lint`

#### 2. 🧪 Test

- Depends on: Lint job passing
- Checks out code
- Sets up Node.js 20
- Installs dependencies with `npm ci`
- Runs `npm test -- --run`

#### 3. 🏗️ Build

- Depends on: Lint and Test jobs passing
- Checks out code
- Sets up Node.js 20
- Installs dependencies with `npm ci`
- Runs `npm run build`
- Uploads build artifact (retained for 7 days)

### Failure Behavior

The workflow uses job dependencies (`needs`), so:

- If **Lint** fails → Test and Build are skipped
- If **Test** fails → Build is skipped
- If **Build** fails → No artifact is uploaded

This saves CI time and provides fast feedback.

## Verifying the Workflow

After activation:

1. Make a small change and push to any branch
2. Go to **Actions** tab in your repository
3. You should see the "CI — Lint, Test & Build" workflow running
4. Click on the workflow run to see detailed logs

## Additional Workflows Available

The repository also has these workflow templates ready:

- **`security.yml`**: Security scanning (npm audit, CodeQL, TruffleHog, Dependency Review)
- **`verify-remote.yml`**: Repository verification checks

To activate them, follow the same process as above.

## Branch Protection

Once the CI workflow is active, consider adding branch protection rules:

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. Select these status checks:
   - `🔍 Lint`
   - `🧪 Test`
   - `🏗️ Build`

See `.github/settings.yml` for the complete recommended configuration.

## Troubleshooting

### "workflow scope" Error

If you see an error about workflow scope when pushing:

- Use Method 2 (GitHub UI) instead
- Or create a Personal Access Token with `workflow` scope

### Tests Failing

The test suite currently has some failing tests. This is expected and the CI will help track these issues. To fix:

1. Review the test failures in the Actions tab
2. Fix the failing tests locally
3. Push the fixes

### Lint Errors

The linter currently reports several issues. To fix:

1. Run `npm run lint` locally
2. Fix the reported issues
3. Consider using `eslint --fix` for auto-fixable issues

## Next Steps

1. ✅ Activate the CI workflow using one of the methods above
2. ⏭️ Review and fix any failing tests
3. ⏭️ Address linting issues
4. ⏭️ Set up branch protection rules
5. ⏭️ Consider activating the security workflow

---

**Note**: The CI workflow file is already prepared in `.github/workflows/ci.yml` in this branch. It just needs to be pushed to the repository with appropriate permissions.
