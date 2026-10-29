import { useState, useCallback, useEffect } from 'react'
import {
  shuffleBoard,
  isSolved,
  moveTile,
  canMove,
  tileForArrowKey,
} from '../../utils/slidePuzzleLogic'

// ── Constants ────────────────────────────────────────────────────────────────

const SIZES = [
  { id: 3, label: '3×3', emoji: '🟢' },
  { id: 4, label: '4×4', emoji: '🟡' },
]

// ── Sub-components ───────────────────────────────────────────────────────────

function StatsBar({ moves, size }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap w-full">
      {[
        { label: 'Grid', value: `${size}×${size}` },
        { label: 'Moves', value: moves },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)', minWidth: 72 }}
        >
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
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
      ))}
    </div>
  )
}

function SizeSelector({ onSelect }) {
  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span style={{ fontSize: '2.5rem' }}>🧮</span>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Slide Puzzle
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
          Slide the tiles into numerical order, leaving the blank in the
          bottom-right corner.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {SIZES.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="rounded-2xl p-4 text-left transition-all hover:scale-105"
            style={{
              background: 'var(--fill-tertiary)',
              border: '2px solid var(--fill-secondary)',
              color: 'var(--label-primary)',
              fontWeight: 700,
            }}
            aria-label={`${s.label} grid`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Tile({ value, onClick, movable, size }) {
  if (value === 0) {
    return (
      <div
        role="gridcell"
        aria-label="Empty space"
        style={{ aspectRatio: '1', borderRadius: 12 }}
      />
    )
  }
  return (
    <button
      role="gridcell"
      onClick={onClick}
      aria-label={`Tile ${value}`}
      style={{
        aspectRatio: '1',
        borderRadius: 12,
        border: 'none',
        cursor: movable ? 'pointer' : 'default',
        fontSize: size === 3 ? '1.75rem' : '1.35rem',
        fontWeight: 800,
        color: '#fff',
        background: 'linear-gradient(145deg, #5e5ce6, #bf5af2)',
        boxShadow: movable
          ? '0 4px 12px rgba(94,92,230,0.45)'
          : '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'box-shadow 0.15s ease, transform 0.1s ease',
      }}
    >
      {value}
    </button>
  )
}

function WinScreen({ moves, size, onPlayAgain }) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4 pt-6 pb-12">
      <div
        className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
        style={{
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <span style={{ fontSize: '3rem' }}>🎉</span>
        <div className="flex flex-col items-center gap-1 text-center">
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--label-primary)',
            }}
          >
            Puzzle Solved!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
            You solved the {size}×{size} puzzle in {moves}{' '}
            {moves === 1 ? 'move' : 'moves'}
          </p>
        </div>
        <button onClick={onPlayAgain} className="btn-primary w-full">
          Play Again
        </button>
      </div>
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────────────────

export default function SlidePuzzleBoard() {
  const [size, setSize] = useState(null)
  const [board, setBoard] = useState([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  const startGame = useCallback((s) => {
    setSize(s)
    setBoard(shuffleBoard(s))
    setMoves(0)
    setWon(false)
  }, [])

  const handleMove = useCallback(
    (index) => {
      if (won || !canMove(board, index, size)) return
      const next = moveTile(board, index, size)
      setBoard(next)
      setMoves((m) => m + 1)
      if (isSolved(next)) setWon(true)
    },
    [board, size, won]
  )

  // Arrow-key support
  useEffect(() => {
    if (!size || won) return undefined
    const onKeyDown = (e) => {
      const index = tileForArrowKey(board, e.key, size)
      if (index === -1) return
      e.preventDefault()
      handleMove(index)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [board, size, won, handleMove])

  if (!size) {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4 pt-6 pb-12">
        <SizeSelector onSelect={startGame} />
      </div>
    )
  }

  if (won) {
    return (
      <WinScreen
        moves={moves}
        size={size}
        onPlayAgain={() => {
          setSize(null)
          setBoard([])
          setMoves(0)
          setWon(false)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4 pt-4 pb-12">
      <StatsBar moves={moves} size={size} />

      <div
        role="grid"
        aria-label="Slide puzzle grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: 8,
          width: '100%',
          padding: 16,
          borderRadius: 20,
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {board.map((value, i) => (
          <Tile
            key={value}
            value={value}
            size={size}
            movable={canMove(board, i, size)}
            onClick={() => handleMove(i)}
          />
        ))}
      </div>

      <p
        className="text-center"
        style={{
          fontSize: '0.78rem',
          color: 'var(--label-tertiary)',
          maxWidth: 280,
        }}
      >
        Click a tile next to the blank, or use the arrow keys, to slide it.
      </p>

      <button onClick={() => startGame(size)} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  )
}
