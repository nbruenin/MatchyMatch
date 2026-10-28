import { useState, useCallback } from 'react'
import Toast from '../Toast'
import {
  MIN_DISKS,
  MAX_DISKS,
  createPegs,
  minMoves,
  isValidMove,
  moveDisk,
  isSolved,
} from '../../utils/hanoiLogic'

const DISK_COLORS = [
  '#ff6b6b',
  '#ff9f0a',
  '#ffd60a',
  '#34c759',
  '#0a84ff',
  '#5e5ce6',
  '#bf5af2',
]

// ── Sub-components ───────────────────────────────────────────────────

function StatsBar({ moves, best, diskCount }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap w-full">
      {[
        { label: 'Disks', value: diskCount },
        { label: 'Moves', value: moves },
        { label: 'Minimum', value: best },
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
      ))}
    </div>
  )
}

function Peg({ index, disks, diskCount, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Peg ${index + 1}, ${disks.length} ${
        disks.length === 1 ? 'disk' : 'disks'
      }${selected ? ', selected' : ''}`}
      aria-pressed={selected}
      className="flex-1 flex flex-col justify-end items-center rounded-2xl relative"
      style={{
        height: 20 * (MAX_DISKS + 1),
        background: selected ? 'var(--fill-secondary)' : 'var(--fill-tertiary)',
        border: selected ? '2px solid #0a84ff' : '2px solid transparent',
        paddingBottom: 8,
        cursor: 'pointer',
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}
    >
      {/* Rod */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 8,
          width: 8,
          height: 20 * (MAX_DISKS + 1) - 16,
          borderRadius: 4,
          background: 'var(--label-tertiary)',
          opacity: 0.4,
        }}
      />
      {/* Disks, drawn top-down so reverse the bottom→top array */}
      <div className="flex flex-col-reverse items-center gap-0.5 w-full relative">
        {disks.map((size) => (
          <div
            key={size}
            data-testid={`disk-${size}`}
            style={{
              height: 18,
              width: `${25 + (size / diskCount) * 70}%`,
              borderRadius: 9,
              background: DISK_COLORS[(size - 1) % DISK_COLORS.length],
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </button>
  )
}

function WinScreen({ moves, diskCount, onPlayAgain }) {
  const best = minMoves(diskCount)
  const perfect = moves === best
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      <div
        className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
        style={{
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <span style={{ fontSize: '3rem' }}>{perfect ? '🏆' : '🎉'}</span>
        <div className="flex flex-col items-center gap-1 text-center">
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--label-primary)',
            }}
          >
            Tower Complete!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
            Solved {diskCount} disks in {moves} moves
            {perfect ? ' — a perfect solution!' : ` (minimum is ${best})`}
          </p>
        </div>
        <button onClick={onPlayAgain} className="btn-primary w-full">
          Play Again
        </button>
      </div>
    </div>
  )
}

// ── Main Board ───────────────────────────────────────────────────────

export default function HanoiBoard() {
  const [diskCount, setDiskCount] = useState(MIN_DISKS)
  const [pegs, setPegs] = useState(() => createPegs(MIN_DISKS))
  const [selected, setSelected] = useState(null)
  const [moves, setMoves] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [toast, setToast] = useState(null)

  const reset = useCallback((count) => {
    setDiskCount(count)
    setPegs(createPegs(count))
    setSelected(null)
    setMoves(0)
    setGameState('playing')
  }, [])

  const handlePegClick = (index) => {
    if (gameState !== 'playing') return

    if (selected === null) {
      if (pegs[index].length === 0) {
        setToast('That peg is empty')
        return
      }
      setSelected(index)
      return
    }

    if (selected === index) {
      setSelected(null)
      return
    }

    if (!isValidMove(pegs, selected, index)) {
      setToast("Can't place a larger disk on a smaller one")
      setSelected(null)
      return
    }

    const next = moveDisk(pegs, selected, index)
    setPegs(next)
    setSelected(null)
    setMoves((m) => m + 1)
    if (isSolved(next, diskCount)) setGameState('won')
  }

  if (gameState === 'won') {
    return (
      <WinScreen
        moves={moves}
        diskCount={diskCount}
        onPlayAgain={() => reset(diskCount)}
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="text-center">
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Tower of Hanoi
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--label-tertiary)' }}>
          Move the whole stack to the last peg. Never put a larger disk on a
          smaller one.
        </p>
      </div>

      <StatsBar
        moves={moves}
        best={minMoves(diskCount)}
        diskCount={diskCount}
      />

      <div
        className="flex gap-3 w-full p-4 rounded-3xl"
        style={{
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {pegs.map((disks, i) => (
          <Peg
            key={i}
            index={i}
            disks={disks}
            diskCount={diskCount}
            selected={selected === i}
            onClick={() => handlePegClick(i)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset(diskCount - 1)}
          disabled={diskCount <= MIN_DISKS}
          className="btn-ghost"
          aria-label="Fewer disks"
        >
          −
        </button>
        <span style={{ color: 'var(--label-secondary)', fontWeight: 600 }}>
          {diskCount} disks
        </span>
        <button
          onClick={() => reset(diskCount + 1)}
          disabled={diskCount >= MAX_DISKS}
          className="btn-ghost"
          aria-label="More disks"
        >
          +
        </button>
      </div>

      <button onClick={() => reset(diskCount)} className="btn-ghost">
        🔀 Restart
      </button>
    </div>
  )
}
