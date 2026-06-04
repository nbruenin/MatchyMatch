# MatchyMatch 🎮

A collection of puzzle and word games built with React and Vite.

## Features

- 🎯 Multiple game modes (Matchy, Wordle, Sudoku, and more)
- 🌙 Dark mode support
- 📱 Responsive design
- ⚡ Fast and lightweight
- 🧪 Comprehensive test suite
- 🔒 Security-focused development
- 🛡️ Repository access control

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
- ✅ Regular dependency audits
- ✅ Content Security Policy enabled
- ✅ Input validation
- ✅ Code review process
- ✅ Repository access control (prevents pushes to wrong repo)
- ✅ Pre-commit hooks for code quality
- ✅ Automated dependency updates

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

## Acknowledgments

- Built with [React](https://react.dev)
- Powered by [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)

---

**Made with ❤️ by the MatchyMatch team**
