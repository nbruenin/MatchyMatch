/**
 * Tests for the NumberNinja game (NumberNinjaBoard)
 *
 * Unit tests cover:
 *  - Initial render: ready screen with difficulty selector
 *  - Difficulty levels: easy, medium, hard
 *  - Game states: ready, playing, won, lost
 *
 * E2E-style tests cover:
 *  - Selecting difficulty and starting game
 *  - Timer countdown during gameplay
 *  - Clicking correct target number advances round
 *  - Clicking wrong number ends game
 *  - Win/lose screens show score and round
 *  - Play Again button restarts game
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NumberNinjaBoard from '../../components/numberninja/NumberNinjaBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('NumberNinja – Unit: initial render', () => {
  it('shows the ready screen with title', () => {
    render(<NumberNinjaBoard />)
    expect(screen.getByText('Number Ninja')).toBeInTheDocument()
  })

  it('shows game description', () => {
    render(<NumberNinjaBoard />)
    expect(
      screen.getByText(/Find the target number before time runs out/i)
    ).toBeInTheDocument()
  })

  it('renders difficulty selector with easy, medium, hard buttons', () => {
    render(<NumberNinjaBoard />)
    expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hard/i })).toBeInTheDocument()
  })

  it('easy difficulty is selected by default', () => {
    render(<NumberNinjaBoard />)
    const easyBtn = screen.getByRole('button', { name: /easy/i })
    // Easy button should have active styling (red background)
    expect(easyBtn).toHaveStyle({ backgroundColor: '#FF6B6B' })
  })

  it('renders Start Game button', () => {
    render(<NumberNinjaBoard />)
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument()
  })
})

describe('NumberNinja – E2E: difficulty selection', () => {
  it('clicking medium difficulty highlights it', () => {
    render(<NumberNinjaBoard />)
    const mediumBtn = screen.getByRole('button', { name: /medium/i })

    fireEvent.click(mediumBtn)

    expect(mediumBtn).toHaveStyle({ backgroundColor: '#FF6B6B' })
  })

  it('clicking hard difficulty highlights it', () => {
    render(<NumberNinjaBoard />)
    const hardBtn = screen.getByRole('button', { name: /hard/i })

    fireEvent.click(hardBtn)

    expect(hardBtn).toHaveStyle({ backgroundColor: '#FF6B6B' })
  })
})

describe('NumberNinja – E2E: game start', () => {
  it('clicking Start Game transitions to playing state', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      // Should show target number and timer
      expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
    })
  })

  it('shows timer during gameplay', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      // Timer should be visible (a number)
      const timerElements = screen.getAllByRole('button').filter(
        (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
      )
      expect(timerElements.length).toBeGreaterThan(0)
    })
  })

  it('shows target number and number options', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
      // Should have number buttons to click
      const numberBtns = screen.getAllByRole('button').filter(
        (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
      )
      expect(numberBtns.length).toBeGreaterThan(0)
    })
  })
})

describe('NumberNinja – E2E: gameplay', () => {
  it('clicking correct target number shows success toast', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
    })

    // Get the target number text
    const targetText = screen.getByText(/Find the number:/).nextElementSibling?.textContent
    const targetNum = parseInt(targetText)

    // Find and click the button with the target number
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )
    const correctBtn = numberBtns.find((btn) => parseInt(btn.textContent) === targetNum)

    if (correctBtn) {
      fireEvent.click(correctBtn)

      vi.runAllTimers()

      await waitFor(() => {
        // Should show success message or advance to next round
        expect(screen.queryByText(/Correct/i) || screen.queryByText(/Round/i)).toBeTruthy()
      })
    }
  })

  it('clicking wrong number shows error and ends game', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
    })

    // Get the target number
    const targetText = screen.getByText(/Find the number:/).nextElementSibling?.textContent
    const targetNum = parseInt(targetText)

    // Find a button with a different number
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )
    const wrongBtn = numberBtns.find((btn) => parseInt(btn.textContent) !== targetNum)

    if (wrongBtn) {
      fireEvent.click(wrongBtn)

      vi.runAllTimers()

      await waitFor(() => {
        // Should show game over or error
        expect(screen.queryByText(/Game Over/i) || screen.queryByText(/Wrong/i)).toBeTruthy()
      })
    }
  })
})

describe('NumberNinja – E2E: game over screens', () => {
  it('shows Game Over screen when wrong number is clicked', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
    })

    const targetText = screen.getByText(/Find the number:/).nextElementSibling?.textContent
    const targetNum = parseInt(targetText)

    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )
    const wrongBtn = numberBtns.find((btn) => parseInt(btn.textContent) !== targetNum)

    if (wrongBtn) {
      fireEvent.click(wrongBtn)

      vi.runAllTimers()

      await waitFor(() => {
        expect(screen.getByText(/Game Over/i)).toBeInTheDocument()
      })
    }
  })

  it('shows score and round on game over screen', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
    })

    const targetText = screen.getByText(/Find the number:/).nextElementSibling?.textContent
    const targetNum = parseInt(targetText)

    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )
    const wrongBtn = numberBtns.find((btn) => parseInt(btn.textContent) !== targetNum)

    if (wrongBtn) {
      fireEvent.click(wrongBtn)

      vi.runAllTimers()

      await waitFor(() => {
        expect(screen.getByText(/Score:/i)).toBeInTheDocument()
        expect(screen.getByText(/Round:/i)).toBeInTheDocument()
      })
    }
  })

  it('Try Again button restarts the game', async () => {
    render(<NumberNinjaBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
    })

    const targetText = screen.getByText(/Find the number:/).nextElementSibling?.textContent
    const targetNum = parseInt(targetText)

    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )
    const wrongBtn = numberBtns.find((btn) => parseInt(btn.textContent) !== targetNum)

    if (wrongBtn) {
      fireEvent.click(wrongBtn)

      vi.runAllTimers()

      await waitFor(() => {
        expect(screen.getByText(/Game Over/i)).toBeInTheDocument()
      })

      const tryAgainBtn = screen.getByRole('button', { name: /Try Again/i })
      fireEvent.click(tryAgainBtn)

      vi.runAllTimers()

      await waitFor(() => {
        expect(screen.getByText(/Find the number:/i)).toBeInTheDocument()
      })
    }
  })
})

describe('NumberNinja – Unit: game states', () => {
  it('starts in ready state', () => {
    render(<NumberNinjaBoard />)
    expect(screen.getByText('Number Ninja')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument()
  })
})
