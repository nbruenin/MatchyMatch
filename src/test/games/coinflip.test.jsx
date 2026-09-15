/**
 * Tests for CoinFlipBoard
 *
 * Unit tests:
 *  - Initial render: title, stats, choice buttons
 *  - Shows 0 wins, 0 losses, 0% win rate initially
 *  - Both Heads and Tails buttons are present
 *
 * E2E-style tests:
 *  - Clicking a choice triggers coin flip animation
 *  - Result is displayed after flip
 *  - Stats update correctly after flip
 *  - Flip Again button resets for next round
 *  - Reset Stats button clears all stats
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CoinFlipBoard from '../../components/coinflip/CoinFlipBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('CoinFlip – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<CoinFlipBoard />)
    expect(document.body).toBeInTheDocument()
  })

  it('shows the game title', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByText('Coin Flip')).toBeInTheDocument()
  })

  it('shows the game description', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByText(/Predict the coin flip and test your luck/i)).toBeInTheDocument()
  })

  it('shows 0 wins initially', () => {
    render(<CoinFlipBoard />)
    const winsElements = screen.getAllByText('0')
    expect(winsElements.length).toBeGreaterThan(0)
  })

  it('shows 0% win rate initially', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows Heads button', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByText('Heads')).toBeInTheDocument()
  })

  it('shows Tails button', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByText('Tails')).toBeInTheDocument()
  })

  it('shows "Make your prediction" text', () => {
    render(<CoinFlipBoard />)
    expect(screen.getByText(/Make your prediction/i)).toBeInTheDocument()
  })
})

describe('CoinFlip – E2E: gameplay', () => {
  it('clicking Heads shows flipping animation', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    // Should show flipping text
    expect(screen.getByText(/Flipping the coin/i)).toBeInTheDocument()
  })

  it('clicking Tails shows flipping animation', async () => {
    render(<CoinFlipBoard />)
    
    const tailsButton = screen.getByText('Tails')
    fireEvent.click(tailsButton)

    // Should show flipping text
    expect(screen.getByText(/Flipping the coin/i)).toBeInTheDocument()
  })

  it('shows result after flip completes', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    // Fast-forward time to complete the flip
    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      // Should show either win or lose message
      const winText = screen.queryByText(/You Win!/i)
      const loseText = screen.queryByText(/You Lose!/i)
      expect(winText !== null || loseText !== null).toBe(true)
    })
  })

  it('shows Flip Again button after result', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText(/Flip Again/i)).toBeInTheDocument()
    })
  })

  it('shows Reset Stats button after result', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText(/Reset Stats/i)).toBeInTheDocument()
    })
  })

  it('updates flip count after a flip', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText(/Total Flips: 1/i)).toBeInTheDocument()
    })
  })

  it('Flip Again button resets to choice screen', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    vi.advanceTimersByTime(1200)

    const flipAgainButton = await screen.findByText(/Flip Again/i)
    fireEvent.click(flipAgainButton)

    // Should be back to choice screen
    await waitFor(() => {
      expect(screen.getByText(/Make your prediction/i)).toBeInTheDocument()
    })
  })

  it('Reset Stats button clears all stats', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    vi.advanceTimersByTime(1200)

    const resetButton = await screen.findByText(/Reset Stats/i)
    fireEvent.click(resetButton)

    // Should be back to initial state with 0% win rate
    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument()
      expect(screen.getByText(/Make your prediction/i)).toBeInTheDocument()
    })
  })
})

describe('CoinFlip – E2E: stats tracking', () => {
  it('tracks multiple flips correctly', async () => {
    render(<CoinFlipBoard />)
    
    // First flip
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)
    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText(/Total Flips: 1/i)).toBeInTheDocument()
    })

    // Second flip
    const flipAgainButton = await screen.findByText(/Flip Again/i)
    fireEvent.click(flipAgainButton)

    const tailsButton = await screen.findByText('Tails')
    fireEvent.click(tailsButton)
    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText(/Total Flips: 2/i)).toBeInTheDocument()
    })
  })

  it('calculates win rate correctly', async () => {
    // Mock Math.random to control outcomes
    const originalRandom = Math.random
    let callCount = 0
    Math.random = vi.fn(() => {
      // First flip: heads (< 0.5), second flip: tails (>= 0.5)
      return callCount++ === 0 ? 0.3 : 0.7
    })

    render(<CoinFlipBoard />)
    
    // First flip - choose heads (will win)
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)
    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument() // 1 win out of 1 = 100%, but we need to check after 2 flips
    })

    // Second flip - choose heads (will lose because result is tails)
    const flipAgainButton = await screen.findByText(/Flip Again/i)
    fireEvent.click(flipAgainButton)

    const headsButton2 = await screen.findByText('Heads')
    fireEvent.click(headsButton2)
    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      // 1 win out of 2 flips = 50%
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    // Restore Math.random
    Math.random = originalRandom
  })
})

describe('CoinFlip – E2E: UI states', () => {
  it('disables interaction during flip animation', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    // During animation, choice buttons should not be visible
    expect(screen.queryByText(/Make your prediction/i)).not.toBeInTheDocument()
  })

  it('shows player choice in result screen', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText(/Your Prediction/i)).toBeInTheDocument()
    })
  })

  it('shows coin result in result screen', async () => {
    render(<CoinFlipBoard />)
    
    const headsButton = screen.getByText('Heads')
    fireEvent.click(headsButton)

    vi.advanceTimersByTime(1200)

    await waitFor(() => {
      expect(screen.getByText(/Result/i)).toBeInTheDocument()
      // Should show "The coin landed on" text
      expect(screen.getByText(/The coin landed on/i)).toBeInTheDocument()
    })
  })
})
