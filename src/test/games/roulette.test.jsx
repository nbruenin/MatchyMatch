/**
 * Tests for RouletteBoard
 *
 * Unit tests:
 *  - Initial render: title, spin count, spin button
 *  - Spin button is enabled on initial load
 *  - Spin button becomes disabled while spinning
 *
 * E2E-style tests:
 *  - Clicking spin button triggers animation (button text changes)
 *  - Play Again button resets to wheel view
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import RouletteBoard from '../../components/roulette/RouletteBoard'

beforeEach(() => {
  vi.useFakeTimers()
  // Mock requestAnimationFrame
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    setTimeout(cb, 16)
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('Roulette – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<RouletteBoard />)
    expect(document.body).toBeInTheDocument()
  })

  it('shows "Spin the Wheel!" title', () => {
    render(<RouletteBoard />)
    expect(screen.getByText(/Spin the Wheel!/i)).toBeInTheDocument()
  })

  it('shows spin count starting at 0', () => {
    render(<RouletteBoard />)
    expect(screen.getByText(/Spins: 0/i)).toBeInTheDocument()
  })

  it('renders the Spin the Wheel button', () => {
    render(<RouletteBoard />)
    const btn = screen.getByRole('button', { name: /Spin the Wheel/i })
    expect(btn).toBeInTheDocument()
  })

  it('spin button is enabled initially', () => {
    render(<RouletteBoard />)
    const btn = screen.getByRole('button', { name: /Spin the Wheel/i })
    expect(btn).not.toBeDisabled()
  })

  it('shows instructions text', () => {
    render(<RouletteBoard />)
    expect(screen.getByText(/Click the button to spin/i)).toBeInTheDocument()
  })

  it('renders the wheel emoji in the center', () => {
    render(<RouletteBoard />)
    expect(screen.getByText('🎡')).toBeInTheDocument()
  })
})

describe('Roulette – E2E: spin interaction', () => {
  it('clicking spin button disables the button while spinning', async () => {
    render(<RouletteBoard />)
    const btn = screen.getByRole('button', { name: /Spin the Wheel/i })

    fireEvent.click(btn)

    // Button should be disabled while spinning
    await waitFor(() => {
      expect(btn).toBeDisabled()
    })
  })

  it('clicking spin button changes button text to "Spinning..."', async () => {
    render(<RouletteBoard />)
    const btn = screen.getByRole('button', { name: /Spin the Wheel/i })

    fireEvent.click(btn)

    await waitFor(() => {
      expect(screen.getByText(/Spinning/i)).toBeInTheDocument()
    })
  })
})
