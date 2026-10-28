import { useState, useCallback } from 'react'
import Toast from '../Toast'
import {
  MIN_DISKS,
  MAX_DISKS,
  createPegs,
  canMove,
  moveDisk,
  isSolved,
  optimalMoves,
} from '../../utils/hanoiLogic'

const PEG_NAMES = ['Left', 'Middle', 'Right']
const DISK_COLORS = [
  '#ff3b30',
  '#ff9f0a',
  '#ffd60a',
  '#34c759',
  '#0a84ff',
  '#bf5af2',
]

function Disk({ size, disks }) {
  const widthPct = 30 + (size / disks) * 70
  return (
    <div
      className="h-4 rounded-full"
      style={{
        width: `${widthPct}%`,
        background: DISK_COLORS[(size - 1) % DISK_COLORS.length],
        boxShadow: 'var(--shadow-sm)',
      }}
    />
  )
}

export default function TowerOfHanoiBoard() {
  const [disks, setDisks] = useState(MIN_DISKS)
  const [pegs, setPegs] = useState(() => createPegs(MIN_DISKS))
  const [selected, setSelected] = useState(null)
  const [moves, setMoves] = useState(0)
  const [gameState, setGameState] = useState('playing') // playing, won
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => setToast(msg), [])

  const startGame = (count) => {
    setDisks(count)
    setPegs(createPegs(count))
    setSelected(null)
    setMoves(0)
    setGameState('playing')
  }

  const handlePegClick = (index) => {
    if (gameState !== 'playing') return

    if (selected === null) {
      if (pegs[index].length === 0) {
        showToast('That peg is empty 🫥')
        return
      }
      setSelected(index)
      return
    }

    if (selected === index) {
      setSelected(null)
      return
    }

    if (!canMove(pegs, selected, index)) {
      showToast("Can't place a larger disk on a smaller one 🚫")
      setSelected(null)
      return
    }

    const next = moveDisk(pegs, selected, index)
    const nextMoves = moves + 1
    setPegs(next)
    setMoves(nextMoves)
    setSelected(null)

    if (isSolved(next, disks)) {
      setGameState('won')
      showToast('Puzzle solved! 🎉')
    }
  }

  const handleRestart = () => {
    setPegs(createPegs(disks))
    setSelected(null)
    setMoves(0)
    setGameState('playing')
  }

  const optimal = optimalMoves(disks)

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
          Move the whole stack to the right peg, one disk at a time
        </p>
      </div>

      {/* Difficulty */}
      <div
        className="flex gap-2 flex-wrap justify-center"
        role="group"
        aria-label="Number of disks"
      >
        {Array.from(
          { length: MAX_DISKS - MIN_DISKS + 1 },
          (_, i) => MIN_DISKS + i
        ).map((count) => (
          <button
            key={count}
            onClick={() => startGame(count)}
            aria-pressed={disks === count}
            className={disks === count ? 'btn-primary' : 'btn-ghost'}
          >
            {count} disks
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 w-full justify-center flex-wrap">
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
            {moves}
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
            Moves
          </span>
        </div>
        <div
          className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span
            style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34c759' }}
          >
            {optimal}
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
            Best Possible
          </span>
        </div>
      </div>

      {gameState === 'won' ? (
        <div
          className="spring-pop flex flex-col items-center gap-4 p-8 rounded-3xl w-full"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span style={{ fontSize: '3rem' }}>🏆</span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
            }}
          >
            Solved in {moves} moves!
          </span>
          <span
            style={{
              fontSize: '0.85rem',
              color: 'var(--label-secondary)',
              textAlign: 'center',
            }}
          >
            {moves === optimal
              ? 'Perfect — that is the minimum possible.'
              : `The minimum is ${optimal} moves. Try again to beat your score!`}
          </span>
          <div className="flex gap-3 w-full">
            <button onClick={handleRestart} className="btn-primary flex-1">
              Play Again
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Pegs */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {pegs.map((peg, index) => {
              const isSelected = selected === index
              return (
                <button
                  key={index}
                  onClick={() => handlePegClick(index)}
                  aria-label={`${PEG_NAMES[index]} peg, ${peg.length} disks${isSelected ? ', selected' : ''}`}
                  aria-pressed={isSelected}
                  className="relative flex flex-col-reverse items-center gap-1 p-3 rounded-2xl transition-all"
                  style={{
                    minHeight: '14rem',
                    background: isSelected
                      ? 'var(--fill-secondary)'
                      : 'var(--fill-tertiary)',
                    border: isSelected
                      ? '2px solid var(--accent)'
                      : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {/* Peg rod */}
                  <div
                    className="absolute"
                    aria-hidden="true"
                    style={{
                      width: '4px',
                      height: '10rem',
                      background: 'var(--label-tertiary)',
                      borderRadius: '2px',
                      bottom: '0.75rem',
                    }}
                  />
                  {peg.map((size) => (
                    <Disk key={size} size={size} disks={disks} />
                  ))}
                  <span
                    className="mt-auto"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--label-tertiary)',
                    }}
                  >
                    {PEG_NAMES[index]}
                  </span>
                </button>
              )
            })}
          </div>

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--label-tertiary)',
              textAlign: 'center',
            }}
          >
            {selected === null
              ? 'Select a peg to pick up its top disk.'
              : `Disk picked up from ${PEG_NAMES[selected]}. Choose a destination peg.`}
          </p>

          <button onClick={handleRestart} className="btn-ghost">
            🔀 Restart
          </button>
        </>
      )}
    </div>
  )
}
