/**
 * Tests for Tower of Hanoi (HanoiBoard + hanoiLogic)
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HanoiBoard from '../../components/hanoi/HanoiBoard'
import {
  createPegs,
  minMoves,
  isValidMove,
  moveDisk,
  isSolved,
} from '../../utils/hanoiLogic'

describe('Hanoi – logic', () => {
  it('creates pegs with all disks on the first peg', () => {
    expect(createPegs(3)).toEqual([[3, 2, 1], [], []])
  })

  it('computes the minimum number of moves', () => {
    expect(minMoves(3)).toBe(7)
    expect(minMoves(5)).toBe(31)
  })

  it('allows moving onto an empty peg or a larger disk', () => {
    const pegs = [[3, 2], [1], []]
    expect(isValidMove(pegs, 0, 2)).toBe(true)
    expect(isValidMove(pegs, 1, 0)).toBe(true)
  })

  it('rejects larger-on-smaller, empty source and same-peg moves', () => {
    const pegs = [[3, 2], [1], []]
    expect(isValidMove(pegs, 0, 1)).toBe(false)
    expect(isValidMove(pegs, 2, 0)).toBe(false)
    expect(isValidMove(pegs, 0, 0)).toBe(false)
  })

  it('moveDisk does not mutate input and ignores invalid moves', () => {
    const pegs = createPegs(3)
    const next = moveDisk(pegs, 0, 1)
    expect(next).toEqual([[3, 2], [1], []])
    expect(pegs).toEqual([[3, 2, 1], [], []])
    expect(moveDisk(next, 0, 1)).toBe(next)
  })

  it('detects solved state', () => {
    expect(isSolved([[], [], [3, 2, 1]], 3)).toBe(true)
    expect(isSolved(createPegs(3), 3)).toBe(false)
  })
})

describe('Hanoi – component', () => {
  const peg = (n) =>
    screen.getByRole('button', { name: new RegExp(`^Peg ${n},`) })

  it('renders title, three pegs and stats', () => {
    render(<HanoiBoard />)
    expect(screen.getByText('Tower of Hanoi')).toBeInTheDocument()
    expect(peg(1)).toBeInTheDocument()
    expect(peg(2)).toBeInTheDocument()
    expect(peg(3)).toBeInTheDocument()
    expect(screen.getByText('Moves')).toBeInTheDocument()
  })

  it('moves a disk and counts the move', () => {
    render(<HanoiBoard />)
    fireEvent.click(peg(1))
    fireEvent.click(peg(3))
    expect(peg(1).getAttribute('aria-label')).toMatch(/2 disks/)
    expect(peg(3).getAttribute('aria-label')).toMatch(/1 disk/)
  })

  it('rejects an illegal move', () => {
    render(<HanoiBoard />)
    fireEvent.click(peg(1))
    fireEvent.click(peg(3))
    fireEvent.click(peg(1))
    fireEvent.click(peg(3)) // disk 2 onto disk 1: illegal
    expect(peg(1).getAttribute('aria-label')).toMatch(/2 disks/)
    expect(peg(3).getAttribute('aria-label')).toMatch(/1 disk/)
  })

  it('shows win screen after the optimal 3-disk solution', () => {
    render(<HanoiBoard />)
    const sequence = [
      [1, 3],
      [1, 2],
      [3, 2],
      [1, 3],
      [2, 1],
      [2, 3],
      [1, 3],
    ]
    for (const [from, to] of sequence) {
      fireEvent.click(peg(from))
      fireEvent.click(peg(to))
    }
    expect(screen.getByText('Tower Complete!')).toBeInTheDocument()
    expect(screen.getByText(/perfect solution/)).toBeInTheDocument()
  })

  it('changes the disk count', () => {
    render(<HanoiBoard />)
    fireEvent.click(screen.getByRole('button', { name: /more disks/i }))
    expect(screen.getByText('4 disks')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /fewer disks/i })
    ).not.toBeDisabled()
  })
})
