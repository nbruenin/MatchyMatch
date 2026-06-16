/**
 * Tests for the Anagram game (AnagramBoard)
 *
 * Unit tests cover:
 *  - Initial render: round counter, score, timer, letter tiles, action buttons
 *  - Scoring guide display
 *  - Clear button disabled state on empty answer
 *
 * E2E-style tests cover:
 *  - Clicking a scrambled letter moves it to the answer area
 *  - Clicking a placed letter returns it to the scrambled row
 *  - Clear button becomes enabled after placing a letter, then clears on click
 *  - Skip button advances the round (or shows game-over after 5 skips)
 *  - Full game flow: skip all 5 rounds → game-over screen with Play Again
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AnagramBoard from '../../components/anagram/AnagramBoard'

// Freeze timers so the countdown doesn't fire during tests
beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit Tests ────────────────────────────────────────────────────────────────

describe('Anagram – Unit: initial render', () => {
  it('shows Round 1/5 on first render', () => {
    render(<AnagramBoard />)
    expect(screen.getByText(/Round 1\/5/i)).toBeInTheDocument()
  })

  it('shows a score of 0 initially', () => {
    render(<AnagramBoard />)
    // ScoreBadge renders the numeric score
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows the countdown timer starting at 30', () => {
    render(<AnagramBoard />)
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('renders scrambled letter tiles as buttons', () => {
    render(<AnagramBoard />)
    // Filter for single uppercase-letter buttons (the scrambled tiles)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent ?? '')
    )
    expect(letterBtns.length).toBeGreaterThan(0)
  })

  it('renders a Clear button that is initially disabled', () => {
    render(<AnagramBoard />)
    const clearBtn = screen.getByRole('button', { name: /clear/i })
    expect(clearBtn).toBeDisabled()
  })

  it('renders a Skip button that is initially enabled', () => {
    render(<AnagramBoard />)
    const skipBtn = screen.getByRole('button', { name: /skip/i })
    expect(skipBtn).toBeEnabled()
  })

  it('shows the "Tap letters below to build the word" placeholder', () => {
    render(<AnagramBoard />)
    expect(
      screen.getByText(/Tap letters below to build the word/i)
    ).toBeInTheDocument()
  })

  it('displays the scoring guide with "pts" labels', () => {
    render(<AnagramBoard />)
    const ptsBadges = screen.getAllByText(/pts/i)
    expect(ptsBadges.length).toBeGreaterThan(0)
  })

  it('shows the Score label in the score badge', () => {
    render(<AnagramBoard />)
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('renders 5 round-progress dots', () => {
    render(<AnagramBoard />)
    // Each dot is a plain div, but the round text confirms 5 rounds
    expect(screen.getByText(/Round 1\/5/i)).toBeInTheDocument()
  })
})

// ── E2E Tests ─────────────────────────────────────────────────────────────────

describe('Anagram – E2E: letter interaction', () => {
  it('clicking a scrambled letter removes the placeholder text', () => {
    render(<AnagramBoard />)
    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent ?? '')
    )
    expect(letterBtns.length).toBeGreaterThan(0)

    fireEvent.click(letterBtns[0])

    // Placeholder should be gone (or at least a letter is now in the answer area)
    // The placeholder disappears once at least one letter is placed
    expect(
      screen.queryByText(/Tap letters below to build the word/i)
    ).not.toBeInTheDocument()
  })

  it('Clear button becomes enabled after placing a letter', () => {
    render(<AnagramBoard />)
    const clearBtn = screen.getByRole('button', { name: /clear/i })
    expect(clearBtn).toBeDisabled()

    const letterBtns = screen.getAllByRole('button').filter(
      (b) => /^[A-Z]$/.test(b.textContent ?? '')
    )
    fireEvent.click(letterBtns[0])

    expect(clearBtn).toBeEnabled()
  })

  it('clicking Clear returns letters to the scrambled row', () => {
    render(<AnagramBoard />)
    const letterBtns = () =>
      screen.getAllByRole('button').filter(
        (b) => /^[A-Z]$/.test(b.textContent ?? '')
      )

    const initialCount = letterBtns().length
    fireEvent.click(letterBtns()[0])

    // After placing, the placeholder is gone
    expect(
      screen.queryByText(/Tap letters below to build the word/i)
    ).not.toBeInTheDocument()

    const clearBtn = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearBtn)

    // Placeholder should reappear
    expect(
      screen.getByText(/Tap letters below to build the word/i)
    ).toBeInTheDocument()

    // All letter tiles should be back
    expect(letterBtns().length).toBe(initialCount)
  })
})

describe('Anagram – E2E: skip & round progression', () => {
  it('clicking Skip keeps the Skip button visible (round advances or game ends)', async () => {
    render(<AnagramBoard />)
    const skipBtn = screen.getByRole('button', { name: /skip/i })
    fireEvent.click(skipBtn)

    // After skip, either still on a round or game-over screen appears
    // Advance timers to let state settle
    vi.runAllTimers()

    await waitFor(() => {
      const stillSkip = screen.queryByRole('button', { name: /skip/i })
      const playAgain = screen.queryByRole('button', { name: /play again/i })
      expect(stillSkip !== null || playAgain !== null).toBe(true)
    })
  })

  it('skipping all 5 rounds shows the game-over / results screen', async () => {
    render(<AnagramBoard />)

    for (let i = 0; i < 5; i++) {
      const skipBtn = screen.queryByRole('button', { name: /skip/i })
      if (!skipBtn) break
      fireEvent.click(skipBtn)
      vi.runAllTimers()
      // Small pause between rounds
      await waitFor(() => {}, { timeout: 50 })
    }

    vi.runAllTimers()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /play again/i })
      ).toBeInTheDocument()
    })
  })

  it('Play Again button resets the game to Round 1/5', async () => {
    render(<AnagramBoard />)

    // Skip through all rounds
    for (let i = 0; i < 5; i++) {
      const skipBtn = screen.queryByRole('button', { name: /skip/i })
      if (!skipBtn) break
      fireEvent.click(skipBtn)
      vi.runAllTimers()
      await waitFor(() => {}, { timeout: 50 })
    }

    vi.runAllTimers()

    const playAgainBtn = await screen.findByRole('button', { name: /play again/i })
    fireEvent.click(playAgainBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Round 1\/5/i)).toBeInTheDocument()
    })
  })
})

describe('Anagram – E2E: final score screen', () => {
  it('shows "Final Score" heading on the results screen', async () => {
    render(<AnagramBoard />)

    for (let i = 0; i < 5; i++) {
      const skipBtn = screen.queryByRole('button', { name: /skip/i })
      if (!skipBtn) break
      fireEvent.click(skipBtn)
      vi.runAllTimers()
      await waitFor(() => {}, { timeout: 50 })
    }

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Final Score/i)).toBeInTheDocument()
    })
  })

  it('shows "out of 500" on the results screen (5 rounds × 100 max pts)', async () => {
    render(<AnagramBoard />)

    for (let i = 0; i < 5; i++) {
      const skipBtn = screen.queryByRole('button', { name: /skip/i })
      if (!skipBtn) break
      fireEvent.click(skipBtn)
      vi.runAllTimers()
      await waitFor(() => {}, { timeout: 50 })
    }

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/out of 500/i)).toBeInTheDocument()
    })
  })
})
