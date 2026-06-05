import { useState, useCallback, useRef, useEffect } from 'react'
import Toast from '../Toast'

// ── Game constants ─────────────────────────────────────────────────
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 60
const BALL_SIZE = 8
const PADDLE_SPEED = 6
const BALL_SPEED = 4

// ── Pong game logic ────────────────────────────────────────────────
function PongGame() {
  const canvasRef = useRef(null)
  const [gameState, setGameState] = useState('playing') // 'playing', 'paused', 'won', 'lost'
  const [score, setScore] = useState(0)
  const [gameData, setGameData] = useState({
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVelX: BALL_SPEED,
    ballVelY: BALL_SPEED,
    paddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiPaddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    playerScore: 0,
    aiScore: 0,
  })
  const keysPressed = useRef({})
  const gameLoopRef = useRef(null)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => setToast(msg), [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true
    }
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false
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

    const gameLoop = () => {
      setGameData((prevData) => {
        let newData = { ...prevData }

        // Move player paddle
        if (keysPressed.current['ArrowUp'] && newData.paddleY > 0) {
          newData.paddleY -= PADDLE_SPEED
        }
        if (keysPressed.current['ArrowDown'] && newData.paddleY < CANVAS_HEIGHT - PADDLE_HEIGHT) {
          newData.paddleY += PADDLE_SPEED
        }

        // AI paddle movement (simple AI)
        const aiCenter = newData.aiPaddleY + PADDLE_HEIGHT / 2
        const ballCenter = newData.ballY
        if (aiCenter < ballCenter - 10 && newData.aiPaddleY < CANVAS_HEIGHT - PADDLE_HEIGHT) {
          newData.aiPaddleY += PADDLE_SPEED * 0.8
        } else if (aiCenter > ballCenter + 10 && newData.aiPaddleY > 0) {
          newData.aiPaddleY -= PADDLE_SPEED * 0.8
        }

        // Move ball
        newData.ballX += newData.ballVelX
        newData.ballY += newData.ballVelY

        // Ball collision with top/bottom
        if (newData.ballY <= 0 || newData.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
          newData.ballVelY = -newData.ballVelY
          newData.ballY = Math.max(0, Math.min(CANVAS_HEIGHT - BALL_SIZE, newData.ballY))
        }

        // Ball collision with paddles
        // Player paddle (left)
        if (
          newData.ballX <= PADDLE_WIDTH &&
          newData.ballY >= newData.paddleY &&
          newData.ballY <= newData.paddleY + PADDLE_HEIGHT
        ) {
          newData.ballVelX = -newData.ballVelX
          newData.ballX = PADDLE_WIDTH
          // Add spin based on where ball hits paddle
          const hitPos = (newData.ballY - newData.paddleY) / PADDLE_HEIGHT - 0.5
          newData.ballVelY += hitPos * 3
        }

        // AI paddle (right)
        if (
          newData.ballX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newData.ballY >= newData.aiPaddleY &&
          newData.ballY <= newData.aiPaddleY + PADDLE_HEIGHT
        ) {
          newData.ballVelX = -newData.ballVelX
          newData.ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE
          const hitPos = (newData.ballY - newData.aiPaddleY) / PADDLE_HEIGHT - 0.5
          newData.ballVelY += hitPos * 3
        }

        // Ball out of bounds (scoring)
        if (newData.ballX < 0) {
          newData.aiScore += 1
          if (newData.aiScore >= 5) {
            setGameState('lost')
            showToast('Game Over! AI wins!')
          }
          // Reset ball
          newData.ballX = CANVAS_WIDTH / 2
          newData.ballY = CANVAS_HEIGHT / 2
          newData.ballVelX = BALL_SPEED
          newData.ballVelY = BALL_SPEED
        } else if (newData.ballX > CANVAS_WIDTH) {
          newData.playerScore += 1
          if (newData.playerScore >= 5) {
            setGameState('won')
            showToast('You win!')
          }
          // Reset ball
          newData.ballX = CANVAS_WIDTH / 2
          newData.ballY = CANVAS_HEIGHT / 2
          newData.ballVelX = -BALL_SPEED
          newData.ballVelY = BALL_SPEED
        }

        setScore(newData.playerScore)
        return newData
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, showToast])

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim()
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--label-primary').trim()

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw center line
    ctx.strokeStyle = textColor
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, 0)
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw paddles
    ctx.fillStyle = '#5AC8FA'
    ctx.fillRect(0, gameData.paddleY, PADDLE_WIDTH, PADDLE_HEIGHT)

    ctx.fillStyle = '#FF6B6B'
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, gameData.aiPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT)

    // Draw ball
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(gameData.ballX + BALL_SIZE / 2, gameData.ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
  }, [gameData])

  const handlePlayAgain = () => {
    setGameState('playing')
    setScore(0)
    setGameData({
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVelX: BALL_SPEED,
      ballVelY: BALL_SPEED,
      paddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiPaddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      playerScore: 0,
      aiScore: 0,
    })
  }

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
            🏆
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
              You Win!
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--label-tertiary)',
                letterSpacing: '-0.01em',
              }}
            >
              Final Score: {gameData.playerScore} - {gameData.aiScore}
            </p>
          </div>

          <button onClick={handlePlayAgain} className="btn-primary w-full">
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
              Final Score: {gameData.playerScore} - {gameData.aiScore}
            </p>
          </div>

          <button onClick={handlePlayAgain} className="btn-primary w-full">
            Try Again
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
          Pong
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
          You: {gameData.playerScore} - AI: {gameData.aiScore}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: '2px solid var(--accent)',
          borderRadius: 8,
          background: 'var(--bg-primary)',
        }}
      />

      <div
        className="text-center"
        style={{
          fontSize: '0.85rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '-0.01em',
          maxWidth: 300,
        }}
      >
        <p>Use <strong>↑ ↓</strong> arrow keys to move your paddle</p>
        <p>First to 5 points wins!</p>
      </div>
    </div>
  )
}

export default PongGame
