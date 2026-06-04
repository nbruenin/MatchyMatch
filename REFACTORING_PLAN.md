```markdown
# Puzzlr — Refactoring Plan

## Executive Summary

The codebase is a well-built, visually polished React + Vite puzzle app with 17 games. The core issues are: **monolithic game files** (some 15,000–23,000 bytes of mixed logic, UI, and sub-components in a single file), **a deeply duplicated win/loss screen pattern** repeated across every game, **an unscalable if/else chain** for routing in `App.jsx`, **inline styles used almost everywhere** instead of the available Tailwind/CSS token system, and **zero test coverage**. The plan below is broken into four phases ordered by impact and safety.

---

## Phase 1 — Shared Infrastructure (Low Risk, High Leverage)

These changes have no game-breaking risk and immediately reduce duplication across the whole codebase.

### 1.1 — Extract a `<GameResultCard>` component

**Problem:** Every single game (Wordle, Hangman, Trivia, GameBoard, NumberCrunch, Memory, Snake, SpellingBee, 2048…) contains an identical win/loss card pattern:

\`\`\`jsx
// Repeated ~15 times across the codebase
<div className="spring-pop flex flex-col items-center gap-6 mt-2 p-8 rounded-3xl w-full"
  style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)" }}>
  <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(...)", ... }}>
    🎉
  </div>
  <h2 style={{ fontSize: "1.75rem", fontWeight: 700, ... }}>You nailed it!</h2>
  ...
  <button onClick={onNewGame} className="btn-primary">Play Again</button>
</div>
\`\`\`

**Fix:** Create `src/components/ui/GameResultCard.jsx`:

\`\`\`jsx
// src/components/ui/GameResultCard.jsx
export default function GameResultCard({ emoji, gradientFrom, gradientTo, glowColor, title, subtitle, children, onAction, actionLabel }) { ... }
\`\`\`

Used as:
\`\`\`jsx
<GameResultCard
  emoji="🎉"
  gradientFrom="#34c759" gradientTo="#30d158"
  glowColor="rgba(52,199,89,0.35)"
  title="You nailed it!"
  subtitle={\`Solved with \${lives} lives remaining\`}
  onAction={onNewGame}
  actionLabel="Play Again"
/>
\`\`\`

**Impact:** Removes ~200 lines of duplicated JSX across 10+ files.

---

### 1.2 — Extract a `<CategoryPill>` / `<BadgePill>` component

**Problem:** The inline "pill badge" pattern (category labels, score badges, rank badges) is copy-pasted in `TriviaBoard.jsx`, `HangmanBoard.jsx`, `SpellingBeeBoard.jsx`, and `GameBoard.jsx`.

**Fix:** Create `src/components/ui/Pill.jsx`:

\`\`\`jsx
// src/components/ui/Pill.jsx
export default function Pill({ children, color = 'accent', size = 'sm' }) { ... }
\`\`\`

---

### 1.3 — Extract a `<ProgressBar>` component

**Problem:** An identical animated progress bar is independently implemented in `TriviaBoard.jsx` and `SpellingBeeBoard.jsx` with the same gradient and transition logic.

**Fix:** Create `src/components/ui/ProgressBar.jsx` with `value`, `max`, `color` props.

---

### 1.4 — Extract a `<ScoreBadge>` component

**Problem:** The stat badge (label above, value below, rounded card) is duplicated in `SnakeBoard.jsx`, `MemoryBoard.jsx`, `Game2048Board.jsx`, and `NumberCrunchBoard.jsx`.

**Fix:** Create `src/components/ui/ScoreBadge.jsx`.

---

### 1.5 — Create a `src/components/ui/index.js` barrel export

Once the above components exist, expose them cleanly:

\`\`\`js
// src/components/ui/index.js
export { default as GameResultCard } from './GameResultCard'
export { default as Pill }           from './Pill'
export { default as ProgressBar }    from './ProgressBar'
export { default as ScoreBadge }     from './ScoreBadge'
\`\`\`

---

## Phase 2 — Game Routing & App Architecture (Medium Risk)

### 2.1 — Replace the `App.jsx` if/else chain with a game registry

**Problem:** `App.jsx` has a 20-branch if/else chain to render the correct game board, plus 17 separate import statements. Every new game requires edits in three places: the import, the if/else, and `GamePicker.jsx`'s `GAMES` array.

\`\`\`jsx
// Current — fragile, hard to maintain
} : activeGame === 'wordle' ? (
  <WordleBoard key={\`wordle-\${gameKey}\`} />
) : activeGame === 'crunch' ? (
  <NumberCrunchBoard key={\`crunch-\${gameKey}\`} />
) : ...
\`\`\`

**Fix:** Create a `src/games/registry.js` that is the single source of truth for every game:

\`\`\`js
// src/games/registry.js
import { lazy } from 'react'

export const GAME_REGISTRY = [
  {
    id: 'matchy',
    name: 'Matchy Match',
    emoji: '🟪',
    description: 'Group 20 words into 5 hidden categories',
    color: '#5e5ce6',
    component: lazy(() => import('../components/GameBoard')),
  },
  {
    id: 'wordle',
    name: 'Wordle',
    emoji: '🟩',
    description: 'Guess the 5-letter word in 6 tries',
    color: '#34c759',
    component: lazy(() => import('../components/wordle/WordleBoard')),
  },
  // ... all 17 games
]

export const getGame = (id) => GAME_REGISTRY.find(g => g.id === id)
\`\`\`

\`App.jsx\` becomes:

\`\`\`jsx
// After — data-driven, O(1) to add a new game
const game = getGame(activeGame)
return game ? (
  <Suspense fallback={<LoadingSpinner />}>
    <game.component key={\`\${activeGame}-\${gameKey}\`} {...gameProps} />
  </Suspense>
) : null
\`\`\`

\`GamePicker.jsx\` simply maps over \`GAME_REGISTRY\` instead of its own \`GAMES\` array.

**Impact:** Removes 17 import lines and 20 conditional branches from \`App.jsx\`. Adds automatic code-splitting via \`lazy()\` so each game is only loaded when first played — a significant performance win.

---

### 2.2 — Add a `useGameState` hook

**Problem:** Every game manually manages the same state shape: \`gameState\` (\`'playing' | 'won' | 'lost'\`), \`toast\`, \`isShaking\`, and a \`triggerShake\` + \`showToast\` pattern. This is copy-pasted verbatim in at least 10 files.

\`\`\`js
// Duplicated in GameBoard, WordleBoard, TriviaBoard, HangmanBoard, etc.
const [toast, setToast] = useState(null);
const [isShaking, setIsShaking] = useState(false);
const showToast = useCallback((msg) => setToast(msg), []);
const triggerShake = () => {
  setIsShaking(true);
  setTimeout(() => setIsShaking(false), 500);
};
\`\`\`

**Fix:** Create \`src/hooks/useGameState.js\`:

\`\`\`js
export function useGameState(initial = 'playing') {
  const [gameState, setGameState] = useState(initial)
  const [toast, setToast]         = useState(null)
  const [shaking, setShaking]     = useState(false)

  const showToast    = useCallback((msg) => setToast(msg), [])
  const triggerShake = useCallback(() => {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }, [])

  return { gameState, setGameState, toast, setToast, shaking, showToast, triggerShake }
}
\`\`\`

---

### 2.3 — Add a `useKeyboard` hook

**Problem:** A \`window.addEventListener('keydown', handler)\` + cleanup pattern is independently implemented in \`WordleBoard.jsx\`, \`HangmanBoard.jsx\`, \`SpellingBeeBoard.jsx\`, \`SnakeBoard.jsx\`, and \`Game2048Board.jsx\`.

**Fix:** Create \`src/hooks/useKeyboard.js\`:

\`\`\`js
export function useKeyboard(handler, deps = []) {
  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
\`\`\`

---

## Phase 3 — Decompose Monolithic Game Files (Higher Risk, Biggest Payoff)

The five largest files each mix game logic, multiple sub-components, and rendering into a single file. They should each be split into a folder.

### 3.1 — \`CrosswordBoard.jsx\` (23 KB) → \`src/components/crossword/\`

\`\`\`
src/components/crossword/
  CrosswordBoard.jsx       ← orchestrator only (~80 lines)
  CrosswordGrid.jsx        ← the SVG/div grid renderer
  CrosswordClues.jsx       ← the clue list panel
  CrosswordInput.jsx       ← the active cell input handler
  useCrossword.js          ← all game logic (selection, fill, check)
\`\`\`

### 3.2 — \`SudokuBoard.jsx\` (18 KB) → \`src/components/sudoku/\`

\`\`\`
src/components/sudoku/
  SudokuBoard.jsx          ← orchestrator only
  SudokuGrid.jsx           ← 9×9 grid rendering
  SudokuControls.jsx       ← number pad + erase + notes toggle
  useSudoku.js             ← puzzle generation, validation, solve logic
\`\`\`

### 3.3 — \`SnakeBoard.jsx\` (20 KB) → \`src/components/snake/\`

\`\`\`
src/components/snake/
  SnakeBoard.jsx           ← orchestrator only
  SnakeCanvas.jsx          ← canvas + drawGame function
  SnakeControls.jsx        ← D-pad, speed picker, pause/restart buttons
  SnakeOverlay.jsx         ← idle/paused/won/lost overlay cards
  useSnake.js              ← all game loop logic (tick, direction queue, collision)
\`\`\`

The \`drawGame\` function in particular (currently inlined in the component file) should live in \`src/components/snake/renderer.js\` as a pure function — it takes \`(ctx, state, dark)\` and has no React dependency.

### 3.4 — \`WordChainBoard.jsx\` (15 KB) → \`src/components/wordchain/\`

\`\`\`
src/components/wordchain/
  WordChainBoard.jsx       ← orchestrator only
  WordChainPath.jsx        ← the visual chain of words
  WordChainInput.jsx       ← the letter-change input
  useWordChain.js          ← validation, path tracking, win detection
\`\`\`

### 3.5 — \`TriviaBoard.jsx\` (15 KB) → \`src/components/trivia/\`

The file already has good internal structure (sub-components defined at the top). The fix is simply to move each named sub-component to its own file:

\`\`\`
src/components/trivia/
  TriviaBoard.jsx          ← orchestrator + Game component
  CategoryPill.jsx         ← (already a named function, just extract)
  ChoiceButton.jsx         ← (already a named function, just extract)
  ProgressBar.jsx          ← (merge with the shared ui/ProgressBar)
  SummaryRow.jsx           ← (already a named function, just extract)
\`\`\`

---

## Phase 4 — Styling & Code Quality

### 4.1 — Migrate inline styles to Tailwind / CSS tokens

**Problem:** Almost every component uses \`style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--label-primary)" }}\` inline. This makes the design system invisible, makes dark mode overrides fragile, and bloats JSX.

**Approach:** Audit the most-repeated inline style patterns and convert them to Tailwind utility classes or named CSS classes in \`index.css\`. Priority targets:

| Pattern | Replacement |
|---|---|
| \`fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em"\` | \`.heading-lg\` CSS class |
| \`fontSize: "0.9rem", color: "var(--label-tertiary)"\` | \`text-sm\` + \`text-[var(--label-tertiary)]\` |
| \`background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)"\` | \`.card-xl\` CSS class |
| \`display: "flex", alignItems: "center", justifyContent: "center"\` | \`flex items-center justify-center\` Tailwind |

### 4.2 — Clean up \`App.css\`

\`App.css\` still contains the default Vite template styles (\`.hero\`, \`.ticks\`, \`#next-steps\`, \`#docs\`, \`#spacer\`, \`#center\`) that are never used in this app. **Delete the entire file** and move the one actually-used class (\`.counter\`) to \`index.css\` if needed — though \`.counter\` itself also appears unused.

### 4.3 — Fix the \`README.md\`

The README is still the default Vite template README. It should describe Puzzlr, how to run it, how to add a new game (pointing to the registry), and how the daily puzzle rotation works.

### 4.4 — Add TypeScript (Optional but Recommended)

The \`package.json\` already includes \`@types/react\` and \`@types/react-dom\`. The SPEC.md mentions this is a production app. Migrating to \`.tsx\`/\`.ts\` would catch the several implicit \`any\` types in the game logic (e.g., \`slots\` in \`NumberCrunchBoard\`, \`state\` in \`WordChainBoard\`) and make the game registry type-safe.

### 4.5 — Add tests

Currently there are zero tests. The highest-value targets are pure logic functions that are already well-isolated:

| File | Function to test |
|---|---|
| \`NumberCrunchBoard.jsx\` | \`getAllReachable()\`, \`generatePuzzle()\` |
| \`scripts/verify-chains.js\` | \`diffCount()\` |
| \`data/spellingBeeData.js\` | \`validateWord()\`, \`wordScore()\`, \`isPangram()\` |
| \`data/puzzles.js\` | Validate all 20 puzzles have exactly 5 categories of 4 words each |
| \`hooks/useDarkMode.js\` | Toggle behavior, localStorage persistence |

Recommended setup: **Vitest** (already compatible with the Vite config, zero extra config needed).

---

## Summary Table

| Phase | Change | Files Affected | Risk | Effort |
|---|---|---|---|---|
| 1.1 | \`<GameResultCard>\` shared component | 10+ game files | 🟢 Low | S |
| 1.2–1.4 | \`<Pill>\`, \`<ProgressBar>\`, \`<ScoreBadge>\` | 6 game files | 🟢 Low | S |
| 2.1 | Game registry + lazy loading | \`App.jsx\`, \`GamePicker.jsx\` | 🟡 Medium | M |
| 2.2 | \`useGameState\` hook | 10 game files | 🟢 Low | S |
| 2.3 | \`useKeyboard\` hook | 5 game files | 🟢 Low | S |
| 3.1 | Decompose \`CrosswordBoard\` | 1 → 5 files | 🔴 High | L |
| 3.2 | Decompose \`SudokuBoard\` | 1 → 5 files | 🔴 High | L |
| 3.3 | Decompose \`SnakeBoard\` | 1 → 5 files | 🔴 High | L |
| 3.4 | Decompose \`WordChainBoard\` | 1 → 4 files | 🟡 Medium | M |
| 3.5 | Decompose \`TriviaBoard\` | 1 → 5 files | 🟡 Medium | M |
| 4.1 | Inline style → Tailwind/CSS | All components | 🟡 Medium | L |
| 4.2 | Delete dead \`App.css\` | \`App.css\`, \`main.jsx\` | 🟢 Low | XS |
| 4.3 | Fix README | \`README.md\` | 🟢 Low | XS |
| 4.4 | Add TypeScript | All \`.jsx\` files | 🔴 High | XL |
| 4.5 | Add Vitest tests | New \`*.test.js\` files | 🟢 Low | M |

**Recommended order:** 4.2 → 1.1–1.5 → 2.2 → 2.3 → 2.1 → 3.5 → 3.4 → 3.1 → 3.2 → 3.3 → 4.1 → 4.5 → 4.3 → 4.4
```

---

## How to use this file:

1. **Copy the markdown above** and save it as `REFACTORING_PLAN.md` in your repository root
2. **Commit it** to your repo: `git add REFACTORING_PLAN.md && git commit -m "docs: add comprehensive refactoring plan"`
Don't forget to be awesome!!!!!!!
