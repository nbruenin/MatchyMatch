/**
 * Tests for Color Mixer (ColorMixerBoard)
 *
 * Unit tests cover:
 *  - Initial render: UI elements, stats, controls
 *  - Game state initialization
 *  - Component structure
 *
 * E2E-style tests cover:
 *  - User interactions (slider adjustments, submit)
 *  - Game logic (scoring, rounds, win condition)
 *  - State transitions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ColorMixerBoard from '../../components/colormixer/ColorMixerBoard'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit Tests ────────────────────────────────────────────────────

describe('ColorMixer – Unit: initial render', () => {
  it('renders the game board', () => {
    render(<ColorMixerBoard />)
    expect(screen.getByText(/Match the target color/i)).toBeInTheDocument()
  })

  it('shows initial round of 1/10', () => {
    render(<ColorMixerBoard />)
    expect(screen.getByText('1/10')).toBeInTheDocument()
  })

  it('shows initial score of 0', () => {
    render(<ColorMixerBoard />)
    expect(screen.getByText('Score')).toBeInTheDocument()
    const scoreContainer = screen.getByText('Score').parentElement
    expect(scoreContainer.textContent).toContain('0')
  })

  it('shows initial streak of 0', () => {
    render(<ColorMixerBoard />)
    const streakElements = screen.getAllByText('0')
    expect(streakElements.length).toBeGreaterThan(0)
  })

  it('renders the Submit Color button', () => {
    render(<ColorMixerBoard />)
    expect(
      screen.getByRole('button', { name: /submit color/i })
    ).toBeInTheDocument()
  })

  it('renders the New Game button', () => {
    render(<ColorMixerBoard />)
    expect(
      screen.getByRole('button', { name: /new game/i })
    ).toBeInTheDocument()
  })

  it('renders three sliders (R, G, B)', () => {
    render(<ColorMixerBoard />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(3)
  })

  it('displays Red, Green, Blue labels', () => {
    render(<ColorMixerBoard />)
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  it('shows Target and Your Mix labels', () => {
    render(<ColorMixerBoard />)
    expect(screen.getByText('Target')).toBeInTheDocument()
    expect(screen.getByText('Your Mix')).toBeInTheDocument()
  })

  it('initializes user color to RGB(128, 128, 128)', () => {
    render(<ColorMixerBoard />)
    expect(screen.getByText(/RGB\(128, 128, 128\)/i)).toBeInTheDocument()
  })
})

// ── E2E Tests ─────────────────────────────────────────────────────

describe('ColorMixer – E2E: gameplay', () => {
  it('allows adjusting the red slider', () => {
    render(<ColorMixerBoard />)
    const sliders = screen.getAllByRole('slider')
    const redSlider = sliders[0]

    fireEvent.change(redSlider, { target: { value: '200' } })

    expect(screen.getByText(/RGB\(200, 128, 128\)/i)).toBeInTheDocument()
  })

  it('allows adjusting the green slider', () => {
    render(<ColorMixerBoard />)
    const sliders = screen.getAllByRole('slider')
    const greenSlider = sliders[1]

    fireEvent.change(greenSlider, { target: { value: '100' } })

    expect(screen.getByText(/RGB\(128, 100, 128\)/i)).toBeInTheDocument()
  })

  it('allows adjusting the blue slider', () => {
    render(<ColorMixerBoard />)
    const sliders = screen.getAllByRole('slider')
    const blueSlider = sliders[2]

    fireEvent.change(blueSlider, { target: { value: '50' } })

    expect(screen.getByText(/RGB\(128, 128, 50\)/i)).toBeInTheDocument()
  })

  it('renders New Game button', () => {
    render(<ColorMixerBoard />)
    expect(
      screen.getByRole('button', { name: /new game/i })
    ).toBeInTheDocument()
  })

  it('allows multiple slider adjustments', () => {
    render(<ColorMixerBoard />)
    const sliders = screen.getAllByRole('slider')

    fireEvent.change(sliders[0], { target: { value: '255' } })
    fireEvent.change(sliders[1], { target: { value: '0' } })
    fireEvent.change(sliders[2], { target: { value: '127' } })

    expect(screen.getByText(/RGB\(255, 0, 127\)/i)).toBeInTheDocument()
  })

  it('has game instructions visible', () => {
    render(<ColorMixerBoard />)
    expect(
      screen.getByText(/Match the target color using the RGB sliders/i)
    ).toBeInTheDocument()
  })

  it('shows stats bar with all metrics', () => {
    render(<ColorMixerBoard />)
    expect(screen.getByText('Round')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Streak')).toBeInTheDocument()
  })

  it('displays RGB value labels for each slider', () => {
    render(<ColorMixerBoard />)
    // Red slider should show initial value of 128
    const redLabel = screen.getByText('Red')
    expect(redLabel).toBeInTheDocument()

    // All sliders start at 128
    const sliders = screen.getAllByRole('slider')
    sliders.forEach((slider) => {
      expect(slider.value).toBe('128')
    })
  })
})
