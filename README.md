# MatchyMatch 🎮

[![CI](https://github.com/nbruenin/MatchyMatch/actions/workflows/ci.yml/badge.svg)](https://github.com/nbruenin/MatchyMatch/actions/workflows/ci.yml)
[![Security](https://github.com/nbruenin/MatchyMatch/actions/workflows/security.yml/badge.svg)](https://github.com/nbruenin/MatchyMatch/actions/workflows/security.yml)
[![codecov](https://codecov.io/gh/nbruenin/MatchyMatch/branch/main/graph/badge.svg)](https://codecov.io/gh/nbruenin/MatchyMatch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A collection of puzzle and word games built with React and Vite.

## Features

- 🎯 Multiple game modes (Matchy, Wordle, Sudoku, and more)
- 🌙 Dark mode support
- 📱 Responsive design
- ⚡ Fast and lightweight
- 🧪 Comprehensive test suite
- 🔒 Security-focused development
- 🛡️ Repository access control
- ✅ Full CI/CD pipeline with GitHub Actions

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nbruenin/MatchyMatch.git
   cd MatchyMatch
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

### Development

```bash
npm run dev          # Start development server with HMR
npm run preview      # Preview production build locally
```

### Building

```bash
npm run build        # Build for production
```

### Testing

```bash
npm test             # Run tests in watch mode
npm run test -- --run  # Run tests once
npm run test:ui      # Run tests with UI
```

### Code Quality

```bash
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── data/           # Game data and puzzles
├── test/           # Test files
├── assets/         # Static assets
└── App.jsx         # Main app component
```

## Games

- **Matchy** - Match categories with related words
- **Wordle** - Guess the word in 6 tries
- **Sudoku** - Classic number puzzle
- **Crossword** - Fill in the crossword
- **Anagram** - Unscramble letters to form words
- **Hangman** - Guess the word letter by letter
- **Memory** - Match pairs of cards
- **Trivia** - Answer trivia questions
- **Word Search** - Find hidden words
- **Whack-a-Mole** - Click the moles before they disappear!
- **And more!**

## Development

### Code Style

- JavaScript ES6+
- React functional components with hooks
- Tailwind CSS for styling
- ESLint for code quality

### Testing

We use Vitest for testing. Tests are located in `src/test/` and should:

- Cover critical functionality
- Test both happy path and edge cases
- Use descriptive test names
- Aim for 80%+ coverage

Run tests with:

```bash
npm test
```

## Continuous Integration & Deployment

This repository has a comprehensive CI/CD pipeline with GitHub Actions:

### 🔄 CI Workflows

#### Main CI Pipeline (`ci.yml`)

Runs on every push and pull request:

- **🔍 Lint** - ESLint code quality checks
- **🧪 Test** - Full test suite with Vitest
- **🏗️ Build** - Production build verification

#### Security Scanning (`security.yml`)

Runs on main branch, PRs, and weekly schedule:

- **📦 npm Audit** - Dependency vulnerability scanning
- **🔬 CodeQL** - Static code analysis for security issues
- **🔑 Secret Scan** - TruffleHog secret detection
- **📋 Dependency Review** - PR dependency change analysis

#### Repository Verification (`verify-remote.yml`)

Runs on every push and PR:

- **🔍 Verify Repository** - Ensures code is pushed to correct repo
- Prevents accidental pushes to forks

### 🤖 Automation Workflows

#### Auto-merge (`auto-merge.yml`)

Automatically merges Dependabot PRs:

- Auto-approves and merges minor/patch updates
- Comments on major updates for manual review
- Requires all CI checks to pass

#### Code Coverage (`coverage.yml`)

Generates and uploads coverage reports:

- Runs tests with coverage
- Uploads to Codecov
- Stores coverage artifacts

#### PR Validation (`pr-validation.yml`)

Validates and labels pull requests:

- Validates PR title format (conventional commits)
- Auto-labels based on changed files
- Adds size labels (xs/s/m/l/xl)

#### Stale Management (`stale.yml`)

Manages inactive issues and PRs:

- Marks issues stale after 60 days
- Marks PRs stale after 30 days
- Auto-closes after warning period

#### Release Automation (`release.yml`)

Automates releases from version tags:

- Generates changelog from PRs
- Creates GitHub release
- Uploads build artifacts

### 📊 CI Status

All workflows are active and running. Check the [Actions tab](https://github.com/nbruenin/MatchyMatch/actions) for current status.

### 🔧 Required Secrets

For full functionality, configure these secrets in repository settings:

- `CODECOV_TOKEN` - For code coverage reporting (optional)
- `GITHUB_TOKEN` - Automatically provided by GitHub

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Development setup
- Code style guidelines
- Testing requirements
- PR process
- Commit message format

## Security

We take security seriously. For security issues, please see [SECURITY.md](SECURITY.md).

### Security Features

- ✅ No dangerous functions (eval, dangerouslySetInnerHTML)
- ✅ Security headers configured
- ✅ Regular dependency audits (automated)
- ✅ Content Security Policy enabled
- ✅ Input validation
- ✅ Code review process
- ✅ Repository access control (prevents pushes to wrong repo)
- ✅ Pre-commit hooks for code quality
- ✅ Automated dependency updates (Dependabot)
- ✅ CodeQL security scanning
- ✅ Secret scanning with TruffleHog
- ✅ Dependency review on PRs

### Repository Access Control

This repository is protected with **enterprise-grade access control** to ensure code can only be pushed to the correct repository: **nbruenin/MatchyMatch**.

**How it works:**

1. **Pre-push hook** - Validates remote URL before every push
2. **GitHub Actions** - Verifies repository on every push/PR
3. **Branch protection** - Requires reviews and CI to pass

For details, see [.github/REPOSITORY_ACCESS_CONTROL.md](.github/REPOSITORY_ACCESS_CONTROL.md).

### Reporting Security Issues

**Please do NOT open a public issue for security vulnerabilities.**

See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

## Deployment

### Netlify

The project is configured for Netlify deployment:

```bash
npm run build
```

Configuration is in `netlify.toml` with:

- Security headers
- Cache policies
- Build environment

### Environment Variables

See `.env.example` for available environment variables.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- ⚡ Vite for fast development and builds
- 📦 Code splitting and lazy loading
- 🎯 Optimized bundle size
- 🚀 Production-ready performance

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- 📖 [Documentation](SPEC.md)
- 🐛 [Report a bug](https://github.com/nbruenin/MatchyMatch/issues)
- 💡 [Request a feature](https://github.com/nbruenin/MatchyMatch/discussions)
- 🔒 [Report security issue](SECURITY.md)
- 🛡️ [Repository access control](/.github/REPOSITORY_ACCESS_CONTROL.md)
- 🔄 [CI/CD Workflows](https://github.com/nbruenin/MatchyMatch/actions)

## Acknowledgments

- Built with [React](https://react.dev)
- Powered by [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)
- CI/CD with [GitHub Actions](https://github.com/features/actions)

---

**Made with ❤️ by the MatchyMatch team**
