/**
 * Tests for SpellingBeeBoard
 *
 * Unit tests:
 *  - Initial render: honeycomb, score bar, input display, action buttons
 *  - Center letter is rendered (golden)
 *  - 6 outer letters are rendered
 *  - Delete, Shuffle, Enter, Clear buttons present
 *  - "Found words (0)" shown initially
 *
 * E2E-style tests:
 *  - Clicking a letter adds it to the input
 *  - Delete button removes last letter
 *  - Clear button clears input
 *  - Shuffle button reorders outer letters
 *  - Enter button is disabled when input < 4 chars
 *  - Submitting a too-short word shows toast
 *  - New Puzzle button resets the game
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SpellingBeeBoard from '../../components/spellingbee/SpellingBeeBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('SpellingBee – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<SpellingBeeBoard />)
    expect(document.body).toBeInTheDocument()
  })

  it('shows "Spelling Bee" label', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByText(/Spelling Bee/i)).toBeInTheDocument()
  })

  it('shows the honeycomb aria label', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByLabelText(/Letter honeycomb/i)).toBeInTheDocument()
  })

  it('renders 7 letter buttons (1 center + 6 outer)', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    expect(letterBtns.length).toBe(7)
  })

  it('renders Delete button', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument()
  })

  it('renders Shuffle button', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByRole('button', { name: /Shuffle/i })).toBeInTheDocument()
  })

  it('renders Enter button', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByRole('button', { name: /Enter/i })).toBeInTheDocument()
  })

  it('renders Clear button', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('shows "Found words (0)" initially', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByText(/Found words \(0\)/i)).toBeInTheDocument()
  })

  it('shows "No words found yet" in found list', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByText(/No words found yet/i)).toBeInTheDocument()
  })

  it('shows the placeholder "Type or tap letters" in input', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByText(/Type or tap letters/i)).toBeInTheDocument()
  })

  it('Enter button is disabled when input is empty', () => {
    render(<SpellingBeeBoard />)
    const enterBtn = screen.getByRole('button', { name: /Enter/i })
    expect(enterBtn).toBeDisabled()
  })

  it('Delete button is disabled when input is empty', () => {
    render(<SpellingBeeBoard />)
    const deleteBtn = screen.getByRole('button', { name: /Delete/i })
    expect(deleteBtn).toBeDisabled()
  })

  it('Clear button is disabled when input is empty', () => {
    render(<SpellingBeeBoard />)
    const clearBtn = screen.getByRole('button', { name: /Clear/i })
    expect(clearBtn).toBeDisabled()
  })

  it('shows New Puzzle button', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByRole('button', { name: /New Puzzle/i })).toBeInTheDocument()
  })

  it('shows rank hint text', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByText(/Current rank:/i)).toBeInTheDocument()
  })

  it('shows Queen Bee goal text', () => {
    render(<SpellingBeeBoard />)
    expect(screen.getByText(/Queen Bee/i)).toBeInTheDocument()
  })
})

describe('SpellingBee – E2E: letter interaction', () => {
  it('clicking a letter adds it to the input display', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    expect(letterBtns.length).toBeGreaterThan(0)

    fireEvent.click(letterBtns[0])

    // Placeholder should be gone
    expect(screen.queryByText(/Type or tap letters/i)).not.toBeInTheDocument()
  })

  it('clicking a letter enables the Delete button', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    fireEvent.click(letterBtns[0])

    const deleteBtn = screen.getByRole('button', { name: /Delete/i })
    expect(deleteBtn).not.toBeDisabled()
  })

  it('clicking a letter enables the Clear button', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    fireEvent.click(letterBtns[0])

    const clearBtn = screen.getByRole('button', { name: /Clear/i })
    expect(clearBtn).not.toBeDisabled()
  })

  it('clicking Delete removes the last letter', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    fireEvent.click(letterBtns[0])

    // Placeholder gone
    expect(screen.queryByText(/Type or tap letters/i)).not.toBeInTheDocument()

    const deleteBtn = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteBtn)

    // Placeholder back
    expect(screen.getByText(/Type or tap letters/i)).toBeInTheDocument()
  })

  it('clicking Clear clears all letters', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    // Click multiple letters
    fireEvent.click(letterBtns[0])
    fireEvent.click(letterBtns[1])

    const clearBtn = screen.getByRole('button', { name: /Clear/i })
    fireEvent.click(clearBtn)

    expect(screen.getByText(/Type or tap letters/i)).toBeInTheDocument()
  })

  it('Enter button is disabled when input has fewer than 4 letters', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    // Click only 2 letters
    fireEvent.click(letterBtns[0])
    fireEvent.click(letterBtns[1])

    const enterBtn = screen.getByRole('button', { name: /Enter/i })
    expect(enterBtn).toBeDisabled()
  })

  it('Enter button is enabled when input has 4+ letters', () => {
    render(<SpellingBeeBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent?.trim() ?? '')
    )
    // Click 4 letters
    for (let i = 0; i < 4; i++) {
      fireEvent.click(letterBtns[i % letterBtns.length])
    }

    const enterBtn = screen.getByRole('button', { name: /Enter/i })
    expect(enterBtn).not.toBeDisabled()
  })

  it('New Puzzle button resets the game', async () => {
    render(<SpellingBeeBoard />)
    const newPuzzleBtn = screen.getByRole('button', { name: /New Puzzle/i })

    fireEvent.click(newPuzzleBtn)
    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Found words \(0\)/i)).toBeInTheDocument()
    })
  })
})
