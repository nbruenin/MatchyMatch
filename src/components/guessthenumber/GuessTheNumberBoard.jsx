import { useState, useCallback } from 'react'
import Toast from '../Toast'

// ── Difficulty selector ────────────────────────────────────────────

function DifficultySelector({ onSelectDifficulty }) {
  const difficulties = [
    { id: 'easy', label: 'Easy', range: '1-50', attempts: 10, emoji: '🟢' },
    { id: 'medium', label: 'Medium', range: '1-100', attempts: 7, emoji: '🟡' },
    { id: 'hard', label: 'Hard', range: '1-500', attempts: 5, emoji: '🔴' },
  ]

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Choose Difficulty
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
          Pick your challenge level
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {difficulties.map((diff) => (
          <button
            key={diff.id}
            onClick={() => onSelectDifficulty(diff.id)}
            className="group relative overflow-hidden rounded-2xl p-4 text-left transition-all hover:scale-105"
            style={{
              background: 'var(--fill-tertiary)',
              border: '2px solid var(--fill-secondary)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '1.5rem' }}>{diff.emoji}</span>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: 'var(--label-primary)',
                      fontSize: '1rem',
                    }}
                  >
                    {diff.label}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--label-tertiary)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {diff.range} • {diff.attempts} attempts
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '1.25rem' }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Game screen ────────────────────────────────────────────────────

function GameScreen({
  difficulty,
  secretNumber,
  maxAttempts,
  maxNumber,
  attempts,
  guesses,
  gameState,
  onGuess,
  onPlayAgain,
  toast,
}) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const guess = parseInt(input, 10)

    if (isNaN(guess) || guess < 1 || guess > maxNumber) {
      return
    }

    setInput('')
    onGuess(guess)
  }

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#34c759'
      case 'medium':
        return '#ff9f0a'
      case 'hard':
        return '#ff3b30'
      default:
        return '#0a84ff'
    }
  }

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'easy':
        return 'Easy'
      case 'medium':
        return 'Medium'
      case 'hard':
        return 'Hard'
      default:
        return 'Unknown'
    }
  }

  // ── Won screen ───────────────────────────────────────────────────
  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
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
              You Won!
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
              The number was {secretNumber}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { label: 'Attempts', value: attempts },
              { label: 'Difficulty', value: getDifficultyLabel() },
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
      </div>
    )
  }

  // ── Lost screen ───────────────────────────────────────────────────
  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
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
              background: 'linear-gradient(145deg, #ff3b30, #ff453a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 8px 24px rgba(255,59,48,0.35)',
            }}
          >
            😢
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
              Game Over
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
              The number was {secretNumber}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { label: 'Attempts Used', value: attempts },
              { label: 'Difficulty', value: getDifficultyLabel() },
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
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ── Playing screen ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => {}} />}

      {/* Header */}
      <div className="text-center">
        <p
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--label-tertiary)',
            marginBottom: 4,
          }}
        >
          Difficulty
        </p>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: 12,
            background: getDifficultyColor(),
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {getDifficultyLabel()}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {[
          { label: 'Range', value: `1-${maxNumber}` },
          { label: 'Attempts Left', value: maxAttempts - attempts },
          { label: 'Total Guesses', value: attempts },
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

      {/* Main prompt */}
      <div
        className="text-center"
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--label-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        I'm thinking of a number...
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={maxNumber}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your guess"
            className="flex-1 px-4 py-3 rounded-xl border-2 text-center font-semibold"
            style={{
              borderColor: 'var(--fill-secondary)',
              background: 'var(--bg-surface)',
              color: 'var(--label-primary)',
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input || attempts >= maxAttempts}
            className="btn-primary px-6"
            style={{
              opacity: !input || attempts >= maxAttempts ? 0.6 : 1,
              cursor: !input || attempts >= maxAttempts ? 'not-allowed' : 'pointer',
            }}
          >
            Guess
          </button>
        </div>
      </form>

      {/* Feedback */}
      {guesses.length > 0 && (
        <div
          className="text-center p-4 rounded-xl"
          style={{
            background: 'var(--fill-tertiary)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--label-primary)',
          }}
        >
          {guesses[guesses.length - 1].feedback}
        </div>
      )}

      {/* Guess history */}
      {guesses.length > 0 && (
        <div className="w-full">
          <p
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Your Guesses
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              justifyContent: 'center',
            }}
          >
            {guesses.map((guess, idx) => (
              <div
                key={idx}
                style={{
                  padding: '6px 12px',
                  borderRadius: 12,
                  background:
                    guess.result === 'correct'
                      ? '#34c759'
                      : guess.result === 'too_high'
                        ? '#ff9f0a'
                        : '#0a84ff',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {guess.number}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hint text */}
      <p
        className="text-center"
        style={{
          fontSize: '0.78rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '-0.01em',
          maxWidth: 300,
        }}
      >
        {attempts === 0
          ? 'Make your first guess!'
          : `You have ${maxAttempts - attempts} attempt${maxAttempts - attempts !== 1 ? 's' : ''} left`}
      </p>
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────

export default function GuessTheNumberBoard() {
  const [difficulty, setDifficulty] = useState(null)
  const [secretNumber, setSecretNumber] = useState(null)
  const [maxAttempts, setMaxAttempts] = useState(null)
  const [maxNumber, setMaxNumber] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [guesses, setGuesses] = useState([])
  const [gameState, setGameState] = useState('selecting') // 'selecting' | 'playing' | 'won' | 'lost'
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => setToast(msg), [])

  const handleSelectDifficulty = (selectedDifficulty) => {
    let max, maxAtts
    switch (selectedDifficulty) {
      case 'easy':
        max = 50
        maxAtts = 10
        break
      case 'medium':
        max = 100
        maxAtts = 7
        break
      case 'hard':
        max = 500
        maxAtts = 5
        break
      default:
        max = 100
        maxAtts = 7
    }

    const secret = Math.floor(Math.random() * max) + 1
    setDifficulty(selectedDifficulty)
    setSecretNumber(secret)
    setMaxAttempts(maxAtts)
    setMaxNumber(max)
    setAttempts(0)
    setGuesses([])
    setGameState('playing')
  }

  const handleGuess = (guess) => {
    if (attempts >= maxAttempts) return

    let result, feedback
    if (guess === secretNumber) {
      result = 'correct'
      feedback = `🎉 Correct! The number was ${secretNumber}!`
    } else if (guess < secretNumber) {
      result = 'too_low'
      feedback = `📈 Too low! Try a higher number.`
    } else {
      result = 'too_high'
      feedback = `📉 Too high! Try a lower number.`
    }

    const newAttempts = attempts + 1
    const newGuesses = [...guesses, { number: guess, result, feedback }]

    setAttempts(newAttempts)
    setGuesses(newGuesses)

    if (result === 'correct') {
      setGameState('won')
    } else if (newAttempts >= maxAttempts) {
      setGameState('lost')
    }
  }

  const handlePlayAgain = () => {
    setDifficulty(null)
    setSecretNumber(null)
    setMaxAttempts(null)
    setMaxNumber(null)
    setAttempts(0)
    setGuesses([])
    setGameState('selecting')
  }

  // ── Difficulty selection ──────────────────────────────────────────
  if (gameState === 'selecting') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />
      </div>
    )
  }

  // ── Playing / Won / Lost ──────────────────────────────────────────
  return (
    <GameScreen
      difficulty={difficulty}
      secretNumber={secretNumber}
      maxAttempts={maxAttempts}
      maxNumber={maxNumber}
      attempts={attempts}
      guesses={guesses}
      gameState={gameState}
      onGuess={handleGuess}
      onPlayAgain={handlePlayAgain}
      toast={toast}
    />
  )
}
