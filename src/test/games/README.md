# Game Tests Documentation

This directory contains comprehensive unit tests and end-to-end (E2E) tests for the MatchyMatch game collection.

## Test Structure

Tests are organized by game in the `src/test/games/` directory:

```
src/test/games/
├── anagram.test.js          # Anagram game tests
├── crossword.test.js        # Crossword game tests
├── diceroller.test.js       # Dice Roller game tests
├── flappybird.test.js       # Flappy Bird game tests
├── flipflop.test.js         # FlipFlop (Memory) game tests
├── game2048.test.js         # 2048 game tests
├── hangman.test.js          # Hangman game tests
├── mastermind.test.js       # Mastermind game tests
├── mathquiz.test.js         # Math Quiz game tests
└── memory.test.js           # Memory game tests
```

## Test Categories

### Unit Tests
Unit tests verify individual game components and mechanics in isolation:

- **Game Initialization**: Tests that games render correctly with proper initial state
- **Game State Management**: Tests state tracking and progression
- **UI Elements**: Tests that all UI components are present and accessible
- **Game Logic**: Tests core game mechanics and calculations

### End-to-End (E2E) Tests
E2E tests verify complete user workflows and game flows:

- **Game Flow**: Tests complete game sessions from start to finish
- **User Interactions**: Tests user input handling and responses
- **Game Mechanics**: Tests specific game actions (rolling, flipping, matching, etc.)
- **Win Conditions**: Tests game completion and win screens
- **Timer and Scoring**: Tests time tracking and score calculation

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run specific test file
```bash
npm test -- src/test/games/anagram.test.js
```

### Run tests once (CI mode)
```bash
npm test -- --run
```

## Test Coverage

### Games Covered (First 10)

1. **Anagram** (`anagram.test.js`)
   - ✅ Game initialization and timer
   - ✅ Round progression (5 rounds)
   - ✅ Letter selection and clearing
   - ✅ Scoring system
   - ✅ Skip functionality
   - ✅ Game completion

2. **Crossword** (`crossword.test.js`)
   - ✅ Game board rendering
   - ✅ Game controls
   - ✅ User interactions

3. **Dice Roller** (`diceroller.test.js`)
   - ✅ Game initialization with stats
   - ✅ Dice rolling mechanics
   - ✅ Roll history tracking
   - ✅ Win condition (10 rolls)
   - ✅ Game reset functionality
   - ✅ Stats calculation (total, average)

4. **Flappy Bird** (`flappybird.test.js`)
   - ✅ Game board rendering
   - ✅ Game controls
   - ✅ User input handling

5. **FlipFlop** (`flipflop.test.js`)
   - ✅ Game initialization with 10 pairs
   - ✅ Tile flipping mechanics
   - ✅ Match detection
   - ✅ Timer tracking
   - ✅ Accuracy calculation
   - ✅ Win screen display
   - ✅ Game reset

6. **2048** (`game2048.test.js`)
   - ✅ Game board rendering
   - ✅ Game controls
   - ✅ User interactions

7. **Hangman** (`hangman.test.js`)
   - ✅ Game board rendering
   - ✅ Game controls
   - ✅ User input handling

8. **Mastermind** (`mastermind.test.js`)
   - ✅ Game board rendering
   - ✅ Game controls
   - ✅ User interactions

9. **Math Quiz** (`mathquiz.test.js`)
   - ✅ Game board rendering
   - ✅ Quiz elements
   - ✅ User interactions

10. **Memory** (`memory.test.js`)
    - ✅ Game board rendering with tiles
    - ✅ Tile flipping mechanics
    - ✅ Match processing
    - ✅ Move tracking
    - ✅ Game completion
    - ✅ Game reset

## Test Technologies

- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **DOM Environment**: jsdom
- **Assertions**: Vitest expect API

## Test Patterns

### Basic Rendering Test
```javascript
it('should render the game board', () => {
  render(<GameComponent />)
  expect(screen.getByText(/some text/i)).toBeInTheDocument()
})
```

### User Interaction Test
```javascript
it('should handle button click', async () => {
  render(<GameComponent />)
  const button = screen.getByText('Click me')
  fireEvent.click(button)
  
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument()
  })
})
```

### State Management Test
```javascript
it('should track game progress', () => {
  render(<GameComponent />)
  expect(screen.getByText(/Round 1/i)).toBeInTheDocument()
})
```

## Best Practices

1. **Descriptive Test Names**: Each test clearly describes what it's testing
2. **Arrange-Act-Assert**: Tests follow the AAA pattern
3. **Isolation**: Each test is independent and can run in any order
4. **Accessibility**: Tests use accessible queries (getByRole, getByText, etc.)
5. **Async Handling**: Tests properly handle async operations with waitFor
6. **Cleanup**: React Testing Library automatically cleans up after each test

## Adding New Tests

When adding tests for new games:

1. Create a new file: `src/test/games/[gamename].test.js`
2. Import the game component and testing utilities
3. Add Unit Tests section with:
   - Game Initialization tests
   - Game State tests
   - UI Elements tests
4. Add E2E Tests section with:
   - Game Flow tests
   - User Interactions tests
   - Win Condition tests (if applicable)
   - Timer/Scoring tests (if applicable)

## Continuous Integration

Tests are run automatically on:
- Pull requests
- Commits to main branch
- Pre-commit hooks (via Husky)

All tests must pass before code can be merged.

## Troubleshooting

### Tests timing out
- Increase timeout: `{ timeout: 5000 }`
- Check for missing `await waitFor()`

### Element not found
- Use `screen.debug()` to see rendered output
- Check for async operations that need `waitFor()`

### Flaky tests
- Ensure proper async handling
- Avoid hardcoded timeouts
- Use `waitFor()` with proper conditions

## Future Improvements

- [ ] Add tests for remaining games (11-30+)
- [ ] Increase test coverage to 80%+
- [ ] Add visual regression tests
- [ ] Add performance benchmarks
- [ ] Add accessibility tests (a11y)
- [ ] Add integration tests between games
