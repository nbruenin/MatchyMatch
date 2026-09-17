# Security Remediation Checklist

**Repository:** MatchyMatch  
**Date Created:** September 17, 2024  
**Status:** Ready for Implementation

---

## Quick Reference

| Priority      | Issues  | Timeline | Status     |
| ------------- | ------- | -------- | ---------- |
| P1 - Critical | 2 items | 24 hours | ⚠️ Pending |
| P2 - High     | 3 items | 1 week   | ⚠️ Pending |
| P3 - Medium   | 3 items | 1 month  | ⚠️ Pending |
| P4 - Low      | 3 items | Ongoing  | ⚠️ Pending |

**Total Issues:** 11  
**Estimated Total Time:** 8-12 hours + ongoing maintenance

---

## Priority 1: CRITICAL (Complete within 24 hours)

### ✅ Task 1.1: Update Vitest and Fix Critical Vulnerabilities

**Severity:** CRITICAL  
**Time Estimate:** 1-2 hours  
**Risk:** Breaking changes may require test updates

**Current State:**

- vitest v1.0.4 (vulnerable)
- @vitest/ui v1.0.4 (vulnerable)
- 5 total vulnerabilities (2 critical, 1 high, 2 moderate)

**Target State:**

- vitest v5.0.1+ (secure)
- @vitest/ui v5.0.1+ (secure)
- 0 vulnerabilities

**Steps:**

```bash
# 1. Backup current configuration
cp package.json package.json.backup
cp package-lock.json package-lock.json.backup

# 2. Update vitest and related packages
npm install vitest@latest @vitest/ui@latest --save-dev --legacy-peer-deps

# 3. Verify installation
npm list vitest @vitest/ui

# 4. Run tests to check for breaking changes
npm test

# 5. If tests fail, check vitest v5 migration guide
# https://vitest.dev/guide/migration.html

# 6. Fix any breaking changes in test files

# 7. Verify all tests pass
npm test

# 8. Run linter
npm run lint

# 9. Build to ensure no build issues
npm run build

# 10. Commit changes
git add package.json package-lock.json
git commit -m "security: update vitest to v5.x to fix critical vulnerabilities

- Fixes GHSA-5xrq-8626-4rwp (Critical): Vitest UI arbitrary file read/execute
- Fixes GHSA-67mh-4wv8-2f99 (Moderate): esbuild dev server request interception
- Fixes GHSA-fx2h-pf6j-xcff (High): Vite fs.deny bypass on Windows
- Fixes GHSA-4w7w-66w2-5vf9 (Moderate): Vite path traversal
- Fixes GHSA-v6wh-96g9-6wx3 (Moderate): NTLMv2 hash disclosure

Resolves all 5 dependency vulnerabilities"
```

**Verification:**

```bash
# Verify no vulnerabilities remain
npm audit

# Expected output: "found 0 vulnerabilities"
```

**Rollback Plan:**

```bash
# If issues occur, rollback
cp package.json.backup package.json
cp package-lock.json.backup package-lock.json
npm install --legacy-peer-deps
```

**Success Criteria:**

- [ ] vitest updated to v5.0.1 or higher
- [ ] @vitest/ui updated to v5.0.1 or higher
- [ ] `npm audit` shows 0 vulnerabilities
- [ ] All tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes committed to git

---

### ✅ Task 1.2: Activate Security Workflows

**Severity:** HIGH  
**Time Estimate:** 30 minutes  
**Risk:** Low - templates already exist and tested

**Current State:**

- Security workflow templates exist but not activated
- No automated security scanning
- No CI/CD pipeline running

**Target State:**

- Security workflows active and running
- Automated npm audit on every PR
- CodeQL analysis enabled
- Secret scanning enabled

**Steps:**

```bash
# 1. Create workflows directory if it doesn't exist
mkdir -p .github/workflows

# 2. Copy security workflow template
cp .github/workflow-templates/security.yml .github/workflows/security.yml

# 3. Copy CI workflow template
cp .github/workflow-templates/ci.yml .github/workflows/ci.yml

# 4. Review workflow files
cat .github/workflows/security.yml
cat .github/workflows/ci.yml

# 5. Commit workflows
git add .github/workflows/
git commit -m "ci: activate security and CI workflows

- Enable automated npm audit on push and PR
- Enable CodeQL security analysis
- Enable secret scanning with TruffleHog
- Enable dependency review for PRs
- Run security checks weekly on schedule"

# 6. Push to trigger workflows
git push

# 7. Verify workflows run successfully in GitHub Actions tab
```

**Verification:**

- [ ] `.github/workflows/security.yml` exists
- [ ] `.github/workflows/ci.yml` exists
- [ ] Workflows appear in GitHub Actions tab
- [ ] Security workflow runs successfully
- [ ] CI workflow runs successfully
- [ ] No errors in workflow runs

**Success Criteria:**

- [ ] Security workflows activated
- [ ] First workflow run completes successfully
- [ ] npm audit runs automatically
- [ ] CodeQL analysis runs automatically
- [ ] Changes committed and pushed

---

## Priority 2: HIGH (Complete within 1 week)

### ✅ Task 2.1: Add HSTS Security Header

**Severity:** MEDIUM  
**Time Estimate:** 15 minutes  
**Risk:** Very low - standard security header

**Current State:**

- HSTS header not configured
- HTTPS not enforced at header level

**Target State:**

- HSTS header configured with 1-year max-age
- HTTPS enforced for all connections

**Steps:**

```bash
# 1. Edit netlify.toml
# Add to the [[headers]] section for "/*":

[[headers]]
  for = "/*"
  [headers.values]
    # ... existing headers ...

    # Enforce HTTPS (add this line)
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

# 2. Commit changes
git add netlify.toml
git commit -m "security: add HSTS header to enforce HTTPS

- Adds Strict-Transport-Security header
- max-age set to 1 year (31536000 seconds)
- Includes subdomains
- Preload ready for HSTS preload list"

# 3. Deploy and verify
# After deployment, check headers:
curl -I https://your-domain.netlify.app | grep -i strict-transport
```

**Verification:**

- [ ] HSTS header added to netlify.toml
- [ ] Changes committed
- [ ] Header visible in production (after deployment)
- [ ] Browser enforces HTTPS

**Success Criteria:**

- [ ] HSTS header configured
- [ ] Header includes includeSubDomains
- [ ] Header includes preload directive
- [ ] Changes deployed to production

---

### ✅ Task 2.2: Enable Branch Protection Rules

**Severity:** MEDIUM  
**Time Estimate:** 15 minutes  
**Risk:** Low - standard GitHub security practice

**Current State:**

- Branch protection not verified
- Direct commits to main possible
- No required reviews

**Target State:**

- Main branch protected
- PR reviews required
- Status checks required
- Direct commits prevented

**Steps:**

1. Go to GitHub repository
2. Navigate to Settings → Branches
3. Click "Add rule" or "Add branch protection rule"
4. Configure for `main` branch:

**Required Settings:**

- [x] Require a pull request before merging
  - [x] Require approvals: 1
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Add required checks:
    - [x] npm-audit (from security workflow)
    - [x] test (from CI workflow)
    - [x] lint (from CI workflow)
- [x] Require conversation resolution before merging
- [x] Require signed commits (optional but recommended)
- [x] Include administrators (recommended)
- [x] Restrict who can push to matching branches (optional)
- [x] Allow force pushes: Disabled
- [x] Allow deletions: Disabled

5. Click "Create" or "Save changes"

**Verification:**

- [ ] Branch protection rule created for `main`
- [ ] PR required for merging
- [ ] Status checks required
- [ ] Direct commits blocked
- [ ] Test by attempting direct commit (should fail)

**Success Criteria:**

- [ ] Branch protection enabled
- [ ] Cannot push directly to main
- [ ] PRs require approval
- [ ] Status checks must pass

---

### ✅ Task 2.3: Verify Updated Dependencies

**Severity:** MEDIUM  
**Time Estimate:** 1 hour  
**Risk:** Medium - ensure no regressions

**Current State:**

- Dependencies updated but not fully tested
- Potential for breaking changes

**Target State:**

- All tests passing
- All games working correctly
- No regressions introduced

**Steps:**

```bash
# 1. Run full test suite
npm test

# 2. Check test coverage
npm test -- --coverage

# 3. Run linter
npm run lint

# 4. Build for production
npm run build

# 5. Test production build locally
npm run preview

# 6. Manual testing checklist:
#    - Open http://localhost:4173
#    - Test each game type
#    - Verify dark mode toggle
#    - Check localStorage persistence
#    - Test game restart functionality
#    - Verify responsive design
#    - Check console for errors

# 7. If issues found:
#    - Document the issue
#    - Fix or rollback
#    - Re-test

# 8. Document test results
echo "# Test Results - $(date)" > TEST_RESULTS.md
echo "" >> TEST_RESULTS.md
echo "## Automated Tests" >> TEST_RESULTS.md
npm test 2>&1 | tee -a TEST_RESULTS.md
echo "" >> TEST_RESULTS.md
echo "## Build" >> TEST_RESULTS.md
npm run build 2>&1 | tee -a TEST_RESULTS.md

# 9. Commit test results
git add TEST_RESULTS.md
git commit -m "test: verify updated dependencies

- All tests passing
- Build successful
- Manual testing complete
- No regressions found"
```

**Verification:**

- [ ] All automated tests pass
- [ ] Linter passes with no errors
- [ ] Production build succeeds
- [ ] Manual testing complete
- [ ] No console errors
- [ ] All games functional

**Success Criteria:**

- [ ] Test suite passes 100%
- [ ] No new warnings or errors
- [ ] All games work correctly
- [ ] Performance not degraded
- [ ] Test results documented

---

## Priority 3: MEDIUM (Complete within 1 month)

### ✅ Task 3.1: Add Additional Security Headers

**Severity:** LOW  
**Time Estimate:** 10 minutes  
**Risk:** Very low

**Current State:**

- Basic security headers configured
- Some additional headers missing

**Target State:**

- Comprehensive security headers
- Defense in depth approach

**Steps:**

```bash
# Edit netlify.toml and add:

[[headers]]
  for = "/*"
  [headers.values]
    # ... existing headers ...

    # Additional security headers
    X-Permitted-Cross-Domain-Policies = "none"
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Resource-Policy = "same-origin"

# Commit changes
git add netlify.toml
git commit -m "security: add additional security headers

- X-Permitted-Cross-Domain-Policies: prevents Flash/PDF cross-domain
- Cross-Origin-Embedder-Policy: isolates resources
- Cross-Origin-Opener-Policy: prevents cross-origin attacks
- Cross-Origin-Resource-Policy: restricts resource loading"
```

**Verification:**

- [ ] Headers added to netlify.toml
- [ ] Changes committed
- [ ] Headers visible after deployment
- [ ] No functionality broken

**Success Criteria:**

- [ ] All headers configured
- [ ] Application still works correctly
- [ ] Headers verified in production

---

### ✅ Task 3.2: Verify Pre-commit Hooks

**Severity:** LOW  
**Time Estimate:** 30 minutes  
**Risk:** Low

**Current State:**

- Husky configured in package.json
- lint-staged configured
- Pre-commit hooks may not be active

**Target State:**

- Pre-commit hooks active and working
- Linter runs before every commit
- Code formatted before every commit

**Steps:**

```bash
# 1. Verify husky is installed
ls -la .husky/

# 2. If not installed, run:
npm install
npx husky install

# 3. Verify pre-commit hook exists
cat .husky/pre-commit

# 4. Test pre-commit hook
# Make a change with linting errors
echo "const x = 'test'" >> src/test-file.js

# Try to commit (should fail)
git add src/test-file.js
git commit -m "test: verify pre-commit hook"

# Should see linting errors and commit blocked

# 5. Fix the file
rm src/test-file.js

# 6. Document hook configuration
echo "# Pre-commit Hooks Configuration" > PRE_COMMIT_HOOKS.md
echo "" >> PRE_COMMIT_HOOKS.md
echo "## Configured Hooks" >> PRE_COMMIT_HOOKS.md
echo "- ESLint: Runs on *.js, *.jsx files" >> PRE_COMMIT_HOOKS.md
echo "- Prettier: Formats all staged files" >> PRE_COMMIT_HOOKS.md
echo "" >> PRE_COMMIT_HOOKS.md
echo "## Testing" >> PRE_COMMIT_HOOKS.md
echo "Pre-commit hooks verified working on $(date)" >> PRE_COMMIT_HOOKS.md

git add PRE_COMMIT_HOOKS.md
git commit -m "docs: document pre-commit hooks configuration"
```

**Verification:**

- [ ] Husky installed
- [ ] Pre-commit hook exists
- [ ] Hook runs on commit
- [ ] Linting errors block commit
- [ ] Prettier formats code

**Success Criteria:**

- [ ] Pre-commit hooks active
- [ ] Linting runs automatically
- [ ] Formatting runs automatically
- [ ] Bad code blocked from commit

---

### ✅ Task 3.3: Create Security Testing Documentation

**Severity:** LOW  
**Time Estimate:** 1 hour  
**Risk:** Very low

**Current State:**

- Security testing ad-hoc
- No documented procedures

**Target State:**

- Security testing procedures documented
- Checklist for security reviews
- Guidelines for contributors

**Steps:**

````bash
# Create security testing guide
cat > SECURITY_TESTING.md << 'EOF'
# Security Testing Guide

## Pre-Release Security Checklist

### Automated Checks
- [ ] `npm audit` shows 0 vulnerabilities
- [ ] `npm run lint` passes with no errors
- [ ] `npm test` passes all tests
- [ ] All GitHub Actions workflows pass
- [ ] Dependabot PRs reviewed and merged

### Manual Checks
- [ ] No hardcoded secrets in code
- [ ] No sensitive data in git history
- [ ] Security headers present in production
- [ ] CSP not blocking legitimate resources
- [ ] HTTPS enforced
- [ ] Error messages don't leak sensitive info

### Code Review Checklist
- [ ] No use of `eval()` or `Function()`
- [ ] No use of `dangerouslySetInnerHTML`
- [ ] User input properly validated
- [ ] localStorage data validated on read
- [ ] No SQL injection vectors (if applicable)
- [ ] No XSS vulnerabilities
- [ ] Dependencies reviewed for security

### Testing Commands
```bash
# Security audit
npm audit

# Check for secrets
git log -p | grep -i "password\|secret\|key\|token"

# Check security headers
curl -I https://your-domain.netlify.app

# Run all tests
npm test

# Lint code
npm run lint
````

## Monthly Security Review

### Dependency Review

1. Check for outdated packages: `npm outdated`
2. Review security advisories
3. Update dependencies: `npm update`
4. Test after updates

### Configuration Review

1. Review security headers
2. Check CSP effectiveness
3. Verify HTTPS enforcement
4. Review access controls

### Code Review

1. Review recent changes for security issues
2. Check for new dangerous patterns
3. Verify input validation
4. Review error handling

## Quarterly Security Audit

### Comprehensive Review

1. Full dependency audit
2. Review all security configurations
3. Test for OWASP Top 10 vulnerabilities
4. Review and update security documentation
5. Consider external security audit

### Documentation Updates

1. Update SECURITY.md
2. Update this guide
3. Update CONTRIBUTING.md security section
4. Document any new security measures

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
  EOF

git add SECURITY_TESTING.md
git commit -m "docs: add security testing guide

- Pre-release security checklist
- Monthly security review procedures
- Quarterly audit guidelines
- Testing commands reference"

````

**Verification:**
- [ ] SECURITY_TESTING.md created
- [ ] Checklist comprehensive
- [ ] Commands tested and working
- [ ] Documentation committed

**Success Criteria:**
- [ ] Security testing guide created
- [ ] Procedures documented
- [ ] Checklists actionable
- [ ] Resources linked

---

## Priority 4: LOW (Ongoing)

### ✅ Task 4.1: Establish Regular Security Review Schedule
**Severity:** LOW
**Time Estimate:** 30 minutes setup + ongoing
**Risk:** Very low

**Steps:**
1. Create calendar reminders:
   - Weekly: Review Dependabot PRs
   - Monthly: Run security audit
   - Quarterly: Comprehensive security review

2. Document review process:
```bash
cat > SECURITY_REVIEW_SCHEDULE.md << 'EOF'
# Security Review Schedule

## Weekly (Every Monday)
- [ ] Review and merge Dependabot PRs
- [ ] Check GitHub security alerts
- [ ] Review recent commits for security issues

## Monthly (First Monday)
- [ ] Run `npm audit` and fix issues
- [ ] Check for outdated packages
- [ ] Review security headers in production
- [ ] Check for new security advisories

## Quarterly (First Monday of Quarter)
- [ ] Comprehensive security audit
- [ ] Review and update security documentation
- [ ] Review access controls
- [ ] Consider external security assessment
- [ ] Update security training materials

## Annual (January)
- [ ] Full security assessment
- [ ] Review and update security policies
- [ ] Review incident response plan
- [ ] Consider penetration testing
EOF

git add SECURITY_REVIEW_SCHEDULE.md
git commit -m "docs: establish security review schedule"
````

**Success Criteria:**

- [ ] Calendar reminders set
- [ ] Review schedule documented
- [ ] First review completed

---

### ✅ Task 4.2: Security Training and Documentation

**Severity:** LOW  
**Time Estimate:** 2 hours  
**Risk:** Very low

**Steps:**

1. Create security guidelines for contributors
2. Document common security pitfalls
3. Create security section in PR template
4. Add security resources to README

**Success Criteria:**

- [ ] Security guidelines documented
- [ ] Common pitfalls documented
- [ ] PR template includes security checklist
- [ ] Resources easily accessible

---

### ✅ Task 4.3: Monitoring and Alerting

**Severity:** LOW  
**Time Estimate:** 1 hour  
**Risk:** Very low

**Steps:**

1. Enable GitHub security alerts
2. Subscribe to security advisories
3. Configure notification preferences
4. Set up monitoring dashboard

**Success Criteria:**

- [ ] GitHub alerts enabled
- [ ] Notifications configured
- [ ] Team aware of alert process
- [ ] Response procedures documented

---

## Progress Tracking

### Overall Progress

- **Priority 1:** 0/2 complete (0%)
- **Priority 2:** 0/3 complete (0%)
- **Priority 3:** 0/3 complete (0%)
- **Priority 4:** 0/3 complete (0%)
- **Total:** 0/11 complete (0%)

### Time Tracking

- **Estimated Total Time:** 8-12 hours
- **Time Spent:** 0 hours
- **Remaining:** 8-12 hours

### Milestone Dates

- **Priority 1 Target:** [Date + 24 hours]
- **Priority 2 Target:** [Date + 1 week]
- **Priority 3 Target:** [Date + 1 month]
- **Priority 4 Target:** Ongoing

---

## Notes and Issues

### Blockers

- None currently identified

### Dependencies

- Task 1.1 must complete before Task 2.3
- Task 1.2 must complete before Task 2.2 (status checks)

### Risks

- Vitest v5 may have breaking changes requiring test updates
- Branch protection may block emergency fixes (can be temporarily disabled)

### Questions

- Should we require signed commits?
- Should we enable auto-merge for Dependabot?
- Do we need additional security tools (Snyk, etc.)?

---

## Sign-off

### Priority 1 Completion

- [ ] All P1 tasks complete
- [ ] All tests passing
- [ ] No vulnerabilities remaining
- [ ] Signed off by: _______________
- [ ] Date: _______________

### Priority 2 Completion

- [ ] All P2 tasks complete
- [ ] Branch protection active
- [ ] HSTS header deployed
- [ ] Signed off by: _______________
- [ ] Date: _______________

### Priority 3 Completion

- [ ] All P3 tasks complete
- [ ] Documentation updated
- [ ] Pre-commit hooks verified
- [ ] Signed off by: _______________
- [ ] Date: _______________

### Priority 4 Ongoing

- [ ] Schedule established
- [ ] First reviews complete
- [ ] Process documented
- [ ] Signed off by: _______________
- [ ] Date: _______________

---

**Document Version:** 1.0  
**Last Updated:** September 17, 2024  
**Next Review:** After Priority 1 completion
