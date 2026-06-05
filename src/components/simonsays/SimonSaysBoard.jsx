import { useState, useCallback, useRef, useEffect } from 'react'
import Toast from '../Toast'

// ── Game constants ─────────────────────────────────────────────────
const COLORS = ['red', 'blue', 'green', 'yellow']
const COLOR_MAP = {
  red: '#FF6B6B',
  blue: '#5AC8FA',
  green: '#34C759',
  yellow: '#FFD700',
}

// ── Simon Says game logic ──────────────────────────────────────────
function SimonSaysGame() {
  const [gameState, setGameState] = useState('ready') // 'ready', 'playing', 'simon-turn', 'player-turn', 'won', 'lost'
  const [sequence, setSequence] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [toast, setToast] = useState(null)
  const [activeColor, setActiveColor] = useState(null)
  const audioContextRef = useRef(null)
  const gameLoopRef = useRef(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
  }, [])

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }, [])

  // Play sound for a color
  const playSound = useCallback((color) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    const frequencies = {
      red: 261.63,
      blue: 329.63,
      green: 392.0,
      yellow: 523.25,
    }

    osc.frequency.value = frequencies[color]
    osc.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc.start(now)
    osc.stop(now + 0.5)
  }, [])

  // Flash a color
  const flashColor = useCallback(
    (color) => {
      return new Promise((resolve) => {
        setActiveColor(color)
        playSound(color)
        setTimeout(() => {
          setActiveColor(null)
          setTimeout(resolve, 200)
        }, 500)
      })
    },
    [playSound]
  )

  // Play the Simon sequence
  const playSequence = useCallback(
    async (seq) => {
      setGameState('simon-turn')
      await new Promise((resolve) => setTimeout(resolve, 500))

      for (const color of seq) {
        await flashColor(color)
      }

      setGameState('player-turn')
    },
    [flashColor]
  )

  // Start a new game
  const startGame = useCallback(() => {
    setSequence([])
    setPlayerSequence([])
    setLevel(0)
    setScore(0)
    setGameState('playing')

    // Start first round
    const newSequence = [COLORS[Math.floor(Math.random() * COLORS.length)]]
    setSequence(newSequence)
    playSequence(newSequence)
  }, [playSequence])

  // Handle player color click
  const handleColorClick = useCallback(
    (color) => {
      if (gameState !== 'player-turn') return

      const newPlayerSequence = [...playerSequence, color]
      setPlayerSequence(newPlayerSequence)
      flashColor(color)

      // Check if player's move is correct
      if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
        setGameState('lost')
        showToast('Wrong sequence! Game Over!')
        return
      }

      // Check if player completed the sequence
      if (newPlayerSequence.length === sequence.length) {
        setPlayerSequence([])
        setLevel((prev) => prev + 1)
        setScore((prev) => prev + 10)
        showToast(`Level ${level + 2}!`)

        setTimeout(() => {
          const newSequence = [
            ...sequence,
            COLORS[Math.floor(Math.random() * COLORS.length)],
          ]
          setSequence(newSequence)
          playSequence(newSequence)
        }, 1000)
      }
    },
    [gameState, playerSequence, sequence, flashColor, playSequence, level, showToast]
  )

  // Win screen
  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
          style={{
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
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
            🎉
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
              Amazing!
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--label-tertiary)',
                letterSpacing: '-0.01em',
              }}
            >
              Final Score: {score} | Level: {level + 1}
            </p>
          </div>

          <button onClick={startGame} className="btn-primary w-full">
            Play Again
          </button>
        </div>
      </div>
    )
  }

  // Lose screen
  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
          style={{
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: 'linear-gradient(145deg, #ff9f0a, #ff6b00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 8px 24px rgba(255,159,10,0.35)',
            }}
          >
            😔
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
              Game Over!
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--label-tertiary)',
                letterSpacing: '-0.01em',
              }}
            >
              Final Score: {score} | Level: {level + 1}
            </p>
          </div>

          <button onClick={startGame} className="btn-primary w-full">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
          style={{
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: 'linear-gradient(145deg, #5AC8FA, #0a84ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 8px 24px rgba(90,200,250,0.35)',
            }}
          >
            🎮
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
              Simon Says
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--label-tertiary)',
                letterSpacing: '-0.01em',
                marginTop: 8,
              }}
            >
              Watch the sequence and repeat it back. Each level adds a new color!
            </p>
          </div>

          <button onClick={startGame} className="btn-primary w-full">
            Start Game
          </button>
        </div>
      </div>
    )
  }

  // Playing screen
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="text-center">
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--label-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}
        >
          Simon Says
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
          Level: {level + 1} | Score: {score}
        </p>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--label-tertiary)',
            marginTop: 4,
            fontStyle: 'italic',
          }}
        >
          {gameState === 'simon-turn' ? 'Watch...' : 'Your turn!'}
        </p>
      </div>

      {/* Color buttons grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          width: '100%',
          maxWidth: 280,
        }}
      >
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={gameState !== 'player-turn'}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 16,
              border: 'none',
              backgroundColor: COLOR_MAP[color],
              opacity: activeColor === color ? 1 : 0.7,
              transform: activeColor === color ? 'scale(0.95)' : 'scale(1)',
              cursor: gameState === 'player-turn' ? 'pointer' : 'default',
              transition: 'all 0.1s ease',
              boxShadow:
                activeColor === color
                  ? `0 0 20px ${COLOR_MAP[color]}`
                  : `0 4px 12px rgba(0,0,0,0.15)`,
            }}
          />
        ))}
      </div>

      <div
        className="text-center"
        style={{
          fontSize: '0.85rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '-0.01em',
          maxWidth: 300,
        }}
      >
        <p>Click the colors in the order Simon shows them</p>
      </div>
    </div>
  )
}

export default SimonSaysGame
