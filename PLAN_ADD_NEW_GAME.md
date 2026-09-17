# Plan: Adding a New Game to MatchyMatch

This document provides a comprehensive guide for adding a new game to the MatchyMatch repository, following established conventions and patterns.

## Overview

MatchyMatch is a collection of puzzle and word games built with React and Vite. The codebase follows consistent patterns for game implementation, making it straightforward to add new games.

## Prerequisites

Before starting, ensure you have:
- Node.js 18.x or higher
- npm 9.x or higher
- Familiarity with React hooks and functional components
- Understanding of the game you want to implement

## Step-by-Step Implementation Guide

### Step 1: Examine Existing Game Structure

**Purpose**: Understand the patterns and conventions used in the codebase.

**Actions**:
1. Review the project structure:
   ```
   src/
   ├── components/          # Game board components
   │   ├── <gamename>/     # Game-specific folder
   │   │   └── <GameName>Board.jsx
   ├── data/               # Game data files
   │   └── <gamename>Data.js
   ├── test/               # Test files
   │   └── games/
   │       └── <gamename>.test.jsx
   ```

2. Study example implementations:
   - **Simple game**: `src/components/flipflop/FlipFlopBoard.jsx` (memory matching)
   - **Data-driven game**: `src/components/wordle/WordleBoard.jsx` (word guessing)
   - **Complex game**: `src/components/snake/SnakeBoard.jsx` (arcade game)

3. Note common patterns:
   - State management with `useState` and `useEffect`
   - Game states: `'playing'`, `'won'`, `'lost'`
   - Consistent UI components: stats bars, win screens, buttons
   - Toast notifications for feedback
   - Dark mode support via CSS variables

### Step 2: Create Game Data File (if needed)

**Purpose**: Define game-specific data separate from logic.

**Location**: `src/data/<gamename>Data.js`

**Example Structure**:
```javascript
// src/data/myGameData.js

export const myGameLevels = [
  {
    id: 1,
    difficulty: 'easy',
    data: {
      // Level-specific data
    }
  },
  // More levels...
]

export const myGameConfig = {
  maxAttempts: 10,
  timeLimit: 60,
  // Other configuration
}
```

**Guidelines**:
- Export named constants (not default exports)
- Use descriptive names
- Include comments for complex data structures
- Keep data separate from game logic
- Consider different difficulty levels or variations

**When to skip**: Simple games without external data (e.g., Tic-Tac-Toe, Coin Flip) may not need a data file.

### Step 3: Implement Game Logic Utilities (if needed)

**Purpose**: Separate game logic from UI components for better testability.

**Location**: `src/utils/<gamename>Logic.js` (create if needed)

**Example Structure**:
```javascript
// src/utils/myGameLogic.js

/**
 * Validates a player's move
 * @param {Object} gameState - Current game state
 * @param {Object} move - Player's move
 * @returns {boolean} Whether the move is valid
 */
export function isValidMove(gameState, move) {
  // Validation logic
}

/**
 * Calculates the score for the current game state
 * @param {Object} gameState - Current game state
 * @returns {number} The calculated score
 */
export function calculateScore(gameState) {
  // Scoring logic
}

/**
 * Checks if the game is won
 * @param {Object} gameState - Current game state
 * @returns {boolean} Whether the game is won
 */
export function checkWinCondition(gameState) {
  // Win condition logic
}
```

**Guidelines**:
- Use pure functions when possible
- Add JSDoc comments for complex functions
- Export individual functions (not default export)
- Keep functions small and focused
- Make functions testable

**When to skip**: Very simple games may include logic directly in the component.

### Step 4: Build Game UI Components

**Purpose**: Create the main game board component and any sub-components.

**Location**: `src/components/<gamename>/<GameName>Board.jsx`

**Component Structure**:

```javascript
import { useState, useEffect, useCallback, useRef } from 'react'
import Toast from '../Toast'

// ── Sub-components (if needed) ────────────────────────────────────

function GameTile({ /* props */ }) {
  // Tile component logic
  return (
    <button className="...">
      {/* Tile content */}
    </button>
  )
}

function StatsBar({ /* props */ }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Stats display */}
    </div>
  )
}

function WinScreen({ /* props */ }) {
  return (
    <div className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl">
      {/* Win screen content */}
    </div>
  )
}

// ── Main Board Component ──────────────────────────────────────────

export default function MyGameBoard() {
  // State management
  const [gameState, setGameState] = useState('playing')
  const [score, setScore] = useState(0)
  const [toast, setToast] = useState(null)
  
  // Refs for timers, intervals, etc.
  const timerRef = useRef(null)
  
  // Effects
  useEffect(() => {
    // Setup and cleanup
    return () => {
      // Cleanup
    }
  }, [])
  
  // Event handlers
  const handleMove = useCallback((move) => {
    // Handle player move
  }, [/* dependencies */])
  
  const handleNewGame = () => {
    // Reset game state
  }
  
  // Render based on game state
  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <WinScreen score={score} onPlayAgain={handleNewGame} />
      </div>
    )
  }
  
  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Loss screen */}
      </div>
    )
  }
  
  // Playing state
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      
      <StatsBar score={score} />
      
      {/* Game board */}
      <div className="...">
        {/* Game elements */}
      </div>
      
      {/* Controls */}
      <button onClick={handleNewGame} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  )
}
```

**Key Patterns**:

1. **State Management**:
   - Use `useState` for game state, score, selections, etc.
   - Use `useRef` for timers, intervals, canvas refs
   - Use `useCallback` for event handlers to prevent re-renders

2. **Game States**:
   - `'playing'` - Active gameplay
   - `'won'` - Player won
   - `'lost'` - Player lost (if applicable)
   - `'paused'` - Game paused (if applicable)

3. **UI Components**:
   - Stats bar showing score, time, lives, etc.
   - Win/loss screens with celebration/consolation
   - Toast notifications for feedback
   - New Game button for reset

4. **Styling**:
   - Use Tailwind CSS classes
   - Use CSS variables for theme support:
     - `var(--bg-primary)` - Background
     - `var(--bg-surface)` - Surface/card background
     - `var(--label-primary)` - Primary text
     - `var(--label-secondary)` - Secondary text
     - `var(--label-tertiary)` - Tertiary text
     - `var(--fill-tertiary)` - Fills
     - `var(--shadow-sm)`, `var(--shadow-xl)` - Shadows
   - Use existing button classes: `btn-primary`, `btn-ghost`
   - Ensure responsive design with `max-w-*` and `px-4 sm:px-6`

5. **Accessibility**:
   - Use semantic HTML elements
   - Add `aria-label` to interactive elements
   - Support keyboard navigation
   - Ensure sufficient color contrast

6. **Performance**:
   - Clean up timers and intervals in `useEffect` return
   - Use `useCallback` for event handlers
   - Avoid unnecessary re-renders

### Step 5: Add Routing and Navigation

**Purpose**: Integrate the new game into the app's navigation system.

**Actions**:

1. **Update `src/components/GamePicker.jsx`**:

   Add game metadata to the `GAMES` array:

   ```javascript
   const GAMES = [
     // ... existing games
     {
       id: 'mygame',              // Unique ID (lowercase, no spaces)
       emoji: '🎮',               // Emoji representing the game
       name: 'My Game',           // Display name
       description: 'Brief description of the game', // Short description
       color: '#FF6B6B',          // Accent color (hex)
     },
   ]
   ```

   **Guidelines**:
   - Choose a unique, descriptive ID
   - Pick an appropriate emoji
   - Keep description under 50 characters
   - Choose a color that stands out but fits the theme

2. **Update `src/App.jsx`**:

   a. Import the game component:
   ```javascript
   import MyGameBoard from './components/mygame/MyGameBoard'
   ```

   b. Add conditional rendering in the main component:
   ```javascript
   {!activeGame ? (
     <GamePicker onGameSelect={handleGameSelect} />
   ) : activeGame === 'matchy' ? (
     <GameBoard key={`matchy-${gameKey}`} puzzle={puzzles[PUZZLE_INDEX]} onNewGame={handleNewGame} />
   ) : activeGame === 'mygame' ? (
     <MyGameBoard key={`mygame-${gameKey}`} />
   ) : // ... other games
   }
   ```

   **Guidelines**:
   - Add the import at the top with other game imports
   - Add the conditional rendering in alphabetical order (optional but clean)
   - Use the same ID as in GamePicker
   - Include the `key` prop with `gameKey` for proper reset
   - Pass any required props (e.g., `dark` mode for games that need it)

### Step 6: Write Comprehensive Tests

**Purpose**: Ensure game functionality and prevent regressions.

**Location**: `src/test/games/<gamename>.test.jsx`

**Test Structure**:

```javascript
/**
 * Tests for My Game (MyGameBoard)
 *
 * Unit tests cover:
 *  - Initial render: UI elements, stats, controls
 *  - Game state initialization
 *  - Component structure
 *
 * E2E-style tests cover:
 *  - User interactions (clicks, keyboard input)
 *  - Game logic (moves, scoring, win/loss conditions)
 *  - State transitions
 *  - Edge cases
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import MyGameBoard from '../../components/mygame/MyGameBoard'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit Tests ────────────────────────────────────────────────────

describe('MyGame – Unit: initial render', () => {
  it('renders the game board', () => {
    render(<MyGameBoard />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('shows initial score of 0', () => {
    render(<MyGameBoard />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders the New Game button', () => {
    render(<MyGameBoard />)
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
  })

  // More unit tests...
})

// ── E2E Tests ─────────────────────────────────────────────────────

describe('MyGame – E2E: gameplay', () => {
  it('updates score when player makes a valid move', async () => {
    render(<MyGameBoard />)
    
    const gameElement = screen.getByRole('button', { name: /play/i })
    fireEvent.click(gameElement)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('shows win screen when player wins', async () => {
    render(<MyGameBoard />)
    
    // Simulate winning moves
    // ...
    
    await waitFor(() => {
      expect(screen.getByText(/you won/i)).toBeInTheDocument()
    })
  })

  // More E2E tests...
})

describe('MyGame – E2E: New Game', () => {
  it('resets game state when New Game is clicked', async () => {
    render(<MyGameBoard />)
    
    // Make some moves
    // ...
    
    fireEvent.click(screen.getByRole('button', { name: /new game/i }))
    
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })
})
```

**Test Coverage Guidelines**:

1. **Unit Tests** (Component Structure):
   - Initial render state
   - All UI elements present
   - Correct initial values
   - Button states (enabled/disabled)

2. **E2E Tests** (User Interactions):
   - Valid moves/actions
   - Invalid moves/actions
   - Score updates
   - Win condition
   - Loss condition (if applicable)
   - New game reset
   - Edge cases

3. **Best Practices**:
   - Use `vi.useFakeTimers()` for time-based tests
   - Use `waitFor` for async state updates
   - Use `act` when advancing timers
   - Test user-facing behavior, not implementation details
   - Use descriptive test names
   - Aim for 80%+ code coverage

4. **Running Tests**:
   ```bash
   npm test                    # Run all tests in watch mode
   npm test mygame.test.jsx    # Run specific test file
   npm test -- --coverage      # Run with coverage report
   npm run test:ui             # Run with UI
   ```

### Step 7: Update Documentation

**Purpose**: Document the new game for users and developers.

**Actions**:

1. **Update `README.md`**:

   Add the game to the "Games" section:

   ```markdown
   ## Games

   - **Matchy** - Match categories with related words
   - **Wordle** - Guess the word in 6 tries
   - **My Game** - Brief description of your game
   - **And more!**
   ```

2. **Update `SPEC.md`** (if applicable):

   Add technical specifications for complex games:

   ```markdown
   ## My Game Specification

   ### Overview
   Brief description of the game mechanics.

   ### Rules
   - Rule 1
   - Rule 2
   - ...

   ### Scoring
   How scoring works.

   ### Win/Loss Conditions
   - Win: ...
   - Loss: ...

   ### UI Components
   - Component 1: Description
   - Component 2: Description
   ```

3. **Update `CHANGELOG.md`**:

   Add an entry for the new game:

   ```markdown
   ## [Unreleased]

   ### Added
   - New game: My Game - Brief description
   ```

4. **Add JSDoc Comments**:

   Document complex functions and components:

   ```javascript
   /**
    * MyGameBoard - Main component for My Game
    * 
    * @description
    * This game implements [game mechanics]. Players [objective].
    * 
    * @example
    * <MyGameBoard />
    */
   export default function MyGameBoard() {
     // ...
   }
   ```

## Implementation Checklist

Use this checklist to track progress:

- [ ] **Step 1**: Examined existing game structure and patterns
- [ ] **Step 2**: Created game data file (if needed)
  - [ ] Data structure defined
  - [ ] Exported with named exports
  - [ ] Documented with comments
- [ ] **Step 3**: Implemented game logic utilities (if needed)
  - [ ] Pure functions created
  - [ ] JSDoc comments added
  - [ ] Functions are testable
- [ ] **Step 4**: Built game UI components
  - [ ] Main board component created
  - [ ] Sub-components created (if needed)
  - [ ] State management implemented
  - [ ] Game states handled (playing, won, lost)
  - [ ] Styling with Tailwind and CSS variables
  - [ ] Responsive design implemented
  - [ ] Accessibility features added
  - [ ] Dark mode support
- [ ] **Step 5**: Added routing and navigation
  - [ ] Game added to GamePicker.jsx
  - [ ] Game imported in App.jsx
  - [ ] Conditional rendering added in App.jsx
- [ ] **Step 6**: Wrote comprehensive tests
  - [ ] Unit tests for initial render
  - [ ] E2E tests for gameplay
  - [ ] Edge cases covered
  - [ ] Tests pass (`npm test`)
  - [ ] 80%+ code coverage
- [ ] **Step 7**: Updated documentation
  - [ ] README.md updated
  - [ ] SPEC.md updated (if applicable)
  - [ ] CHANGELOG.md updated
  - [ ] JSDoc comments added
- [ ] **Final Checks**:
  - [ ] Linter passes (`npm run lint`)
  - [ ] Build succeeds (`npm run build`)
  - [ ] Game works in development (`npm run dev`)
  - [ ] Game works in production preview (`npm run preview`)
  - [ ] No console errors or warnings
  - [ ] Responsive on mobile and desktop
  - [ ] Dark mode works correctly

## Common Patterns and Conventions

### File Naming
- Components: PascalCase (e.g., `MyGameBoard.jsx`)
- Data files: camelCase (e.g., `myGameData.js`)
- Test files: camelCase with `.test.jsx` (e.g., `mygame.test.jsx`)
- Utility files: camelCase (e.g., `myGameLogic.js`)

### Code Style
- Use ES6+ syntax
- Use functional components with hooks
- Use arrow functions for callbacks
- Use template literals for strings
- Use destructuring for props and state
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

### Component Structure
1. Imports
2. Sub-components (if any)
3. Main component
4. Export

### State Management
- Use `useState` for component state
- Use `useEffect` for side effects
- Use `useCallback` for memoized callbacks
- Use `useRef` for mutable values and DOM refs
- Use `useMemo` for expensive computations (sparingly)

### Styling
- Use Tailwind CSS utility classes
- Use CSS variables for theming
- Use existing button classes: `btn-primary`, `btn-ghost`
- Use consistent spacing: `gap-4`, `gap-5`, `gap-6`
- Use consistent padding: `p-4`, `p-6`, `p-8`
- Use consistent border radius: `rounded-lg`, `rounded-2xl`, `rounded-3xl`

### Accessibility
- Use semantic HTML (`button`, `main`, `section`, etc.)
- Add `aria-label` to interactive elements
- Support keyboard navigation
- Ensure color contrast meets WCAG standards
- Test with screen readers (if possible)

### Performance
- Clean up timers and intervals
- Avoid unnecessary re-renders
- Use `useCallback` for event handlers
- Use `useMemo` for expensive computations
- Lazy load components if needed

## Example: Adding a Simple Game

Let's walk through adding a simple "Coin Flip" game:

### 1. No data file needed (simple game)

### 2. No utility functions needed (logic in component)

### 3. Create component: `src/components/coinflip/CoinFlipBoard.jsx`

```javascript
import { useState } from 'react'
import Toast from '../Toast'

export default function CoinFlipBoard() {
  const [choice, setChoice] = useState(null)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ wins: 0, losses: 0 })
  const [toast, setToast] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)

  const handleFlip = (playerChoice) => {
    if (isFlipping) return
    
    setChoice(playerChoice)
    setIsFlipping(true)
    
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'heads' : 'tails'
      setResult(coinResult)
      
      if (coinResult === playerChoice) {
        setScore(s => ({ ...s, wins: s.wins + 1 }))
        setToast('You won! 🎉')
      } else {
        setScore(s => ({ ...s, losses: s.losses + 1 }))
        setToast('You lost! 😢')
      }
      
      setIsFlipping(false)
    }, 1000)
  }

  const handleReset = () => {
    setChoice(null)
    setResult(null)
    setScore({ wins: 0, losses: 0 })
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      
      {/* Score */}
      <div className="flex gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--label-primary)' }}>
            {score.wins}
          </div>
          <div className="text-sm" style={{ color: 'var(--label-tertiary)' }}>
            Wins
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--label-primary)' }}>
            {score.losses}
          </div>
          <div className="text-sm" style={{ color: 'var(--label-tertiary)' }}>
            Losses
          </div>
        </div>
      </div>

      {/* Coin */}
      <div
        className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl ${
          isFlipping ? 'animate-spin' : ''
        }`}
        style={{ background: 'var(--fill-tertiary)' }}
      >
        {result ? (result === 'heads' ? '👑' : '🦅') : '🪙'}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleFlip('heads')}
          disabled={isFlipping}
          className="btn-primary"
        >
          Heads
        </button>
        <button
          onClick={() => handleFlip('tails')}
          disabled={isFlipping}
          className="btn-primary"
        >
          Tails
        </button>
      </div>

      <button onClick={handleReset} className="btn-ghost">
        Reset Score
      </button>
    </div>
  )
}
```

### 4. Add to GamePicker.jsx

```javascript
{
  id: 'coinflip',
  emoji: '🪙',
  name: 'Coin Flip',
  description: 'Predict the coin flip and test your luck',
  color: '#FFD700',
}
```

### 5. Add to App.jsx

```javascript
import CoinFlipBoard from './components/coinflip/CoinFlipBoard'

// In render:
: activeGame === 'coinflip' ? (
  <CoinFlipBoard key={`coinflip-${gameKey}`} />
)
```

### 6. Write tests: `src/test/games/coinflip.test.jsx`

```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CoinFlipBoard from '../../components/coinflip/CoinFlipBoard'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('CoinFlip – Unit: initial render', () => {
  it('renders Heads button', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByRole('button', { name: /heads/i })).toBeInTheDocument()
  })

  it('renders Tails button', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByRole('button', { name: /tails/i })).toBeInTheDocument()
  })

  it('shows 0 wins and 0 losses initially', () => {
    render(<CoinFlipBoard />)
    const scores = screen.getAllByText('0')
    expect(scores.length).toBe(2)
  })
})

describe('CoinFlip – E2E: gameplay', () => {
  it('clicking Heads triggers a flip', async () => {
    render(<CoinFlipBoard />)
    
    fireEvent.click(screen.getByRole('button', { name: /heads/i }))
    
    act(() => vi.advanceTimersByTime(1100))
    
    await waitFor(() => {
      // Score should have changed
      const scores = screen.getAllByText('0')
      expect(scores.length).toBeLessThan(2)
    })
  })
})
```

### 7. Update documentation

Add to README.md:
```markdown
- **Coin Flip** - Predict the coin flip and test your luck
```

## Tips and Best Practices

### Development Workflow
1. Start with a simple version
2. Test frequently during development
3. Commit incrementally
4. Run linter and tests before committing
5. Test in both light and dark modes
6. Test on different screen sizes

### Debugging
- Use React DevTools to inspect component state
- Use browser DevTools to inspect DOM and styles
- Add `console.log` statements (remove before committing)
- Use `debugger` statements for breakpoints
- Check browser console for errors and warnings

### Common Pitfalls
- Forgetting to clean up timers/intervals
- Not handling edge cases
- Inconsistent styling
- Missing accessibility features
- Not testing on mobile
- Forgetting to update documentation

### Getting Help
- Review existing game implementations
- Check CONTRIBUTING.md for guidelines
- Read React documentation
- Ask in GitHub Discussions
- Review test examples

## Conclusion

Adding a new game to MatchyMatch follows a consistent pattern:

1. **Understand** the existing structure
2. **Create** data files (if needed)
3. **Implement** game logic (if needed)
4. **Build** UI components
5. **Integrate** with routing
6. **Test** thoroughly
7. **Document** changes

By following this plan and the established conventions, you can add high-quality games that fit seamlessly into the MatchyMatch ecosystem.

## Next Steps

After completing this plan:
1. Choose a game to implement
2. Follow the checklist step by step
3. Test thoroughly
4. Submit a pull request
5. Respond to code review feedback

Happy coding! 🎮
