import { useState, useEffect, useRef, useCallback } from 'react'
import Confetti from '../Confetti'

// ── Constants ─────────────────────────────────────────────────────

const TOTAL_ROUNDS = 5
const MIN_DELAY_MS = 1500
const MAX_DELAY_MS = 4500

// Rating thresholds (ms)
function getRating(avgMs) {
  if (avgMs < 200) return { emoji: '⚡', label: 'Superhuman!', color: '#bf5af2' }
  if (avgMs < 280) return { emoji: '🏆', label: 'Excellent!',  color: '#ffd60a' }
  if (avgMs < 380) return { emoji: '🌟', label: 'Great!',      color: '#34c759' }
  if (avgMs < 500) return { emoji: '👍', label: 'Good',        color: '#007aff' }
  return               { emoji: '🐢', label: 'Keep trying!', color: '#ff9f0a' }
}

// ── Sub-components ────────────────────────────────────────────────

function StatPill({ label, value }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
      style={{ background: 'var(--fill-tertiary)', minWidth: 80 }}
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
  )
}

function ResultsScreen({ times, onPlayAgain }) {
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  const best = Math.min(...times)
  const rating = getRating(avg)

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      <Confetti />

      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: `linear-gradient(145deg, ${rating.color}, ${rating.color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: `0 8px 24px ${rating.color}44`,
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
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
          {TOTAL_ROUNDS} rounds complete
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="flex gap-4">
        <StatPill label="Avg" value={`${avg} ms`} />
        <StatPill label="Best" value={`${best} ms`} />
      </div>

      {/* Per-round breakdown */}
      <div className="w-full flex flex-col gap-1.5">
        {times.map((t, i) => {
          const pct = Math.min(100, (t / 800) * 100)
          const barColor = t < 280 ? '#34c759' : t < 450 ? '#007aff' : '#ff9f0a'
          return (
            <div key={i} className="flex items-center gap-3">
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--label-tertiary)',
                  width: 52,
                  flexShrink: 0,
                }}
              >
                Round {i + 1}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  background: 'var(--fill-tertiary)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    borderRadius: 4,
                    background: barColor,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--label-primary)',
                  width: 56,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {t} ms
              </span>
            </div>
          )
        })}
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────

export default function ReactionTimeBoard() {
  // 'idle' | 'waiting' | 'ready' | 'toosoon' | 'done'
  const [phase, setPhase] = useState('idle')
  const [round, setRound] = useState(0)
  const [times, setTimes] = useState([])
  const [startTs, setStartTs] = useState(null)

  const timeoutRef = useRef(null)

  const clearPendingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Kick off a new round: enter 'waiting' phase, then flip to 'ready' after random delay
  const startRound = useCallback(() => {
    setPhase('waiting')
    clearPendingTimeout()
    const delay =
      MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
    timeoutRef.current = setTimeout(() => {
      setPhase('ready')
      setStartTs(Date.now())
    }, delay)
  }, [])

  // Clean up on unmount
  useEffect(() => () => clearPendingTimeout(), [])

  const handleStart = () => {
    setRound(1)
    setTimes([])
    startRound()
  }

  const handleTargetClick = useCallback(() => {
    if (phase !== 'ready') return
    clearPendingTimeout()
    const elapsed = Date.now() - startTs
    const newTimes = [...times, elapsed]
    setTimes(newTimes)

    if (newTimes.length >= TOTAL_ROUNDS) {
      setPhase('done')
    } else {
      setRound((r) => r + 1)
      startRound()
    }
  }, [phase, startTs, times, startRound])

  const handleAreaClick = useCallback(() => {
    if (phase === 'waiting') {
      // Clicked too soon
      clearPendingTimeout()
      setPhase('toosoon')
    }
  }, [phase])

  const handleTooSoonRetry = () => {
    startRound()
  }

  const handlePlayAgain = () => {
    setPhase('idle')
    setRound(0)
    setTimes([])
    setStartTs(null)
  }

  // ── Done screen ──────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <ResultsScreen times={times} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  // ── Shared layout ────────────────────────────────────────────────
  const avgSoFar =
    times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : null
  const bestSoFar = times.length > 0 ? Math.min(...times) : null

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Header */}
      <div className="text-center">
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Reaction Time
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)', marginTop: '0.4rem' }}>
          Click the target the moment it turns green
        </p>
      </div>

      {/* Progress pills */}
      {phase !== 'idle' && (
        <div className="flex gap-3">
          <StatPill label="Round" value={`${Math.min(round, TOTAL_ROUNDS)} / ${TOTAL_ROUNDS}`} />
          {avgSoFar !== null && <StatPill label="Avg" value={`${avgSoFar} ms`} />}
          {bestSoFar !== null && <StatPill label="Best" value={`${bestSoFar} ms`} />}
        </div>
      )}

      {/* ── Idle ── */}
      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div
            style={{
              padding: '2rem',
              borderRadius: '1.5rem',
              background: 'var(--fill-tertiary)',
              textAlign: 'center',
              maxWidth: 320,
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⚡</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--label-secondary)', lineHeight: 1.6 }}>
              A target will appear after a random delay. Click it as fast as you can!
              You&apos;ll play <strong>{TOTAL_ROUNDS} rounds</strong> and get a score at the end.
            </p>
          </div>
          <button onClick={handleStart} className="btn-primary" style={{ minWidth: 160 }}>
            Start Game
          </button>
        </div>
      )}

      {/* ── Waiting (red zone) ── */}
      {phase === 'waiting' && (
        <button
          onClick={handleAreaClick}
          aria-label="Waiting area — do not click yet"
          style={{
            width: '100%',
            maxWidth: 360,
            aspectRatio: '1 / 1',
            borderRadius: '2rem',
            background: 'linear-gradient(145deg, #ff3b30, #ff453a)',
            boxShadow: '0 8px 32px rgba(255,59,48,0.35)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'transform 0.1s ease',
          }}
        >
          <span style={{ fontSize: '3rem' }}>🔴</span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '-0.01em',
            }}
          >
            Wait for green…
          </span>
        </button>
      )}

      {/* ── Ready (green zone) ── */}
      {phase === 'ready' && (
        <button
          onClick={handleTargetClick}
          aria-label="Click now!"
          style={{
            width: '100%',
            maxWidth: 360,
            aspectRatio: '1 / 1',
            borderRadius: '2rem',
            background: 'linear-gradient(145deg, #34c759, #30d158)',
            boxShadow: '0 8px 32px rgba(52,199,89,0.45)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'transform 0.1s ease',
          }}
        >
          <span style={{ fontSize: '3rem' }}>🟢</span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.02em',
            }}
          >
            CLICK NOW!
          </span>
        </button>
      )}

      {/* ── Too soon ── */}
      {phase === 'toosoon' && (
        <div className="flex flex-col items-center gap-5 w-full">
          <div
            style={{
              width: '100%',
              maxWidth: 360,
              aspectRatio: '1 / 1',
              borderRadius: '2rem',
              background: 'linear-gradient(145deg, #ff9f0a, #ffcc00)',
              boxShadow: '0 8px 32px rgba(255,159,10,0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '3rem' }}>⚠️</span>
            <span
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'rgba(0,0,0,0.75)',
                letterSpacing: '-0.01em',
              }}
            >
              Too soon!
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'rgba(0,0,0,0.55)',
                textAlign: 'center',
                maxWidth: 220,
              }}
            >
              Wait for the green target before clicking.
            </span>
          </div>
          <button onClick={handleTooSoonRetry} className="btn-primary" style={{ minWidth: 160 }}>
            Try Again
          </button>
        </div>
      )}

      {/* Previous round times */}
      {times.length > 0 && phase !== 'idle' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {times.map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '0.3rem 0.75rem',
                borderRadius: 999,
                background: 'var(--fill-tertiary)',
                color: 'var(--label-secondary)',
              }}
            >
              #{i + 1} {t} ms
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
