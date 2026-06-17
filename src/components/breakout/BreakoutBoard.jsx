import { useState, useCallback, useRef, useEffect } from 'react'
import Toast from '../Toast'

// ── Game constants ─────────────────────────────────────────────────
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300
const PADDLE_WIDTH = 60
const PADDLE_HEIGHT = 10
const BALL_SIZE = 8
const BRICK_WIDTH = 50
const BRICK_HEIGHT = 15
const BRICK_PADDING = 5
const BRICK_COLS = 7
const BRICK_ROWS = 4
const PADDLE_SPEED = 7
const BALL_SPEED = 3

// ── Breakout game logic ────────────────────────────────────────────
function BreakoutGame() {
  const canvasRef = useRef(null)
  const [gameState, setGameState] = useState('playing') // 'playing', 'paused', 'won', 'lost'
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameData, setGameData] = useState({
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 50,
    ballVelX: BALL_SPEED,
    ballVelY: -BALL_SPEED,
    paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    bricks: initializeBricks(),
    bricksDestroyed: 0,
  })
  const keysPressed = useRef({})
  const gameLoopRef = useRef(null)
  const [toast, setToast] = useState(null)

  function initializeBricks() {
    const bricks = []
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          id: `${row}-${col}`,
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + 20,
          active: true,
          color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][row % 4],
        })
      }
    }
    return bricks
  }

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

        // Move paddle
        if (keysPressed.current['ArrowLeft'] && newData.paddleX > 0) {
          newData.paddleX -= PADDLE_SPEED
        }
        if (keysPressed.current['ArrowRight'] && newData.paddleX < CANVAS_WIDTH - PADDLE_WIDTH) {
          newData.paddleX += PADDLE_SPEED
        }

        // Move ball
        newData.ballX += newData.ballVelX
        newData.ballY += newData.ballVelY

        // Ball collision with left/right walls
        if (newData.ballX <= 0 || newData.ballX >= CANVAS_WIDTH - BALL_SIZE) {
          newData.ballVelX = -newData.ballVelX
          newData.ballX = Math.max(0, Math.min(CANVAS_WIDTH - BALL_SIZE, newData.ballX))
        }

        // Ball collision with top
        if (newData.ballY <= 0) {
          newData.ballVelY = -newData.ballVelY
          newData.ballY = 0
        }

        // Ball collision with paddle
        if (
          newData.ballY >= CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE &&
          newData.ballY <= CANVAS_HEIGHT - BALL_SIZE &&
          newData.ballX >= newData.paddleX &&
          newData.ballX <= newData.paddleX + PADDLE_WIDTH
        ) {
          newData.ballVelY = -newData.ballVelY
          newData.ballY = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE
          // Add spin based on where ball hits paddle
          const hitPos = (newData.ballX - newData.paddleX) / PADDLE_WIDTH - 0.5
          newData.ballVelX += hitPos * 2
        }

        // Ball collision with bricks
        newData.bricks.forEach((brick) => {
          if (!brick.active) return

          if (
            newData.ballX + BALL_SIZE >= brick.x &&
            newData.ballX <= brick.x + BRICK_WIDTH &&
            newData.ballY + BALL_SIZE >= brick.y &&
            newData.ballY <= brick.y + BRICK_HEIGHT
          ) {
            brick.active = false
            newData.bricksDestroyed += 1
            setScore((s) => s + 10)
            showToast('Brick destroyed! +10')

            // Determine collision side and bounce accordingly
            const overlapLeft = newData.ballX + BALL_SIZE - brick.x
            const overlapRight = brick.x + BRICK_WIDTH - newData.ballX
            const overlapTop = newData.ballY + BALL_SIZE - brick.y
            const overlapBottom = brick.y + BRICK_HEIGHT - newData.ballY

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              newData.ballVelX = -newData.ballVelX
            } else {
              newData.ballVelY = -newData.ballVelY
            }
          }
        })

        // Ball out of bounds (bottom)
        if (newData.ballY > CANVAS_HEIGHT) {
          const newLives = lives - 1
          setLives(newLives)
          if (newLives <= 0) {
            setGameState('lost')
            showToast('Game Over!')
          } else {
            showToast(`Lost a life! ${newLives} remaining`)
            // Reset ball
            newData.ballX = CANVAS_WIDTH / 2
            newData.ballY = CANVAS_HEIGHT - 50
            newData.ballVelX = BALL_SPEED
            newData.ballVelY = -BALL_SPEED
            newData.paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2
          }
        }

        // Check win condition
        if (newData.bricksDestroyed === BRICK_ROWS * BRICK_COLS) {
          setGameState('won')
          showToast('You win!')
        }

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
  }, [gameState, lives, showToast])

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

    // Draw bricks
    gameData.bricks.forEach((brick) => {
      if (brick.active) {
        ctx.fillStyle = brick.color
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT)
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        ctx.lineWidth = 1
        ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT)
      }
    })

    // Draw paddle
    ctx.fillStyle = '#5AC8FA'
    ctx.fillRect(gameData.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT)
    ctx.strokeStyle = '#0a84ff'
    ctx.lineWidth = 2
    ctx.strokeRect(gameData.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT)

    // Draw ball
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(gameData.ballX + BALL_SIZE / 2, gameData.ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#FFA500'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [gameData])

  const handlePlayAgain = () => {
    setGameState('playing')
    setScore(0)
    setLives(3)
    setGameData({
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT - 50,
      ballVelX: BALL_SPEED,
      ballVelY: -BALL_SPEED,
      paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      bricks: initializeBricks(),
      bricksDestroyed: 0,
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
              Final Score: {score}
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
              Final Score: {score}
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
          Breakout
        </h2>
        <div className="flex justify-center gap-6">
          <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
            Score: {score}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
            Lives: {lives}
          </p>
        </div>
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
        <p>Use <strong>← →</strong> arrow keys to move the paddle</p>
        <p>Destroy all bricks to win! You have 3 lives.</p>
      </div>
    </div>
  )
}

export default BreakoutGame
