import { useState, useEffect, useRef } from 'react'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 10
const BALL_SIZE = 10
const PADDLE_SPEED = 6
const BALL_SPEED = 5

export default function PongBoard() {
  const canvasRef = useRef(null)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'paused' | 'won'
  const [score, setScore] = useState({ player: 0, ai: 0 })
  const [gameKey, setGameKey] = useState(0)

  const gameStateRef = useRef({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVelX: BALL_SPEED,
    ballVelY: BALL_SPEED,
    playerScore: 0,
    aiScore: 0,
    keysPressed: {},
  })

  const gameLoopRef = useRef(null)

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      gameStateRef.current.keysPressed[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e) => {
      gameStateRef.current.keysPressed[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const gameLoop = () => {
      const state = gameStateRef.current

      // Update player paddle
      if (gameStateRef.current.keysPressed['w'] || gameStateRef.current.keysPressed['arrowup']) {
        state.playerY = Math.max(0, state.playerY - PADDLE_SPEED)
      }
      if (gameStateRef.current.keysPressed['s'] || gameStateRef.current.keysPressed['arrowdown']) {
        state.playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.playerY + PADDLE_SPEED)
      }

      // Update AI paddle (simple AI)
      const aiCenter = state.aiY + PADDLE_HEIGHT / 2
      const ballCenter = state.ballY
      if (aiCenter < ballCenter - 35) {
        state.aiY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.aiY + PADDLE_SPEED * 0.8)
      } else if (aiCenter > ballCenter + 35) {
        state.aiY = Math.max(0, state.aiY - PADDLE_SPEED * 0.8)
      }

      // Update ball position
      state.ballX += state.ballVelX
      state.ballY += state.ballVelY

      // Ball collision with top/bottom
      if (state.ballY - BALL_SIZE / 2 <= 0 || state.ballY + BALL_SIZE / 2 >= CANVAS_HEIGHT) {
        state.ballVelY = -state.ballVelY
        state.ballY = Math.max(BALL_SIZE / 2, Math.min(CANVAS_HEIGHT - BALL_SIZE / 2, state.ballY))
      }

      // Ball collision with paddles
      // Player paddle (left)
      if (
        state.ballX - BALL_SIZE / 2 <= PADDLE_WIDTH &&
        state.ballY >= state.playerY &&
        state.ballY <= state.playerY + PADDLE_HEIGHT
      ) {
        state.ballVelX = -state.ballVelX
        state.ballX = PADDLE_WIDTH + BALL_SIZE / 2
        // Add spin based on where ball hits paddle
        const hitPos = (state.ballY - state.playerY) / PADDLE_HEIGHT - 0.5
        state.ballVelY += hitPos * 3
      }

      // AI paddle (right)
      if (
        state.ballX + BALL_SIZE / 2 >= CANVAS_WIDTH - PADDLE_WIDTH &&
        state.ballY >= state.aiY &&
        state.ballY <= state.aiY + PADDLE_HEIGHT
      ) {
        state.ballVelX = -state.ballVelX
        state.ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE / 2
        // Add spin based on where ball hits paddle
        const hitPos = (state.ballY - state.aiY) / PADDLE_HEIGHT - 0.5
        state.ballVelY += hitPos * 3
      }

      // Ball out of bounds
      if (state.ballX < 0) {
        state.aiScore++
        setScore({ player: state.playerScore, ai: state.aiScore })
        resetBall(state)
      } else if (state.ballX > CANVAS_WIDTH) {
        state.playerScore++
        setScore({ player: state.playerScore, ai: state.aiScore })
        resetBall(state)
      }

      // Check win condition
      if (state.playerScore >= 5) {
        setGameState('won')
        return
      }

      // Draw
      ctx.fillStyle = 'var(--bg-primary)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Center line
      ctx.strokeStyle = 'var(--label-tertiary)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(CANVAS_WIDTH / 2, 0)
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
      ctx.stroke()
      ctx.setLineDash([])

      // Player paddle
      ctx.fillStyle = '#0a84ff'
      ctx.fillRect(0, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)

      // AI paddle
      ctx.fillStyle = '#ff3b30'
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT)

      // Ball
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(state.ballX, state.ballY, BALL_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState])

  const resetBall = (state) => {
    state.ballX = CANVAS_WIDTH / 2
    state.ballY = CANVAS_HEIGHT / 2
    state.ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
    state.ballVelY = BALL_SPEED * (Math.random() - 0.5) * 2
  }

  const handlePlayAgain = () => {
    gameStateRef.current = {
      playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVelX: BALL_SPEED,
      ballVelY: BALL_SPEED,
      playerScore: 0,
      aiScore: 0,
      keysPressed: {},
    }
    setScore({ player: 0, ai: 0 })
    setGameState('playing')
    setGameKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Title */}
      <div className="text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: 'var(--label-primary)' }}
        >
          🏓 Pong
        </h2>
        <p style={{ color: 'var(--label-secondary)', fontSize: '0.9rem' }}>
          Use W/S or Arrow Keys to move your paddle. First to 5 points wins!
        </p>
      </div>

      {/* Score display */}
      <div className="flex gap-8 justify-center">
        <div className="flex flex-col items-center gap-1">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--label-tertiary)' }}>
            You
          </span>
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0a84ff',
              letterSpacing: '-0.03em',
            }}
          >
            {score.player}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--label-tertiary)' }}>
            AI
          </span>
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ff3b30',
              letterSpacing: '-0.03em',
            }}
          >
            {score.ai}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          aspectRatio: '2 / 1',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--bg-primary)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Win screen */}
      {gameState === 'won' && (
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
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
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--label-primary)' }}>
              You Won!
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
              Final Score: {score.player} - {score.ai}
            </p>
          </div>

          <button onClick={handlePlayAgain} className="btn-primary w-full">
            Play Again
          </button>
        </div>
      )}

      {/* Instructions */}
      {gameState === 'playing' && (
        <p
          className="text-center"
          style={{ fontSize: '0.78rem', color: 'var(--label-tertiary)', letterSpacing: '-0.01em', maxWidth: 300 }}
        >
          Move your paddle (blue) to hit the ball. Avoid letting the AI (red) score 5 points before you do!
        </p>
      )}
    </div>
  )
}
