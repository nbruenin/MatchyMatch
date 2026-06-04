# Contributing to MatchyMatch

Thank you for your interest in contributing to MatchyMatch! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MatchyMatch.git
   cd MatchyMatch
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/nbruenin/MatchyMatch.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Development Workflow

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/bug-description
# or for documentation
git checkout -b docs/documentation-update
```

**Branch naming convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Keep commits atomic and well-described

### 3. Run Tests and Linting

```bash
# Run linter
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build
```

**All tests must pass before submitting a PR.**

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new game feature"
```

**Commit message format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process, dependencies, etc.
- `perf:` - Performance improvements

**Example:**
```
feat(game): add new puzzle game mode

Add a new puzzle game mode with 20 unique puzzles.
Includes game logic, UI components, and test suite.

Closes #123
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub with:
- Clear title describing the change
- Description of what changed and why
- Reference to related issues (e.g., "Closes #123")
- Screenshots for UI changes

## Code Style Guidelines

### JavaScript/React

- Use ES6+ syntax
- Use functional components with hooks
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for complex functions

```javascript
/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
```

### CSS/Tailwind

- Use Tailwind CSS classes
- Avoid inline styles
- Use semantic class names
- Keep component styles scoped

### File Organization

```
src/
├── components/          # React components
│   ├── GameBoard.jsx
│   └── Tile.jsx
├── hooks/              # Custom React hooks
│   └── useDarkMode.js
├── utils/              # Utility functions
│   └── gameLogic.js
├── data/               # Data files
│   └── puzzles.js
├── test/               # Test files
│   └── basicTests.test.js
└── App.jsx
```

## Testing

### Writing Tests

- Write tests for new features
- Aim for at least 80% code coverage
- Test both happy path and edge cases
- Use descriptive test names

```javascript
describe('gameLogic', () => {
  it('should correctly identify matching categories', () => {
    const category = { words: ['cat', 'dog', 'bird', 'fish'] }
    const selected = ['cat', 'dog', 'bird', 'fish']
    expect(isCorrectMatch(category, selected)).toBe(true)
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test basicTests.test.js

# Run with coverage
npm test -- --coverage

# Run in UI mode
npm run test:ui
```

## Security Guidelines

### Do's
- ✅ Keep dependencies up to date
- ✅ Run `npm audit` regularly
- ✅ Review security advisories
- ✅ Use environment variables for configuration
- ✅ Validate user input
- ✅ Report security issues privately

### Don'ts
- ❌ Never commit secrets or API keys
- ❌ Don't use `eval()` or `dangerouslySetInnerHTML`
- ❌ Don't hardcode sensitive data
- ❌ Don't ignore security warnings
- ❌ Don't commit `.env` files
- ❌ Don't publicly disclose security vulnerabilities

## Documentation

### README Updates
- Update README.md if adding new features
- Include setup instructions for new dependencies
- Add examples for new functionality

### Code Comments
- Comment complex logic
- Explain "why" not just "what"
- Keep comments up to date with code

### Commit Messages
- Use clear, descriptive messages
- Reference related issues
- Explain the reasoning behind changes

## Pull Request Process

1. **Before submitting:**
   - [ ] Tests pass (`npm test`)
   - [ ] Linter passes (`npm run lint`)
   - [ ] Build succeeds (`npm run build`)
   - [ ] Code follows style guidelines
   - [ ] Documentation is updated
   - [ ] Commit messages are clear

2. **PR Description should include:**
   - What changed and why
   - How to test the changes
   - Screenshots for UI changes
   - Related issues (e.g., "Closes #123")
   - Any breaking changes

3. **Review process:**
   - At least one maintainer review required
   - CI checks must pass
   - All conversations must be resolved
   - Maintainer approval required

4. **After approval:**
   - Squash commits if requested
   - Merge to main branch
   - Delete feature branch

## Reporting Issues

### Bug Reports
Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Screenshots if applicable

### Feature Requests
Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Examples or mockups

### Security Issues
**Do NOT open a public issue.** See [SECURITY.md](SECURITY.md) for reporting instructions.

## Getting Help

- Check existing issues and discussions
- Read the [README.md](README.md)
- Review the [SPEC.md](SPEC.md)
- Ask in GitHub Discussions

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to MatchyMatch! 🎮**
