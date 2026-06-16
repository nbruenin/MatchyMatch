/**
 * Tests for the Dice Roller game (DiceRollerBoard)
 *
 * Unit tests cover:
 *  - Initial render: stats bar (Rolls / Total / Average), dice display, buttons
 *  - Initial roll count is 0
 *  - Roll button is enabled initially
 *  - New Game button is present
 *  - Hint text is visible
 *
 * E2E-style tests cover:
 *  - Clicking Roll Dice disables the button during animation
 *  - After the animation resolves, the button re-enables and roll count increases
 *  - Rolling 10 times transitions to the win screen
 *  - Win screen shows Roll Again button and stats
 *  - New Game resets the board
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import DiceRollerBoard from '../../components/diceroller/DiceRollerBoard'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit Tests ────────────────────────────────────────────────────────────────

describe('Dice Roller – Unit: initial render', () => {
  it('renders the Rolls stat label', () => {
    render(<DiceRollerBoard />)
    expect(screen.getByText('Rolls')).toBeInTheDocument()
  })

  it('renders the Total stat label', () => {
    render(<DiceRollerBoard />)
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('renders the Average stat label', () => {
    render(<DiceRollerBoard />)
    expect(screen.getByText('Average')).toBeInTheDocument()
  })

  it('shows initial roll count of 0', () => {
    render(<DiceRollerBoard />)
    // The Rolls stat value starts at 0
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders the Roll Dice button enabled', () => {
    render(<DiceRollerBoard />)
    const rollBtn = screen.getByRole('button', { name: /roll dice/i })
    expect(rollBtn).toBeEnabled()
  })

  it('renders the New Game button', () => {
    render(<DiceRollerBoard />)
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
  })

  it('shows the hint text about rolling 10 times', () => {
    render(<DiceRollerBoard />)
    expect(
      screen.getByText(/Roll the dice 10 times/i)
    ).toBeInTheDocument()
  })

  it('shows the Total: display with initial sum', () => {
    render(<DiceRollerBoard />)
    expect(screen.getByText(/Total:/i)).toBeInTheDocument()
  })

  it('renders two dice (two grid cells)', () => {
    render(<DiceRollerBoard />)
    // Two Die components are rendered side by side
    const diceContainers = document.querySelectorAll(
      '[style*="width: 120px"]'
    )
    expect(diceContainers.length).toBe(2)
  })
})

// ── E2E Tests ─────────────────────────────────────────────────────────────────

describe('Dice Roller – E2E: rolling', () => {
  it('clicking Roll Dice disables the button immediately', () => {
    render(<DiceRollerBoard />)
    const rollBtn = screen.getByRole('button', { name: /roll dice/i })

    fireEvent.click(rollBtn)

    // Button should be disabled during the 600 ms animation
    expect(rollBtn).toBeDisabled()
  })

  it('button re-enables after the roll animation completes', async () => {
    render(<DiceRollerBoard />)
    const rollBtn = screen.getByRole('button', { name: /roll dice/i })

    fireEvent.click(rollBtn)
    expect(rollBtn).toBeDisabled()

    // Advance past the 600 ms roll timeout
    act(() => vi.advanceTimersByTime(700))

    await waitFor(() => {
      expect(rollBtn).toBeEnabled()
    })
  })

  it('roll count increments after one roll', async () => {
    render(<DiceRollerBoard />)
    const rollBtn = screen.getByRole('button', { name: /roll dice/i })

    fireEvent.click(rollBtn)
    act(() => vi.advanceTimersByTime(700))

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('roll history appears after the first roll', async () => {
    render(<DiceRollerBoard />)
    const rollBtn = screen.getByRole('button', { name: /roll dice/i })

    fireEvent.click(rollBtn)
    act(() => vi.advanceTimersByTime(700))

    await waitFor(() => {
      expect(screen.getByText(/Roll History/i)).toBeInTheDocument()
    })
  })
})

describe('Dice Roller – E2E: win condition', () => {
  it('shows the win screen after 10 rolls', async () => {
    render(<DiceRollerBoard />)

    for (let i = 0; i < 10; i++) {
      const rollBtn = screen.getByRole('button', { name: /roll dice/i })
      fireEvent.click(rollBtn)
      act(() => vi.advanceTimersByTime(700))
      await waitFor(() => {
        // Wait for button to re-enable before next roll
        expect(screen.queryByRole('button', { name: /roll dice/i })).toBeEnabled()
      })
    }

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /roll again/i })).toBeInTheDocument()
    })
  })

  it('win screen shows Total and Average stats', async () => {
    render(<DiceRollerBoard />)

    for (let i = 0; i < 10; i++) {
      const rollBtn = screen.getByRole('button', { name: /roll dice/i })
      fireEvent.click(rollBtn)
      act(() => vi.advanceTimersByTime(700))
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /roll dice/i })).toBeEnabled()
      })
    }

    await waitFor(() => {
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('Average')).toBeInTheDocument()
    })
  })

  it('clicking Roll Again resets to the playing screen', async () => {
    render(<DiceRollerBoard />)

    for (let i = 0; i < 10; i++) {
      const rollBtn = screen.getByRole('button', { name: /roll dice/i })
      fireEvent.click(rollBtn)
      act(() => vi.advanceTimersByTime(700))
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /roll dice/i })).toBeEnabled()
      })
    }

    const rollAgainBtn = await screen.findByRole('button', { name: /roll again/i })
    fireEvent.click(rollAgainBtn)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /roll dice/i })).toBeInTheDocument()
    })
  })
})

describe('Dice Roller – E2E: New Game', () => {
  it('clicking New Game resets the roll count to 0', async () => {
    render(<DiceRollerBoard />)
    const rollBtn = screen.getByRole('button', { name: /roll dice/i })

    // Roll once
    fireEvent.click(rollBtn)
    act(() => vi.advanceTimersByTime(700))
    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())

    // Reset
    fireEvent.click(screen.getByRole('button', { name: /new game/i }))

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })
})
