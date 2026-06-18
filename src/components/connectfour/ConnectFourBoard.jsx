import { useState, useCallback } from 'react'
import Confetti from '../Confetti'

// ── Constants ─────────────────────────────────────────────────────────────────

const ROWS = 6
const COLS = 7
const EMPTY = null
const PLAYER = 'player'
const AI = 'ai'

// ── Helpers ───────────────────────────────────────────────────────────────────

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY))
}

/** Return the lowest empty row in a column, or -1 if full. */
function getDropRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r
  }
  return -1
}

/** Check if `who` has won on the given board. */
function checkWinner(board, who) {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === who &&
        board[r][c + 1] === who &&
        board[r][c + 2] === who &&
        board[r][c + 3] === who
      )
        return true
    }
  }
  // Vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      if (
        board[r][c] === who &&
        board[r + 1][c] === who &&
        board[r + 2][c] === who &&
        board[r + 3][c] === who
      )
        return true
    }
  }
  // Diagonal down-right
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === who &&
        board[r + 1][c + 1] === who &&
        board[r + 2][c + 2] === who &&
        board[r + 3][c + 3] === who
      )
        return true
    }
  }
  // Diagonal down-left
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      if (
        board[r][c] === who &&
        board[r + 1][c - 1] === who &&
        board[r + 2][c - 2] === who &&
        board[r + 3][c - 3] === who
      )
        return true
    }
  }
  return false
}

function isBoardFull(board) {
  return board[0].every((cell) => cell !== EMPTY)
}

// ── AI: minimax with alpha-beta pruning (depth 4) ─────────────────────────────

function scoreWindow(window, who) {
  const opp = who === AI ? PLAYER : AI
  const mine = window.filter((c) => c === who).length
  const empty = window.filter((c) => c === EMPTY).length
  const theirs = window.filter((c) => c === opp).length

  if (mine === 4) return 100
  if (mine === 3 && empty === 1) return 5
  if (mine === 2 && empty === 2) return 2
  if (theirs === 3 && empty === 1) return -4
  return 0
}

function scoreBoard(board, who) {
  let score = 0
  const centreCol = board.map((r) => r[Math.floor(COLS / 2)])
  score += centreCol.filter((c) => c === who).length * 3

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow(
        [board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]],
        who
      )
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      score += scoreWindow(
        [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]],
        who
      )
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow(
        [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]],
        who
      )
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      score += scoreWindow(
        [board[r][c], board[r + 1][c - 1], board[r + 2][c - 2], board[r + 3][c - 3]],
        who
      )
    }
  }
  return score
}

function minimax(board, depth, alpha, beta, maximising) {
  const aiWon = checkWinner(board, AI)
  const playerWon = checkWinner(board, PLAYER)
  if (aiWon) return { score: 1000 + depth }
  if (playerWon) return { score: -(1000 + depth) }
  if (isBoardFull(board) || depth === 0) return { score: scoreBoard(board, AI) }

  const validCols = Array.from({ length: COLS }, (_, i) => i).filter(
    (c) => getDropRow(board, c) !== -1
  )

  if (maximising) {
    let best = { score: -Infinity, col: validCols[0] }
    for (const col of validCols) {
      const row = getDropRow(board, col)
      const next = board.map((r) => [...r])
      next[row][col] = AI
      const result = minimax(next, depth - 1, alpha, beta, false)
      if (result.score > best.score) best = { score: result.score, col }
      alpha = Math.max(alpha, best.score)
      if (alpha >= beta) break
    }
    return best
  } else {
    let best = { score: Infinity, col: validCols[0] }
    for (const col of validCols) {
      const row = getDropRow(board, col)
      const next = board.map((r) => [...r])
      next[row][col] = PLAYER
      const result = minimax(next, depth - 1, alpha, beta, true)
      if (result.score < best.score) best = { score: result.score, col }
      beta = Math.min(beta, best.score)
      if (alpha >= beta) break
    }
    return best
  }
}

export function getAiMove(board) {
  const { col } = minimax(board, 4, -Infinity, Infinity, true)
  return col
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Cell({ owner, isHovered, onClick, onMouseEnter, onMouseLeave, disabled }) {
  const bg =
    owner === PLAYER
      ? 'radial-gradient(circle at 35% 35%, #ff8a80, #e53935)'
      : owner === AI
        ? 'radial-gradient(circle at 35% 35%, #80d8ff, #0288d1)'
        : isHovered
          ? 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
          : 'transparent'

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      aria-label={`cell ${owner ? `occupied by ${owner}` : 'empty'}`}
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: bg,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s ease',
        boxShadow:
          owner === PLAYER
            ? '0 3px 10px rgba(229,57,53,0.5)'
            : owner === AI
              ? '0 3px 10px rgba(2,136,209,0.5)'
              : 'none',
      }}
    />
  )
}

function StatusBadge({ turn, gameState, winner }) {
  let text, color
  if (gameState === 'won') {
    text = winner === PLAYER ? '🎉 You win!' : '🤖 AI wins!'
    color = winner === PLAYER ? '#34c759' : '#ff3b30'
  } else if (gameState === 'draw') {
    text = "🤝 It's a draw!"
    color = 'var(--label-secondary)'
  } else {
    text = turn === PLAYER ? '🔴 Your turn' : '🔵 AI thinking…'
    color = turn === PLAYER ? '#e53935' : '#0288d1'
  }

  return (
    <div
      data-testid="status-badge"
      style={{
        fontSize: '1rem',
        fontWeight: 700,
        color,
        letterSpacing: '-0.01em',
        minHeight: 28,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  )
}

function ScoreRow({ playerWins, aiWins, draws }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {[
        { label: 'You', value: playerWins, color: '#e53935' },
        { label: 'Draws', value: draws, color: 'var(--label-secondary)' },
        { label: 'AI', value: aiWins, color: '#0288d1' },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)', minWidth: 72 }}
        >
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color }}>{value}</span>
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
      ))}
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────────────────

export default function ConnectFourBoard() {
  const [board, setBoard] = useState(createBoard)
  const [turn, setTurn] = useState(PLAYER)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'won' | 'draw'
  const [winner, setWinner] = useState(null)
  const [hoveredCol, setHoveredCol] = useState(null)
  const [playerWins, setPlayerWins] = useState(0)
  const [aiWins, setAiWins] = useState(0)
  const [draws, setDraws] = useState(0)

  const resetGame = useCallback(() => {
    setBoard(createBoard())
    setTurn(PLAYER)
    setGameState('playing')
    setWinner(null)
    setHoveredCol(null)
  }, [])

  const dropDisc = useCallback(
    (col) => {
      if (gameState !== 'playing' || turn !== PLAYER) return

      const row = getDropRow(board, col)
      if (row === -1) return // column full

      const next = board.map((r) => [...r])
      next[row][col] = PLAYER

      if (checkWinner(next, PLAYER)) {
        setBoard(next)
        setGameState('won')
        setWinner(PLAYER)
        setPlayerWins((w) => w + 1)
        return
      }
      if (isBoardFull(next)) {
        setBoard(next)
        setGameState('draw')
        setDraws((d) => d + 1)
        return
      }

      // AI move — run after a short delay so the player's disc renders first
      setBoard(next)
      setTurn(AI)

      setTimeout(() => {
        const aiCol = getAiMove(next)
        const aiRow = getDropRow(next, aiCol)
        const afterAi = next.map((r) => [...r])
        afterAi[aiRow][aiCol] = AI

        if (checkWinner(afterAi, AI)) {
          setBoard(afterAi)
          setGameState('won')
          setWinner(AI)
          setAiWins((w) => w + 1)
        } else if (isBoardFull(afterAi)) {
          setBoard(afterAi)
          setGameState('draw')
          setDraws((d) => d + 1)
        } else {
          setBoard(afterAi)
          setTurn(PLAYER)
        }
      }, 300)
    },
    [board, gameState, turn]
  )

  const disabled = gameState !== 'playing' || turn !== PLAYER

  return (
    <div
      className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12"
      data-testid="connectfour-board"
    >
      {gameState === 'won' && winner === PLAYER && <Confetti />}

      {/* Title */}
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--label-primary)',
        }}
      >
        Connect Four
      </h2>

      {/* Score */}
      <ScoreRow playerWins={playerWins} aiWins={aiWins} draws={draws} />

      {/* Status */}
      <StatusBadge turn={turn} gameState={gameState} winner={winner} />

      {/* Drop buttons row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 48px)`,
          gap: 6,
        }}
      >
        {Array.from({ length: COLS }, (_, c) => (
          <button
            key={c}
            aria-label={`Drop in column ${c + 1}`}
            onClick={() => dropDisc(c)}
            onMouseEnter={() => !disabled && setHoveredCol(c)}
            onMouseLeave={() => setHoveredCol(null)}
            disabled={disabled || getDropRow(board, c) === -1}
            style={{
              width: 48,
              height: 24,
              borderRadius: 8,
              border: 'none',
              background:
                hoveredCol === c && !disabled
                  ? 'rgba(229,57,53,0.35)'
                  : 'var(--fill-tertiary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s ease',
              fontSize: '0.7rem',
              color: 'var(--label-tertiary)',
            }}
          >
            ▼
          </button>
        ))}
      </div>

      {/* Board grid */}
      <div
        data-testid="game-grid"
        style={{
          background: 'linear-gradient(145deg, #1565c0, #0d47a1)',
          borderRadius: 16,
          padding: 12,
          boxShadow: '0 12px 40px rgba(13,71,161,0.45)',
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 48px)`,
          gridTemplateRows: `repeat(${ROWS}, 48px)`,
          gap: 6,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              owner={cell}
              isHovered={hoveredCol === c && !disabled}
              onClick={() => dropDisc(c)}
              onMouseEnter={() => !disabled && setHoveredCol(c)}
              onMouseLeave={() => setHoveredCol(null)}
              disabled={disabled || getDropRow(board, c) === -1}
            />
          ))
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {gameState !== 'playing' && (
          <button onClick={resetGame} className="btn-primary">
            Play Again
          </button>
        )}
        <button onClick={resetGame} className="btn-ghost">
          🔄 New Game
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        {[
          { who: 'You', color: '#e53935', disc: '🔴' },
          { who: 'AI', color: '#0288d1', disc: '🔵' },
        ].map(({ who, color, disc }) => (
          <div key={who} className="flex items-center gap-1.5">
            <span style={{ fontSize: '1rem' }}>{disc}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color }}>{who}</span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <p
        className="text-center"
        style={{
          fontSize: '0.78rem',
          color: 'var(--label-tertiary)',
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        Click a column to drop your disc. Get four in a row — horizontally, vertically, or
        diagonally — to win!
      </p>
    </div>
  )
}
