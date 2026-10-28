/**
 * Tests for the Sliding Puzzle game
 *
 * Unit tests (slidingPuzzleLogic):
 *  - Solved board layout and solved detection
 *  - Legal / illegal move detection and applying moves
 *  - Shuffling produces a valid, non-solved permutation
 *
 * Component tests (SlidingPuzzleBoard):
 *  - Initial render: title, stats, 15 tiles, blank space, New Game button
 *  - Clicking a tile next to the gap moves it and counts a move
 *  - Clicking a non-adjacent tile does nothing
 *  - Arrow keys slide tiles
 *  - Solving the puzzle shows the win screen with moves and time
 *  - New Game resets the move counter and timer
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SlidingPuzzleBoard from '../../components/slidingpuzzle/SlidingPuzzleBoard'
import * as logic from '../../utils/slidingPuzzleLogic'

vi.mock('../../utils/slidingPuzzleLogic', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    shuffleBoard: vi.fn((...args) => actual.shuffleBoard(...args)),
  }
})

const {
  createSolvedBoard,
  isSolved,
  canMove,
  applyMove,
  shuffleBoard,
  findBlankIndex,
} = logic

// Blank at index 14 (row 3, col 2), tile 15 at index 15 -> one move
// (tile 15 slides left into the gap) from solved.
const ONE_MOVE_FROM_SOLVED = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15,
]

describe('SlidingPuzzle – Unit: logic', () => {
  it('creates the solved board 1..15 with blank last', () => {
    expect(createSolvedBoard(4)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
    ])
  })

  it('detects a solved board', () => {
    expect(isSolved(createSolvedBoard(4))).toBe(true)
    expect(isSolved(ONE_MOVE_FROM_SOLVED)).toBe(false)
  })

  it('allows only orthogonally adjacent tiles to move into the blank', () => {
    // blank at index 14 (row 3, col 2)
    expect(canMove(ONE_MOVE_FROM_SOLVED, 15)).toBe(true) // right neighbour
    expect(canMove(ONE_MOVE_FROM_SOLVED, 13)).toBe(true) // left neighbour
    expect(canMove(ONE_MOVE_FROM_SOLVED, 10)).toBe(true) // top neighbour
    expect(canMove(ONE_MOVE_FROM_SOLVED, 12)).toBe(false) // two away
    expect(canMove(ONE_MOVE_FROM_SOLVED, 9)).toBe(false) // diagonal
    expect(canMove(ONE_MOVE_FROM_SOLVED, 14)).toBe(false) // the blank itself
  })

  it('applyMove swaps the tile with the blank', () => {
    const next = applyMove(ONE_MOVE_FROM_SOLVED, 15)
    expect(next).toEqual(createSolvedBoard(4))
    expect(isSolved(next)).toBe(true)
  })

  it('applyMove returns null for an illegal move', () => {
    expect(applyMove(ONE_MOVE_FROM_SOLVED, 0)).toBeNull()
  })

  it('applyMove does not mutate the original board', () => {
    const copy = ONE_MOVE_FROM_SOLVED.slice()
    applyMove(ONE_MOVE_FROM_SOLVED, 15)
    expect(ONE_MOVE_FROM_SOLVED).toEqual(copy)
  })

  it('shuffleBoard returns a valid permutation that is not solved', () => {
    const board = shuffleBoard(4)
    expect([...board].sort((a, b) => a - b)).toEqual(
      createSolvedBoard(4)
        .slice()
        .sort((a, b) => a - b)
    )
    expect(isSolved(board)).toBe(false)
    expect(findBlankIndex(board)).toBeGreaterThanOrEqual(0)
  })

  it('shuffleBoard is deterministic for a given random source', () => {
    const seq = [0.1, 0.5, 0.9, 0.3, 0.7, 0.2, 0.8, 0.4]
    const make = () => {
      let i = 0
      return () => seq[i++ % seq.length]
    }
    expect(shuffleBoard(4, 50, make())).toEqual(shuffleBoard(4, 50, make()))
  })
})

describe('SlidingPuzzle – Unit: initial render', () => {
  beforeEach(() => {
    shuffleBoard.mockReturnValueOnce(ONE_MOVE_FROM_SOLVED.slice())
  })

  it('shows the game title', () => {
    render(<SlidingPuzzleBoard />)
    expect(screen.getByText('Sliding Puzzle')).toBeInTheDocument()
  })

  it('shows zero moves and a 0:00 timer initially', () => {
    render(<SlidingPuzzleBoard />)
    expect(screen.getByText('0:00')).toBeInTheDocument()
    expect(screen.getByText('Moves')).toBeInTheDocument()
  })

  it('renders 15 numbered tiles and one empty space', () => {
    render(<SlidingPuzzleBoard />)
    const tiles = screen.getAllByRole('button', { name: /^Tile \d+$/ })
    expect(tiles).toHaveLength(15)
    expect(screen.getByLabelText('Empty space')).toBeInTheDocument()
  })

  it('shows a New Game button', () => {
    render(<SlidingPuzzleBoard />)
    expect(
      screen.getByRole('button', { name: /new game/i })
    ).toBeInTheDocument()
  })
})

describe('SlidingPuzzle – E2E: gameplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    shuffleBoard.mockReturnValueOnce(ONE_MOVE_FROM_SOLVED.slice())
  })

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers()
    })
    vi.useRealTimers()
  })

  // The "Moves" stat is the StatBox sibling of the "Moves" label
  const movesValue = () =>
    screen.getByText('Moves').previousElementSibling.textContent

  it('moving a tile next to the gap increments the move counter', () => {
    render(<SlidingPuzzleBoard />)
    fireEvent.click(screen.getByRole('button', { name: 'Tile 15' }))
    expect(movesValue()).toBe('1')
  })

  it('clicking a tile that is not next to the gap does nothing', () => {
    render(<SlidingPuzzleBoard />)
    const blocked = screen.getByRole('button', { name: 'Tile 1' })
    expect(blocked).toBeDisabled()
    fireEvent.click(blocked)
    expect(movesValue()).toBe('0')
  })

  it('solving the puzzle shows the win screen', () => {
    render(<SlidingPuzzleBoard />)
    fireEvent.click(screen.getByRole('button', { name: 'Tile 15' }))
    expect(screen.getByText(/Solved!/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /play again/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /new game/i })
    ).not.toBeInTheDocument()
  })

  it('arrow keys slide a tile into the gap', () => {
    render(<SlidingPuzzleBoard />)
    // Gap is at row 3, col 2; ArrowLeft moves the tile to its right (15) into the gap
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(movesValue()).toBe('1')
    expect(screen.getByText(/Solved!/)).toBeInTheDocument()
  })

  it('New Game resets the move counter and timer', () => {
    render(<SlidingPuzzleBoard />)
    fireEvent.click(
      screen.getByRole('button', { name: /play again|new game/i })
    )
    expect(movesValue()).toBe('0')
    expect(screen.getByText('0:00')).toBeInTheDocument()
  })
})
