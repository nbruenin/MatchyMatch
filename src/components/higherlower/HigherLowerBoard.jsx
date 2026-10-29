import { useState, useCallback } from 'react'
import Toast from '../Toast'
import {
  createDeck,
  shuffleDeck,
  evaluateGuess,
  isRed,
} from '../../utils/higherLowerLogic'

const MAX_LIVES = 3

function newRound() {
  const deck = shuffleDeck(createDeck())
  const current = deck.pop()
  return { deck, current }
}

function PlayingCard({ card, hidden }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl"
      aria-label={hidden ? 'Hidden card' : `${card.rank} of ${card.suit}`}
      style={{
        width: 110,
        height: 150,
        background: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-xl)',
        color: hidden
          ? 'var(--label-tertiary)'
          : isRed(card)
            ? '#ff3b30'
            : 'var(--label-primary)',
        fontSize: '2.5rem',
        fontWeight: 800,
      }}
    >
      {hidden ? (
        '?'
      ) : (
        <>
          <span>{card.rank}</span>
          <span>{card.suit}</span>
        </>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
      style={{ background: 'var(--fill-tertiary)', minWidth: 72 }}
    >
      <span
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--label-primary)',
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

export default function HigherLowerBoard() {
  const [round, setRound] = useState(newRound)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'won' | 'lost'
  const [toast, setToast] = useState(null)

  const { deck, current } = round

  const handleGuess = useCallback(
    (guess) => {
      if (gameState !== 'playing') return
      const next = deck[deck.length - 1]
      const rest = deck.slice(0, -1)
      const result = evaluateGuess(current, next, guess)

      let nextScore = score
      let nextLives = lives
      if (result === 'correct') {
        nextScore = score + 1
        setScore(nextScore)
        setBest((b) => Math.max(b, nextScore))
        setToast(`Correct! It was ${next.rank}${next.suit}`)
      } else if (result === 'wrong') {
        nextLives = lives - 1
        setLives(nextLives)
        setToast(`Wrong! It was ${next.rank}${next.suit}`)
      } else {
        setToast('Same rank — no change')
      }

      setRound({ deck: rest, current: next })

      if (nextLives <= 0) setGameState('lost')
      else if (rest.length === 0) setGameState('won')
    },
    [deck, current, score, lives, gameState]
  )

  const handleNewGame = useCallback(() => {
    setRound(newRound())
    setScore(0)
    setLives(MAX_LIVES)
    setGameState('playing')
    setToast(null)
  }, [])

  if (gameState !== 'playing') {
    const won = gameState === 'won'
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
          style={{
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>{won ? '🎉' : '💔'}</span>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
            }}
          >
            {won ? 'Deck cleared!' : 'Game over'}
          </h2>
          <p style={{ color: 'var(--label-tertiary)' }}>
            Final score: {score}
          </p>
          <button onClick={handleNewGame} className="btn-primary w-full">
            Play Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--label-primary)',
        }}
      >
        Higher or Lower
      </h2>

      <div className="flex items-center justify-center gap-4 flex-wrap w-full">
        <Stat label="Score" value={score} />
        <Stat label="Best" value={best} />
        <Stat label="Lives" value={'❤️'.repeat(lives)} />
        <Stat label="Cards Left" value={deck.length} />
      </div>

      <div className="flex items-center gap-4">
        <PlayingCard card={current} />
        <PlayingCard hidden />
      </div>

      <div className="flex gap-4">
        <button onClick={() => handleGuess('higher')} className="btn-primary">
          Higher
        </button>
        <button onClick={() => handleGuess('lower')} className="btn-primary">
          Lower
        </button>
      </div>

      <p
        className="text-center"
        style={{ fontSize: '0.78rem', color: 'var(--label-tertiary)' }}
      >
        Will the next card be higher or lower? Aces are high. Ties are a push.
      </p>

      <button onClick={handleNewGame} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  )
}
