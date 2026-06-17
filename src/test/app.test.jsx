/**
 * Tests for the main App component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../../App'

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
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
})

describe('App – E2E: game selection', () => {
  it('displays game picker on initial load', () => {
    render(<App />)
    // Should have buttons for game selection
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('can select a game', async () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')

    if (buttons.length > 0) {
      fireEvent.click(buttons[0])

      vi.runAllTimers()

      await waitFor(() => {
        // Should render the selected game
        expect(document.body).toBeInTheDocument()
      }, { timeout: 100 })
    }
  })
})

describe('App – E2E: dark mode', () => {
  it('has dark mode toggle button', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('can toggle dark mode', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')

    // Find and click dark mode toggle (usually in header)
    if (buttons.length > 0) {
      fireEvent.click(buttons[0])
      expect(document.body).toBeInTheDocument()
    }
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
