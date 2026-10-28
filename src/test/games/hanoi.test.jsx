/**
 * Tests for Tower of Hanoi
 *
 * Unit tests cover the pure rules in utils/hanoiLogic.js:
 *  - Starting layout, legal/illegal moves, immutability, solved detection
 *
 * E2E-style tests cover the TowerOfHanoiBoard UI:
 *  - Initial render, disk-count selection, peg selection, moves, win state
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TowerOfHanoiBoard from '../../components/hanoi/TowerOfHanoiBoard'
import {
  createPegs,
  canMove,
  moveDisk,
  isSolved,
  optimalMoves,
} from '../../utils/hanoiLogic'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('Tower of Hanoi – Unit: rules', () => {
  it('createPegs stacks all disks on the first peg, largest at the bottom', () => {
    expect(createPegs(3)).toEqual([[3, 2, 1], [], []])
  })

  it('optimalMoves returns 2^n - 1', () => {
    expect(optimalMoves(3)).toBe(7)
    expect(optimalMoves(4)).toBe(15)
    expect(optimalMoves(6)).toBe(63)
  })

  it('allows moving a disk onto an empty peg', () => {
    expect(canMove(createPegs(3), 0, 2)).toBe(true)
  })

  it('allows moving a smaller disk onto a larger one', () => {
    const pegs = [[3], [2], []]
    expect(canMove(pegs, 1, 0)).toBe(true)
  })

  it('rejects placing a larger disk on a smaller one', () => {
    const pegs = [[3], [1], []]
    expect(canMove(pegs, 0, 1)).toBe(false)
  })

  it('rejects moving from an empty peg or onto the same peg', () => {
    const pegs = createPegs(3)
    expect(canMove(pegs, 1, 2)).toBe(false)
    expect(canMove(pegs, 0, 0)).toBe(false)
  })

  it('moveDisk returns a new array and does not mutate the input', () => {
    const pegs = createPegs(3)
    const next = moveDisk(pegs, 0, 2)
    expect(next).toEqual([[3, 2], [], [1]])
    expect(pegs).toEqual([[3, 2, 1], [], []])
  })

  it('moveDisk returns the same pegs for an illegal move', () => {
    const pegs = [[3], [1], []]
    expect(moveDisk(pegs, 0, 1)).toBe(pegs)
  })

  it('isSolved is true only when all disks are on the last peg', () => {
    expect(isSolved([[], [], [3, 2, 1]], 3)).toBe(true)
    expect(isSolved(createPegs(3), 3)).toBe(false)
  })
})

describe('Tower of Hanoi – Unit: initial render', () => {
  it('shows the game title', () => {
    render(<TowerOfHanoiBoard />)
    expect(screen.getByText('Tower of Hanoi')).toBeInTheDocument()
  })

  it('shows three pegs', () => {
    render(<TowerOfHanoiBoard />)
    expect(
      screen.getByRole('button', { name: /Left peg, 3 disks/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Middle peg, 0 disks/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Right peg, 0 disks/ })
    ).toBeInTheDocument()
  })

  it('starts with 0 moves and shows the optimal move count', () => {
    render(<TowerOfHanoiBoard />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('offers disk counts from 3 to 6', () => {
    render(<TowerOfHanoiBoard />)
    ;[3, 4, 5, 6].forEach((n) => {
      expect(
        screen.getByRole('button', { name: `${n} disks` })
      ).toBeInTheDocument()
    })
  })
})

describe('Tower of Hanoi – E2E: gameplay', () => {
  it('selecting a peg then a legal destination moves the top disk', () => {
    render(<TowerOfHanoiBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Left peg/ }))
    fireEvent.click(screen.getByRole('button', { name: /Right peg/ }))
    expect(
      screen.getByRole('button', { name: /Left peg, 2 disks/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Right peg, 1 disks/ })
    ).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('an illegal move shows a warning and does not change the move count', () => {
    render(<TowerOfHanoiBoard />)
    // Move smallest disk to the middle peg
    fireEvent.click(screen.getByRole('button', { name: /Left peg/ }))
    fireEvent.click(screen.getByRole('button', { name: /Right peg/ }))
    // Left now has disk 2 on top; put it on right (holds disk 1) -> illegal
    fireEvent.click(screen.getByRole('button', { name: /Left peg/ }))
    fireEvent.click(screen.getByRole('button', { name: /Right peg/ }))
    expect(screen.getByText(/Can't place a larger disk/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Left peg, 2 disks/ })
    ).toBeInTheDocument()
  })

  it('clicking the selected peg again deselects it', () => {
    render(<TowerOfHanoiBoard />)
    const left = screen.getByRole('button', { name: /Left peg/ })
    fireEvent.click(left)
    expect(left).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(left)
    expect(left).toHaveAttribute('aria-pressed', 'false')
  })

  it('clicking an empty peg shows a message', () => {
    render(<TowerOfHanoiBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Middle peg/ }))
    expect(screen.getByText(/That peg is empty/)).toBeInTheDocument()
  })

  it('solving the 3-disk puzzle in 7 moves shows the win screen', () => {
    render(<TowerOfHanoiBoard />)
    const L = /Left peg/
    const M = /Middle peg/
    const R = /Right peg/
    const sequence = [
      [L, R],
      [L, M],
      [R, M],
      [L, R],
      [M, L],
      [M, R],
      [L, R],
    ]
    sequence.forEach(([from, to]) => {
      fireEvent.click(screen.getByRole('button', { name: from }))
      fireEvent.click(screen.getByRole('button', { name: to }))
    })
    expect(screen.getByText('Solved in 7 moves!')).toBeInTheDocument()
    expect(screen.getByText(/Perfect/)).toBeInTheDocument()
  })

  it('Restart resets the board and move count', () => {
    render(<TowerOfHanoiBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Left peg/ }))
    fireEvent.click(screen.getByRole('button', { name: /Right peg/ }))
    fireEvent.click(screen.getByRole('button', { name: /Restart/ }))
    expect(
      screen.getByRole('button', { name: /Left peg, 3 disks/ })
    ).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('changing disk count restarts with that many disks', () => {
    render(<TowerOfHanoiBoard />)
    fireEvent.click(screen.getByRole('button', { name: '4 disks' }))
    expect(
      screen.getByRole('button', { name: /Left peg, 4 disks/ })
    ).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })
})
