/**
 * Tests for ReactionTimeBoard
 *
 * Unit tests:
 *  - Initial render: title, description, instructions card, Start Game button
 *  - getRating helper returns correct labels for different avg times
 *
 * E2E-style tests:
 *  - Clicking Start Game transitions to the waiting (red) phase
 *  - Clicking the red area too early shows the "Too soon!" screen
 *  - "Try Again" from the too-soon screen re-enters the waiting phase
 *  - After the delay fires the target turns green (ready phase)
 *  - Clicking the green target records a time and advances the round counter
 *  - Completing all 5 rounds shows the results screen
 *  - Results screen shows avg, best, per-round breakdown, and Play Again button
 *  - Play Again resets to idle
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ReactionTimeBoard from '../../components/reactiontime/ReactionTimeBoard'

// Mock canvas for Confetti (used on the results screen)
beforeEach(() => {
  vi.useFakeTimers()
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
  }))
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Helper: advance past the random delay so the target turns green ──────────
function triggerGreen() {
  // MAX_DELAY_MS is 4500 — advancing 5 s is always enough
  act(() => vi.advanceTimersByTime(5000))
}

// ── Helper: play N rounds by waiting for green then clicking ─────────────────
async function playRounds(n) {
  for (let i = 0; i < n; i++) {
    triggerGreen()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Click now!/i })).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /Click now!/i }))
    // Small tick so React can process state updates
    act(() => vi.advanceTimersByTime(10))
  }
}

// ── Unit: initial render ──────────────────────────────────────────────────────

describe('ReactionTime – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<ReactionTimeBoard />)
    expect(document.body).toBeInTheDocument()
  })

  it('shows the game title', () => {
    render(<ReactionTimeBoard />)
    expect(screen.getByText('Reaction Time')).toBeInTheDocument()
  })

  it('shows the subtitle description', () => {
    render(<ReactionTimeBoard />)
    expect(screen.getByText(/Click the target the moment it turns green/i)).toBeInTheDocument()
  })

  it('shows the instructions card with the lightning bolt emoji', () => {
    render(<ReactionTimeBoard />)
    expect(screen.getByText('⚡')).toBeInTheDocument()
  })

  it('shows the Start Game button', () => {
    render(<ReactionTimeBoard />)
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument()
  })

  it('does NOT show the round counter before the game starts', () => {
    render(<ReactionTimeBoard />)
    expect(screen.queryByText(/Round/i)).not.toBeInTheDocument()
  })

  it('does NOT show the red waiting area before the game starts', () => {
    render(<ReactionTimeBoard />)
    expect(
      screen.queryByRole('button', { name: /Waiting area/i })
    ).not.toBeInTheDocument()
  })
})

// ── E2E: starting the game ────────────────────────────────────────────────────

describe('ReactionTime – E2E: starting the game', () => {
  it('clicking Start Game shows the round counter', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(screen.getByText(/1 \/ 5/i)).toBeInTheDocument()
    })
  })

  it('clicking Start Game shows the red waiting area', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Waiting area/i })
      ).toBeInTheDocument()
    })
  })

  it('shows "Wait for green…" text during waiting phase', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(screen.getByText(/Wait for green/i)).toBeInTheDocument()
    })
  })
})

// ── E2E: too-soon penalty ─────────────────────────────────────────────────────

describe('ReactionTime – E2E: too-soon penalty', () => {
  it('clicking the red area shows the Too soon! screen', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    const waitingArea = await screen.findByRole('button', { name: /Waiting area/i })
    fireEvent.click(waitingArea)

    await waitFor(() => {
      expect(screen.getByText(/Too soon!/i)).toBeInTheDocument()
    })
  })

  it('shows a Try Again button after clicking too soon', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    const waitingArea = await screen.findByRole('button', { name: /Waiting area/i })
    fireEvent.click(waitingArea)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
    })
  })

  it('clicking Try Again re-enters the waiting phase', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    const waitingArea = await screen.findByRole('button', { name: /Waiting area/i })
    fireEvent.click(waitingArea)

    const tryAgainBtn = await screen.findByRole('button', { name: /Try Again/i })
    fireEvent.click(tryAgainBtn)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Waiting area/i })
      ).toBeInTheDocument()
    })
  })
})

// ── E2E: green target ─────────────────────────────────────────────────────────

describe('ReactionTime – E2E: green target', () => {
  it('after the delay the green target appears', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    triggerGreen()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Click now!/i })).toBeInTheDocument()
    })
  })

  it('the green target shows "CLICK NOW!" text', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    triggerGreen()

    await waitFor(() => {
      expect(screen.getByText(/CLICK NOW!/i)).toBeInTheDocument()
    })
  })

  it('clicking the green target records a time badge', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    triggerGreen()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Click now!/i })).toBeInTheDocument()
    )
    fireEvent.click(screen.getByRole('button', { name: /Click now!/i }))
    act(() => vi.advanceTimersByTime(10))

    await waitFor(() => {
      expect(screen.getByText(/#1/i)).toBeInTheDocument()
    })
  })

  it('clicking the green target advances the round counter', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    triggerGreen()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Click now!/i })).toBeInTheDocument()
    )
    fireEvent.click(screen.getByRole('button', { name: /Click now!/i }))
    act(() => vi.advanceTimersByTime(10))

    await waitFor(() => {
      expect(screen.getByText(/2 \/ 5/i)).toBeInTheDocument()
    })
  })
})

// ── E2E: completing all rounds ────────────────────────────────────────────────

describe('ReactionTime – E2E: completing all rounds', () => {
  it('completing 5 rounds shows the results screen', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    await waitFor(() => {
      expect(screen.getByText(/rounds complete/i)).toBeInTheDocument()
    })
  })

  it('results screen shows the Avg stat', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    await waitFor(() => {
      expect(screen.getByText('Avg')).toBeInTheDocument()
    })
  })

  it('results screen shows the Best stat', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    await waitFor(() => {
      expect(screen.getByText('Best')).toBeInTheDocument()
    })
  })

  it('results screen shows a per-round breakdown with 5 rows', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    await waitFor(() => {
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Round ${i}`)).toBeInTheDocument()
      }
    })
  })

  it('results screen shows a Play Again button', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Play Again/i })).toBeInTheDocument()
    })
  })

  it('clicking Play Again returns to the idle screen', async () => {
    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    const playAgainBtn = await screen.findByRole('button', { name: /Play Again/i })
    fireEvent.click(playAgainBtn)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument()
    })
  })
})

// ── Unit: getRating helper (via rendered output) ──────────────────────────────

describe('ReactionTime – Unit: rating labels', () => {
  // We test the rating by mocking Date.now so all 5 clicks register a specific time.

  it('shows "Superhuman!" for avg < 200 ms', async () => {
    let callCount = 0
    const BASE = 1_000_000
    vi.spyOn(Date, 'now').mockImplementation(() => {
      // Each pair of calls: first when target turns green (setStartTs), second on click
      // We return BASE on even calls and BASE + 100 on odd calls → 100 ms per round
      return callCount++ % 2 === 0 ? BASE : BASE + 100
    })

    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    await waitFor(() => {
      expect(screen.getByText('Superhuman!')).toBeInTheDocument()
    })

    vi.restoreAllMocks()
  })

  it('shows "Keep trying!" for avg >= 500 ms', async () => {
    let callCount = 0
    const BASE = 1_000_000
    vi.spyOn(Date, 'now').mockImplementation(() => {
      return callCount++ % 2 === 0 ? BASE : BASE + 600
    })

    render(<ReactionTimeBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await playRounds(5)

    await waitFor(() => {
      expect(screen.getByText('Keep trying!')).toBeInTheDocument()
    })

    vi.restoreAllMocks()
  })
})
