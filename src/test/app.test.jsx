/**
 * Tests for the main App component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../../App'

// Mock canvas for Confetti and Snake
beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
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
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    strokeStyle: '',
    lineWidth: 0,
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    roundRect: vi.fn(),
    font: '',
    textAlign: '',
    textBaseline: '',
    fillText: vi.fn(),
  }))
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  localStorage.clear()
})

describe('App – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })

  it('renders header', () => {
    render(<App />)
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<App />)
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('renders main content area', () => {
    render(<App />)
    const main = document.querySelector('main')
    expect(main).toBeInTheDocument()
  })

  it('shows the Puzzlr wordmark', () => {
    render(<App />)
    expect(screen.getByText('Puzzlr')).toBeInTheDocument()
  })

  it('shows footer text', () => {
    render(<App />)
    expect(screen.getByText(/Co-created by/i)).toBeInTheDocument()
  })
})

describe('App – E2E: game selection', () => {
  it('displays game picker on initial load', () => {
    render(<App />)
    expect(screen.getByText(/What are we playing/i)).toBeInTheDocument()
  })

  it('shows game cards on initial load', () => {
    render(<App />)
    expect(screen.getByText('Wordle')).toBeInTheDocument()
    expect(screen.getByText('Matchy Match')).toBeInTheDocument()
  })

  it('clicking a game card navigates to that game', async () => {
    render(<App />)

    // Click the Wordle game card
    const wordleCard = screen.getByText('Wordle').closest('button')
    if (wordleCard) {
      fireEvent.click(wordleCard)
      vi.runAllTimers()

      await waitFor(() => {
        // Game picker should be gone
        expect(screen.queryByText(/What are we playing/i)).not.toBeInTheDocument()
      })
    }
  })

  it('shows back button after selecting a game', async () => {
    render(<App />)

    const wordleCard = screen.getByText('Wordle').closest('button')
    if (wordleCard) {
      fireEvent.click(wordleCard)
      vi.runAllTimers()

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Back to game picker/i })).toBeInTheDocument()
      })
    }
  })

  it('clicking back button returns to game picker', async () => {
    render(<App />)

    const wordleCard = screen.getByText('Wordle').closest('button')
    if (wordleCard) {
      fireEvent.click(wordleCard)
      vi.runAllTimers()

      await waitFor(() => {
        const backBtn = screen.queryByRole('button', { name: /Back to game picker/i })
        if (backBtn) fireEvent.click(backBtn)
      })

      vi.runAllTimers()

      await waitFor(() => {
        expect(screen.getByText(/What are we playing/i)).toBeInTheDocument()
      })
    }
  })
})

describe('App – E2E: dark mode', () => {
  it('has dark mode toggle button', () => {
    render(<App />)
    const darkModeBtn = screen.getByRole('button', { name: /Switch to (dark|light) mode/i })
    expect(darkModeBtn).toBeInTheDocument()
  })

  it('can toggle dark mode', () => {
    render(<App />)
    const darkModeBtn = screen.getByRole('button', { name: /Switch to dark mode/i })
    fireEvent.click(darkModeBtn)
    // After toggle, button should now say "Switch to light mode"
    expect(screen.getByRole('button', { name: /Switch to light mode/i })).toBeInTheDocument()
  })

  it('toggling dark mode twice returns to light mode', () => {
    render(<App />)
    const darkModeBtn = screen.getByRole('button', { name: /Switch to dark mode/i })
    fireEvent.click(darkModeBtn)
    const lightModeBtn = screen.getByRole('button', { name: /Switch to light mode/i })
    fireEvent.click(lightModeBtn)
    expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument()
  })
})

describe('App – Unit: layout structure', () => {
  it('has proper semantic HTML structure', () => {
    const { container } = render(<App />)
    expect(container.querySelector('header')).toBeInTheDocument()
    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('renders without console errors', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    render(<App />)
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
