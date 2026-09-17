# CI Fix Plan - Detailed Implementation Guide

**Date**: 2025-01-XX  
**Status**: Ready for Implementation  
**Related**: CI_ISSUES_ANALYSIS.md

---

## Overview

This document provides step-by-step instructions for fixing all CI issues identified in the analysis. Each phase includes specific commands, code changes, and verification steps.

---

## Phase 1: Activate CI Workflows

### Objective

Move workflow templates to active workflows directory and update for peer dependency compatibility.

### Prerequisites

- Repository cloned locally
- Git configured with appropriate permissions
- Node.js 20+ installed

### Steps

#### 1.1: Create Workflows Directory

```bash
mkdir -p .github/workflows
```

#### 1.2: Update CI Workflow for Peer Dependencies

Create `.github/workflows/ci.yml`:

```yaml
name: CI — Lint, Test & Build

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main, master]

permissions:
  contents: read

jobs:
  lint:
    name: 🔍 Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Run ESLint
        run: npm run lint

  test:
    name: 🧪 Test
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Run tests
        run: npm test -- --run

  build:
    name: 🏗️ Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Build
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7
```

#### 1.3: Update Security Workflow

Create `.github/workflows/security.yml`:

```yaml
name: 🔒 Security Audit

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  schedule:
    # Run every Monday at 04:00 UTC
    - cron: '0 4 * * 1'
  workflow_dispatch:

permissions:
  contents: read
  security-events: write

jobs:
  npm-audit:
    name: 📦 npm Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Run npm audit (production deps)
        run: npm audit --omit=dev --audit-level=high
        continue-on-error: false

      - name: Run full npm audit (report only)
        run: npm audit --audit-level=critical || true

  codeql:
    name: 🔬 CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    strategy:
      fail-fast: false
      matrix:
        language: [javascript]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: security-and-quality

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: '/language:${{ matrix.language }}'

  secret-scan:
    name: 🔑 Secret Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Scan for secrets with TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
          extra_args: --debug --only-verified
        continue-on-error: true

  dependency-review:
    name: 📋 Dependency Review
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Dependency Review
        uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
          deny-licenses: GPL-2.0, AGPL-3.0
```

#### 1.4: Copy Verify Remote Workflow

```bash
cp .github/workflow-templates/verify-remote.yml .github/workflows/verify-remote.yml
```

#### 1.5: Commit and Push

```bash
git add .github/workflows/
git commit -m "ci: activate GitHub Actions workflows with peer dependency fix"
git push
```

### Verification

1. Go to GitHub Actions tab
2. Verify workflows appear in the list
3. Make a test commit to trigger workflows
4. Check that workflows run (they will fail due to linting errors - expected)

### Expected Outcome

- ✅ Workflows visible in GitHub Actions
- ✅ Workflows trigger on push
- ❌ Lint job fails (expected - Phase 2 will fix)
- ⏭️ Test and Build jobs skipped (depends on Lint)

---

## Phase 2: Fix ESLint Errors

### Objective

Fix all 121 ESLint errors to allow CI pipeline to pass the Lint stage.

### Strategy

Fix errors in order of priority and impact:

1. React Hooks purity violations (HIGH)
2. Parameter reassignment (MEDIUM)
3. Variable declarations (LOW)
4. Unused variables (LOW)
5. Console warnings (LOW)

### 2.1: Fix React Hooks Purity Violations

#### Issue: Math.random() in Render

**File**: `src/components/Confetti.jsx`

**Current Code** (lines 16-21):

```javascript
return Array.from({ length: count }, (_, i) => ({
  id: i,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  left: randomBetween(5, 95),
  delay: randomBetween(0, 0.9),
  duration: randomBetween(1.1, 1.9),
}))
```

**Fixed Code**:

```javascript
// Move confetti generation to useMemo to avoid calling Math.random during render
const confetti = useMemo(() => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    left: randomBetween(5, 95),
    delay: randomBetween(0, 0.9),
    duration: randomBetween(1.1, 1.9),
  }))
}, [count])
```

**Import to add**:

```javascript
import { useMemo } from 'react'
```

#### Issue: Variable Accessed Before Declaration

**File**: `src/components/anagram/AnagramBoard.jsx`

**Problem**: `handleSkip` and `advanceRound` are called before they're declared.

**Solution**: Reorder function declarations or use `useCallback` with proper dependencies.

**Current Structure**:

```javascript
// Line 275: handleSkip called here
useEffect(() => {
  if (timeLeft === 0 && gamePhase === 'playing') {
    handleSkip(true)
  }
}, [timeLeft, gamePhase])

// Line 333: handleSkip declared here
const handleSkip = useCallback(
  (timedOut = false) => {
    // ...
  },
  [gamePhase, currentRound, stopTimer]
)
```

**Fixed Structure**:

```javascript
// Declare handleSkip before the useEffect that uses it
const handleSkip = useCallback(
  (timedOut = false) => {
    if (gamePhase !== 'playing') return
    stopTimer()
    if (!timedOut) setToast('Skipped!')
    else setToast(`Time's up! It was ${currentRound.word}`)
    advanceRound('skipped')
  },
  [gamePhase, currentRound, stopTimer, advanceRound]
)

// Declare advanceRound before handleSkip
const advanceRound = useCallback(
  (result) => {
    setRoundResults((prev) => {
      const next = [...prev, result]
      if (next.length >= ROUNDS_PER_GAME) {
        setGamePhase('gameOver')
        return next
      }
      return next
    })
    // ... rest of logic
  },
  [/* dependencies */]
)

// Now the useEffect can safely use handleSkip
useEffect(() => {
  if (timeLeft === 0 && gamePhase === 'playing') {
    handleSkip(true)
  }
}, [timeLeft, gamePhase, handleSkip])
```

#### Issue: setState in Effect

**File**: `src/components/anagram/AnagramBoard.jsx` (line 316)

**Problem**: Calling `setState` synchronously within an effect body.

**Current Code**:

```javascript
useEffect(() => {
  if (isCorrect) {
    stopTimer()
    const pts = calcPoints(timeLeft)
    setRevealState('correct') // ❌ Synchronous setState in effect
    setScore((s) => s + pts)
    setToast(`+${pts} pts`)
    setTimeout(() => advanceRound('correct'), 1200)
  }
}, [answerSlots])
```

**Fixed Code**:

```javascript
// Move logic to a separate function
const handleCorrectAnswer = useCallback(() => {
  stopTimer()
  const pts = calcPoints(timeLeft)
  setRevealState('correct')
  setScore((s) => s + pts)
  setToast(`+${pts} pts`)
  setTimeout(() => advanceRound('correct'), 1200)
}, [timeLeft, stopTimer, advanceRound])

// Call function from effect
useEffect(() => {
  if (isCorrect) {
    handleCorrectAnswer()
  }
}, [isCorrect, handleCorrectAnswer])
```

#### Issue: Manual Memoization Not Preserved

**File**: `src/components/breakout/BreakoutBoard.jsx` (line 53)

**Problem**: `useCallback` dependencies don't match inferred dependencies.

**Current Code**:

```javascript
const showToast = useCallback((msg) => setToast(msg), [])
```

**Fixed Code**:

```javascript
const showToast = useCallback((msg) => setToast(msg), [setToast])
// Or if setToast is from useState, it's stable and can be omitted:
const showToast = useCallback((msg) => setToast(msg), [])
// But add eslint-disable comment if intentional:
// eslint-disable-next-line react-hooks/exhaustive-deps
```

### 2.2: Fix Parameter Reassignment

#### Issue: Mutating Event Object Properties

**File**: `src/components/DarkModeToggle.jsx` (lines 24-35)

**Current Code**:

```javascript
const handleClick = (e) => {
  e.currentTarget.style.transform = 'scale(0.95)'
  e.currentTarget.style.transition = 'transform 0.1s'
  // ... more mutations
}
```

**Fixed Code**:

```javascript
const handleClick = (e) => {
  const target = e.currentTarget
  target.style.transform = 'scale(0.95)'
  target.style.transition = 'transform 0.1s'
  // ... rest of code
}
```

**File**: `src/components/Tile.jsx` (lines 35-46)

Apply same fix pattern.

**File**: `src/components/breakout/BreakoutBoard.jsx` (line 129)

**Current Code**:

```javascript
bricks.forEach((brick) => {
  if (brick.hit) {
    brick.visible = false // ❌ Mutating parameter
  }
})
```

**Fixed Code**:

```javascript
bricks.forEach((brick) => {
  if (brick.hit) {
    const updatedBrick = { ...brick, visible: false }
    // Or use map to create new array
  }
})
// Better: Use map instead of forEach
const updatedBricks = bricks.map((brick) =>
  brick.hit ? { ...brick, visible: false } : brick
)
```

### 2.3: Fix Variable Declarations

#### Issue: Using `let` for Variables Never Reassigned

**File**: `src/components/blackjack/BlackjackBoard.jsx`

**Lines 359, 388, 404, 405, 449, 463**:

**Current Code**:

```javascript
let d = deck.slice()
let dHand = dealerHand.slice()
```

**Fixed Code**:

```javascript
const d = deck.slice()
const dHand = dealerHand.slice()
```

**Automated Fix**:

```bash
# Run ESLint with --fix flag
npm run lint -- --fix
```

This will automatically fix many `prefer-const` violations.

### 2.4: Remove Unused Variables

#### Issue: Variables Declared But Never Used

**File**: `src/components/breakout/BreakoutBoard.jsx` (line 196)

**Current Code**:

```javascript
const textColor = 'white' // Never used
```

**Fixed Code**:

```javascript
// Remove the line or use the variable
```

**Automated Detection**:

```bash
npm run lint | grep "never used"
```

### 2.5: Fix Console Warnings

#### Issue: Using console.log Instead of Allowed Methods

**File**: `scripts/pick-puzzle.js` (line 12)
**File**: `scripts/verify-chains.js` (lines 32, 36)

**Current Code**:

```javascript
console.log('Some message')
```

**Fixed Code**:

```javascript
// Option 1: Change to allowed method
console.warn('Some message')

// Option 2: Add eslint-disable comment if intentional
// eslint-disable-next-line no-console
console.log('Some message')

// Option 3: Remove if not needed
```

### 2.6: Automated Fixes

Run ESLint with auto-fix:

```bash
npm run lint -- --fix
```

This will automatically fix:

- `prefer-const` violations
- Some formatting issues
- Simple code style issues

### 2.7: Verification

After each fix:

```bash
# Check remaining errors
npm run lint

# Run tests to ensure nothing broke
npm test -- --run

# Build to verify no build errors
npm run build
```

### Expected Outcome

- ✅ `npm run lint` passes with 0 errors
- ✅ All warnings addressed or documented
- ✅ Code still functions correctly

---

## Phase 3: Fix Test Suite

### Objective

Resolve test suite hanging issue and ensure all tests pass.

### 3.1: Investigate Test Hang

#### Step 1: Run Individual Test Files

```bash
# Test each file individually to isolate the issue
npm test -- --run src/test/basicTests.test.js
npm test -- --run src/test/app.test.jsx
npm test -- --run src/test/components.test.jsx
npm test -- --run src/test/gameLogic.test.js
npm test -- --run src/test/dataAndUtils.test.js
```

#### Step 2: Check for Infinite Loops

Look for:

- `useEffect` without dependencies
- `useEffect` that updates its own dependencies
- Recursive function calls without base case
- While loops without exit condition

#### Step 3: Review Async Operations

Check for:

- Promises that never resolve
- Timers that never complete
- Event listeners not cleaned up

### 3.2: Common Test Hang Fixes

#### Fix 1: Add Test Timeouts

**vitest.config.js**:

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    testTimeout: 10000, // Add 10 second timeout
    hookTimeout: 10000, // Add hook timeout
  },
})
```

#### Fix 2: Mock Timers in Tests

**Example test file**:

```javascript
import { vi } from 'vitest'

describe('Component with timers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle timeout', () => {
    // Test code
    vi.runAllTimers()
  })
})
```

#### Fix 3: Clean Up Effects

Ensure all components clean up effects:

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    // ...
  }, 1000)

  return () => clearTimeout(timer) // ✅ Cleanup
}, [])
```

### 3.3: Run Full Test Suite

```bash
npm test -- --run --reporter=verbose
```

### Expected Outcome

- ✅ Test suite completes without hanging
- ✅ All tests pass or have documented failures
- ✅ Test output shows clear results

---

## Phase 4: Configure Branch Protection

### Objective

Enforce CI checks before merging to main branch.

### Steps

#### 4.1: Navigate to Branch Protection Settings

1. Go to repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** or **Add branch protection rule**

#### 4.2: Configure Rule

**Branch name pattern**: `main`

**Settings to enable**:

- ✅ **Require a pull request before merging**
  - Required approving reviews: `1`
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners
  - ✅ Require approval of the most recent reviewable push

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Status checks that are required**:
    - `🔍 Lint`
    - `🧪 Test`
    - `🏗️ Build`
    - `verify-remote`

- ✅ **Require conversation resolution before merging**

- ✅ **Require linear history**

- ✅ **Do not allow bypassing the above settings**

- ✅ **Restrict who can push to matching branches**
  - Add: Repository administrators

#### 4.3: Save Changes

Click **Create** or **Save changes**

### Verification

1. Create a test PR with failing lint
2. Verify PR cannot be merged
3. Fix the issue
4. Verify PR can now be merged

### Expected Outcome

- ✅ PRs require passing CI checks
- ✅ PRs require 1 approval
- ✅ Force pushes blocked
- ✅ Linear history enforced

---

## Phase 5: Enable Security Features

### Objective

Activate GitHub's security scanning and alerting features.

### Steps

#### 5.1: Navigate to Security Settings

1. Go to repository on GitHub
2. Click **Settings** → **Security & analysis**

#### 5.2: Enable Features

Enable each of the following:

1. **Dependency graph**
   - Should already be enabled
   - If not, click **Enable**

2. **Dependabot alerts**
   - Click **Enable**
   - Alerts for vulnerable dependencies

3. **Dependabot security updates**
   - Click **Enable**
   - Automatic PRs to fix vulnerabilities

4. **Secret scanning**
   - Click **Enable**
   - Scans for leaked secrets

5. **Secret scanning push protection**
   - Click **Enable**
   - Blocks pushes containing secrets

6. **Code scanning**
   - Will auto-enable when `security.yml` workflow runs
   - Or manually set up CodeQL

### Verification

1. Check **Security** tab appears in repository
2. Navigate to **Security** → **Dependabot**
3. Verify alerts are being tracked
4. Check **Security** → **Code scanning** after workflow runs

### Expected Outcome

- ✅ Dependabot alerts active
- ✅ Secret scanning active
- ✅ CodeQL scanning active (after workflow runs)
- ✅ Security tab populated with findings

---

## Phase 6: Optimize Bundle Size (Optional)

### Objective

Reduce bundle size below 500 KB warning threshold.

### 6.1: Analyze Bundle

```bash
npm run build -- --mode production

# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Update vite.config.js to include visualizer
```

**vite.config.js**:

```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  // ...
})
```

### 6.2: Implement Code Splitting

**src/App.jsx**:

```javascript
import { lazy, Suspense } from 'react'

// Lazy load game components
const AnagramBoard = lazy(() => import('./components/anagram/AnagramBoard'))
const BlackjackBoard = lazy(
  () => import('./components/blackjack/BlackjackBoard')
)
// ... other games

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Game components */}
    </Suspense>
  )
}
```

### 6.3: Configure Chunk Splitting

**vite.config.js**:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'game-components': [
            './src/components/anagram/AnagramBoard',
            './src/components/blackjack/BlackjackBoard',
            // ... other game components
          ],
        },
      },
    },
  },
})
```

### Expected Outcome

- ✅ Bundle size under 500 KB
- ✅ No bundle size warnings
- ✅ Faster initial page load

---

## Rollback Plan

If any phase causes issues:

### Rollback Phase 1 (Workflows)

```bash
git revert <commit-hash>
git push
```

Or manually:

```bash
rm -rf .github/workflows/
git add .github/workflows/
git commit -m "ci: rollback workflow activation"
git push
```

### Rollback Phase 2 (ESLint Fixes)

```bash
git revert <commit-hash>
git push
```

Or restore from backup:

```bash
git checkout HEAD~1 -- src/
git commit -m "revert: rollback ESLint fixes"
git push
```

### Rollback Phase 3 (Test Fixes)

```bash
git revert <commit-hash>
git push
```

---

## Testing Checklist

After each phase:

- [ ] Run `npm run lint` - should pass
- [ ] Run `npm test -- --run` - should complete
- [ ] Run `npm run build` - should succeed
- [ ] Check GitHub Actions - workflows should run
- [ ] Create test PR - should show CI status
- [ ] Verify branch protection - should block bad PRs

---

## Success Metrics

### Phase 1 Success

- Workflows visible in GitHub Actions
- Workflows trigger on push/PR
- npm ci completes successfully

### Phase 2 Success

- ESLint reports 0 errors
- ESLint reports 0 warnings (or all documented)
- Code still functions correctly

### Phase 3 Success

- Test suite completes in < 60 seconds
- All tests pass or failures documented
- No hanging tests

### Phase 4 Success

- Branch protection rules active
- PRs require CI checks
- Cannot merge failing PRs

### Phase 5 Success

- All security features enabled
- Security tab shows findings
- Dependabot creating PRs

### Phase 6 Success

- Bundle size < 500 KB
- No build warnings
- Page load time improved

---

## Troubleshooting

### Issue: npm ci Fails

**Solution**: Ensure `--legacy-peer-deps` flag is used

```bash
npm ci --legacy-peer-deps
```

### Issue: Workflows Don't Trigger

**Solution**: Check workflow file syntax

```bash
# Validate YAML syntax
cat .github/workflows/ci.yml | python3 -c "import yaml, sys; yaml.safe_load(sys.stdin)"
```

### Issue: Tests Still Hang

**Solution**: Run with verbose output

```bash
npm test -- --run --reporter=verbose --no-coverage
```

### Issue: ESLint Errors Persist

**Solution**: Check ESLint config

```bash
npx eslint --print-config src/App.jsx
```

---

## Documentation Updates

After completing all phases, update:

1. **README.md**
   - Add CI status badges
   - Update development workflow section

2. **CONTRIBUTING.md**
   - Update CI requirements
   - Add troubleshooting section

3. **CI_SETUP_INSTRUCTIONS.md**
   - Mark as complete
   - Add "Completed" date

4. **Create CI_COMPLETION_REPORT.md**
   - Document what was fixed
   - Include metrics (errors fixed, time taken)
   - List any remaining issues

---

## Next Steps After Completion

1. Monitor CI runs for 1 week
2. Address any new issues that arise
3. Consider additional optimizations:
   - Add code coverage reporting
   - Add performance testing
   - Add visual regression testing
4. Update team documentation
5. Train team on new CI workflow

---

**Document Status**: ✅ Ready for Implementation  
**Last Updated**: 2025-01-XX  
**Owner**: Development Team
