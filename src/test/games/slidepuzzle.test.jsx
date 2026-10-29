/**
 * Tests for SlidePuzzleBoard (logic helpers are tested in slidepuzzle.test.js)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('../../utils/slidePuzzleLogic', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // One move away from solved: tile 8 slides right into the blank
    shuffleBoard: vi.fn((size) => {
      const b = actual.createSolvedBoard(size)
      return actual.moveTile(b, size * size - 2, size)
    }),
  }
})

import SlidePuzzleBoard from '../../components/slidepuzzle/SlidePuzzleBoard'

describe('SlidePuzzle – board', () => {
  it('shows the size selector first', () => {
    render(<SlidePuzzleBoard />)
    expect(screen.getByText('Slide Puzzle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /3×3 grid/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /4×4 grid/ })).toBeInTheDocument()
  })

  it('starts a game with 8 tiles and zero moves', () => {
    render(<SlidePuzzleBoard />)
    fireEvent.click(screen.getByRole('button', { name: /3×3 grid/ }))
    expect(screen.getAllByRole('gridcell')).toHaveLength(9)
    expect(screen.getByLabelText('Empty space')).toBeInTheDocument()
    expect(screen.getByText('Moves').previousSibling).toHaveTextContent('0')
  })

  it('counts moves and shows the win screen when solved', () => {
    render(<SlidePuzzleBoard />)
    fireEvent.click(screen.getByRole('button', { name: /3×3 grid/ }))
    fireEvent.click(screen.getByRole('gridcell', { name: 'Tile 8' }))
    expect(screen.getByText('Puzzle Solved!')).toBeInTheDocument()
    expect(screen.getByText(/in 1 move/)).toBeInTheDocument()
  })

  it('ignores clicks on tiles that cannot move', () => {
    render(<SlidePuzzleBoard />)
    fireEvent.click(screen.getByRole('button', { name: /3×3 grid/ }))
    fireEvent.click(screen.getByRole('gridcell', { name: 'Tile 1' }))
    expect(screen.getByText('Moves').previousSibling).toHaveTextContent('0')
  })

  it('supports arrow keys', () => {
    render(<SlidePuzzleBoard />)
    fireEvent.click(screen.getByRole('button', { name: /3×3 grid/ }))
    // Board is [1..7,0,8]; blank at 7; ArrowLeft slides tile 8 left.
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('Puzzle Solved!')).toBeInTheDocument()
  })

  it('Play Again returns to the selector', () => {
    render(<SlidePuzzleBoard />)
    fireEvent.click(screen.getByRole('button', { name: /3×3 grid/ }))
    fireEvent.click(screen.getByRole('gridcell', { name: 'Tile 8' }))
    fireEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(screen.getByRole('button', { name: /4×4 grid/ })).toBeInTheDocument()
  })
})
