import { useState, useEffect, useCallback, useRef } from 'react'
import Toast from '../Toast'

// ── Bubble component ──────────────────────────────────────────────

function Bubble({ id, x, y, size, color, onPop, isPopped }) {
  if (isPopped) return null

  const handleMouseEnter = (e) => {
    const target = e.currentTarget
    target.style.transform = 'scale(1.1)'
    target.style.boxShadow = `0 8px 20px ${color}a0, inset -2px -2px 4px rgba(0,0,0,0.2)`
  }

  const handleMouseLeave = (e) => {
    const target = e.currentTarget
    target.style.transform = 'scale(1)'
    target.style.boxShadow = `0 4px 12px ${color}80, inset -2px -2px 4px rgba(0,0,0,0.2)`
  }

  return (
    <button
      onClick={() => onPop(id)}
      className="bubble"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        border: `3px solid ${color}`,
        boxShadow: `0 4px 12px ${color}80, inset -2px -2px 4px rgba(0,0,0,0.2)`,
        cursor: 'pointer',
        transition: 'all 0.1s ease',
        transform: 'scale(1)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.4}px`,
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      ✨
    </button>
  )
}

// ── Stats bar ─────────────────────────────────────────────────────

function StatsBar({ score, bubblesPopped, timeLeft, level }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {[
        { label: 'Score', value: score, emoji: '⭐' },
        { label: 'Popped', value: bubblesPopped, emoji: '💥' },
        { label: 'Level', value: level, emoji: '📈' },
        { label: 'Time', value: `${timeLeft}s`, emoji: '⏱️' },
      ].map(({ label, value, emoji }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)', minWidth: 80 }}
        >
          <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
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

// ── Game over screen ──────────────────────────────────────────────

function GameOverScreen({ score, bubblesPopped, level, onPlayAgain }) {
  const rating =
    score >= 500
      ? { emoji: '🏆', label: 'Legendary!' }
      : score >= 300
        ? { emoji: '🌟', label: 'Excellent!' }
        : score >= 150
          ? { emoji: '👍', label: 'Great job!' }
          : { emoji: '🎮', label: 'Good try!' }

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
          background: 'linear-gradient(145deg, #ff6b6b, #ff8787)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 8px 24px rgba(255,107,107,0.35)',
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
          Time's up!
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        {[
          { label: 'Score', value: score },
          { label: 'Popped', value: bubblesPopped },
          { label: 'Level', value: level },
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

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
]
const INITIAL_TIME = 30
const BUBBLES_PER_LEVEL = 5

export default function BubblePopBoard() {
  const [bubbles, setBubbles] = useState([])
  const [score, setScore] = useState(0)
  const [bubblesPopped, setBubblesPopped] = useState(0)
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'gameOver'
  const [level, setLevel] = useState(1)
  const [toast, setToast] = useState(null)
  const isInitializedRef = useRef(false)
  const nextBubbleIdRef = useRef(BUBBLES_PER_LEVEL)
  const levelUpToastShownRef = useRef(new Set())

  const showToast = useCallback((msg) => setToast(msg), [])

  // Generate random bubbles
  const generateBubbles = useCallback((count, startId) => {
    const newBubbles = []
    for (let i = 0; i < count; i++) {
      newBubbles.push({
        id: startId + i,
        x: Math.random() * 85,
        y: Math.random() * 70,
        size: 40 + Math.random() * 30,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        popped: false,
      })
    }
    return newBubbles
  }, [])

  // Initialize game
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      setBubbles(generateBubbles(BUBBLES_PER_LEVEL, 0))
    }
  }, [generateBubbles])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('gameOver')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  // Check for level up - use a ref to track which levels have been shown
  useEffect(() => {
    if (gameState === 'playing' && bubblesPopped > 0) {
      const threshold = BUBBLES_PER_LEVEL * level
      if (
        bubblesPopped >= threshold &&
        !levelUpToastShownRef.current.has(level)
      ) {
        levelUpToastShownRef.current.add(level)
        const newLevel = level + 1
        setLevel(newLevel)
        const newBubbles = generateBubbles(
          BUBBLES_PER_LEVEL,
          nextBubbleIdRef.current
        )
        nextBubbleIdRef.current += BUBBLES_PER_LEVEL
        setBubbles((prev) => [...prev.filter((b) => !b.popped), ...newBubbles])
        showToast(`Level ${newLevel}! 🚀`)
      }
    }
  }, [bubblesPopped, level, gameState, generateBubbles, showToast])

  const handlePopBubble = useCallback(
    (id) => {
      if (gameState !== 'playing') return

      setBubbles((prev) =>
        prev.map((bubble) =>
          bubble.id === id ? { ...bubble, popped: true } : bubble
        )
      )

      const points = 10 + level * 5
      setScore((prev) => prev + points)
      setBubblesPopped((prev) => prev + 1)
      showToast(`+${points} 🎉`)
    },
    [gameState, level, showToast]
  )

  const handlePlayAgain = () => {
    setScore(0)
    setBubblesPopped(0)
    setTimeLeft(INITIAL_TIME)
    setLevel(1)
    setGameState('playing')
    setBubbles(generateBubbles(BUBBLES_PER_LEVEL, 0))
    nextBubbleIdRef.current = BUBBLES_PER_LEVEL
    levelUpToastShownRef.current = new Set()
    isInitializedRef.current = false
  }

  // ── Game over screen ──────────────────────────────────────────
  if (gameState === 'gameOver') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <GameOverScreen
          score={score}
          bubblesPopped={bubblesPopped}
          level={level}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    )
  }

  // ── Playing screen ────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Stats */}
      <StatsBar
        score={score}
        bubblesPopped={bubblesPopped}
        timeLeft={timeLeft}
        level={level}
      />

      {/* Game area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          background:
            'linear-gradient(135deg, var(--fill-secondary), var(--fill-tertiary))',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '2px solid var(--fill-tertiary)',
        }}
      >
        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            id={bubble.id}
            x={bubble.x}
            y={bubble.y}
            size={bubble.size}
            color={bubble.color}
            onPop={handlePopBubble}
            isPopped={bubble.popped}
          />
        ))}

        {/* Empty state */}
        {bubbles.filter((b) => !b.popped).length === 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ fontSize: '3rem' }}>🫧</div>
            <p style={{ color: 'var(--label-tertiary)', fontSize: '0.95rem' }}>
              No bubbles left! Keep going...
            </p>
          </div>
        )}
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
        Pop as many bubbles as you can before time runs out! More bubbles appear
        as you level up.
      </p>
    </div>
  )
}
