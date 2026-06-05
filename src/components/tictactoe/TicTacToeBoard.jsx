import { useState, useCallback } from 'react'
import Confetti from '../Confetti'

// ── Single cell ────────────────────────────────────────────────────

function Cell({ value, onClick, disabled }) {
  const isX = value === 'X'
  const isO = value === 'O'

  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value || 'Empty cell'}
      className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        fontSize: 'clamp(2rem, 8vw, 3rem)',
        fontWeight: 700,
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: '2px solid var(--fill-tertiary)',
        color: isX ? '#007aff' : isO ? '#ff3b30' : 'var(--label-primary)',
        cursor: value !== null ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        if (value === null && !disabled) {
          e.target.style.background = 'var(--fill-secondary)'
          e.target.style.borderColor = 'var(--accent)'
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'var(--bg-surface)'
        e.target.style.borderColor = 'var(--fill-tertiary)'
      }}
    >
      {value}
    </button>
  )
}

// ── Win screen ────────────────────────────────────────────────────

function WinScreen({ winner, onPlayAgain, onGoHome }) {
  const isDraw = winner === 'draw'
  const isXWin = winner === 'X'

  const title = isDraw ? "It's a Draw!" : `${winner} Wins!`
  const emoji = isDraw ? '🤝' : isXWin ? '❌' : '⭕'
  const bgColor = isDraw ? '#636366' : isXWin ? '#007aff' : '#ff3b30'

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
          background: `linear-gradient(145deg, ${bgColor}, ${bgColor}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: `0 8px 24px ${bgColor}55`,
        }}
      >
        {emoji}
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
          {title}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
          {isDraw ? 'Great match!' : `Congratulations!`}
        </p>
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

// ── Main board ────────────────────────────────────────────────────

export default function TicTacToeBoard({ onGoHome }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'won'
  const [winner, setWinner] = useState(null)

  // Calculate winner
  const calculateWinner = useCallback((squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }, [])

  // Check for draw
  const isBoardFull = board.every((cell) => cell !== null)

  const handleCellClick = useCallback(
    (index) => {
      if (gameState !== 'playing' || board[index] !== null) return

      const newBoard = [...board]
      newBoard[index] = isXNext ? 'X' : 'O'
      setBoard(newBoard)

      const gameWinner = calculateWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        setGameState('won')
      } else if (newBoard.every((cell) => cell !== null)) {
        setWinner('draw')
        setGameState('won')
      }

      setIsXNext(!isXNext)
    },
    [board, isXNext, gameState, calculateWinner]
  )

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setGameState('playing')
    setWinner(null)
  }

  // ── Won screen ───────────────────────────────────────────────────
  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <Confetti />
        <WinScreen
          winner={winner}
          onPlayAgain={handlePlayAgain}
          onGoHome={onGoHome}
        />
      </div>
    )
  }

  // ── Playing screen ───────────────────────────────────────────────
  const currentPlayer = isXNext ? 'X' : 'O'
  const currentPlayerColor = isXNext ? '#007aff' : '#ff3b30'

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Status */}
      <div className="flex flex-col items-center gap-2">
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--label-tertiary)',
          }}
        >
          Current Player
        </p>
        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: currentPlayerColor,
            letterSpacing: '-0.03em',
          }}
        >
          {currentPlayer}
        </div>
      </div>

      {/* Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(8px, 2vw, 12px)',
          width: '100%',
          maxWidth: 300,
          aspectRatio: '1 / 1',
        }}
      >
        {board.map((value, index) => (
          <Cell
            key={index}
            value={value}
            onClick={() => handleCellClick(index)}
            disabled={gameState !== 'playing'}
          />
        ))}
      </div>

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
        {isBoardFull && gameState === 'playing'
          ? "It's a draw!"
          : `${currentPlayer}'s turn — click a cell to place your mark`}
      </p>

      {/* New game button */}
      <button onClick={handlePlayAgain} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  )
}
