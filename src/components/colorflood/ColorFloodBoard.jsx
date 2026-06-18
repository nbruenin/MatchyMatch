import { useState, useCallback } from 'react'
import Confetti from '../Confetti'

// ── Constants ─────────────────────────────────────────────────────

const GRID_SIZE = 14
const MAX_MOVES = 25
const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF', '#FF9A3C']
const COLOR_NAMES = ['Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Orange']

// ── Helpers ───────────────────────────────────────────────────────

function randomGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.floor(Math.random() * COLORS.length))
  )
}

/**
 * Flood-fill from (0,0) changing all connected cells of `oldColor` to `newColor`.
 * Returns a new grid (immutable).
 */
function floodFill(grid, newColor) {
  const oldColor = grid[0][0]
  if (oldColor === newColor) return grid

  // Clone grid
  const next = grid.map((row) => [...row])
  const stack = [[0, 0]]
  const visited = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false))

  while (stack.length > 0) {
    const [r, c] = stack.pop()
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) continue
    if (visited[r][c]) continue
    if (next[r][c] !== oldColor) continue
    visited[r][c] = true
    next[r][c] = newColor
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
  }

  return next
}

/**
 * Count how many cells are the same color as (0,0) — i.e., the "flooded" region.
 */
function countFlooded(grid) {
  const targetColor = grid[0][0]
  const visited = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false))
  const stack = [[0, 0]]
  let count = 0

  while (stack.length > 0) {
    const [r, c] = stack.pop()
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) continue
    if (visited[r][c]) continue
    if (grid[r][c] !== targetColor) continue
    visited[r][c] = true
    count++
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
  }

  return count
}

function isFullyFlooded(grid) {
  return countFlooded(grid) === GRID_SIZE * GRID_SIZE
}

function getRating(movesUsed) {
  const ratio = movesUsed / MAX_MOVES
  if (ratio <= 0.5) return { emoji: '🏆', label: 'Masterful!', color: '#ffd60a' }
  if (ratio <= 0.7) return { emoji: '🌟', label: 'Excellent!', color: '#34c759' }
  if (ratio <= 0.85) return { emoji: '👍', label: 'Well done!', color: '#007aff' }
  return { emoji: '😅', label: 'Close call!', color: '#ff9f0a' }
}

// ── Sub-components ────────────────────────────────────────────────

function StatPill({ label, value, highlight }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
      style={{
        background: highlight ? highlight + '22' : 'var(--fill-tertiary)',
        border: highlight ? `2px solid ${highlight}55` : '2px solid transparent',
        minWidth: 72,
      }}
    >
      <span
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: highlight || 'var(--label-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--label-tertiary)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

function ColorButton({ colorIndex, onClick, disabled, isActive }) {
  return (
    <button
      onClick={() => onClick(colorIndex)}
      disabled={disabled}
      aria-label={`Flood with ${COLOR_NAMES[colorIndex]}`}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: COLORS[colorIndex],
        border: isActive ? '3px solid white' : '3px solid transparent',
        boxShadow: isActive
          ? `0 0 0 3px ${COLORS[colorIndex]}, 0 4px 12px ${COLORS[colorIndex]}66`
          : `0 2px 8px ${COLORS[colorIndex]}44`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        transform: isActive ? 'scale(1.15)' : 'scale(1)',
      }}
    />
  )
}

function Grid({ grid }) {
  const cellSize = Math.min(Math.floor(320 / GRID_SIZE), 24)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
        gap: 1,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
      }}
      aria-label="Color Flood grid"
    >
      {grid.map((row, r) =>
        row.map((colorIdx, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: cellSize,
              height: cellSize,
              background: COLORS[colorIdx],
              transition: 'background 0.15s ease',
            }}
          />
        ))
      )}
    </div>
  )
}

function ResultScreen({ won, movesUsed, onPlayAgain }) {
  const rating = won ? getRating(movesUsed) : null

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      {won && <Confetti />}

      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: won
            ? `linear-gradient(145deg, ${rating.color}, ${rating.color}cc)`
            : 'linear-gradient(145deg, #ff3b30, #ff453a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: won
            ? `0 8px 24px ${rating.color}44`
            : '0 8px 24px rgba(255,59,48,0.35)',
        }}
      >
        {won ? rating.emoji : '😢'}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          {won ? rating.label : 'Out of Moves!'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
          {won
            ? `You flooded the board in ${movesUsed} move${movesUsed !== 1 ? 's' : ''}!`
            : `You used all ${MAX_MOVES} moves. So close!`}
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <StatPill label="Moves Used" value={movesUsed} />
        <StatPill label="Max Moves" value={MAX_MOVES} />
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────

export default function ColorFloodBoard() {
  const [grid, setGrid] = useState(() => randomGrid())
  const [moves, setMoves] = useState(0)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'won' | 'lost'

  const currentColor = grid[0][0]
  const flooded = countFlooded(grid)
  const total = GRID_SIZE * GRID_SIZE
  const progressPct = Math.round((flooded / total) * 100)
  const movesLeft = MAX_MOVES - moves

  const handleColorClick = useCallback(
    (colorIndex) => {
      if (gameState !== 'playing') return
      if (colorIndex === currentColor) return

      const newGrid = floodFill(grid, colorIndex)
      const newMoves = moves + 1

      setGrid(newGrid)
      setMoves(newMoves)

      if (isFullyFlooded(newGrid)) {
        setGameState('won')
      } else if (newMoves >= MAX_MOVES) {
        setGameState('lost')
      }
    },
    [grid, moves, gameState, currentColor]
  )

  const handlePlayAgain = () => {
    setGrid(randomGrid())
    setMoves(0)
    setGameState('playing')
  }

  // ── Result screen ────────────────────────────────────────────────
  if (gameState === 'won' || gameState === 'lost') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <ResultScreen won={gameState === 'won'} movesUsed={moves} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  // ── Playing screen ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Title */}
      <div className="text-center">
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Color Flood
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)', marginTop: '0.4rem' }}>
          Flood the entire board from the top-left corner
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-wrap justify-center">
        <StatPill
          label="Moves Left"
          value={movesLeft}
          highlight={movesLeft <= 5 ? '#ff3b30' : movesLeft <= 10 ? '#ff9f0a' : null}
        />
        <StatPill label="Flooded" value={`${progressPct}%`} />
        <StatPill label="Cells" value={`${flooded}/${total}`} />
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          maxWidth: 340,
          height: 8,
          borderRadius: 4,
          background: 'var(--fill-tertiary)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            borderRadius: 4,
            background: COLORS[currentColor],
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Grid */}
      <Grid grid={grid} />

      {/* Color picker */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          padding: '12px 16px',
          borderRadius: 20,
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {COLORS.map((_, idx) => (
          <ColorButton
            key={idx}
            colorIndex={idx}
            onClick={handleColorClick}
            disabled={idx === currentColor}
            isActive={idx === currentColor}
          />
        ))}
      </div>

      {/* Hint */}
      <p
        style={{
          fontSize: '0.78rem',
          color: 'var(--label-tertiary)',
          textAlign: 'center',
          maxWidth: 300,
        }}
      >
        Pick a color to expand your flooded region. Fill the whole board in {MAX_MOVES} moves!
      </p>
    </div>
  )
}
