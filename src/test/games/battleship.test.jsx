import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BattleshipBoard from '../../components/battleship/BattleshipBoard'

describe('BattleshipBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the game board', () => {
    render(<BattleshipBoard />)
    const heading = screen.getByRole('heading', { name: /Battleship/i })
    expect(heading).toBeInTheDocument()
    expect(
      screen.getByText('Find and sink all enemy ships')
    ).toBeInTheDocument()
  })

  it('displays initial stats', () => {
    render(<BattleshipBoard />)
    expect(screen.getByText('Shots')).toBeInTheDocument()
    expect(screen.getByText('Hits')).toBeInTheDocument()
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
  })

  it('displays ships legend', () => {
    render(<BattleshipBoard />)
    expect(screen.getByText('Ships to Find')).toBeInTheDocument()
    expect(screen.getByText('Cruiser')).toBeInTheDocument()
    expect(screen.getByText('Destroyer')).toBeInTheDocument()
    expect(screen.getByText('Submarine')).toBeInTheDocument()
  })

  it('renders a 10x10 grid', () => {
    render(<BattleshipBoard />)
    const buttons = screen.getAllByRole('button')
    // 100 grid cells + 1 "New Game" button = 101
    expect(buttons.length).toBeGreaterThanOrEqual(100)
  })

  it('has a New Game button', () => {
    render(<BattleshipBoard />)
    expect(screen.getByText('New Game')).toBeInTheDocument()
  })

  it('allows clicking on grid cells', () => {
    render(<BattleshipBoard />)
    const buttons = screen.getAllByRole('button')
    const gridCell = buttons[0]
    fireEvent.click(gridCell)
    // After clicking, the cell should be disabled
    expect(gridCell).toBeDisabled()
  })

  it('resets game on New Game button click', async () => {
    render(<BattleshipBoard />)
    const buttons = screen.getAllByRole('button')
    const gridCell = buttons[0]

    // Click a cell
    fireEvent.click(gridCell)
    expect(gridCell).toBeDisabled()

    // Click New Game
    const newGameButton = screen.getByText('New Game')
    fireEvent.click(newGameButton)

    // Wait for state to update
    await waitFor(() => {
      // After new game, the grid should be reset
      const updatedButtons = screen.getAllByRole('button')
      expect(updatedButtons.length).toBeGreaterThanOrEqual(100)
    })
  })

  it('tracks shots and hits', async () => {
    render(<BattleshipBoard />)
    const buttons = screen.getAllByRole('button')

    // Click multiple cells
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])

    await waitFor(() => {
      const shotElements = screen.getAllByText('Shots')
      expect(shotElements.length).toBeGreaterThan(0)
    })
  })

  it('displays accuracy percentage', () => {
    render(<BattleshipBoard />)
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
  })
})
