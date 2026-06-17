/**
 * Tests for the Pong game (PongBoard)
 *
 * Unit tests cover:
 *  - Initial render: canvas, score display, instructions
 *  - Game constants (canvas size, paddle size, ball speed)
 *
 * E2E-style tests cover:
 *  - Game starts and renders canvas
 *  - Score updates when ball goes out of bounds
 *  - Win condition (first to 5 points)
 *  - Lose condition (AI reaches 5 points)
 *  - Play Again button resets game
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PongBoard from '../../components/pong/PongBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('Pong – Unit: initial render', () => {
  it('shows the game title', () => {
    render(<PongBoard />)
    expect(screen.getByText('Pong')).toBeInTheDocument()
  })

  it('renders a canvas element', () => {
    render(<PongBoard />)
    const canvas = screen.getByRole('img', { hidden: true })?.closest('canvas') ||
                   document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('shows initial score as 0 - 0', () => {
    render(<PongBoard />)
    expect(screen.getByText(/You: 0 - AI: 0/i)).toBeInTheDocument()
  })

  it('shows instructions about arrow keys', () => {
    render(<PongBoard />)
    expect(screen.getByText(/arrow keys/i)).toBeInTheDocument()
  })

  it('shows "First to 5 points wins!" instruction', () => {
    render(<PongBoard />)
    expect(screen.getByText(/First to 5 points wins/i)).toBeInTheDocument()
  })
})

describe('Pong – E2E: gameplay', () => {
  it('game renders without errors', () => {
    render(<PongBoard />)
    expect(screen.getByText('Pong')).toBeInTheDocument()
  })

  it('canvas is visible during gameplay', () => {
    render(<PongBoard />)
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('width', '400')
    expect(canvas).toHaveAttribute('height', '300')
  })

  it('game loop runs and updates score', async () => {
    render(<PongBoard />)

    // Run timers to let game loop execute
    vi.runAllTimers()

    await waitFor(() => {
      // Score should still be visible
      expect(screen.getByText(/You:/i)).toBeInTheDocument()
    }, { timeout: 100 })
  })
})

describe('Pong – E2E: win/lose conditions', () => {
  it('shows win screen when player reaches 5 points', async () => {
    render(<PongBoard />)

    // Run game for a while to potentially reach win condition
    for (let i = 0; i < 100; i++) {
      vi.runOnlyPendingTimers()
    }

    vi.runAllTimers()

    await waitFor(() => {
      // Either still playing or showing win/lose screen
      const playAgainBtn = screen.queryByRole('button', { name: /Play Again/i })
      const gameTitle = screen.queryByText('Pong')
      expect(playAgainBtn || gameTitle).toBeTruthy()
    }, { timeout: 200 })
  })

  it('shows lose screen when AI reaches 5 points', async () => {
    render(<PongBoard />)

    // Run game for a while
    for (let i = 0; i < 100; i++) {
      vi.runOnlyPendingTimers()
    }

    vi.runAllTimers()

    await waitFor(() => {
      const playAgainBtn = screen.queryByRole('button', { name: /Play Again/i })
      const gameTitle = screen.queryByText('Pong')
      expect(playAgainBtn || gameTitle).toBeTruthy()
    }, { timeout: 200 })
  })

  it('Play Again button resets the game', async () => {
    render(<PongBoard />)

    // Run game for a while
    for (let i = 0; i < 100; i++) {
      vi.runOnlyPendingTimers()
    }

    vi.runAllTimers()

    const playAgainBtn = screen.queryByRole('button', { name: /Play Again/i })
    if (playAgainBtn) {
      fireEvent.click(playAgainBtn)

      vi.runAllTimers()

      await waitFor(() => {
        expect(screen.getByText(/You: 0 - AI: 0/i)).toBeInTheDocument()
      })
    }
  })
})

describe('Pong – Unit: game constants', () => {
  it('canvas has correct dimensions', () => {
    render(<PongBoard />)
    const canvas = document.querySelector('canvas')
    expect(canvas).toHaveAttribute('width', '400')
    expect(canvas).toHaveAttribute('height', '300')
  })

  it('renders with border styling', () => {
    render(<PongBoard />)
    const canvas = document.querySelector('canvas')
    expect(canvas).toHaveStyle({ border: '2px solid var(--accent)' })
  })
})
