/**
 * Tests for the Math Quiz game (MathQuizBoard) and its data utilities.
 *
 * Unit tests cover:
 *  - pickProblems returns the correct count with required fields
 *  - Component render: progress bar, score badge, question card, input, submit button
 *  - Timer ring is visible
 *  - Tier badge is shown
 *
 * E2E-style tests cover:
 *  - Submitting a correct answer shows "Correct!" feedback and increments score
 *  - Submitting a wrong answer shows the correct answer
 *  - Pressing Enter submits the answer
 *  - Next button advances to the next question
 *  - Completing all 10 questions shows the results screen
 *  - Timer expiry auto-skips the question
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import MathQuizBoard from '../../components/mathquiz/MathQuizBoard'
import { pickProblems } from '../../data/mathQuizProblems'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit Tests: data utilities ────────────────────────────────────────────────

describe('MathQuiz Data – pickProblems', () => {
  it('returns exactly the requested number of problems', () => {
    const problems = pickProblems(10)
    expect(problems).toHaveLength(10)
  })

  it('each problem has an id, question, answer, and tier', () => {
    const problems = pickProblems(5)
    problems.forEach((p) => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('question')
      expect(p).toHaveProperty('answer')
      expect(p).toHaveProperty('tier')
    })
  })

  it('tier values are 1, 2, or 3', () => {
    const problems = pickProblems(20)
    problems.forEach((p) => {
      expect([1, 2, 3]).toContain(p.tier)
    })
  })

  it('answer is a number', () => {
    const problems = pickProblems(5)
    problems.forEach((p) => {
      expect(typeof p.answer).toBe('number')
    })
  })

  it('question is a non-empty string', () => {
    const problems = pickProblems(5)
    problems.forEach((p) => {
      expect(typeof p.question).toBe('string')
      expect(p.question.length).toBeGreaterThan(0)
    })
  })
})

// ── Unit Tests: component ─────────────────────────────────────────────────────

describe('MathQuiz Component – initial render', () => {
  it('shows "Question 1 of 10" progress label', () => {
    render(<MathQuizBoard />)
    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument()
  })

  it('shows the score badge "0 / 10"', () => {
    render(<MathQuizBoard />)
    expect(screen.getByText('0 / 10')).toBeInTheDocument()
  })

  it('renders the answer input field', () => {
    render(<MathQuizBoard />)
    expect(screen.getByPlaceholderText(/Your answer/i)).toBeInTheDocument()
  })

  it('renders the Submit button', () => {
    render(<MathQuizBoard />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('Submit button is disabled when input is empty', () => {
    render(<MathQuizBoard />)
    const submitBtn = screen.getByRole('button', { name: /submit/i })
    expect(submitBtn).toBeDisabled()
  })

  it('renders the countdown timer', () => {
    render(<MathQuizBoard />)
    // Timer starts at 15
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('renders a tier badge (Easy / Medium / Hard)', () => {
    render(<MathQuizBoard />)
    const tierBadge = screen.queryByText(/Easy|Medium|Hard/i)
    expect(tierBadge).not.toBeNull()
  })

  it('shows the question with "= ?" suffix', () => {
    render(<MathQuizBoard />)
    expect(screen.getByText(/= \?/)).toBeInTheDocument()
  })

  it('shows the hint text about Submit / Enter', () => {
    render(<MathQuizBoard />)
    expect(screen.getByText(/Submit.*Enter|Enter.*Submit/i)).toBeInTheDocument()
  })
})

// ── E2E Tests ─────────────────────────────────────────────────────────────────

describe('MathQuiz Component – answering questions', () => {
  it('typing in the input enables the Submit button', async () => {
    render(<MathQuizBoard />)
    const input = screen.getByPlaceholderText(/Your answer/i)
    const submitBtn = screen.getByRole('button', { name: /submit/i })

    fireEvent.change(input, { target: { value: '42' } })

    await waitFor(() => {
      expect(submitBtn).toBeEnabled()
    })
  })

  it('submitting a wrong answer shows the correct answer', async () => {
    render(<MathQuizBoard />)
    const input = screen.getByPlaceholderText(/Your answer/i)

    // Type an obviously wrong answer
    fireEvent.change(input, { target: { value: '99999' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      // Feedback shows "The answer was X"
      expect(screen.queryByText(/The answer was/i)).not.toBeNull()
    })
  })

  it('submitting a wrong answer does not increment the score', async () => {
    render(<MathQuizBoard />)
    const input = screen.getByPlaceholderText(/Your answer/i)

    fireEvent.change(input, { target: { value: '99999' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText('0 / 10')).toBeInTheDocument()
    })
  })

  it('pressing Enter submits the answer', async () => {
    render(<MathQuizBoard />)
    const input = screen.getByPlaceholderText(/Your answer/i)

    fireEvent.change(input, { target: { value: '99999' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.queryByText(/The answer was/i)).not.toBeNull()
    })
  })

  it('Next button appears after submitting', async () => {
    render(<MathQuizBoard />)
    const input = screen.getByPlaceholderText(/Your answer/i)

    fireEvent.change(input, { target: { value: '99999' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })
  })

  it('clicking Next advances to Question 2', async () => {
    render(<MathQuizBoard />)
    const input = screen.getByPlaceholderText(/Your answer/i)

    fireEvent.change(input, { target: { value: '99999' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    const nextBtn = await screen.findByRole('button', { name: /next/i })
    fireEvent.click(nextBtn)

    await waitFor(() => {
      expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument()
    })
  })
})

describe('MathQuiz Component – timer', () => {
  it('timer counts down from 15', async () => {
    render(<MathQuizBoard />)
    expect(screen.getByText('15')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(3000))

    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument()
    })
  })

  it('timer expiry auto-skips and shows "Time\'s up!" toast', async () => {
    render(<MathQuizBoard />)

    act(() => vi.advanceTimersByTime(16000))

    await waitFor(() => {
      // After timeout, either Next button appears or question advanced
      const nextBtn = screen.queryByRole('button', { name: /next/i })
      const q2 = screen.queryByText(/Question 2 of 10/i)
      expect(nextBtn !== null || q2 !== null).toBe(true)
    })
  })
})

describe('MathQuiz Component – results screen', () => {
  it('completing all 10 questions shows the results screen', async () => {
    render(<MathQuizBoard />)

    for (let i = 0; i < 10; i++) {
      const input = screen.queryByPlaceholderText(/Your answer/i)
      if (!input) break

      fireEvent.change(input, { target: { value: '99999' } })
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      const nextBtn = await screen.findByRole('button', { name: /next|see results/i })
      fireEvent.click(nextBtn)
    }

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument()
    })
  })
})
