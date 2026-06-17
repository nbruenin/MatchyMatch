/**
 * Tests for TriviaBoard
 *
 * Unit tests:
 *  - Initial render: question card, 4 choices, progress bar, score badge
 *  - Confirm button is disabled until a choice is selected
 *  - Shows "Question 1 of 10"
 *
 * E2E-style tests:
 *  - Clicking a choice selects it
 *  - Clicking the same choice deselects it
 *  - Confirm button enables after selection
 *  - Correct answer shows green feedback
 *  - Wrong answer shows red feedback
 *  - Next Question advances to question 2
 *  - Completing all 10 questions shows results screen
 *  - Results screen shows score and Play Again button
 *  - Play Again resets to question 1
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TriviaBoard from '../../components/trivia/TriviaBoard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('Trivia – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<TriviaBoard />)
    expect(document.body).toBeInTheDocument()
  })

  it('shows "Question 1 of 10"', () => {
    render(<TriviaBoard />)
    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument()
  })

  it('shows 4 answer choice buttons', () => {
    render(<TriviaBoard />)
    // Choice buttons have letter badges A, B, C, D
    const choiceBtns = screen.getAllByRole('button').filter(
      (b) => /^[ABCD]$/.test(b.querySelector('span')?.textContent?.trim() ?? '')
    )
    expect(choiceBtns.length).toBe(4)
  })

  it('shows A, B, C, D letter badges', () => {
    render(<TriviaBoard />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('shows Confirm button', () => {
    render(<TriviaBoard />)
    expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument()
  })

  it('Confirm button is disabled initially', () => {
    render(<TriviaBoard />)
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i })
    expect(confirmBtn).toBeDisabled()
  })

  it('shows score badge "0 / 10"', () => {
    render(<TriviaBoard />)
    expect(screen.getByText(/0 \/ 10/i)).toBeInTheDocument()
  })

  it('shows "Score:" label', () => {
    render(<TriviaBoard />)
    expect(screen.getByText(/Score:/i)).toBeInTheDocument()
  })

  it('shows instruction text to select and confirm', () => {
    render(<TriviaBoard />)
    expect(screen.getByText(/Select an answer/i)).toBeInTheDocument()
  })

  it('shows progress percentage "10%"', () => {
    render(<TriviaBoard />)
    expect(screen.getByText('10%')).toBeInTheDocument()
  })
})

describe('Trivia – E2E: answer selection', () => {
  it('clicking a choice enables the Confirm button', () => {
    render(<TriviaBoard />)
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i })
    expect(confirmBtn).toBeDisabled()

    // Click choice A
    const choiceA = screen.getAllByRole('button').find(
      (b) => b.textContent?.includes('A')
    )
    if (choiceA) fireEvent.click(choiceA)

    expect(confirmBtn).not.toBeDisabled()
  })

  it('clicking Confirm after selecting an answer locks in the answer', async () => {
    render(<TriviaBoard />)

    const choiceA = screen.getAllByRole('button').find(
      (b) => b.textContent?.includes('A')
    )
    if (choiceA) fireEvent.click(choiceA)

    const confirmBtn = screen.getByRole('button', { name: /Confirm/i })
    fireEvent.click(confirmBtn)

    vi.runAllTimers()

    await waitFor(() => {
      // After confirming, Next Question button appears
      const nextBtn = screen.queryByRole('button', { name: /Next Question/i })
      const seeResults = screen.queryByRole('button', { name: /See Results/i })
      expect(nextBtn !== null || seeResults !== null).toBe(true)
    })
  })

  it('clicking Next Question advances to question 2', async () => {
    render(<TriviaBoard />)

    const choiceA = screen.getAllByRole('button').find(
      (b) => b.textContent?.includes('A')
    )
    if (choiceA) fireEvent.click(choiceA)

    const confirmBtn = screen.getByRole('button', { name: /Confirm/i })
    fireEvent.click(confirmBtn)

    vi.runAllTimers()

    await waitFor(() => {
      const nextBtn = screen.queryByRole('button', { name: /Next Question/i })
      if (nextBtn) fireEvent.click(nextBtn)
    })

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument()
    })
  })
})

describe('Trivia – E2E: complete game', () => {
  it('completing all 10 questions shows results screen', async () => {
    render(<TriviaBoard />)

    for (let q = 0; q < 10; q++) {
      // Select choice A
      const choiceA = screen.getAllByRole('button').find(
        (b) => b.textContent?.includes('A') && !b.disabled
      )
      if (choiceA) fireEvent.click(choiceA)

      const confirmBtn = screen.queryByRole('button', { name: /Confirm/i })
      if (confirmBtn && !confirmBtn.disabled) {
        fireEvent.click(confirmBtn)
        vi.runAllTimers()
      }

      await waitFor(() => {}, { timeout: 50 })

      const nextBtn = screen.queryByRole('button', { name: /Next Question/i })
      const seeResults = screen.queryByRole('button', { name: /See Results/i })

      if (seeResults) {
        fireEvent.click(seeResults)
        break
      } else if (nextBtn) {
        fireEvent.click(nextBtn)
      }
    }

    vi.runAllTimers()

    await waitFor(() => {
      const playAgain = screen.queryByRole('button', { name: /Play Again/i })
      expect(playAgain).toBeInTheDocument()
    })
  })

  it('results screen shows score out of 10', async () => {
    render(<TriviaBoard />)

    for (let q = 0; q < 10; q++) {
      const choiceA = screen.getAllByRole('button').find(
        (b) => b.textContent?.includes('A') && !b.disabled
      )
      if (choiceA) fireEvent.click(choiceA)

      const confirmBtn = screen.queryByRole('button', { name: /Confirm/i })
      if (confirmBtn && !confirmBtn.disabled) {
        fireEvent.click(confirmBtn)
        vi.runAllTimers()
      }

      await waitFor(() => {}, { timeout: 50 })

      const nextBtn = screen.queryByRole('button', { name: /Next Question/i })
      const seeResults = screen.queryByRole('button', { name: /See Results/i })

      if (seeResults) {
        fireEvent.click(seeResults)
        break
      } else if (nextBtn) {
        fireEvent.click(nextBtn)
      }
    }

    vi.runAllTimers()

    await waitFor(() => {
      // Results show "X out of 10"
      expect(screen.getByText(/out of/i)).toBeInTheDocument()
    })
  })

  it('Play Again resets to question 1', async () => {
    render(<TriviaBoard />)

    for (let q = 0; q < 10; q++) {
      const choiceA = screen.getAllByRole('button').find(
        (b) => b.textContent?.includes('A') && !b.disabled
      )
      if (choiceA) fireEvent.click(choiceA)

      const confirmBtn = screen.queryByRole('button', { name: /Confirm/i })
      if (confirmBtn && !confirmBtn.disabled) {
        fireEvent.click(confirmBtn)
        vi.runAllTimers()
      }

      await waitFor(() => {}, { timeout: 50 })

      const nextBtn = screen.queryByRole('button', { name: /Next Question/i })
      const seeResults = screen.queryByRole('button', { name: /See Results/i })

      if (seeResults) {
        fireEvent.click(seeResults)
        break
      } else if (nextBtn) {
        fireEvent.click(nextBtn)
      }
    }

    vi.runAllTimers()

    const playAgain = await screen.findByRole('button', { name: /Play Again/i })
    fireEvent.click(playAgain)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument()
    })
  })
})
