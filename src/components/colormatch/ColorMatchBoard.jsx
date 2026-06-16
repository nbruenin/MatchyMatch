import { useState, useCallback, useEffect } from 'react'
import Toast from '../Toast'

// ── Color tile component ──────────────────────────────────────────

function ColorTile({ color, isSelected, isMatched, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className="color-tile"
      style={{
        width: 80,
        height: 80,
        borderRadius: 12,
        border: isSelected ? '4px solid var(--accent)' : '2px solid var(--fill-secondary)',
        background: color,
        cursor: disabled || isMatched ? 'not-allowed' : 'pointer',
        opacity: isMatched ? 0.3 : 1,
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? '0 8px 24px rgba(0,122,255,0.4)' : 'var(--shadow-md)',
      }}
    />
  )
}

// ── Score display ────────────────────────────────────────────────

function ScoreDisplay({ matches, total, streak }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {[
        { label: 'Matches', value: matches, icon: '✓' },
        { label: 'Total', value: total, icon: '🎯' },
        { label: 'Streak', value: streak, icon: '🔥' },
      ].map(({ label, value, icon }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)', minWidth: 80 }}
        >
          <span style={{ fontSize: '1.2rem' }}>{icon}</span>
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

// ── Win screen ────────────────────────────────────────────────────

function WinScreen({ matches, streak, onPlayAgain }) {
  const rating =
    matches >= 8
      ? { emoji: '🏆', label: 'Perfect Match!' }
      : matches >= 6
        ? { emoji: '🌟', label: 'Excellent!' }
        : matches >= 4
          ? { emoji: '👍', label: 'Great Job!' }
          : { emoji: '🎨', label: 'Good Try!' }

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: 'linear-gradient(145deg, #34c759, #30d158)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 8px 24px rgba(52,199,89,0.35)',
        }}
      >
        {rating.emoji}
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
          {rating.label}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
          You matched {matches} pairs!
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        {[
          { label: 'Matches', value: matches },
          { label: 'Streak', value: streak },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
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
        ))}
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────

export default function ColorMatchBoard() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  ]

  const [tiles, setTiles] = useState(
    colors.sort(() => Math.random() - 0.5).map((color, idx) => ({
      id: idx,
      color,
      isMatched: false,
    }))
  )

  const [selected, setSelected] = useState([])
  const [matches, setMatches] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'won'
  const [toast, setToast] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  const showToast = useCallback((msg) => setToast(msg), [])

  // Check for matches
  useEffect(() => {
    if (selected.length !== 2 || isChecking) return

    setIsChecking(true)

    const timer = setTimeout(() => {
      const [first, second] = selected
      const firstTile = tiles[first]
      const secondTile = tiles[second]

      if (firstTile.color === secondTile.color) {
        // Match found!
        setTiles((prev) =>
          prev.map((tile, idx) =>
            idx === first || idx === second ? { ...tile, isMatched: true } : tile
          )
        )
        setMatches((m) => m + 1)
        setStreak((s) => s + 1)
        showToast('Match! 🎉')
        setSelected([])

        // Check if game is won
        const newMatches = matches + 1
        if (newMatches === 8) {
          setGameState('won')
        }
      } else {
        // No match
        showToast('No match, try again!')
        setStreak(0)
        setSelected([])
      }

      setIsChecking(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [selected, tiles, matches, isChecking, showToast])

  const handleTileClick = (idx) => {
    if (isChecking || tiles[idx].isMatched || selected.includes(idx)) return

    if (selected.length < 2) {
      setSelected([...selected, idx])
    }
  }

  const handlePlayAgain = () => {
    const newColors = colors.sort(() => Math.random() - 0.5)
    setTiles(
      newColors.map((color, idx) => ({
        id: idx,
        color,
        isMatched: false,
      }))
    )
    setSelected([])
    setMatches(0)
    setStreak(0)
    setGameState('playing')
  }

  // ── Won screen ───────────────────────────────────────────────────
  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <WinScreen matches={matches} streak={streak} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  // ── Playing screen ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Score */}
      <ScoreDisplay matches={matches} total={8} streak={streak} />

      {/* Title */}
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--label-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        Find the matching colors
      </h2>

      {/* Tiles grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          width: '100%',
          maxWidth: 360,
        }}
      >
        {tiles.map((tile, idx) => (
          <ColorTile
            key={tile.id}
            color={tile.color}
            isSelected={selected.includes(idx)}
            isMatched={tile.isMatched}
            onClick={() => handleTileClick(idx)}
            disabled={isChecking}
          />
        ))}
      </div>

      {/* Instructions */}
      <p
        className="text-center"
        style={{
          fontSize: '0.78rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '-0.01em',
          maxWidth: 300,
        }}
      >
        Click two tiles to find matching colors. Match all 8 pairs to win!
      </p>

      {/* New game button */}
      <button onClick={handlePlayAgain} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  )
}
