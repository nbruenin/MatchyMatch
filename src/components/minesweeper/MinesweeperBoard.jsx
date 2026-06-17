import { useState, useCallback, useEffect } from 'react'
import Confetti from '../Confetti'

// ── Constants ──────────────────────────────────────────────────────

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10, label: 'Easy', emoji: '🟢' },
  medium: { rows: 16, cols: 16, mines: 40, label: 'Medium', emoji: '🟡' },
  hard: { rows: 16, cols: 30, mines: 99, label: 'Hard', emoji: '🔴' },
}

const CELL_COLORS = ['', '#0a84ff', '#34c759', '#ff3b30', '#5e5ce6', '#ff453a', '#30d158', '#000', '#636366']

// ── Helpers ────────────────────────────────────────────────────────

function createEmptyGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  )
}

function placeMines(grid, rows, cols, mines, safeRow, safeCol) {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (newGrid[r][c].mine) continue
    if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue
    newGrid[r][c].mine = true
    placed++
  }
  // Calculate adjacent counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].mine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].mine) {
            count++
          }
        }
      }
      newGrid[r][c].adjacent = count
    }
  }
  return newGrid
}

function floodReveal(grid, rows, cols, startRow, startCol) {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
  const queue = [[startRow, startCol]]
  const visited = new Set()

  while (queue.length > 0) {
    const [r, c] = queue.shift()
    const key = `${r},${c}`
    if (visited.has(key)) continue
    visited.add(key)

    const cell = newGrid[r][c]
    if (cell.flagged || cell.revealed) continue
    cell.revealed = true

    if (cell.adjacent === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(`${nr},${nc}`)) {
            queue.push([nr, nc])
          }
        }
      }
    }
  }
  return newGrid
}

function countRevealed(grid) {
  return grid.flat().filter((c) => c.revealed).length
}

function countFlagged(grid) {
  return grid.flat().filter((c) => c.flagged).length
}

// ── Difficulty Selector ────────────────────────────────────────────

function DifficultySelector({ onSelect }) {
  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span style={{ fontSize: '3rem' }}>💣</span>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Minesweeper
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
          Choose your difficulty
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
                  <p style={{ fontWeight: 700, color: 'var(--label-primary)', fontSize: '1rem' }}>
                    {diff.label}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--label-tertiary)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {diff.rows}×{diff.cols} • {diff.mines} mines
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '1.25rem' }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Result Screen ──────────────────────────────────────────────────

function ResultScreen({ won, elapsed, difficulty, onPlayAgain }) {
  const diff = DIFFICULTIES[difficulty]
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {won && <Confetti />}
      <div
        className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
        style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: won
              ? 'linear-gradient(145deg, #34c759, #30d158)'
              : 'linear-gradient(145deg, #ff3b30, #ff453a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            boxShadow: won
              ? '0 8px 24px rgba(52,199,89,0.35)'
              : '0 8px 24px rgba(255,59,48,0.35)',
          }}
        >
          {won ? '🎉' : '💥'}
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
            {won ? 'You Won!' : 'Boom!'}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
            {won ? 'All mines cleared safely!' : 'You hit a mine.'}
          </p>
        </div>

        <div className="flex gap-6">
          {[
            { label: 'Difficulty', value: diff.label },
            { label: 'Time', value: timeStr },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--label-primary)',
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
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
          {won ? 'Play Again' : 'Try Again'}
        </button>
      </div>
    </div>
  )
}

// ── Game Grid ──────────────────────────────────────────────────────

function GameGrid({ grid, rows, cols, mines, gameState, elapsed, onReveal, onFlag, onChord }) {
  const flagged = countFlagged(grid)
  const remaining = mines - flagged

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const cellSize = cols > 16 ? 24 : cols > 9 ? 28 : 36

  return (
    <div className="flex flex-col items-center gap-4 w-full px-2 pb-12">
      {/* Stats bar */}
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span style={{ fontSize: '1.1rem' }}>🚩</span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: remaining < 0 ? '#ff3b30' : 'var(--label-primary)',
              minWidth: 28,
              textAlign: 'center',
            }}
          >
            {remaining}
          </span>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span style={{ fontSize: '1.1rem' }}>⏱️</span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {timeStr}
          </span>
        </div>
      </div>

      {/* Hint */}
      <p
        style={{
          fontSize: '0.72rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Left-click to reveal · Right-click to flag
      </p>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: 2,
          padding: 12,
          borderRadius: 16,
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-xl)',
          overflowX: 'auto',
          maxWidth: '100%',
        }}
      >
        {grid.flat().map((cell) => {
          const isRevealed = cell.revealed
          const isFlagged = cell.flagged
          const isMine = cell.mine
          const isExploded = gameState === 'lost' && isMine && isRevealed

          let bg = 'var(--fill-secondary)'
          let content = null
          const textColor = CELL_COLORS[cell.adjacent] || 'var(--label-primary)'

          if (isRevealed) {
            bg = isExploded ? '#ff3b30' : 'var(--fill-tertiary)'
            if (isMine) {
              content = '💣'
            } else if (cell.adjacent > 0) {
              content = cell.adjacent
            }
          } else if (isFlagged) {
            content = '🚩'
          } else if (gameState === 'lost' && isMine) {
            content = '💣'
          }

          return (
            <button
              key={`${cell.row}-${cell.col}`}
              data-testid={`cell-${cell.row}-${cell.col}`}
              onClick={() => onReveal(cell.row, cell.col)}
              onContextMenu={(e) => {
                e.preventDefault()
                onFlag(cell.row, cell.col)
              }}
              onDoubleClick={() => onChord(cell.row, cell.col)}
              disabled={isRevealed || gameState !== 'playing'}
              style={{
                width: cellSize,
                height: cellSize,
                background: bg,
                border: 'none',
                borderRadius: 4,
                cursor: isRevealed || gameState !== 'playing' ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMine || isFlagged ? cellSize * 0.55 : cellSize * 0.5,
                fontWeight: 800,
                color: textColor,
                transition: 'background 0.1s',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                padding: 0,
              }}
            >
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────

export default function MinesweeperBoard() {
  const [difficulty, setDifficulty] = useState(null)
  const [grid, setGrid] = useState(null)
  const [gameState, setGameState] = useState('selecting') // selecting | playing | won | lost
  const [minesPlaced, setMinesPlaced] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return
    const id = setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [gameState])

  const handleSelectDifficulty = useCallback((id) => {
    const diff = DIFFICULTIES[id]
    setDifficulty(id)
    setGrid(createEmptyGrid(diff.rows, diff.cols))
    setMinesPlaced(false)
    setElapsed(0)
    setGameState('playing')
  }, [])

  const handleReveal = useCallback(
    (row, col) => {
      if (gameState !== 'playing') return
      const diff = DIFFICULTIES[difficulty]

      setGrid((prev) => {
        if (prev[row][col].flagged || prev[row][col].revealed) return prev

        let current = prev
        let placed = minesPlaced

        if (!placed) {
          current = placeMines(prev, diff.rows, diff.cols, diff.mines, row, col)
          setMinesPlaced(true)
          placed = true
        }

        if (current[row][col].mine) {
          const exploded = current.map((r) =>
            r.map((c) => (c.row === row && c.col === col ? { ...c, revealed: true } : { ...c }))
          )
          setGameState('lost')
          return exploded
        }

        const revealed = floodReveal(current, diff.rows, diff.cols, row, col)
        const totalSafe = diff.rows * diff.cols - diff.mines
        if (countRevealed(revealed) >= totalSafe) {
          setGameState('won')
        }
        return revealed
      })
    },
    [gameState, difficulty, minesPlaced]
  )

  const handleFlag = useCallback(
    (row, col) => {
      if (gameState !== 'playing') return
      setGrid((prev) => {
        const cell = prev[row][col]
        if (cell.revealed) return prev
        return prev.map((r) =>
          r.map((c) =>
            c.row === row && c.col === col ? { ...c, flagged: !c.flagged } : { ...c }
          )
        )
      })
    },
    [gameState]
  )

  const handleChord = useCallback(
    (row, col) => {
      if (gameState !== 'playing') return
      const diff = DIFFICULTIES[difficulty]
      setGrid((prev) => {
        const cell = prev[row][col]
        if (!cell.revealed || cell.adjacent === 0) return prev

        let adjFlags = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr
            const nc = col + dc
            if (nr >= 0 && nr < diff.rows && nc >= 0 && nc < diff.cols) {
              if (prev[nr][nc].flagged) adjFlags++
            }
          }
        }
        if (adjFlags !== cell.adjacent) return prev

        let current = prev
        let hitMine = false
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr
            const nc = col + dc
            if (nr >= 0 && nr < diff.rows && nc >= 0 && nc < diff.cols) {
              const neighbour = current[nr][nc]
              if (!neighbour.flagged && !neighbour.revealed) {
                if (neighbour.mine) {
                  hitMine = true
                  current = current.map((r) =>
                    r.map((c) =>
                      c.row === nr && c.col === nc ? { ...c, revealed: true } : { ...c }
                    )
                  )
                } else {
                  current = floodReveal(current, diff.rows, diff.cols, nr, nc)
                }
              }
            }
          }
        }

        if (hitMine) {
          setGameState('lost')
        } else {
          const totalSafe = diff.rows * diff.cols - diff.mines
          if (countRevealed(current) >= totalSafe) {
            setGameState('won')
          }
        }
        return current
      })
    },
    [gameState, difficulty]
  )

  const handlePlayAgain = useCallback(() => {
    setDifficulty(null)
    setGrid(null)
    setMinesPlaced(false)
    setElapsed(0)
    setGameState('selecting')
  }, [])

  if (gameState === 'selecting') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <DifficultySelector onSelect={handleSelectDifficulty} />
      </div>
    )
  }

  if (gameState === 'won' || gameState === 'lost') {
    return (
      <ResultScreen
        won={gameState === 'won'}
        elapsed={elapsed}
        difficulty={difficulty}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  const diff = DIFFICULTIES[difficulty]

  return (
    <GameGrid
      grid={grid}
      rows={diff.rows}
      cols={diff.cols}
      mines={diff.mines}
      gameState={gameState}
      elapsed={elapsed}
      onReveal={handleReveal}
      onFlag={handleFlag}
      onChord={handleChord}
    />
  )
}
