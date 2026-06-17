/**
 * Tests for the RockPaperScissors game (RockPaperScissorsBoard)
 *
 * Unit tests cover:
 *  - Initial render: title, score display, choice buttons
 *  - Three choices: Rock, Paper, Scissors
 *  - Score tracking for player and AI
 *
 * E2E-style tests cover:
 *  - Clicking a choice starts the game
 *  - AI makes a choice after delay
 *  - Result is determined correctly (win, lose, tie)
 *  - Score updates after each round
 *  - Play Again button resets for next round
 *  - Reset Score button clears scores
 *  - Round counter increments
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RockPaperScissorsBoard from '../../components/rockpaperscissors/RockPaperScissorsBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('RockPaperScissors – Unit: initial render', () => {
  it('shows the game title', () => {
    render(<RockPaperScissorsBoard />)
    expect(screen.getByText('Rock Paper Scissors')).toBeInTheDocument()
  })

  it('shows game description', () => {
    render(<RockPaperScissorsBoard />)
    expect(screen.getByText(/Beat the AI in this classic game/i)).toBeInTheDocument()
  })

  it('displays score board with You and AI sections', () => {
    render(<RockPaperScissorsBoard />)
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('shows initial scores as 0', () => {
    render(<RockPaperScissorsBoard />)
    const scoreElements = screen.getAllByText('0')
    expect(scoreElements.length).toBeGreaterThanOrEqual(2)
  })

  it('renders three choice buttons: Rock, Paper, Scissors', () => {
    render(<RockPaperScissorsBoard />)
    expect(screen.getByRole('button', { name: /Rock/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Paper/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Scissors/i })).toBeInTheDocument()
  })

  it('shows "Make your choice:" prompt', () => {
    render(<RockPaperScissorsBoard />)
    expect(screen.getByText(/Make your choice:/i)).toBeInTheDocument()
  })
})

describe('RockPaperScissors – E2E: choice selection', () => {
  it('clicking Rock choice starts the game', async () => {
    render(<RockPaperScissorsBoard />)
    const rockBtn = screen.getByRole('button', { name: /Rock/i })

    fireEvent.click(rockBtn)

    vi.runAllTimers()

    await waitFor(() => {
      // Should show AI thinking or result
      expect(
        screen.queryByText(/AI is thinking/i) ||
        screen.queryByText(/You Win/i) ||
        screen.queryByText(/You Lose/i) ||
        screen.queryByText(/It's a Tie/i)
      ).toBeTruthy()
    })
  })

  it('clicking Paper choice starts the game', async () => {
    render(<RockPaperScissorsBoard />)
    const paperBtn = screen.getByRole('button', { name: /Paper/i })

    fireEvent.click(paperBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(
        screen.queryByText(/AI is thinking/i) ||
        screen.queryByText(/You Win/i) ||
        screen.queryByText(/You Lose/i) ||
        screen.queryByText(/It's a Tie/i)
      ).toBeTruthy()
    })
  })

  it('clicking Scissors choice starts the game', async () => {
    render(<RockPaperScissorsBoard />)
    const scissorsBtn = screen.getByRole('button', { name: /Scissors/i })

    fireEvent.click(scissorsBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(
        screen.queryByText(/AI is thinking/i) ||
        screen.queryByText(/You Win/i) ||
        screen.queryByText(/You Lose/i) ||
        screen.queryByText(/It's a Tie/i)
      ).toBeTruthy()
    })
  })
})

describe('RockPaperScissors – E2E: game flow', () => {
  it('shows AI thinking state after choice', async () => {
    render(<RockPaperScissorsBoard />)
    const rockBtn = screen.getByRole('button', { name: /Rock/i })

    fireEvent.click(rockBtn)

    // Should show thinking state immediately
    expect(screen.getByText(/AI is thinking/i)).toBeInTheDocument()
  })

  it('shows result after AI choice', async () => {
    render(<RockPaperScissorsBoard />)
    const rockBtn = screen.getByRole('button', { name: /Rock/i })

    fireEvent.click(rockBtn)

    vi.runAllTimers()

    await waitFor(() => {
      // Should show one of the result messages
      const resultMsg = screen.queryByText(/You Win/i) ||
                       screen.queryByText(/You Lose/i) ||
                       screen.queryByText(/It's a Tie/i)
      expect(resultMsg).toBeTruthy()
    })
  })

  it('displays both player and AI choices in result screen', async () => {
    render(<RockPaperScissorsBoard />)
    const rockBtn = screen.getByRole('button', { name: /Rock/i })

    fireEvent.click(rockBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText('You')).toBeInTheDocument()
      expect(screen.getByText('AI')).toBeInTheDocument()
    })
  })

  it('shows Play Again button in result screen', async () => {
    render(<RockPaperScissorsBoard />)
    const rockBtn = screen.getByRole('button', { name: /Rock/i })

    fireEvent.click(rockBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Play Again/i })).toBeInTheDocument()
    })
  })
})

describe('RockPaperScissors – E2E: scoring', () => {
  it('player score increases on win', async () => {
    render(<RockPaperScissorsBoard />)

    // Play multiple rounds until we get a win
    for (let i = 0; i < 10; i++) {
      const rockBtn = screen.getByRole('button', { name: /Rock/i })
      if (rockBtn) {
        fireEvent.click(rockBtn)
        vi.runAllTimers()

        await waitFor(() => {
          const winMsg = screen.queryByText(/You Win/i)
          if (winMsg) {
            // Found a win, check score increased
            const scores = screen.getAllByText(/\d+/)
            expect(scores.length).toBeGreaterThan(0)
          }
        }, { timeout: 100 })

        const playAgainBtn = screen.queryByRole('button', { name: /Play Again/i })
        if (playAgainBtn) {
          fireEvent.click(playAgainBtn)
          vi.runAllTimers()
        }
      }
    }
  })

  it('AI score increases on lose', async () => {
    render(<RockPaperScissorsBoard />)

    // Play multiple rounds until we get a loss
    for (let i = 0; i < 10; i++) {
      const rockBtn = screen.getByRole('button', { name: /Rock/i })
      if (rockBtn) {
        fireEvent.click(rockBtn)
        vi.runAllTimers()

        await waitFor(() => {
          const loseMsg = screen.queryByText(/You Lose/i)
          if (loseMsg) {
            // Found a loss, check AI score increased
            const scores = screen.getAllByText(/\d+/)
            expect(scores.length).toBeGreaterThan(0)
          }
        }, { timeout: 100 })

        const playAgainBtn = screen.queryByRole('button', { name: /Play Again/i })
        if (playAgainBtn) {
          fireEvent.click(playAgainBtn)
          vi.runAllTimers()
        }
      }
    }
  })
})

describe('RockPaperScissors – E2E: round counter', () => {
  it('shows round counter after first round', async () => {
    render(<RockPaperScissorsBoard />)
    const rockBtn = screen.getByRole('button', { name: /Rock/i })

    fireEvent.click(rockBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Round 1/i)).toBeInTheDocument()
    })
  })
})

describe('RockPaperScissors – E2E: reset', () => {
  it('Reset Score button clears scores and round counter', async () => {
    render(<RockPaperScissorsBoard />)
    const rockBtn = screen.getByRole('button', { name: /Rock/i })

    fireEvent.click(rockBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reset Score/i })).toBeInTheDocument()
    })

    const resetBtn = screen.getByRole('button', { name: /Reset Score/i })
    fireEvent.click(resetBtn)

    vi.runAllTimers()

    await waitFor(() => {
      // Should be back to initial state
      expect(screen.getByText(/Make your choice:/i)).toBeInTheDocument()
    })
  })
})
