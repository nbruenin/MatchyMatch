import { useState, useCallback, useEffect } from 'react'
import Toast from '../Toast'

const GRID_SIZE = 10
const SHIPS = [
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Destroyer', size: 2 },
  { name: 'Submarine', size: 1 },
]

function createEmptyGrid() {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null))
}

function placeShipsRandomly() {
  let grid = createEmptyGrid()

  for (const ship of SHIPS) {
    let placed = false
    while (!placed) {
      const isHorizontal = Math.random() > 0.5
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)

      if (canPlaceShip(grid, row, col, ship.size, isHorizontal)) {
        grid = placeShip(grid, row, col, ship.size, isHorizontal, ship.name)
        placed = true
      }
    }
  }

  return grid
}

function canPlaceShip(grid, row, col, size, isHorizontal) {
  if (isHorizontal) {
    if (col + size > GRID_SIZE) return false
    for (let i = 0; i < size; i++) {
      if (grid[row][col + i] !== null) return false
    }
  } else {
    if (row + size > GRID_SIZE) return false
    for (let i = 0; i < size; i++) {
      if (grid[row + i][col] !== null) return false
    }
  }
  return true
}

function placeShip(grid, row, col, size, isHorizontal, shipName) {
  const newGrid = grid.map((r) => [...r])
  if (isHorizontal) {
    for (let i = 0; i < size; i++) {
      newGrid[row][col + i] = { ship: shipName, hit: false }
    }
  } else {
    for (let i = 0; i < size; i++) {
      newGrid[row + i][col] = { ship: shipName, hit: false }
    }
  }
  return newGrid
}

export default function BattleshipBoard() {
  const [enemyGrid, setEnemyGrid] = useState(() => placeShipsRandomly())
  const [playerGrid, setPlayerGrid] = useState(createEmptyGrid())
  const [gameState, setGameState] = useState('playing') // playing, won, lost
  const [shots, setShots] = useState(0)
  const [hits, setHits] = useState(0)
  const [toast, setToast] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  const showToast = useCallback((msg) => setToast(msg), [])

  const countShipCells = useCallback((grid) => {
    let count = 0
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] !== null) count++
      }
    }
    return count
  }, [])

  const totalShipCells = countShipCells(enemyGrid)

  useEffect(() => {
    if (hits === totalShipCells && !gameOver) {
      const timer = setTimeout(() => {
        setGameState('won')
        setGameOver(true)
        showToast('🎉 You sank all enemy ships!')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [hits, totalShipCells, gameOver, showToast])

  const handleCellClick = (row, col) => {
    if (gameState !== 'playing') return
    if (playerGrid[row][col] !== null) return

    const newPlayerGrid = playerGrid.map((r) => [...r])
    const cell = enemyGrid[row][col]

    if (cell !== null) {
      newPlayerGrid[row][col] = { hit: true, ship: cell.ship }
      setHits((h) => h + 1)
      showToast('💥 Hit!')
    } else {
      newPlayerGrid[row][col] = { hit: false }
      showToast('💧 Miss!')
    }

    setPlayerGrid(newPlayerGrid)
    setShots((s) => s + 1)
  }

  const handleNewGame = () => {
    setEnemyGrid(placeShipsRandomly())
    setPlayerGrid(createEmptyGrid())
    setGameState('playing')
    setShots(0)
    setHits(0)
    setGameOver(false)
  }

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Title */}
      <div className="text-center">
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Battleship
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--label-tertiary)',
            marginTop: '0.5rem',
          }}
        >
          Find and sink all enemy ships
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 w-full justify-center flex-wrap">
        <div
          className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0a84ff',
            }}
          >
            {shots}
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
            Shots
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#34c759',
            }}
          >
            {hits}
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
            Hits
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ff9f0a',
            }}
          >
            {accuracy}%
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
            Accuracy
          </span>
        </div>
      </div>

      {/* Game Status */}
      {gameState === 'won' && (
        <div
          className="spring-pop p-6 rounded-2xl w-full text-center"
          style={{
            background: 'var(--fill-tertiary)',
            border: '2px solid #34c759',
          }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#34c759',
            }}
          >
            🎉 Victory!
          </span>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--label-secondary)',
              marginTop: '0.5rem',
            }}
          >
            You sank all enemy ships in {shots} shots!
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="w-full">
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--label-secondary)',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Enemy Waters
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '2px',
            background: 'var(--fill-tertiary)',
            padding: '8px',
            borderRadius: '8px',
            maxWidth: '100%',
            aspectRatio: '1',
          }}
        >
          {playerGrid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <button
                key={`${rowIdx}-${colIdx}`}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                disabled={gameState !== 'playing' || cell !== null}
                style={{
                  background:
                    cell === null
                      ? 'var(--fill-secondary)'
                      : cell.hit
                        ? '#34c759'
                        : '#0a84ff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor:
                    gameState === 'playing' && cell === null
                      ? 'pointer'
                      : 'default',
                  transition: 'all 0.2s ease',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cell === null ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (gameState === 'playing' && cell === null) {
                    const target = e.currentTarget
                    target.style.opacity = '1'
                  }
                }}
                onMouseLeave={(e) => {
                  if (gameState === 'playing' && cell === null) {
                    const target = e.currentTarget
                    target.style.opacity = '0.7'
                  }
                }}
              >
                {cell?.hit ? '💥' : cell ? '💧' : ''}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Ships Legend */}
      <div
        style={{
          width: '100%',
          padding: '1rem',
          background: 'var(--fill-tertiary)',
          borderRadius: '8px',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--label-tertiary)',
            marginBottom: '0.75rem',
          }}
        >
          Ships to Find
        </p>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          {SHIPS.map((ship) => (
            <div
              key={ship.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: 'var(--label-secondary)',
              }}
            >
              <span>{ship.name}</span>
              <span style={{ color: 'var(--label-tertiary)' }}>
                {ship.size} cell{ship.size > 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-full">
        <button onClick={handleNewGame} className="btn-primary flex-1">
          New Game
        </button>
      </div>
    </div>
  )
}
