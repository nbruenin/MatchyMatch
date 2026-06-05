import { useState, useCallback, useRef, useEffect } from 'react'
import Toast from '../Toast'

// ── Roulette wheel ─────────────────────────────────────────────────

function RouletteWheel({ segments, isSpinning, rotation, onSpinComplete }) {
  const wheelRef = useRef(null)

  useEffect(() => {
    if (!isSpinning && wheelRef.current) {
      // Determine which segment is at the top (pointer position)
      const normalizedRotation = ((rotation % 360) + 360) % 360
      const segmentAngle = 360 / segments.length
      const pointerAngle = 0 // Top of wheel
      const selectedIndex = Math.round((360 - normalizedRotation) / segmentAngle) % segments.length

      if (onSpinComplete) {
        onSpinComplete(selectedIndex)
      }
    }
  }, [isSpinning, rotation, segments.length, onSpinComplete])

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer (top) */}
      <div
        style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '20px solid var(--accent)',
          zIndex: 10,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        }}
      />

      {/* Wheel */}
      <div
        ref={wheelRef}
        style={{
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `conic-gradient(${segments
            .map((seg, i) => `${seg.color} ${(i / segments.length) * 360}deg ${((i + 1) / segments.length) * 360}deg`)
            .join(', ')})`,
          boxShadow: 'var(--shadow-xl), inset 0 0 20px rgba(0,0,0,0.1)',
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'none' : 'transform 0.1s ease-out',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Center circle */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--label-primary)',
          }}
        >
          🎡
        </div>

        {/* Labels around wheel */}
        {segments.map((seg, i) => {
          const angle = (i / segments.length) * 360 + (360 / segments.length) / 2
          const radius = 110
          const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius
          const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`,
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
              }}
            >
              {seg.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Result card ────────────────────────────────────────────────────

function ResultCard({ segment, onPlayAgain }) {
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
          background: `linear-gradient(145deg, ${segment.color}, ${segment.color}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: `0 8px 24px ${segment.color}55`,
        }}
      >
        {segment.emoji}
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
          You landed on...
        </h2>
        <p
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: segment.color,
            letterSpacing: '-0.01em',
          }}
        >
          {segment.label}
        </p>
      </div>

      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--label-tertiary)',
          textAlign: 'center',
          maxWidth: 300,
        }}
      >
        {segment.description}
      </p>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Spin Again
      </button>
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────

const WHEEL_SEGMENTS = [
  { label: 'Win!', emoji: '🏆', color: '#FFD700', description: 'You won the jackpot!' },
  { label: 'Try Again', emoji: '🔄', color: '#FF6B6B', description: 'Better luck next time!' },
  { label: 'Bonus', emoji: '⭐', color: '#5AC8FA', description: 'You got a bonus!' },
  { label: 'Free Spin', emoji: '🎡', color: '#30D158', description: 'Spin one more time!' },
  { label: 'Mystery', emoji: '❓', color: '#BF5AF2', description: 'Something special awaits!' },
  { label: 'Lose', emoji: '😅', color: '#FF9F0A', description: 'Oops! Better luck next time!' },
]

export default function RouletteBoard() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [spinCount, setSpinCount] = useState(0)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => setToast(msg), [])

  const handleSpin = useCallback(() => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedSegment(null)

    // Generate random spins (multiple full rotations + final position)
    const spins = 5 + Math.random() * 5 // 5-10 full rotations
    const randomSegment = Math.floor(Math.random() * WHEEL_SEGMENTS.length)
    const segmentAngle = 360 / WHEEL_SEGMENTS.length
    const finalRotation = spins * 360 + randomSegment * segmentAngle

    // Animate the spin
    const startTime = Date.now()
    const duration = 3000 // 3 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentRotation = easeProgress * finalRotation

      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        setSpinCount((c) => c + 1)
        showToast('Spin complete! 🎉')
      }
    }

    animate()
  }, [isSpinning, showToast])

  const handlePlayAgain = () => {
    setSelectedSegment(null)
    setRotation(0)
  }

  const handleSegmentSelected = (index) => {
    setSelectedSegment(WHEEL_SEGMENTS[index])
  }

  // ── Result screen ───────────────────────────────────────────────
  if (selectedSegment) {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <ResultCard segment={selectedSegment} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  // ── Spinning screen ─────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Title */}
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
          Spin the Wheel!
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
          Spins: {spinCount}
        </p>
      </div>

      {/* Wheel */}
      <RouletteWheel
        segments={WHEEL_SEGMENTS}
        isSpinning={isSpinning}
        rotation={rotation}
        onSpinComplete={handleSegmentSelected}
      />

      {/* Spin button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="btn-primary"
        style={{
          opacity: isSpinning ? 0.6 : 1,
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          padding: '12px 32px',
        }}
      >
        {isSpinning ? '🎡 Spinning...' : '🎡 Spin the Wheel'}
      </button>

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
        Click the button to spin the wheel and see what you land on!
      </p>
    </div>
  )
}
