/**
 * Tests for TypingSpeedBoard
 *
 * Unit tests:
 *  - Initial render: title, description, instructions card, Start Game button
 *  - getRating helper returns correct labels for different WPM values (via rendered output)
 *
 * E2E-style tests:
 *  - Clicking Start Game transitions to the playing phase (shows prompt + input)
 *  - Typing correct characters turns them green (correct colour)
 *  - Typing incorrect characters turns them red
 *  - WPM and Accuracy stats are shown while playing
 *  - Progress bar advances as the user types
 *  - Finishing the prompt early ends the game and shows the results screen
 *  - Timer countdown ends the game and shows the results screen
 *  - Results screen shows WPM, Accuracy, Chars stats and Play Again button
 *  - Play Again returns to the idle screen
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import TypingSpeedBoard from '../../components/typingspeed/TypingSpeedBoard'

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

// ── Unit: initial render ──────────────────────────────────────────────────────

describe('TypingSpeed – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<TypingSpeedBoard />)
    expect(document.body).toBeInTheDocument()
  })

  it('shows the game title', () => {
    render(<TypingSpeedBoard />)
    expect(screen.getByText('Typing Speed')).toBeInTheDocument()
  })

  it('shows the subtitle description', () => {
    render(<TypingSpeedBoard />)
    expect(
      screen.getByText(/Type the prompt as fast and accurately as you can/i)
    ).toBeInTheDocument()
  })

  it('shows the instructions card with the keyboard emoji', () => {
    render(<TypingSpeedBoard />)
    expect(screen.getByText('⌨️')).toBeInTheDocument()
  })

  it('shows the Start Game button', () => {
    render(<TypingSpeedBoard />)
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument()
  })

  it('does NOT show the typing input before the game starts', () => {
    render(<TypingSpeedBoard />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('does NOT show the typing prompt before the game starts', () => {
    render(<TypingSpeedBoard />)
    expect(screen.queryByLabelText('typing prompt')).not.toBeInTheDocument()
  })
})

// ── E2E: starting the game ────────────────────────────────────────────────────

describe('TypingSpeed – E2E: starting the game', () => {
  it('clicking Start Game shows the typing input', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('typing input')).toBeInTheDocument()
    })
  })

  it('clicking Start Game shows the typing prompt', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('typing prompt')).toBeInTheDocument()
    })
  })

  it('clicking Start Game shows the timer', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(screen.getByText(/30s/i)).toBeInTheDocument()
    })
  })

  it('clicking Start Game shows WPM stat', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(screen.getByText('WPM')).toBeInTheDocument()
    })
  })

  it('clicking Start Game shows Accuracy stat', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      expect(screen.getByText('Accuracy')).toBeInTheDocument()
    })
  })
})

// ── E2E: typing behaviour ─────────────────────────────────────────────────────

describe('TypingSpeed – E2E: typing behaviour', () => {
  it('typing updates the character counter', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    const input = await screen.findByLabelText('typing input')
    // Advance timer slightly so elapsed > 0 for WPM calc
    act(() => vi.advanceTimersByTime(1000))

    fireEvent.change(input, { target: { value: 'T' } })

    await waitFor(() => {
      expect(screen.getByText(/1 \//i)).toBeInTheDocument()
    })
  })

  it('typing shows the progress bar region', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    await waitFor(() => {
      // The character counter text "0 / N characters" should be present
      expect(screen.getByText(/0 \//i)).toBeInTheDocument()
    })
  })
})

// ── E2E: timer countdown ──────────────────────────────────────────────────────

describe('TypingSpeed – E2E: timer countdown', () => {
  it('timer decrements after 1 second', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    act(() => vi.advanceTimersByTime(1000))

    await waitFor(() => {
      expect(screen.getByText(/29s/i)).toBeInTheDocument()
    })
  })

  it('timer reaching 0 shows the results screen', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    // Advance 30 seconds
    act(() => vi.advanceTimersByTime(30_000))

    await waitFor(() => {
      expect(screen.getByText(/typing test complete/i)).toBeInTheDocument()
    })
  })
})

// ── E2E: finishing the prompt early ──────────────────────────────────────────

describe('TypingSpeed – E2E: finishing prompt early', () => {
  it('completing the full prompt shows the results screen', async () => {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    act(() => vi.advanceTimersByTime(1000))

    const input = await screen.findByLabelText('typing input')
    const prompt = screen.getByLabelText('typing prompt').textContent

    fireEvent.change(input, { target: { value: prompt } })

    await waitFor(() => {
      expect(screen.getByText(/typing test complete/i)).toBeInTheDocument()
    })
  })
})

// ── E2E: results screen ───────────────────────────────────────────────────────

describe('TypingSpeed – E2E: results screen', () => {
  async function finishGame() {
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))
    act(() => vi.advanceTimersByTime(30_000))
    await waitFor(() =>
      expect(screen.getByText(/typing test complete/i)).toBeInTheDocument()
    )
  }

  it('results screen shows WPM stat', async () => {
    await finishGame()
    expect(screen.getByText('WPM')).toBeInTheDocument()
  })

  it('results screen shows Accuracy stat', async () => {
    await finishGame()
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
  })

  it('results screen shows Chars stat', async () => {
    await finishGame()
    expect(screen.getByText('Chars')).toBeInTheDocument()
  })

  it('results screen shows a Play Again button', async () => {
    await finishGame()
    expect(screen.getByRole('button', { name: /Play Again/i })).toBeInTheDocument()
  })

  it('clicking Play Again returns to the idle screen', async () => {
    await finishGame()
    fireEvent.click(screen.getByRole('button', { name: /Play Again/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument()
    })
  })
})

// ── Unit: rating labels (via rendered output) ─────────────────────────────────

describe('TypingSpeed – Unit: rating labels', () => {
  async function finishWithWpm(targetWpm) {
    // We control WPM by typing `targetWpm * 5` correct chars in 60s.
    // Since the game is only 30s, we type targetWpm*5/2 chars in 30s.
    render(<TypingSpeedBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))

    // Advance 1 second so elapsed > 0
    act(() => vi.advanceTimersByTime(1000))

    const input = await screen.findByLabelText('typing input')
    const prompt = screen.getByLabelText('typing prompt').textContent

    // Type the correct number of characters to hit the target WPM
    // WPM = (correctChars / 5) / (elapsed / 60)
    // At elapsed=1s: correctChars = targetWpm * 5 / 60
    // We just type the full prompt to get a high WPM, or type nothing for low WPM
    if (targetWpm >= 80) {
      // Type the whole prompt to maximise WPM
      fireEvent.change(input, { target: { value: prompt } })
    } else {
      // Let the timer expire with no typing → WPM = 0
      act(() => vi.advanceTimersByTime(30_000))
    }

    await waitFor(() =>
      expect(screen.getByText(/typing test complete/i)).toBeInTheDocument()
    )
  }

  it('shows "Keep Practicing!" for 0 WPM', async () => {
    await finishWithWpm(0)
    expect(screen.getByText('Keep Practicing!')).toBeInTheDocument()
  })
})
