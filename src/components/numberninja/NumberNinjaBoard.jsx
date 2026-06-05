import { useState, useCallback, useEffect } from 'react'
import Toast from '../Toast'

// ── Game constants ─────────────────────────────────────────────────
const DIFFICULTY_LEVELS = {
  easy: { time: 3000, range: 10, pairs: 4 },
  medium: { time: 2000, range: 50, pairs: 6 },
  hard: { time: 1000, range: 100, pairs: 8 },
}

// ── Number Ninja game logic ────────────────────────────────────────
function NumberNinjaGame() {
  const [gameState, setGameState] = useState('ready') // 'ready', 'playing', 'won', 'lost'
  const [difficulty, setDifficulty] = useState('easy')
  const [numbers, setNumbers] = useState([])
  const [targetNumber, setTargetNumber] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [toast, setToast] = useState(null)
  const [selectedNumber, setSelectedNumber] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
  }, [])

  // Generate a new round
  const generateRound = useCallback(() => {
    const config = DIFFICULTY_LEVELS[difficulty]
    const target = Math.floor(Math.random() * config.range) + 1
    const numberList = [target]

    // Generate other random numbers
    while (numberList.length < config.pairs) {
      const num = Math.floor(Math.random() * config.range) + 1
      if (!numberList.includes(num)) {
        numberList.push(num)
      }
    }

    // Shuffle the array
    const shuffled = numberList.sort(() => Math.random() - 0.5)

    setTargetNumber(target)
    setNumbers(shuffled)
    setTimeLeft(config.time / 1000)
  }, [difficulty])

  // Start a new game
  const startGame = useCallback(() => {
    setScore(0)
    setRound(0)
    setGameState('playing')
    generateRound()
  }, [generateRound])

  // Handle number selection
  const handleNumberClick = useCallback(
    (num) => {
      if (gameState !== 'playing' || selectedNumber !== null) return

      setSelectedNumber(num)

      if (num === targetNumber) {
        setScore((prev) => prev + 10)
        setRound((prev) => prev + 1)
        showToast('✓ Correct!')

        setTimeout(() => {
          setSelectedNumber(null)
          generateRound()
        }, 500)
      } else {
        showToast('✗ Wrong number!')
        setGameState('lost')
      }
    },
    [gameState, targetNumber, selectedNumber, generateRound, showToast]
  )

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setGameState('lost')
          showToast('Time\'s up!')
          return 0
        }
        return prev - 0.1
      })
    }, 100)

    return () => clearInterval(timer)
  }, [gameState, showToast])

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
            🥷
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
              Ninja Master!
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--label-tertiary)',
                letterSpacing: '-0.01em',
              }}
            >
              Score: {score} | Rounds: {round}
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
              Score: {score} | Rounds: {round}
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
              background: 'linear-gradient(145deg, #FF6B6B, #FF4757)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 8px 24px rgba(255,107,107,0.35)',
            }}
          >
            🥷
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
              Number Ninja
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--label-tertiary)',
                letterSpacing: '-0.01em',
                marginTop: 8,
              }}
            >
              Find the target number before time runs out!
            </p>
          </div>

          {/* Difficulty selector */}
          <div className="w-full flex gap-2 justify-center">
            {Object.keys(DIFFICULTY_LEVELS).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor:
                    difficulty === level ? '#FF6B6B' : 'var(--bg-secondary)',
                  color:
                    difficulty === level
                      ? 'white'
                      : 'var(--label-primary)',
                  fontWeight: difficulty === level ? 600 : 500,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                }}
              >
                {level}
              </button>
            ))}
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
          Number Ninja
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
          Score: {score} | Round: {round + 1}
        </p>
      </div>

      {/* Timer */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #FF6B6B, #FF4757)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'white',
          boxShadow: '0 8px 24px rgba(255,107,107,0.35)',
        }}
      >
        {Math.ceil(timeLeft)}
      </div>

      {/* Target number */}
      <div
        style={{
          padding: '16px 32px',
          borderRadius: 12,
          background: 'var(--bg-secondary)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--label-tertiary)',
            marginBottom: 8,
          }}
        >
          Find the number:
        </p>
        <p
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--label-primary)',
          }}
        >
          {targetNumber}
        </p>
      </div>

      {/* Number buttons grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
          gap: 12,
          width: '100%',
          maxWidth: 300,
        }}
      >
        {numbers.map((num, idx) => (
          <button
            key={idx}
            onClick={() => handleNumberClick(num)}
            disabled={selectedNumber !== null}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 12,
              border: 'none',
              backgroundColor:
                selectedNumber === num
                  ? num === targetNumber
                    ? '#34C759'
                    : '#FF6B6B'
                  : 'var(--bg-secondary)',
              color: 'var(--label-primary)',
              fontSize: '1.25rem',
              fontWeight: 700,
              cursor: selectedNumber === null ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              boxShadow:
                selectedNumber === num
                  ? `0 0 20px ${
                      num === targetNumber ? '#34C759' : '#FF6B6B'
                    }`
                  : '0 2px 8px rgba(0,0,0,0.1)',
              opacity: selectedNumber === null ? 1 : selectedNumber === num ? 1 : 0.5,
            }}
          >
            {num}
          </button>
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
        <p>Click the target number before time runs out!</p>
      </div>
    </div>
  )
}

export default NumberNinjaGame
