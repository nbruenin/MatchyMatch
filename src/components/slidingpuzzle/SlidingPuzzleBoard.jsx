import { useState, useEffect, useCallback, useRef } from 'react'
import Toast from '../Toast'
import {
  shuffleBoard,
  applyMove,
  canMove,
  findBlankIndex,
  isSolved,
} from '../../utils/slidingPuzzleLogic'

const SIZE = 4

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function StatBox({ value, label, color }) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
      style={{ background: 'var(--fill-tertiary)' }}
    >
      <span
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: color || 'var(--label-primary)',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--label-tertiary)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default function SlidingPuzzleBoard() {
  const [board, setBoard] = useState(() => shuffleBoard(SIZE))
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [won, setWon] = useState(false)
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  // Tick the clock once the first move has been made, until the puzzle is solved
  useEffect(() => {
    if (!started || won) return undefined
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [started, won])

  const handleTileClick = useCallback(
    (index) => {
      if (won) return
      const next = applyMove(board, index, SIZE)
      if (!next) return

      setBoard(next)
      setMoves((m) => m + 1)
      if (!started) setStarted(true)

      if (isSolved(next)) {
        setWon(true)
        setToast('Puzzle solved! 🎉')
      }
    },
    [board, won, started]
  )

  // Arrow keys slide the tile that sits on the opposite side of the blank
  useEffect(() => {
    if (won) return undefined
    const handleKey = (e) => {
      const blank = findBlankIndex(board)
      const row = Math.floor(blank / SIZE)
      const col = blank % SIZE
      let target = null
      if (e.key === 'ArrowUp' && row < SIZE - 1) target = blank + SIZE
      else if (e.key === 'ArrowDown' && row > 0) target = blank - SIZE
      else if (e.key === 'ArrowLeft' && col < SIZE - 1) target = blank + 1
      else if (e.key === 'ArrowRight' && col > 0) target = blank - 1
      if (target === null) return
      e.preventDefault()
      handleTileClick(target)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [board, won, handleTileClick])

  const handleNewGame = () => {
    setBoard(shuffleBoard(SIZE))
    setMoves(0)
    setSeconds(0)
    setStarted(false)
    setWon(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

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
          Sliding Puzzle
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--label-tertiary)',
            marginTop: '0.5rem',
          }}
        >
          Slide the tiles into order from 1 to 15
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 w-full justify-center flex-wrap">
        <StatBox value={moves} label="Moves" />
        <StatBox value={formatTime(seconds)} label="Time" />
      </div>

      {/* Board */}
      <div
        role="group"
        aria-label="Sliding puzzle board"
        className="grid gap-2 p-3 rounded-2xl w-full"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
          background: 'var(--fill-secondary)',
          maxWidth: '22rem',
        }}
      >
        {board.map((tile, index) => {
          const isBlank = tile === 0
          const movable = !won && canMove(board, index, SIZE)
          const inPlace = tile !== 0 && tile === index + 1
          return isBlank ? (
            <div
              key="blank"
              aria-label="Empty space"
              className="rounded-xl aspect-square"
            />
          ) : (
            <button
              key={tile}
              onClick={() => handleTileClick(index)}
              disabled={!movable}
              aria-label={`Tile ${tile}`}
              className="rounded-xl aspect-square flex items-center justify-center font-bold transition-all"
              style={{
                fontSize: '1.4rem',
                background: inPlace ? '#34c759' : 'var(--bg-surface)',
                color: inPlace ? '#ffffff' : 'var(--label-primary)',
                boxShadow: 'var(--shadow-sm)',
                cursor: movable ? 'pointer' : 'default',
                opacity: movable ? 1 : 0.85,
              }}
            >
              {tile}
            </button>
          )
        })}
      </div>

      {won ? (
        <div
          className="spring-pop flex flex-col items-center gap-4 p-6 rounded-2xl w-full"
          style={{
            background: 'var(--fill-tertiary)',
            border: '2px solid #34c759',
          }}
        >
          <span
            style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34c759' }}
          >
            🎉 Solved!
          </span>
          <span
            style={{ fontSize: '0.85rem', color: 'var(--label-secondary)' }}
          >
            {moves} moves in {formatTime(seconds)}
          </span>
          <button onClick={handleNewGame} className="btn-primary">
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p style={{ fontSize: '0.75rem', color: 'var(--label-tertiary)' }}>
            Click a tile next to the gap, or use the arrow keys
          </p>
          <button onClick={handleNewGame} className="btn-ghost">
            🔀 New Game
          </button>
        </div>
      )}
    </div>
  )
}
