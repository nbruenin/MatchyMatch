/**
 * Tests for the Tower of Hanoi game
 *
 * Unit tests (hanoiLogic):
 *  - Initial stack, minimum move count
 *  - Legal / illegal move detection and applying moves
 *  - Solved detection
 *
 * Component tests (HanoiBoard):
 *  - Initial render: title, 4-disk default, pegs and stats
 *  - Picking up and dropping a disk counts a move
 *  - Illegal drop shows a toast and does not move the disk
 *  - Solving a 2-disk tower shows the win screen
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HanoiBoard from '../../components/hanoi/HanoiBoard'
import {
  createTowers,
  canMove,
  applyMove,
  isSolved,
  minimumMoves,
} from '../../utils/hanoiLogic'

describe('Hanoi – Unit: logic', () => {
  it('creates all disks on the first peg, largest at the bottom', () => {
    expect(createTowers(3)).toEqual([[3, 2, 1], [], []])
  })

  it('computes the minimum number of moves as 2^n - 1', () => {
    expect(minimumMoves(3)).toBe(7)
    expect(minimumMoves(4)).toBe(15)
    expect(minimumMoves(5)).toBe(31)
  })

  it('allows moving onto an empty peg', () => {
    expect(canMove(createTowers(3), 0, 1)).toBe(true)
  })

  it('rejects moving from an empty peg', () => {
    expect(canMove(createTowers(3), 1, 2)).toBe(false)
  })

  it('rejects moving onto a smaller disk', () => {
    const towers = [[3, 2], [1], []]
    expect(canMove(towers, 0, 1)).toBe(false)
  })

  it('allows moving a disk onto a larger one', () => {
    const towers = [[3], [2], [1]]
    expect(canMove(towers, 1, 0)).toBe(true)
  })

  it('rejects moving a peg onto itself', () => {
    expect(canMove(createTowers(3), 0, 0)).toBe(false)
  })

  it('applyMove returns a new state and does not mutate the input', () => {
    const towers = createTowers(3)
    const next = applyMove(towers, 0, 2)
    expect(next).toEqual([[3, 2], [], [1]])
    expect(towers).toEqual([[3, 2, 1], [], []])
  })

  it('applyMove returns null for an illegal move', () => {
    expect(applyMove([[2], [1], []], 0, 1)).toBeNull()
  })

  it('detects a solved tower only when every disk is on the last peg', () => {
    expect(isSolved([[], [], [2, 1]], 2)).toBe(true)
    expect(isSolved(createTowers(2), 2)).toBe(false)
  })
})

describe('Hanoi – Component', () => {
  it('renders the title, three pegs and a 4-disk default', () => {
    render(<HanoiBoard />)
    expect(screen.getByText('Tower of Hanoi')).toBeInTheDocument()
    expect(screen.getByLabelText('Peg A, 4 disks')).toBeInTheDocument()
    expect(screen.getByLabelText('Peg B, 0 disks')).toBeInTheDocument()
    expect(screen.getByLabelText('Peg C, 0 disks')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('counts a move when a disk is picked up and dropped on a legal peg', () => {
    render(<HanoiBoard />)
    fireEvent.click(screen.getByLabelText(/Peg A/))
    fireEvent.click(screen.getByLabelText(/Peg C/))
    expect(screen.getByLabelText('Peg C, 1 disks')).toBeInTheDocument()
    expect(screen.getByLabelText('Peg A, 3 disks')).toBeInTheDocument()
    expect(screen.getByText('Moves').previousSibling).toHaveTextContent('1')
  })

  it('rejects an illegal drop and leaves the towers unchanged', () => {
    render(<HanoiBoard />)
    // Move the smallest disk to B, then try to drop a larger disk on it
    fireEvent.click(screen.getByLabelText(/Peg A/))
    fireEvent.click(screen.getByLabelText(/Peg B/))
    fireEvent.click(screen.getByLabelText(/Peg A/))
    fireEvent.click(screen.getByLabelText(/Peg B/))
    expect(
      screen.getByText("Can't place a larger disk on a smaller one")
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Peg A, 3 disks')).toBeInTheDocument()
    expect(screen.getByLabelText('Peg B, 1 disks')).toBeInTheDocument()
  })

  it('shows the win screen after solving a 3-disk tower', () => {
    render(<HanoiBoard />)
    fireEvent.click(screen.getByText('3 disks'))
    // Optimal 7-move solution from A (3 disks) to C
    const moves = [
      ['A', 'C'],
      ['A', 'B'],
      ['C', 'B'],
      ['A', 'C'],
      ['B', 'A'],
      ['B', 'C'],
      ['A', 'C'],
    ]
    for (const [from, to] of moves) {
      fireEvent.click(screen.getByLabelText(new RegExp(`Peg ${from},`)))
      fireEvent.click(screen.getByLabelText(new RegExp(`Peg ${to},`)))
    }
    expect(screen.getByText('🎉 Solved!')).toBeInTheDocument()
    expect(screen.getByText('7 moves (best possible: 7)')).toBeInTheDocument()
  })
})
