import { useState, useEffect, useCallback, useRef } from 'react'
import Confetti from '../Confetti'

// ── Tetromino shapes ──────────────────────────────────────────────────
const SHAPES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#a000f0',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#00f000',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#f00000',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#0000f0',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#f0a000',
  },
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_SPEED = 800
const SPEED_INCREMENT = 50

// ── Helper functions ──────────────────────────────────────────────────

function createEmptyBoard() {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null))
}

function getRandomShape() {
  const shapes = Object.keys(SHAPES)
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
  return {
    shape: SHAPES[randomShape].shape,
    color: SHAPES[randomShape].color,
  }
}

function rotate(matrix) {
  const rows = matrix.length
  const cols = matrix[0].length
  const rotated = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(0))

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = matrix[r][c]
    }
  }
  return rotated
}

function checkCollision(board, piece, position) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const newRow = position.row + r
        const newCol = position.col + c

        if (
          newRow >= BOARD_HEIGHT ||
          newCol < 0 ||
          newCol >= BOARD_WIDTH ||
          (newRow >= 0 && board[newRow][newCol])
        ) {
          return true
        }
      }
    }
  }
  return false
}

function mergePieceToBoard(board, piece, position) {
  const newBoard = board.map((row) => [...row])
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const row = position.row + r
        const col = position.col + c
        if (row >= 0) {
          newBoard[row][col] = piece.color
        }
      }
    }
  }
  return newBoard
}

function clearLines(board) {
  let linesCleared = 0
  const newBoard = board.filter((row) => {
    if (row.every((cell) => cell !== null)) {
      linesCleared++
      return false
    }
    return true
  })

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null))
  }

  return { newBoard, linesCleared }
}

// ── Cell component ────────────────────────────────────────────────────

function Cell({ color }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        background: color || 'var(--fill-quaternary)',
        border: color
          ? '1px solid rgba(0, 0, 0, 0.2)'
          : '1px solid var(--fill-tertiary)',
        borderRadius: 2,
        boxShadow: color ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)' : 'none',
      }}
    />
  )
}

// ── Game Over screen ──────────────────────────────────────────────────

function GameOverScreen({ score, lines, onPlayAgain, onGoHome }) {
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
          background: 'linear-gradient(145deg, #ff3b30, #ff3b30dd)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 8px 24px #ff3b3055',
        }}
      >
        🎮
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
        <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
          Great effort!
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6 w-full justify-center">
        <div className="flex flex-col items-center gap-1">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
            }}
          >
            Score
          </p>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
            }}
          >
            {score}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
            }}
          >
            Lines
          </p>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
            }}
          >
            {lines}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <button onClick={onPlayAgain} className="btn-primary w-full">
          Play Again
        </button>
        <button onClick={onGoHome} className="btn-ghost w-full">
          Back to Games
        </button>
      </div>
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────────

export default function TetrisBoard({ onGoHome }) {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(getRandomShape())
  const [nextPiece, setNextPiece] = useState(getRandomShape())
  const [position, setPosition] = useState({
    row: 0,
    col: Math.floor(BOARD_WIDTH / 2) - 1,
  })
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'paused' | 'over'
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const gameLoopRef = useRef(null)

  // Move piece down
  const moveDown = useCallback(() => {
    const newPosition = { ...position, row: position.row + 1 }
    if (!checkCollision(board, currentPiece, newPosition)) {
      setPosition(newPosition)
    } else {
      // Lock piece
      const newBoard = mergePieceToBoard(board, currentPiece, position)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

      setBoard(clearedBoard)
      setLines((prev) => prev + linesCleared)
      setScore((prev) => prev + linesCleared * 100 + 10)

      // Speed up every 5 lines
      if (linesCleared > 0 && (lines + linesCleared) % 5 === 0) {
        setSpeed((prev) => Math.max(200, prev - SPEED_INCREMENT))
      }

      // Spawn new piece
      const newPiece = nextPiece
      const newNextPiece = getRandomShape()
      const newPosition = { row: 0, col: Math.floor(BOARD_WIDTH / 2) - 1 }

      if (checkCollision(clearedBoard, newPiece, newPosition)) {
        setGameState('over')
      } else {
        setCurrentPiece(newPiece)
        setNextPiece(newNextPiece)
        setPosition(newPosition)
      }
    }
  }, [board, currentPiece, position, nextPiece, lines])

  // Move piece left
  const moveLeft = useCallback(() => {
    const newPosition = { ...position, col: position.col - 1 }
    if (!checkCollision(board, currentPiece, newPosition)) {
      setPosition(newPosition)
    }
  }, [board, currentPiece, position])

  // Move piece right
  const moveRight = useCallback(() => {
    const newPosition = { ...position, col: position.col + 1 }
    if (!checkCollision(board, currentPiece, newPosition)) {
      setPosition(newPosition)
    }
  }, [board, currentPiece, position])

  // Rotate piece
  const rotatePiece = useCallback(() => {
    const rotatedShape = rotate(currentPiece.shape)
    const rotatedPiece = { ...currentPiece, shape: rotatedShape }
    if (!checkCollision(board, rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [board, currentPiece, position])

  // Drop piece instantly
  const dropPiece = useCallback(() => {
    const newPosition = { ...position }
    while (
      !checkCollision(board, currentPiece, {
        ...newPosition,
        row: newPosition.row + 1,
      })
    ) {
      newPosition.row++
    }
    setPosition(newPosition)
    // Trigger immediate lock
    setTimeout(() => moveDown(), 50)
  }, [board, currentPiece, position, moveDown])

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        moveLeft()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        moveRight()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveDown()
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault()
        rotatePiece()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        dropPiece()
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, moveLeft, moveRight, moveDown, rotatePiece, dropPiece])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      return
    }

    gameLoopRef.current = setInterval(() => {
      moveDown()
    }, speed)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState, speed, moveDown])

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row])

    // Add current piece to display
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[r].length; c++) {
        if (currentPiece.shape[r][c]) {
          const row = position.row + r
          const col = position.col + c
          if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
            displayBoard[row][col] = currentPiece.color
          }
        }
      }
    }

    return displayBoard
  }

  // Render next piece preview
  const renderNextPiece = () => {
    const maxSize = 4
    const preview = Array(maxSize)
      .fill(null)
      .map(() => Array(maxSize).fill(null))

    const offsetRow = Math.floor((maxSize - nextPiece.shape.length) / 2)
    const offsetCol = Math.floor((maxSize - nextPiece.shape[0].length) / 2)

    for (let r = 0; r < nextPiece.shape.length; r++) {
      for (let c = 0; c < nextPiece.shape[r].length; c++) {
        if (nextPiece.shape[r][c]) {
          preview[offsetRow + r][offsetCol + c] = nextPiece.color
        }
      }
    }

    return preview
  }

  const handlePlayAgain = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(getRandomShape())
    setNextPiece(getRandomShape())
    setPosition({ row: 0, col: Math.floor(BOARD_WIDTH / 2) - 1 })
    setScore(0)
    setLines(0)
    setGameState('playing')
    setSpeed(INITIAL_SPEED)
  }

  const togglePause = () => {
    setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'))
  }

  // ── Game Over screen ──────────────────────────────────────────────────
  if (gameState === 'over') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        <GameOverScreen
          score={score}
          lines={lines}
          onPlayAgain={handlePlayAgain}
          onGoHome={onGoHome}
        />
      </div>
    )
  }

  // ── Playing screen ────────────────────────────────────────────────────
  const displayBoard = renderBoard()
  const nextPiecePreview = renderNextPiece()

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Title */}
      <div className="flex flex-col items-center gap-2">
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Tetris
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--label-tertiary)',
            textAlign: 'center',
          }}
        >
          Stack blocks and clear lines
        </p>
      </div>

      {/* Game container */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">
        {/* Main board */}
        <div className="flex flex-col gap-4 items-center">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              gap: 1,
              background: 'var(--bg-surface)',
              padding: 'clamp(8px, 2vw, 12px)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-lg)',
              width: 'min(100%, 300px)',
            }}
          >
            {displayBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Cell key={`${rowIndex}-${colIndex}`} color={cell} />
              ))
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden flex-col gap-3 w-full max-w-xs">
            <div className="flex gap-2 justify-center">
              <button
                onClick={moveLeft}
                disabled={gameState !== 'playing'}
                className="btn-secondary px-6 py-3 text-lg"
                aria-label="Move left"
              >
                ←
              </button>
              <button
                onClick={rotatePiece}
                disabled={gameState !== 'playing'}
                className="btn-secondary px-6 py-3 text-lg"
                aria-label="Rotate"
              >
                ↻
              </button>
              <button
                onClick={moveRight}
                disabled={gameState !== 'playing'}
                className="btn-secondary px-6 py-3 text-lg"
                aria-label="Move right"
              >
                →
              </button>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={moveDown}
                disabled={gameState !== 'playing'}
                className="btn-secondary px-6 py-3 text-lg flex-1"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                onClick={dropPiece}
                disabled={gameState !== 'playing'}
                className="btn-primary px-6 py-3 text-lg flex-1"
                aria-label="Drop"
              >
                Drop
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4 w-full lg:w-auto">
          {/* Stats */}
          <div
            className="flex lg:flex-col gap-4 p-6 rounded-2xl"
            style={{
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div className="flex flex-col items-center gap-1 flex-1">
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--label-tertiary)',
                }}
              >
                Score
              </p>
              <p
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--label-primary)',
                }}
              >
                {score}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--label-tertiary)',
                }}
              >
                Lines
              </p>
              <p
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--label-primary)',
                }}
              >
                {lines}
              </p>
            </div>
          </div>

          {/* Next piece */}
          <div
            className="flex flex-col gap-3 p-6 rounded-2xl"
            style={{
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
                textAlign: 'center',
              }}
            >
              Next
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                width: 100,
                margin: '0 auto',
              }}
            >
              {nextPiecePreview.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Cell key={`next-${rowIndex}-${colIndex}`} color={cell} />
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div
            className="flex flex-col gap-3 p-6 rounded-2xl"
            style={{
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
                textAlign: 'center',
              }}
            >
              Controls
            </p>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--label-secondary)',
                lineHeight: 1.6,
              }}
            >
              <div className="hidden lg:block">
                <p>← → : Move</p>
                <p>↑ / Space : Rotate</p>
                <p>↓ : Soft drop</p>
                <p>Enter : Hard drop</p>
                <p>P : Pause</p>
              </div>
              <div className="lg:hidden text-center">
                <p>Use buttons below</p>
              </div>
            </div>
          </div>

          {/* Pause button */}
          <button onClick={togglePause} className="btn-secondary w-full">
            {gameState === 'paused' ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Pause overlay */}
      {gameState === 'paused' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={togglePause}
        >
          <div
            className="spring-pop"
            style={{
              background: 'var(--bg-surface)',
              padding: '2rem',
              borderRadius: 24,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <p
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--label-primary)',
              }}
            >
              Paused
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
