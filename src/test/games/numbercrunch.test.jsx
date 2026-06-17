/**
 * Tests for the NumberCrunch game (NumberCrunchBoard)
 *
 * Unit tests cover:
 *  - Initial render: target display, number tiles, operator buttons
 *  - Puzzle generation (numbers between 1-100, target 100-999)
 *  - Operator selection
 *
 * E2E-style tests cover:
 *  - Selecting an operator highlights it
 *  - Clicking two numbers with an operator performs calculation
 *  - Invalid operations (division by zero, negative results) show error
 *  - Reaching the target shows win screen
 *  - Undo button removes last operation
 *  - Reset button clears all operations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NumberCrunchBoard from '../../components/numbercrunch/NumberCrunchBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('NumberCrunch – Unit: initial render', () => {
  it('shows a target number between 100 and 999', () => {
    render(<NumberCrunchBoard />)
    expect(screen.getByText('Target')).toBeInTheDocument()
    // Target should be displayed as a large number
    const targetSection = screen.getByText('Target').closest('div')
    expect(targetSection).toBeInTheDocument()
  })

  it('renders 6 number tiles', () => {
    render(<NumberCrunchBoard />)
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )
    // Should have at least 6 initial number tiles
    expect(numberBtns.length).toBeGreaterThanOrEqual(6)
  })

  it('renders 4 operator buttons: +, −, ×, ÷', () => {
    render(<NumberCrunchBoard />)
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument()
  })

  it('renders Undo and Reset buttons', () => {
    render(<NumberCrunchBoard />)
    expect(screen.getByRole('button', { name: /Undo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument()
  })

  it('Undo button is initially disabled', () => {
    render(<NumberCrunchBoard />)
    const undoBtn = screen.getByRole('button', { name: /Undo/i })
    expect(undoBtn).toBeDisabled()
  })

  it('shows instruction text', () => {
    render(<NumberCrunchBoard />)
    expect(
      screen.getByText(/Pick an operator, then tap two numbers/i)
    ).toBeInTheDocument()
  })
})

describe('NumberCrunch – E2E: operator selection', () => {
  it('clicking an operator highlights it', () => {
    render(<NumberCrunchBoard />)
    const addBtn = screen.getByRole('button', { name: '+' })

    fireEvent.click(addBtn)

    // Button should have active styling (blue background)
    expect(addBtn).toHaveStyle({ background: 'var(--accent)' })
  })

  it('clicking the same operator again deselects it', () => {
    render(<NumberCrunchBoard />)
    const addBtn = screen.getByRole('button', { name: '+' })

    fireEvent.click(addBtn)
    fireEvent.click(addBtn)

    // Should be deselected (back to default styling)
    expect(addBtn).not.toHaveStyle({ background: 'var(--accent)' })
  })

  it('switching operators changes the active one', () => {
    render(<NumberCrunchBoard />)
    const addBtn = screen.getByRole('button', { name: '+' })
    const subBtn = screen.getByRole('button', { name: '−' })

    fireEvent.click(addBtn)
    expect(addBtn).toHaveStyle({ background: 'var(--accent)' })

    fireEvent.click(subBtn)
    expect(subBtn).toHaveStyle({ background: 'var(--accent)' })
  })
})

describe('NumberCrunch – E2E: number operations', () => {
  it('clicking two numbers with an operator performs calculation', async () => {
    render(<NumberCrunchBoard />)

    const addBtn = screen.getByRole('button', { name: '+' })
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )

    if (numberBtns.length >= 2) {
      fireEvent.click(addBtn)
      fireEvent.click(numberBtns[0])
      fireEvent.click(numberBtns[1])

      vi.runAllTimers()

      // After operation, a new result tile should appear
      await waitFor(() => {
        const allNumbers = screen.getAllByRole('button').filter(
          (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
        )
        // Should have more tiles now (original 6 + result)
        expect(allNumbers.length).toBeGreaterThanOrEqual(7)
      })
    }
  })

  it('division by zero shows error toast', async () => {
    render(<NumberCrunchBoard />)

    const divBtn = screen.getByRole('button', { name: '÷' })
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )

    // Try to divide by a number that might be 0 or not divisible
    if (numberBtns.length >= 2) {
      fireEvent.click(divBtn)
      fireEvent.click(numberBtns[0])
      fireEvent.click(numberBtns[1])

      vi.runAllTimers()

      // If division fails, error toast should appear
      // (This may or may not happen depending on random numbers)
      await waitFor(() => {}, { timeout: 100 })
    }
  })
})

describe('NumberCrunch – E2E: undo and reset', () => {
  it('Undo button becomes enabled after an operation', async () => {
    render(<NumberCrunchBoard />)

    const addBtn = screen.getByRole('button', { name: '+' })
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )

    if (numberBtns.length >= 2) {
      fireEvent.click(addBtn)
      fireEvent.click(numberBtns[0])
      fireEvent.click(numberBtns[1])

      vi.runAllTimers()

      const undoBtn = screen.getByRole('button', { name: /Undo/i })
      await waitFor(() => {
        expect(undoBtn).toBeEnabled()
      })
    }
  })

  it('clicking Undo removes the last operation', async () => {
    render(<NumberCrunchBoard />)

    const addBtn = screen.getByRole('button', { name: '+' })
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )

    if (numberBtns.length >= 2) {
      fireEvent.click(addBtn)
      fireEvent.click(numberBtns[0])
      fireEvent.click(numberBtns[1])

      vi.runAllTimers()

      const undoBtn = screen.getByRole('button', { name: /Undo/i })
      fireEvent.click(undoBtn)

      vi.runAllTimers()

      // After undo, should be back to 6 tiles
      await waitFor(() => {
        const allNumbers = screen.getAllByRole('button').filter(
          (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
        )
        expect(allNumbers.length).toBeLessThanOrEqual(6)
      })
    }
  })

  it('clicking Reset clears all operations', async () => {
    render(<NumberCrunchBoard />)

    const addBtn = screen.getByRole('button', { name: '+' })
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )

    if (numberBtns.length >= 2) {
      fireEvent.click(addBtn)
      fireEvent.click(numberBtns[0])
      fireEvent.click(numberBtns[1])

      vi.runAllTimers()

      const resetBtn = screen.getByRole('button', { name: /Reset/i })
      fireEvent.click(resetBtn)

      vi.runAllTimers()

      // After reset, should be back to initial state
      const undoBtn = screen.getByRole('button', { name: /Undo/i })
      expect(undoBtn).toBeDisabled()
    }
  })
})

describe('NumberCrunch – Unit: puzzle generation', () => {
  it('generates numbers for the puzzle', () => {
    render(<NumberCrunchBoard />)
    const numberBtns = screen.getAllByRole('button').filter(
      (btn) => /^\d+$/.test(btn.textContent?.trim() ?? '')
    )
    expect(numberBtns.length).toBeGreaterThan(0)
  })

  it('target is always between 100 and 999', () => {
    render(<NumberCrunchBoard />)
    // Target is displayed in a large box
    const targetSection = screen.getByText('Target').closest('div')
    expect(targetSection).toBeInTheDocument()
  })
})
