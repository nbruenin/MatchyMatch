import { useState, useCallback } from 'react'
import Toast from '../Toast'

// ── Helper Functions ──────────────────────────────────────────────

function randomColor() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

function colorToRgbString(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`
}

function calculateScore(targetColor, userColor) {
  const rDiff = Math.abs(targetColor.r - userColor.r)
  const gDiff = Math.abs(targetColor.g - userColor.g)
  const bDiff = Math.abs(targetColor.b - userColor.b)
  const totalDiff = rDiff + gDiff + bDiff
  const maxDiff = 255 * 3 // Maximum possible difference

  // Convert to a 0-100 score (100 = perfect match)
  return Math.max(0, Math.round((1 - totalDiff / maxDiff) * 100))
}

// ── Stats Bar ─────────────────────────────────────────────────────

function StatsBar({ round, score, streak }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {[
        { label: 'Round', value: `${round}/10` },
        { label: 'Score', value: score },
        { label: 'Streak', value: streak },
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

// ── Win Screen ────────────────────────────────────────────────────

function WinScreen({ score, onPlayAgain }) {
  const rating =
    score >= 900
      ? { emoji: '🏆', label: 'Master Mixer!' }
      : score >= 750
        ? { emoji: '🌟', label: 'Excellent!' }
        : score >= 600
          ? { emoji: '👍', label: 'Good Job!' }
          : { emoji: '🎨', label: 'Keep Practicing!' }

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
          background: 'linear-gradient(145deg, #bf5af2, #5e5ce6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 8px 24px rgba(191,90,242,0.35)',
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
          You completed all 10 rounds!
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-2">
        <span
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          {score}
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
          Total Score
        </span>
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  )
}

// ── Main Board ────────────────────────────────────────────────────

export default function ColorMixerBoard() {
  const [targetColor, setTargetColor] = useState(() => randomColor())
  const [userColor, setUserColor] = useState({ r: 128, g: 128, b: 128 })
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'won'
  const [toast, setToast] = useState(null)
  const [roundScore, setRoundScore] = useState(null)

  const showToast = useCallback((msg) => setToast(msg), [])

  const handleSliderChange = (channel, value) => {
    setUserColor((prev) => ({ ...prev, [channel]: parseInt(value) }))
  }

  const handleSubmit = () => {
    const currentScore = calculateScore(targetColor, userColor)
    setRoundScore(currentScore)

    const newScore = score + currentScore
    setScore(newScore)

    if (currentScore >= 90) {
      setStreak((prev) => prev + 1)
      showToast(`🎉 Perfect! +${currentScore}`)
    } else if (currentScore >= 75) {
      setStreak((prev) => prev + 1)
      showToast(`✨ Great! +${currentScore}`)
    } else if (currentScore >= 60) {
      setStreak(0)
      showToast(`👍 Good! +${currentScore}`)
    } else {
      setStreak(0)
      showToast(`🎨 Keep trying! +${currentScore}`)
    }

    setTimeout(() => {
      setRoundScore(null)
      if (round >= 10) {
        setGameState('won')
      } else {
        setRound((r) => r + 1)
        setTargetColor(randomColor())
        setUserColor({ r: 128, g: 128, b: 128 })
      }
    }, 2000)
  }

  const handleNewGame = () => {
    setTargetColor(randomColor())
    setUserColor({ r: 128, g: 128, b: 128 })
    setRound(1)
    setScore(0)
    setStreak(0)
    setGameState('playing')
    setRoundScore(null)
  }

  // ── Won screen ───────────────────────────────────────────────────
  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <WinScreen score={score} onPlayAgain={handleNewGame} />
      </div>
    )
  }

  // ── Playing screen ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Stats */}
      <StatsBar round={round} score={score} streak={streak} />

      {/* Instructions */}
      <div
        className="text-center p-4 rounded-2xl"
        style={{ background: 'var(--fill-tertiary)' }}
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--label-secondary)' }}>
          Match the target color using the RGB sliders
        </p>
      </div>

      {/* Color Display */}
      <div className="flex gap-4 w-full">
        {/* Target Color */}
        <div className="flex-1 flex flex-col gap-2">
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
              textAlign: 'center',
            }}
          >
            Target
          </span>
          <div
            style={{
              height: 120,
              borderRadius: 16,
              backgroundColor: colorToRgbString(targetColor),
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          />
          {roundScore !== null && (
            <div
              className="text-center p-2 rounded-xl"
              style={{
                background: roundScore >= 75 ? '#34c759' : '#ff9f0a',
                color: 'white',
                fontWeight: 700,
              }}
            >
              {roundScore}%
            </div>
          )}
        </div>

        {/* User Color */}
        <div className="flex-1 flex flex-col gap-2">
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
              textAlign: 'center',
            }}
          >
            Your Mix
          </span>
          <div
            style={{
              height: 120,
              borderRadius: 16,
              backgroundColor: colorToRgbString(userColor),
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          />
          <div
            className="text-center text-xs"
            style={{ color: 'var(--label-tertiary)' }}
          >
            RGB({userColor.r}, {userColor.g}, {userColor.b})
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-4 w-full">
        {[
          { channel: 'r', label: 'Red', color: '#ff3b30' },
          { channel: 'g', label: 'Green', color: '#34c759' },
          { channel: 'b', label: 'Blue', color: '#007aff' },
        ].map(({ channel, label, color }) => (
          <div key={channel} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--label-primary)',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color,
                  minWidth: 40,
                  textAlign: 'right',
                }}
              >
                {userColor[channel]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={userColor[channel]}
              onChange={(e) => handleSliderChange(channel, e.target.value)}
              disabled={roundScore !== null}
              style={{
                width: '100%',
                accentColor: color,
              }}
              className="slider"
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={roundScore !== null}
        className="btn-primary w-full"
        style={{ opacity: roundScore !== null ? 0.5 : 1 }}
      >
        {roundScore !== null ? 'Next Round...' : 'Submit Color'}
      </button>

      {/* New Game Button */}
      <button onClick={handleNewGame} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  )
}
