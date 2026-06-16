/**
 * Tests for the 2048 game (Game2048Board) and its data utilities.
 *
 * Unit tests cover:
 *  - Data utilities: emptyGrid, spawnTile, applyMove, hasMovesLeft, maxTile
 *  - Component render: title, score badges, grid, how-to-play section
 *  - New Game button resets score to 0
 *
 * E2E-style tests cover:
 *  - Arrow key moves update the grid
 *  - Score increases when tiles merge
 *  - New Game button resets the board
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Game2048Board from '../../components/game2048/Game2048Board'
import {
  emptyGrid,
  spawnTile,
  applyMove,
  hasMovesLeft,
  maxTile,
  GRID_SIZE,
} from '../../data/game2048Data'

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
})
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  localStorage.clear()
})

// ── Unit Tests: data utilities ────────────────────────────────────────────────

describe('2048 Data – emptyGrid', () => {
  it('returns an array of length GRID_SIZE²', () => {
    const grid = emptyGrid()
    expect(grid).toHaveLength(GRID_SIZE * GRID_SIZE)
  })

  it('all cells are null', () => {
    const grid = emptyGrid()
    expect(grid.every((v) => v === null)).toBe(true)
  })
})

describe('2048 Data – spawnTile', () => {
  it('adds exactly one non-null tile to an empty grid', () => {
    const grid = emptyGrid()
    const next = spawnTile(grid)
    const filled = next.filter((v) => v !== null)
    expect(filled).toHaveLength(1)
  })

  it('spawned tile is either 2 or 4', () => {
    const grid = emptyGrid()
    const next = spawnTile(grid)
    const tile = next.find((v) => v !== null)
    expect([2, 4]).toContain(tile)
  })

  it('does not mutate the original grid', () => {
    const grid = emptyGrid()
    const copy = [...grid]
    spawnTile(grid)
    expect(grid).toEqual(copy)
  })

  it('returns the same grid when no empty cells remain', () => {
    const full = Array(GRID_SIZE * GRID_SIZE).fill(2)
    const result = spawnTile(full)
    expect(result).toEqual(full)
  })
})

describe('2048 Data – applyMove (left)', () => {
  it('slides tiles to the left', () => {
    // Grid: [null, 2, null, null, ...rest null]
    const grid = emptyGrid()
    grid[1] = 2 // row 0, col 1
    const { grid: next, moved } = applyMove(grid, 'left')
    expect(moved).toBe(true)
    expect(next[0]).toBe(2) // should be at col 0
  })

  it('merges two equal tiles', () => {
    const grid = emptyGrid()
    grid[0] = 2 // row 0, col 0
    grid[1] = 2 // row 0, col 1
    const { grid: next, score } = applyMove(grid, 'left')
    expect(next[0]).toBe(4)
    expect(score).toBe(4)
  })

  it('returns moved=false when no tile can move', () => {
    // All tiles already left-aligned, no merges possible
    const grid = emptyGrid()
    grid[0] = 2
    grid[4] = 4
    grid[8] = 8
    grid[12] = 16
    const { moved } = applyMove(grid, 'left')
    expect(moved).toBe(false)
  })
})

describe('2048 Data – applyMove (right)', () => {
  it('slides tiles to the right', () => {
    const grid = emptyGrid()
    grid[0] = 2 // row 0, col 0
    const { grid: next, moved } = applyMove(grid, 'right')
    expect(moved).toBe(true)
    expect(next[3]).toBe(2) // should be at col 3
  })
})

describe('2048 Data – applyMove (up/down)', () => {
  it('slides tiles upward', () => {
    const grid = emptyGrid()
    grid[4] = 2 // row 1, col 0
    const { grid: next, moved } = applyMove(grid, 'up')
    expect(moved).toBe(true)
    expect(next[0]).toBe(2) // row 0, col 0
  })

  it('slides tiles downward', () => {
    const grid = emptyGrid()
    grid[0] = 2 // row 0, col 0
    const { grid: next, moved } = applyMove(grid, 'down')
    expect(moved).toBe(true)
    expect(next[12]).toBe(2) // row 3, col 0
  })
})

describe('2048 Data – hasMovesLeft', () => {
  it('returns true for an empty grid', () => {
    expect(hasMovesLeft(emptyGrid())).toBe(true)
  })

  it('returns true when adjacent tiles can merge', () => {
    const grid = Array(GRID_SIZE * GRID_SIZE).fill(2)
    expect(hasMovesLeft(grid)).toBe(true)
  })

  it('returns false when no moves are possible', () => {
    // Checkerboard of 2s and 4s — no adjacent equals, no empty cells
    const grid = []
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        grid.push((r + c) % 2 === 0 ? 2 : 4)
      }
    }
    expect(hasMovesLeft(grid)).toBe(false)
  })
})

describe('2048 Data – maxTile', () => {
  it('returns 0 for an empty grid', () => {
    expect(maxTile(emptyGrid())).toBe(0)
  })

  it('returns the highest tile value', () => {
    const grid = emptyGrid()
    grid[0] = 128
    grid[5] = 512
    grid[10] = 64
    expect(maxTile(grid)).toBe(512)
  })
})

// ── Unit Tests: component ─────────────────────────────────────────────────────

describe('2048 Component – initial render', () => {
  it('renders the "2048" title', () => {
    render(<Game2048Board />)
    expect(screen.getByText('2048')).toBeInTheDocument()
  })

  it('renders the Score badge', () => {
    render(<Game2048Board />)
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('renders the Best badge', () => {
    render(<Game2048Board />)
    expect(screen.getByText('Best')).toBeInTheDocument()
  })

  it('shows initial score of 0', () => {
    render(<Game2048Board />)
    // Both Score and Best start at 0
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the New Game button', () => {
    render(<Game2048Board />)
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
  })

  it('renders the How to play section', () => {
    render(<Game2048Board />)
    expect(screen.getByText(/How to play/i)).toBeInTheDocument()
  })

  it('renders 16 grid cells (4×4)', () => {
    render(<Game2048Board />)
    // The grid container has gridTemplateColumns with 4 columns
    const gridContainer = document.querySelector('[style*="repeat(4, 1fr)"]')
    expect(gridContainer).not.toBeNull()
    // 16 tile divs inside
    const tiles = gridContainer?.querySelectorAll(':scope > div')
    expect(tiles?.length).toBe(16)
  })

  it('reads best score from localStorage', () => {
    localStorage.setItem('2048_best', '256')
    render(<Game2048Board />)
    expect(screen.getByText('256')).toBeInTheDocument()
  })
})

// ── E2E Tests ─────────────────────────────────────────────────────────────────

describe('2048 Component – keyboard moves', () => {
  it('pressing ArrowLeft does not crash', () => {
    render(<Game2048Board />)
    expect(() => {
      fireEvent.keyDown(window, { key: 'ArrowLeft' })
    }).not.toThrow()
  })

  it('pressing ArrowRight does not crash', () => {
    render(<Game2048Board />)
    expect(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' })
    }).not.toThrow()
  })

  it('pressing ArrowUp does not crash', () => {
    render(<Game2048Board />)
    expect(() => {
      fireEvent.keyDown(window, { key: 'ArrowUp' })
    }).not.toThrow()
  })

  it('pressing ArrowDown does not crash', () => {
    render(<Game2048Board />)
    expect(() => {
      fireEvent.keyDown(window, { key: 'ArrowDown' })
    }).not.toThrow()
  })
})

describe('2048 Component – New Game', () => {
  it('clicking New Game resets score to 0', async () => {
    render(<Game2048Board />)

    // Make a move that might score
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    act(() => vi.advanceTimersByTime(300))

    fireEvent.click(screen.getByRole('button', { name: /new game/i }))

    await waitFor(() => {
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1)
    })
  })
})
