import { useState, useEffect, useRef, useCallback } from 'react'
import Confetti from '../Confetti'

// ── Constants ─────────────────────────────────────────────────────

const PROMPTS = [
  'The quick brown fox jumps over the lazy dog near the river bank.',
  'Pack my box with five dozen liquor jugs before the storm arrives.',
  'How vexingly quick daft zebras jump over the sleeping panther.',
  'The five boxing wizards jump quickly past the old wooden fence.',
  'Bright vixens jump dozing fowl quack and the lazy cat watches.',
  'Sphinx of black quartz judge my vow and let the journey begin.',
  'Two driven jocks help fax my big quiz to the waiting professor.',
  'The job requires extra pluck and zeal from every young wizard.',
  'A wizard quickly jinxed the gnomes before they vaporized everything.',
  'We promptly judged antique ivory buckles for the next prize show.',
]

const DURATION_SECONDS = 30

function getRating(wpm) {
  if (wpm >= 80) return { emoji: '🚀', label: 'Blazing Fast!',     color: '#bf5af2' }
  if (wpm >= 60) return { emoji: '⚡', label: 'Excellent!',         color: '#ffd60a' }
  if (wpm >= 40) return { emoji: '🌟', label: 'Great!',             color: '#34c759' }
  if (wpm >= 20) return { emoji: '👍', label: 'Good',               color: '#007aff' }
  return               { emoji: '🐢', label: 'Keep Practicing!',   color: '#ff9f0a' }
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

function ResultsScreen({ wpm, accuracy, correctChars, totalChars, onPlayAgain }) {
  const rating = getRating(wpm)
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
          {DURATION_SECONDS}-second typing test complete
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-wrap justify-center">
        <StatPill label="WPM" value={wpm} />
        <StatPill label="Accuracy" value={`${accuracy}%`} />
        <StatPill label="Chars" value={`${correctChars}/${totalChars}`} />
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  )
}

// ── Prompt display with per-character colouring ───────────────────

function PromptDisplay({ prompt, typed }) {
  return (
    <div
      aria-label="typing prompt"
      style={{
        fontFamily: 'monospace',
        fontSize: '1.05rem',
        lineHeight: 1.8,
        letterSpacing: '0.03em',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        background: 'var(--fill-tertiary)',
        userSelect: 'none',
        wordBreak: 'break-word',
      }}
    >
      {prompt.split('').map((char, i) => {
        let color = 'var(--label-tertiary)'
        if (i < typed.length) {
          color = typed[i] === char ? '#34c759' : '#ff3b30'
        } else if (i === typed.length) {
          color = 'var(--label-primary)'
        }
        return (
          <span
            key={i}
            style={{
              color,
              borderBottom: i === typed.length ? '2px solid var(--accent)' : 'none',
              transition: 'color 0.08s ease',
            }}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────

export default function TypingSpeedBoard() {
  // 'idle' | 'playing' | 'done'
  const [phase, setPhase] = useState('idle')
  const [prompt, setPrompt] = useState('')
  const [typed, setTyped] = useState('')
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)

  const inputRef = useRef(null)
  const intervalRef = useRef(null)

  const pickPrompt = useCallback(() => {
    return PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
  }, [])

  // Focus the hidden input whenever we enter playing phase
  useEffect(() => {
    if (phase === 'playing' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [phase])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'playing') return
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [phase])

  // When time hits 0, finish the game
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) {
      finishGame()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase])

  const finishGame = useCallback(() => {
    clearInterval(intervalRef.current)
    setPhase('done')
  }, [])

  const handleStart = () => {
    const p = pickPrompt()
    setPrompt(p)
    setTyped('')
    setTimeLeft(DURATION_SECONDS)
    setWpm(0)
    setAccuracy(100)
    setCorrectChars(0)
    setTotalChars(0)
    setPhase('playing')
  }

  const handleInput = (e) => {
    if (phase !== 'playing') return
    const value = e.target.value

    // Don't allow typing past the prompt length
    if (value.length > prompt.length) return

    setTyped(value)

    // Compute live WPM: words = correct chars / 5
    const elapsed = DURATION_SECONDS - timeLeft
    const correct = value.split('').filter((ch, i) => ch === prompt[i]).length
    const liveWpm = elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0
    setWpm(liveWpm)

    // Accuracy
    const total = value.length
    const acc = total > 0 ? Math.round((correct / total) * 100) : 100
    setAccuracy(acc)
    setCorrectChars(correct)
    setTotalChars(total)

    // Finished the prompt early
    if (value.length === prompt.length) {
      finishGame()
    }
  }

  const handlePlayAgain = () => {
    setPhase('idle')
    setTyped('')
    setWpm(0)
    setAccuracy(100)
    setCorrectChars(0)
    setTotalChars(0)
  }

  // Timer colour
  const timerColor =
    timeLeft > 10 ? '#34c759' : timeLeft > 5 ? '#ff9f0a' : '#ff3b30'

  // ── Done screen ──────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <ResultsScreen
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          totalChars={totalChars}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    )
  }

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
          Typing Speed
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)', marginTop: '0.4rem' }}>
          Type the prompt as fast and accurately as you can
        </p>
      </div>

      {/* ── Idle ── */}
      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div
            style={{
              padding: '2rem',
              borderRadius: '1.5rem',
              background: 'var(--fill-tertiary)',
              textAlign: 'center',
              maxWidth: 360,
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⌨️</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--label-secondary)', lineHeight: 1.6 }}>
              You have <strong>{DURATION_SECONDS} seconds</strong> to type the prompt.
              Your score is measured in <strong>WPM</strong> (words per minute) and{' '}
              <strong>accuracy</strong>. Finish the prompt early to stop the clock!
            </p>
          </div>
          <button onClick={handleStart} className="btn-primary" style={{ minWidth: 160 }}>
            Start Game
          </button>
        </div>
      )}

      {/* ── Playing ── */}
      {phase === 'playing' && (
        <div className="flex flex-col gap-5 w-full">
          {/* Stats row */}
          <div className="flex gap-3 justify-center flex-wrap">
            {/* Timer pill */}
            <div
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
              style={{ background: 'var(--fill-tertiary)', minWidth: 80 }}
            >
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: timerColor,
                  letterSpacing: '-0.02em',
                  transition: 'color 0.3s ease',
                }}
              >
                {timeLeft}s
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
                Time
              </span>
            </div>
            <StatPill label="WPM" value={wpm} />
            <StatPill label="Accuracy" value={`${accuracy}%`} />
          </div>

          {/* Prompt */}
          <PromptDisplay prompt={prompt} typed={typed} />

          {/* Input */}
          <input
            ref={inputRef}
            aria-label="typing input"
            value={typed}
            onChange={handleInput}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '2px solid var(--separator)',
              background: 'var(--bg-surface)',
              color: 'var(--label-primary)',
              fontFamily: 'monospace',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--separator)')}
            placeholder="Start typing here…"
          />

          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: 6,
              borderRadius: 3,
              background: 'var(--fill-tertiary)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${prompt.length > 0 ? (typed.length / prompt.length) * 100 : 0}%`,
                height: '100%',
                borderRadius: 3,
                background: 'var(--accent)',
                transition: 'width 0.1s ease',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--label-tertiary)',
              textAlign: 'center',
              marginTop: '-0.5rem',
            }}
          >
            {typed.length} / {prompt.length} characters
          </p>
        </div>
      )}
    </div>
  )
}
