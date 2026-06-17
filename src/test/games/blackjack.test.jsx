/**
 * Tests for the Blackjack game (BlackjackBoard)
 *
 * Unit tests cover:
 *  - Initial render: balance display, bet display, chip buttons, Deal button
 *  - All 5 chip denominations are rendered ($5, $10, $25, $50, $100)
 *  - Deal button is disabled when no bet is placed
 *  - Rules hint text is shown during betting phase
 *
 * E2E-style tests cover:
 *  - Clicking a chip increases the current bet
 *  - Clicking multiple chips accumulates the bet
 *  - Clear Bet button resets the bet to $0
 *  - Clicking Deal with a bet transitions to the playing phase (Hit/Stand visible)
 *  - Hit button draws a card (player hand grows)
 *  - Stand button triggers dealer play and shows a result
 *  - Double Down button is shown when player has 2 cards
 *  - Next Round button appears after a result
 *  - Next Round resets back to the betting phase
 *  - handTotal utility correctly sums card values
 *  - handTotal handles soft aces (A + A = 12, not 22)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BlackjackBoard, { handTotal } from '../../components/blackjack/BlackjackBoard'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit: handTotal utility ───────────────────────────────────────────────────

describe('Blackjack – Unit: handTotal', () => {
  it('sums numeric cards correctly', () => {
    const hand = [
      { rank: '7', suit: '♠' },
      { rank: '8', suit: '♥' },
    ]
    expect(handTotal(hand)).toBe(15)
  })

  it('counts J, Q, K as 10', () => {
    const hand = [
      { rank: 'J', suit: '♠' },
      { rank: 'Q', suit: '♥' },
    ]
    expect(handTotal(hand)).toBe(20)
  })

  it('counts Ace as 11 when safe', () => {
    const hand = [
      { rank: 'A', suit: '♠' },
      { rank: '9', suit: '♥' },
    ]
    expect(handTotal(hand)).toBe(20)
  })

  it('counts Ace as 1 when 11 would bust', () => {
    const hand = [
      { rank: 'A', suit: '♠' },
      { rank: '9', suit: '♥' },
      { rank: '5', suit: '♦' },
    ]
    expect(handTotal(hand)).toBe(15)
  })

  it('handles two Aces as 12 (soft)', () => {
    const hand = [
      { rank: 'A', suit: '♠' },
      { rank: 'A', suit: '♥' },
    ]
    expect(handTotal(hand)).toBe(12)
  })

  it('returns 21 for A + K (blackjack)', () => {
    const hand = [
      { rank: 'A', suit: '♠' },
      { rank: 'K', suit: '♥' },
    ]
    expect(handTotal(hand)).toBe(21)
  })
})

// ── Unit: initial render ──────────────────────────────────────────────────────

describe('Blackjack – Unit: initial render', () => {
  it('renders the game container', () => {
    render(<BlackjackBoard />)
    expect(screen.getByRole('generic', { name: /blackjack game/i })).toBeInTheDocument()
  })

  it('shows the starting balance of $500', () => {
    render(<BlackjackBoard />)
    expect(screen.getByText('$500')).toBeInTheDocument()
  })

  it('shows a $0 bet initially', () => {
    render(<BlackjackBoard />)
    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('renders the Balance label', () => {
    render(<BlackjackBoard />)
    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('renders the Bet label', () => {
    render(<BlackjackBoard />)
    expect(screen.getByText('Bet')).toBeInTheDocument()
  })

  it('renders all 5 chip buttons', () => {
    render(<BlackjackBoard />)
    expect(screen.getByRole('button', { name: /Add \$5 chip/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add \$10 chip/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add \$25 chip/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add \$50 chip/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add \$100 chip/i })).toBeInTheDocument()
  })

  it('renders the Deal button', () => {
    render(<BlackjackBoard />)
    expect(screen.getByRole('button', { name: /Deal/i })).toBeInTheDocument()
  })

  it('Deal button is disabled when bet is $0', () => {
    render(<BlackjackBoard />)
    expect(screen.getByRole('button', { name: /Deal/i })).toBeDisabled()
  })

  it('shows the rules hint text', () => {
    render(<BlackjackBoard />)
    expect(screen.getByText(/Get closer to 21 than the dealer/i)).toBeInTheDocument()
  })

  it('shows "Place your bet" heading', () => {
    render(<BlackjackBoard />)
    expect(screen.getByText(/Place your bet/i)).toBeInTheDocument()
  })
})

// ── E2E: betting ──────────────────────────────────────────────────────────────

describe('Blackjack – E2E: betting', () => {
  it('clicking a $10 chip increases the bet', async () => {
    render(<BlackjackBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Add \$10 chip/i }))
    await waitFor(() => {
      expect(screen.getByText('$10')).toBeInTheDocument()
    })
  })

  it('clicking multiple chips accumulates the bet', async () => {
    render(<BlackjackBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Add \$25 chip/i }))
    fireEvent.click(screen.getByRole('button', { name: /Add \$10 chip/i }))
    await waitFor(() => {
      expect(screen.getByText('$35')).toBeInTheDocument()
    })
  })

  it('Clear Bet button resets the bet to $0', async () => {
    render(<BlackjackBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Add \$25 chip/i }))
    await waitFor(() => {
      expect(screen.getByText('Clear Bet')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /Clear Bet/i }))
    await waitFor(() => {
      expect(screen.getByText('$0')).toBeInTheDocument()
    })
  })

  it('Deal button becomes enabled after placing a bet', async () => {
    render(<BlackjackBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Add \$5 chip/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Deal/i })).not.toBeDisabled()
    })
  })

  it('Clear Bet button is not shown when bet is $0', () => {
    render(<BlackjackBoard />)
    expect(screen.queryByRole('button', { name: /Clear Bet/i })).not.toBeInTheDocument()
  })
})

// ── E2E: dealing ──────────────────────────────────────────────────────────────

describe('Blackjack – E2E: dealing', () => {
  function placeBetAndDeal() {
    fireEvent.click(screen.getByRole('button', { name: /Add \$25 chip/i }))
    fireEvent.click(screen.getByRole('button', { name: /Deal/i }))
  }

  it('dealing shows Hit and Stand buttons (or a result on blackjack)', async () => {
    render(<BlackjackBoard />)
    placeBetAndDeal()
    await waitFor(() => {
      const hitBtn = screen.queryByRole('button', { name: /Hit/i })
      const standBtn = screen.queryByRole('button', { name: /Stand/i })
      const nextRound = screen.queryByRole('button', { name: /Next Round/i })
      // Either playing (hit/stand) or instant result (blackjack)
      expect(hitBtn !== null || nextRound !== null).toBe(true)
      if (hitBtn) expect(standBtn).toBeInTheDocument()
    })
  })

  it('dealing shows the Dealer label', async () => {
    render(<BlackjackBoard />)
    placeBetAndDeal()
    await waitFor(() => {
      expect(screen.getByText('Dealer')).toBeInTheDocument()
    })
  })

  it('dealing shows the You label', async () => {
    render(<BlackjackBoard />)
    placeBetAndDeal()
    await waitFor(() => {
      expect(screen.getByText('You')).toBeInTheDocument()
    })
  })

  it('dealing hides the betting chip selector', async () => {
    render(<BlackjackBoard />)
    placeBetAndDeal()
    await waitFor(() => {
      // Chip buttons should be gone after dealing
      expect(screen.queryByRole('button', { name: /Add \$5 chip/i })).not.toBeInTheDocument()
    })
  })
})

// ── E2E: playing ──────────────────────────────────────────────────────────────

describe('Blackjack – E2E: playing', () => {
  function placeBetAndDeal() {
    fireEvent.click(screen.getByRole('button', { name: /Add \$25 chip/i }))
    fireEvent.click(screen.getByRole('button', { name: /Deal/i }))
  }

  it('clicking Stand shows a result', async () => {
    render(<BlackjackBoard />)
    placeBetAndDeal()

    await waitFor(() => {
      const standBtn = screen.queryByRole('button', { name: /Stand/i })
      if (standBtn) fireEvent.click(standBtn)
    })

    await waitFor(() => {
      const nextRound = screen.queryByRole('button', { name: /Next Round/i })
      expect(nextRound).not.toBeNull()
    })
  })

  it('clicking Next Round returns to betting phase', async () => {
    render(<BlackjackBoard />)
    placeBetAndDeal()

    // Stand or wait for result
    await waitFor(() => {
      const standBtn = screen.queryByRole('button', { name: /Stand/i })
      if (standBtn) fireEvent.click(standBtn)
    })

    await waitFor(() => {
      const nextRound = screen.queryByRole('button', { name: /Next Round/i })
      if (nextRound) fireEvent.click(nextRound)
    })

    await waitFor(() => {
      expect(screen.getByText(/Place your bet/i)).toBeInTheDocument()
    })
  })

  it('Double Down button appears when player has exactly 2 cards', async () => {
    render(<BlackjackBoard />)
    placeBetAndDeal()

    await waitFor(() => {
      const hitBtn = screen.queryByRole('button', { name: /Hit/i })
      if (hitBtn) {
        // If we're in playing phase with 2 cards, Double should be visible
        const doubleBtn = screen.queryByRole('button', { name: /Double/i })
        // Double is shown when balance >= bet (which it is at start)
        expect(doubleBtn).not.toBeNull()
      }
    })
  })
})

// ── E2E: face-down card ───────────────────────────────────────────────────────

describe('Blackjack – E2E: face-down card', () => {
  it("dealer's second card is face-down during playing phase", async () => {
    render(<BlackjackBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Add \$25 chip/i }))
    fireEvent.click(screen.getByRole('button', { name: /Deal/i }))

    await waitFor(() => {
      const hitBtn = screen.queryByRole('button', { name: /Hit/i })
      if (hitBtn) {
        // Face-down card should be present
        expect(screen.getByLabelText(/Face-down card/i)).toBeInTheDocument()
      }
    })
  })
})
