import { useState, useCallback } from 'react'
import Toast from '../Toast'
import {
  createTowers,
  applyMove,
  canMove,
  isSolved,
  minimumMoves,
  PEG_COUNT,
} from '../../utils/hanoiLogic'

const DISK_OPTIONS = [3, 4, 5]
const DEFAULT_DISKS = 4
const PEG_LABELS = ['A', 'B', 'C']
const DISK_COLORS = ['#ff3b30', '#ff9f0a', '#ffd60a', '#34c759', '#0a84ff']

function StatBox({ value, label }) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
      style={{ background: 'var(--fill-tertiary)' }}
    >
      <span
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--label-primary)',
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

export default function HanoiBoard() {
  const [disks, setDisks] = useState(DEFAULT_DISKS)
  const [towers, setTowers] = useState(() => createTowers(DEFAULT_DISKS))
  const [moves, setMoves] = useState(0)
  const [selected, setSelected] = useState(null)
  const [won, setWon] = useState(false)
  const [toast, setToast] = useState(null)

  const resetWith = useCallback((count) => {
    setDisks(count)
    setTowers(createTowers(count))
    setMoves(0)
    setSelected(null)
    setWon(false)
  }, [])

  const handlePegClick = (peg) => {
    if (won) return

    // Nothing picked yet: pick up the top disk of a non-empty peg
    if (selected === null) {
      if (towers[peg].length === 0) return
      setSelected(peg)
      return
    }

    // Clicking the selected peg again cancels the selection
    if (selected === peg) {
      setSelected(null)
      return
    }

    const next = applyMove(towers, selected, peg)
    if (!next) {
      setToast("Can't place a larger disk on a smaller one")
      setSelected(null)
      return
    }

    setTowers(next)
    setMoves((m) => m + 1)
    setSelected(null)

    if (isSolved(next, disks)) {
      setWon(true)
      setToast('Tower complete! 🎉')
    }
  }

  const optimal = minimumMoves(disks)

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
          Tower of Hanoi
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--label-tertiary)',
            marginTop: '0.5rem',
          }}
        >
          Move the whole stack to the last peg, one disk at a time
        </p>
      </div>

      {/* Disk count */}
      <div className="flex gap-2" role="group" aria-label="Number of disks">
        {DISK_OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => resetWith(count)}
            aria-pressed={disks === count}
            className={disks === count ? 'btn-primary' : 'btn-ghost'}
          >
            {count} disks
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 w-full justify-center flex-wrap">
        <StatBox value={moves} label="Moves" />
        <StatBox value={optimal} label="Best possible" />
      </div>

      {/* Pegs */}
      <div
        className="grid gap-3 w-full p-3 rounded-2xl"
        style={{
          gridTemplateColumns: `repeat(${PEG_COUNT}, minmax(0, 1fr))`,
          background: 'var(--fill-secondary)',
        }}
      >
        {towers.map((peg, pegIndex) => {
          const isSelected = selected === pegIndex
          const canDrop =
            selected !== null && canMove(towers, selected, pegIndex)
          return (
            <button
              key={PEG_LABELS[pegIndex]}
              onClick={() => handlePegClick(pegIndex)}
              disabled={won}
              aria-label={`Peg ${PEG_LABELS[pegIndex]}, ${peg.length} disks`}
              aria-pressed={isSelected}
              className="flex flex-col-reverse items-center gap-1 rounded-xl pb-2 pt-3 min-h-[14rem] transition-all"
              style={{
                background: isSelected
                  ? 'var(--fill-tertiary)'
                  : 'var(--bg-surface)',
                boxShadow: canDrop
                  ? 'inset 0 0 0 2px #34c759'
                  : 'var(--shadow-sm)',
                cursor: won ? 'default' : 'pointer',
              }}
            >
              {peg.map((size, i) => {
                const isTop = i === peg.length - 1
                return (
                  <span
                    key={size}
                    className="rounded-md"
                    style={{
                      width: `${35 + size * 9}%`,
                      height: '1.25rem',
                      background: DISK_COLORS[(size - 1) % DISK_COLORS.length],
                      transform:
                        isSelected && isTop ? 'translateY(-0.5rem)' : 'none',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                )
              })}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--label-tertiary)',
                }}
              >
                {PEG_LABELS[pegIndex]}
              </span>
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
            {moves} moves (best possible: {optimal})
          </span>
          <button onClick={() => resetWith(disks)} className="btn-primary">
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p style={{ fontSize: '0.75rem', color: 'var(--label-tertiary)' }}>
            Click a peg to pick up its top disk, then click another peg to drop
            it
          </p>
          <button onClick={() => resetWith(disks)} className="btn-ghost">
            🔀 New Game
          </button>
        </div>
      )}
    </div>
  )
}
