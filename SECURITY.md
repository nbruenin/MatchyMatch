# Security Policy

## Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability in MatchyMatch, please report it responsibly.

### How to Report

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email us with:
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if you have one)

### Security Contact

For security issues, please contact the maintainers privately through GitHub's security advisory feature:
- Go to the repository's Security tab
- Click "Report a vulnerability"
- Fill out the form with details

### Response Timeline

We aim to:
- Acknowledge receipt within 48 hours
- Provide initial assessment within 1 week
- Release a fix within 2 weeks (depending on severity)
- Credit the reporter (unless they prefer anonymity)

## Security Best Practices

### For Users
- Keep your browser and dependencies up to date
- Report any suspicious behavior
- Use strong passwords if the app stores any data

### For Developers
- Never commit secrets, API keys, or credentials
- Use `.env.local` for local development (not tracked by git)
- Run `npm audit` regularly to check for vulnerabilities
- Review dependencies before adding them
- Keep dependencies updated
- Follow OWASP security guidelines

## Supported Versions

| Version | Status | Security Updates |
|---------|--------|------------------|
| Latest  | Active | Yes              |
| Previous| Maintenance | Limited |
| Older   | EOL    | No               |

## Known Security Considerations

### Current Limitations
- This is a client-side game application with no backend
- No user authentication or data persistence
- All game state is stored locally in the browser
- No sensitive data is transmitted

### Mitigations
- Content Security Policy headers configured
- No use of dangerous functions (eval, dangerouslySetInnerHTML)
- Regular dependency audits
- Code review process for all changes

## Security Headers

The application is configured with the following security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Dependencies

We use the following security tools:
- `npm audit` - Automated vulnerability scanning
- `Dependabot` - Automated dependency updates
- `ESLint` - Code quality and security linting
- `GitHub Security` - Repository security scanning

## Changelog

### Security Updates
- All security updates are documented in CHANGELOG.md
- Critical vulnerabilities are released as patch versions
- Security advisories are posted in GitHub Releases

## Questions?

If you have questions about security, please open a discussion in the GitHub Discussions tab.

---

**Last Updated:** 2024
**Version:** 1.0
