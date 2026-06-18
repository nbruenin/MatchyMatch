import { useState, useEffect, useCallback, useRef } from 'react'
import Toast from '../Toast'
import { DIFFICULTIES, pickChallenges, MORSE_MAP } from '../../data/morseCodeData'

// ── Morse display ─────────────────────────────────────────────────────────────

function MorseDisplay({ morse }) {
  const symbols = morse.split('')

  return (
    <div
      className="flex flex-wrap justify-center items-center gap-1"
      aria-label={`Morse code: ${morse}`}
      role="img"
    >
      {symbols.map((sym, i) => {
        if (sym === ' ') {
          return <span key={i} style={{ width: 10 }} />
        }
        const isDot = sym === '.'
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              background: 'var(--label-primary)',
              borderRadius: isDot ? '50%' : 4,
              width: isDot ? 14 : 36,
              height: 14,
            }}
          />
        )
      })}
    </div>
  )
}

// ── Reference table (collapsible) ────────────────────────────────────────────

function MorseReference() {
  const [open, setOpen] = useState(false)
  const letters = Object.entries(MORSE_MAP).filter(([ch]) => /^[A-Z]$/.test(ch))

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          padding: '8px 14px',
          borderRadius: 12,
          background: 'var(--fill-tertiary)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--label-secondary)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        aria-expanded={open}
        aria-label="Toggle Morse code reference chart"
      >
        <span>📖 Reference Chart</span>
        <span
          style={{
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="mt-2 p-3 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '6px 8px',
            }}
          >
            {letters.map(([ch, code]) => (
              <div
                key={ch}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 6px',
                  borderRadius: 8,
                  background: 'var(--bg-surface)',
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: 'var(--label-primary)',
                    minWidth: 16,
                  }}
                >
                  {ch}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--label-secondary)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em',
                  }}
                >
                  {code}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ current, total, timeLeft, timeMax }) {
  const timeFraction = timeLeft / timeMax
  const timeColor =
    timeFraction > 0.5 ? '#34c759' : timeFraction > 0.25 ? '#ff9f0a' : '#ff3b30'

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--label-tertiary)',
          }}
        >
          Round {current} of {total}
        </span>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: timeColor,
          }}
        >
          ⏱ {timeLeft}s
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: 6,
          borderRadius: 99,
          background: 'var(--fill-secondary)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${timeFraction * 100}%`,
            background: timeColor,
            borderRadius: 99,
            transition: 'width 1s linear, background 0.3s',
          }}
        />
      </div>
    </div>
  )
}

// ── Difficulty selector ───────────────────────────────────────────────────────

function DifficultySelector({ onSelect }) {
  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div style={{ fontSize: '3rem' }}>📡</div>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Morse Code
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)', maxWidth: 260 }}>
          Decode the dots and dashes. Choose your challenge level.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {Object.entries(DIFFICULTIES).map(([id, diff]) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
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
                      letterSpacing: '0.04em',
                    }}
                  >
                    {diff.description} · {diff.rounds} rounds · {diff.timePerRound}s each
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '1.25rem', color: 'var(--label-tertiary)' }}>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick legend */}
      <div
        className="flex items-center gap-6 px-4 py-3 rounded-2xl w-full justify-center"
        style={{ background: 'var(--fill-tertiary)' }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--label-primary)',
            }}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--label-secondary)' }}>dot</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              display: 'inline-block',
              width: 28,
              height: 10,
              borderRadius: 3,
              background: 'var(--label-primary)',
            }}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--label-secondary)' }}>dash</span>
        </div>
      </div>
    </div>
  )
}

// ── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({ score, total, difficulty, onPlayAgain }) {
  const pct = Math.round((score / total) * 100)
  const isGreat = pct >= 80
  const isOk = pct >= 50

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      <div
        className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
        style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: isGreat
              ? 'linear-gradient(145deg, #34c759, #30d158)'
              : isOk
                ? 'linear-gradient(145deg, #ff9f0a, #ffcc00)'
                : 'linear-gradient(145deg, #ff453a, #ff3b30)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            boxShadow: isGreat
              ? '0 8px 24px rgba(52,199,89,0.35)'
              : isOk
                ? '0 8px 24px rgba(255,159,10,0.35)'
                : '0 8px 24px rgba(255,59,48,0.35)',
          }}
        >
          {isGreat ? '🏆' : isOk ? '👍' : '📡'}
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
            {isGreat ? 'Excellent!' : isOk ? 'Good effort!' : 'Keep practising!'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
            {DIFFICULTIES[difficulty]?.label} difficulty
          </p>
        </div>

        <div className="flex gap-8">
          {[
            { label: 'Correct', value: score },
            { label: 'Total', value: total },
            { label: 'Score', value: `${pct}%` },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--label-primary)',
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
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

// ── Game screen ───────────────────────────────────────────────────────────────

function GameScreen({ challenges, difficulty, onFinish }) {
  const config = DIFFICULTIES[difficulty]
  const [roundIndex, setRoundIndex] = useState(0)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(config.timePerRound)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong' | 'timeout'
  const [toast, setToast] = useState(null)
  const inputRef = useRef(null)
  // Track score in a ref so the advance callback always reads the latest value
  const scoreRef = useRef(0)

  const challenge = challenges[roundIndex]
  const isLastRound = roundIndex >= challenges.length - 1

  const advance = useCallback(
    (result) => {
      setFeedback(result)
      setTimeout(() => {
        setFeedback(null)
        setInput('')
        setTimeLeft(config.timePerRound)
        if (isLastRound) {
          onFinish(scoreRef.current)
        } else {
          setRoundIndex((r) => r + 1)
        }
        setTimeout(() => inputRef.current?.focus(), 50)
      }, 900)
    },
    [config.timePerRound, isLastRound, onFinish]
  )

  // Countdown timer
  useEffect(() => {
    if (feedback !== null) return
    if (timeLeft <= 0) {
      setToast(`⏰ Time's up! Answer: ${challenge.answer}`)
      advance('timeout')
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, feedback, advance, challenge.answer])

  // Focus input on mount and round change
  useEffect(() => {
    inputRef.current?.focus()
  }, [roundIndex])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (feedback !== null) return
    const trimmed = input.trim().toUpperCase()
    if (!trimmed) return

    if (trimmed === challenge.answer) {
      scoreRef.current += 1
      setScore((s) => s + 1)
      setToast('✅ Correct!')
      advance('correct')
    } else {
      setToast(`❌ Wrong! Answer: ${challenge.answer}`)
      advance('wrong')
    }
  }

  const feedbackBg =
    feedback === 'correct'
      ? 'rgba(52,199,89,0.12)'
      : feedback === 'wrong' || feedback === 'timeout'
        ? 'rgba(255,59,48,0.10)'
        : 'var(--bg-surface)'

  const feedbackBorder =
    feedback === 'correct'
      ? 'rgba(52,199,89,0.35)'
      : feedback === 'wrong' || feedback === 'timeout'
        ? 'rgba(255,59,48,0.25)'
        : 'transparent'

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast key={toast} message={toast} onDone={() => setToast(null)} />}

      {/* Progress */}
      <ProgressBar
        current={roundIndex + 1}
        total={challenges.length}
        timeLeft={timeLeft}
        timeMax={config.timePerRound}
      />

      {/* Score chip */}
      <div className="flex items-center gap-2">
        <span
          style={{
            padding: '4px 14px',
            borderRadius: 999,
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          ✓ {score} correct
        </span>
      </div>

      {/* Morse card */}
      <div
        className="w-full flex flex-col items-center gap-5 rounded-3xl py-8 px-6"
        style={{
          background: feedbackBg,
          boxShadow: 'var(--shadow-md)',
          border: '1.5px solid',
          borderColor: feedbackBorder,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--label-tertiary)',
          }}
        >
          Decode this Morse code
        </p>

        {/* Morse visual */}
        <MorseDisplay morse={challenge.morse} />

        {/* Text representation */}
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            letterSpacing: '0.15em',
            color: 'var(--label-secondary)',
            fontWeight: 600,
          }}
        >
          {challenge.morse}
        </p>

        {/* Hint */}
        {config.showHint && (
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--label-tertiary)',
              fontStyle: 'italic',
            }}
          >
            💡 {challenge.hint}
          </p>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder={challenge.type === 'letter' ? 'Type a letter…' : 'Type the word…'}
            disabled={feedback !== null}
            maxLength={challenge.type === 'letter' ? 1 : 10}
            className="flex-1 px-4 py-3 rounded-xl border-2 text-center font-bold tracking-widest"
            style={{
              borderColor: 'var(--fill-secondary)',
              background: 'var(--bg-surface)',
              color: 'var(--label-primary)',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              opacity: feedback !== null ? 0.6 : 1,
            }}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-label="Your answer"
          />
          <button
            type="submit"
            disabled={!input.trim() || feedback !== null}
            className="btn-primary px-6"
            style={{
              opacity: !input.trim() || feedback !== null ? 0.5 : 1,
              cursor: !input.trim() || feedback !== null ? 'not-allowed' : 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      </form>

      {/* Reference chart */}
      <MorseReference />
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────────────────

export default function MorseCodeBoard() {
  const [phase, setPhase] = useState('selecting') // 'selecting' | 'playing' | 'results'
  const [difficulty, setDifficulty] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [finalScore, setFinalScore] = useState(0)

  const handleSelectDifficulty = (diff) => {
    const config = DIFFICULTIES[diff]
    const picked = pickChallenges(config.challengePool, config.rounds)
    setDifficulty(diff)
    setChallenges(picked)
    setPhase('playing')
  }

  const handleFinish = (score) => {
    setFinalScore(score)
    setPhase('results')
  }

  const handlePlayAgain = () => {
    setDifficulty(null)
    setChallenges([])
    setFinalScore(0)
    setPhase('selecting')
  }

  if (phase === 'selecting') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <DifficultySelector onSelect={handleSelectDifficulty} />
      </div>
    )
  }

  if (phase === 'results') {
    return (
      <ResultsScreen
        score={finalScore}
        total={challenges.length}
        difficulty={difficulty}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  return (
    <GameScreen
      key={`${difficulty}-${challenges.length}`}
      challenges={challenges}
      difficulty={difficulty}
      onFinish={handleFinish}
    />
  )
}
