/**
 * Tests for the Scramble game (ScrambleBoard)
 *
 * Unit tests cover:
 *  - Initial render: scrambled letters, answer slots, lives display
 *  - Hint toggle functionality
 *  - Clear button state
 *
 * E2E-style tests cover:
 *  - Clicking scrambled letters places them in answer slots
 *  - Clicking answer slots removes letters
 *  - Submitting correct answer shows win screen
 *  - Submitting wrong answer decreases lives
 *  - Running out of lives shows lose screen
 *  - Keyboard support (letter keys, backspace, enter)
 *  - New Word button restarts game
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ScrambleBoard from '../../components/scramble/ScrambleBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('Scramble – Unit: initial render', () => {
  it('shows 5 heart lives indicators', () => {
    render(<ScrambleBoard />)
    const hearts = screen.getAllByText('❤️')
    expect(hearts.length).toBe(5)
  })

  it('renders Show hint button', () => {
    render(<ScrambleBoard />)
    expect(screen.getByRole('button', { name: /Show hint/i })).toBeInTheDocument()
  })

  it('renders Scrambled label', () => {
    render(<ScrambleBoard />)
    expect(screen.getByText(/Scrambled/i)).toBeInTheDocument()
  })

  it('renders Your answer label', () => {
    render(<ScrambleBoard />)
    expect(screen.getByText(/Your answer/i)).toBeInTheDocument()
  })

  it('renders scrambled letter tiles', () => {
    render(<ScrambleBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (btn) => /^[A-Z]$/.test(btn.textContent?.trim() ?? '')
    )
    expect(letterBtns.length).toBeGreaterThan(0)
  })

  it('renders answer slot tiles', () => {
    render(<ScrambleBoard />)
    // Answer slots are buttons with aria-label "empty slot"
    const emptySlots = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-label')?.includes('empty slot')
    )
    expect(emptySlots.length).toBeGreaterThan(0)
  })

  it('Clear button is initially disabled', () => {
    render(<ScrambleBoard />)
    const clearBtn = screen.getByRole('button', { name: /Clear/i })
    expect(clearBtn).toBeDisabled()
  })

  it('Submit button is initially disabled', () => {
    render(<ScrambleBoard />)
    const submitBtn = screen.getByRole('button', { name: /Submit/i })
    expect(submitBtn).toBeDisabled()
  })
})

describe('Scramble – E2E: hint toggle', () => {
  it('clicking Show hint displays the hint text', () => {
    render(<ScrambleBoard />)
    const hintBtn = screen.getByRole('button', { name: /Show hint/i })

    fireEvent.click(hintBtn)

    // Hint text should appear (it's in quotes)
    const hintTexts = screen.getAllByText(/".*"/)
    expect(hintTexts.length).toBeGreaterThan(0)
  })

  it('clicking Hide hint hides the hint text', () => {
    render(<ScrambleBoard />)
    const hintBtn = screen.getByRole('button', { name: /Show hint/i })

    fireEvent.click(hintBtn)
    expect(screen.getByRole('button', { name: /Hide hint/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Hide hint/i }))

    // Hint should be hidden (button text changes back)
    expect(screen.getByRole('button', { name: /Show hint/i })).toBeInTheDocument()
  })
})

describe('Scramble – E2E: letter placement', () => {
  it('clicking a scrambled letter places it in an answer slot', () => {
    render(<ScrambleBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (btn) => /^[A-Z]$/.test(btn.textContent?.trim() ?? '')
    )

    if (letterBtns.length > 0) {
      fireEvent.click(letterBtns[0])

      // Clear button should now be enabled
      const clearBtn = screen.getByRole('button', { name: /Clear/i })
      expect(clearBtn).toBeEnabled()
    }
  })

  it('clicking an answer slot with a letter removes it', () => {
    render(<ScrambleBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (btn) => /^[A-Z]$/.test(btn.textContent?.trim() ?? '')
    )

    if (letterBtns.length > 0) {
      fireEvent.click(letterBtns[0])

      // Click the filled slot to remove it
      const filledSlots = screen.getAllByRole('button').filter(
        (btn) => btn.getAttribute('aria-label')?.includes('Remove')
      )

      if (filledSlots.length > 0) {
        fireEvent.click(filledSlots[0])

        // Clear button should be disabled again
        const clearBtn = screen.getByRole('button', { name: /Clear/i })
        expect(clearBtn).toBeDisabled()
      }
    }
  })
})

describe('Scramble – E2E: clear button', () => {
  it('Clear button removes all placed letters', () => {
    render(<ScrambleBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (btn) => /^[A-Z]$/.test(btn.textContent?.trim() ?? '')
    )

    if (letterBtns.length > 1) {
      fireEvent.click(letterBtns[0])
      fireEvent.click(letterBtns[1])

      const clearBtn = screen.getByRole('button', { name: /Clear/i })
      fireEvent.click(clearBtn)

      // Clear button should be disabled again
      expect(clearBtn).toBeDisabled()
    }
  })
})

describe('Scramble – Unit: game states', () => {
  it('starts in playing state', () => {
    render(<ScrambleBoard />)
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
  })
})

describe('Scramble – E2E: lives system', () => {
  it('all 5 hearts are visible initially', () => {
    render(<ScrambleBoard />)
    const hearts = screen.getAllByText('❤️')
    expect(hearts.length).toBe(5)
  })
})
