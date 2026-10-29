/**
 * Tests for the Guess the Number game (GuessTheNumberBoard)
 *
 * Unit tests cover:
 *  - Initial render: difficulty selector with three options
 *  - Difficulty buttons are clickable
 *  - Each difficulty shows correct range and attempt count
 *
 * E2E-style tests cover:
 *  - Selecting a difficulty starts the game
 *  - Game screen shows stats bar with range, attempts left, and total guesses
 *  - Entering a guess and clicking Guess button processes the guess
 *  - Feedback is provided (too high, too low, correct)
 *  - Guess history is displayed
 *  - Winning the game shows the win screen
 *  - Losing the game shows the game over screen
 *  - Play Again resets the game
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GuessTheNumberBoard from '../../components/guessthenumber/GuessTheNumberBoard'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit Tests ────────────────────────────────────────────────────────────────

describe('Guess the Number – Unit: difficulty selection', () => {
  it('renders the difficulty selector heading', () => {
    render(<GuessTheNumberBoard />)
    expect(screen.getByText('Choose Difficulty')).toBeInTheDocument()
  })

  it('renders the Easy difficulty button', () => {
    render(<GuessTheNumberBoard />)
    expect(screen.getByRole('button', { name: /Easy/i })).toBeInTheDocument()
  })

  it('renders the Medium difficulty button', () => {
    render(<GuessTheNumberBoard />)
    expect(screen.getByRole('button', { name: /Medium/i })).toBeInTheDocument()
  })

  it('renders the Hard difficulty button', () => {
    render(<GuessTheNumberBoard />)
    expect(screen.getByRole('button', { name: /Hard/i })).toBeInTheDocument()
  })

  it('Easy difficulty shows 1-50 range and 10 attempts', () => {
    render(<GuessTheNumberBoard />)
    expect(screen.getByText(/1-50.*10 attempts/i)).toBeInTheDocument()
  })

  it('Medium difficulty shows 1-100 range and 7 attempts', () => {
    render(<GuessTheNumberBoard />)
    expect(screen.getByText(/1-100.*7 attempts/i)).toBeInTheDocument()
  })

  it('Hard difficulty shows 1-500 range and 5 attempts', () => {
    render(<GuessTheNumberBoard />)
    expect(screen.getByText(/1-500.*5 attempts/i)).toBeInTheDocument()
  })
})

// ── E2E Tests ─────────────────────────────────────────────────────────────────

describe('Guess the Number – E2E: game flow', () => {
  it('clicking Easy difficulty starts the game', async () => {
    render(<GuessTheNumberBoard />)
    const easyBtn = screen.getByRole('button', { name: /Easy/i })

    fireEvent.click(easyBtn)

    await waitFor(() => {
      expect(screen.getByText(/I'm thinking of a number/i)).toBeInTheDocument()
    })
  })

  it('game screen shows the difficulty badge', async () => {
    render(<GuessTheNumberBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(screen.getByText('Easy')).toBeInTheDocument()
    })
  })

  it('game screen shows stats bar with range', async () => {
    render(<GuessTheNumberBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(screen.getByText('1-50')).toBeInTheDocument()
    })
  })

  it('game screen shows attempts left stat', async () => {
    render(<GuessTheNumberBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(screen.getByText('Attempts Left')).toBeInTheDocument()
    })
  })

  it('game screen shows total guesses stat', async () => {
    render(<GuessTheNumberBoard />)
    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(screen.getByText('Total Guesses')).toBeInTheDocument()
    })
  })
})

describe('Guess the Number – E2E: guessing', () => {
  it('can enter a guess and submit it', async () => {
    const user = userEvent.setup({ delay: null })
    render(<GuessTheNumberBoard />)

    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Enter your guess/i)
      ).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/Enter your guess/i)
    await user.type(input, '25')

    const guessBtn = screen.getByRole('button', { name: /Guess/i })
    fireEvent.click(guessBtn)

    await waitFor(() => {
      expect(screen.getByText(/Too (high|low)/i)).toBeInTheDocument()
    })
  })

  it('displays feedback after a guess', async () => {
    const user = userEvent.setup({ delay: null })
    render(<GuessTheNumberBoard />)

    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Enter your guess/i)
      ).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/Enter your guess/i)
    await user.type(input, '25')
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }))

    await waitFor(() => {
      const feedback = screen.getByText(/Too (high|low)/i)
      expect(feedback).toBeInTheDocument()
    })
  })

  it('adds guess to history after submission', async () => {
    const user = userEvent.setup({ delay: null })
    render(<GuessTheNumberBoard />)

    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Enter your guess/i)
      ).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/Enter your guess/i)
    await user.type(input, '25')
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }))

    await waitFor(() => {
      expect(screen.getByText('Your Guesses')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
    })
  })

  it('clears input after submission', async () => {
    const user = userEvent.setup({ delay: null })
    render(<GuessTheNumberBoard />)

    fireEvent.click(screen.getByRole('button', { name: /Easy/i }))

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Enter your guess/i)
      ).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/Enter your guess/i)
    await user.type(input, '25')
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }))

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })
})

// The secret is Math.floor(Math.random() * max) + 1, so mocking random to 0 makes it 1.
function startWithSecretOne(difficulty) {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  render(<GuessTheNumberBoard />)
  fireEvent.click(screen.getByRole('button', { name: difficulty }))
}

function guess(n) {
  fireEvent.change(screen.getByPlaceholderText(/Enter your guess/i), {
    target: { value: String(n) },
  })
  fireEvent.click(screen.getByRole('button', { name: /Guess/i }))
}

afterEach(() => vi.restoreAllMocks())

describe('Guess the Number – E2E: win condition', () => {
  it('shows win screen when correct number is guessed', () => {
    startWithSecretOne(/Easy/i)
    guess(1)
    expect(screen.getByText(/You Won/i)).toBeInTheDocument()
  })

  it('win screen shows Play Again button', () => {
    startWithSecretOne(/Easy/i)
    guess(1)
    expect(
      screen.getByRole('button', { name: /Play Again/i })
    ).toBeInTheDocument()
  })
})

describe('Guess the Number – E2E: lose condition', () => {
  it('shows game over screen when attempts are exhausted', () => {
    startWithSecretOne(/Hard/i)
    for (let i = 1; i <= 5; i++) guess(i * 100)
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument()
  })

  it('game over screen shows Try Again button', () => {
    startWithSecretOne(/Hard/i)
    for (let i = 1; i <= 5; i++) guess(i * 100)
    expect(
      screen.getByRole('button', { name: /Try Again/i })
    ).toBeInTheDocument()
  })
})

describe('Guess the Number – E2E: reset', () => {
  it('clicking Play Again returns to difficulty selection', () => {
    startWithSecretOne(/Easy/i)
    guess(1)
    fireEvent.click(screen.getByRole('button', { name: /Play Again/i }))
    expect(screen.getByRole('button', { name: /Easy/i })).toBeInTheDocument()
    expect(
      screen.queryByPlaceholderText(/Enter your guess/i)
    ).not.toBeInTheDocument()
  })
})
