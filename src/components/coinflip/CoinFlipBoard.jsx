import { useState, useCallback } from 'react'
import Toast from '../Toast'

const COIN_SIDES = [
  { id: 'heads', emoji: '👑', label: 'Heads' },
  { id: 'tails', emoji: '🦅', label: 'Tails' },
]

function flipCoin() {
  return Math.random() < 0.5 ? 'heads' : 'tails'
}

export default function CoinFlipBoard() {
  const [playerChoice, setPlayerChoice] = useState(null)
  const [result, setResult] = useState(null)
  const [gameState, setGameState] = useState('idle') // idle, flipping, result
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [toast, setToast] = useState(null)
  const [flipCount, setFlipCount] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  const showToast = useCallback((msg) => setToast(msg), [])

  const handleChoiceClick = (choice) => {
    if (gameState !== 'idle') return

    setPlayerChoice(choice)
    setGameState('flipping')
    setIsFlipping(true)

    // Simulate coin flip animation
    setTimeout(() => {
      const coinResult = flipCoin()
      setResult(coinResult)
      setIsFlipping(false)

      const won = choice.id === coinResult
      if (won) {
        setWins((w) => w + 1)
        showToast('You guessed right! 🎉')
      } else {
        setLosses((l) => l + 1)
        showToast('Better luck next time! 😔')
      }

      setFlipCount((f) => f + 1)
      setGameState('result')
    }, 1200)
  }

  const handleFlipAgain = () => {
    setPlayerChoice(null)
    setResult(null)
    setGameState('idle')
  }

  const handleReset = () => {
    setPlayerChoice(null)
    setResult(null)
    setGameState('idle')
    setWins(0)
    setLosses(0)
    setFlipCount(0)
  }

  const winRate =
    flipCount > 0 ? Math.round((wins / flipCount) * 100) : 0

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
          Coin Flip
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--label-tertiary)',
            marginTop: '0.5rem',
          }}
        >
          Predict the coin flip and test your luck
        </p>
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
              color: '#34c759',
            }}
          >
            {wins}
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
            Wins
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ff3b30',
            }}
          >
            {losses}
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
            Losses
          </span>
        </div>

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
            {winRate}%
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
            Win Rate
          </span>
        </div>
      </div>

      {/* Game area */}
      {gameState === 'idle' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--label-secondary)',
              textAlign: 'center',
            }}
          >
            Make your prediction:
          </p>

          {/* Choice buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            {COIN_SIDES.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice)}
                className="flex flex-col items-center gap-2 px-8 py-6 rounded-2xl transition-all hover:scale-105"
                style={{
                  background: 'var(--fill-secondary)',
                  border: '2px solid var(--fill-tertiary)',
                  cursor: 'pointer',
                  fontSize: '3rem',
                }}
              >
                <span>{choice.emoji}</span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--label-secondary)',
                  }}
                >
                  {choice.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'flipping' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--label-tertiary)',
              textAlign: 'center',
            }}
          >
            Flipping the coin...
          </p>
          <div
            style={{
              fontSize: '4rem',
              animation: 'spin 0.6s linear infinite',
              transformStyle: 'preserve-3d',
            }}
          >
            🪙
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {gameState === 'result' && playerChoice && result && (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Your prediction */}
          <div className="flex flex-col items-center gap-2">
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
              }}
            >
              Your Prediction
            </span>
            <div
              style={{
                fontSize: '3rem',
                padding: '1rem',
                background: 'var(--fill-secondary)',
                borderRadius: '1rem',
                border: '2px solid var(--accent)',
              }}
            >
              {playerChoice.emoji}
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--label-secondary)',
              }}
            >
              {playerChoice.label}
            </span>
          </div>

          {/* Result */}
          <div
            className="spring-pop flex flex-col items-center gap-3 p-6 rounded-2xl w-full"
            style={{
              background: 'var(--fill-tertiary)',
              border:
                playerChoice.id === result
                  ? '2px solid #34c759'
                  : '2px solid #ff3b30',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
              }}
            >
              Result
            </span>
            <div
              style={{
                fontSize: '3.5rem',
              }}
            >
              {COIN_SIDES.find((s) => s.id === result)?.emoji}
            </div>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color:
                  playerChoice.id === result ? '#34c759' : '#ff3b30',
              }}
            >
              {playerChoice.id === result
                ? '🎉 You Win!'
                : '😔 You Lose!'}
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--label-secondary)',
              }}
            >
              The coin landed on{' '}
              <strong>{COIN_SIDES.find((s) => s.id === result)?.label}</strong>
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button onClick={handleFlipAgain} className="btn-primary flex-1">
              Flip Again
            </button>
            <button onClick={handleReset} className="btn-ghost flex-1">
              Reset Stats
            </button>
          </div>
        </div>
      )}

      {/* Flip counter */}
      {flipCount > 0 && (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--label-tertiary)',
            textAlign: 'center',
            marginTop: '1rem',
          }}
        >
          Total Flips: {flipCount}
        </p>
      )}
    </div>
  )
}
