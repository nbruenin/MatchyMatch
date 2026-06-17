/**
 * Tests for SnakeBoard
 *
 * Unit tests:
 *  - Initial render: canvas, score badge, speed picker, start button
 *  - Speed picker renders all 3 speed options
 *  - Score starts at 0, Best starts at 0
 *
 * E2E-style tests:
 *  - Clicking Start Game begins the game
 *  - Pause/Resume buttons appear when game is active
 *  - Restart button appears when game is active
 *  - Speed picker is disabled during active game
 *  - D-pad buttons appear during active game
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SnakeBoard from '../../components/snake/SnakeBoard'

// Mock canvas getContext
beforeEach(() => {
  vi.useFakeTimers()
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    roundRect: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    font: '',
    textAlign: '',
    textBaseline: '',
    fillText: vi.fn(),
  }))
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('Snake – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<SnakeBoard />)
    expect(document.body).toBeInTheDocument()
  })

  it('renders a canvas element', () => {
    const { container } = render(<SnakeBoard />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('shows Score badge', () => {
    render(<SnakeBoard />)
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('shows Best badge', () => {
    render(<SnakeBoard />)
    expect(screen.getByText('Best')).toBeInTheDocument()
  })

  it('shows score of 0 initially', () => {
    render(<SnakeBoard />)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(2) // Score and Best both 0
  })

  it('shows Speed label', () => {
    render(<SnakeBoard />)
    expect(screen.getByText('Speed')).toBeInTheDocument()
  })

  it('renders all 3 speed options', () => {
    render(<SnakeBoard />)
    expect(screen.getByRole('button', { name: /Chill/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Normal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Fast/i })).toBeInTheDocument()
  })

  it('shows the Snake title in the idle overlay', () => {
    render(<SnakeBoard />)
    expect(screen.getByText('Snake')).toBeInTheDocument()
  })

  it('shows Start Game button in idle overlay', () => {
    render(<SnakeBoard />)
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeInTheDocument()
  })

  it('shows snake emoji in idle overlay', () => {
    render(<SnakeBoard />)
    expect(screen.getByText('🐍')).toBeInTheDocument()
  })

  it('shows instructions text', () => {
    render(<SnakeBoard />)
    expect(screen.getByText(/Arrow keys/i)).toBeInTheDocument()
  })
})

describe('Snake – E2E: game start', () => {
  it('clicking Start Game hides the idle overlay', async () => {
    render(<SnakeBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)
    vi.runAllTimers()

    await waitFor(() => {
      // Idle overlay should be gone
      expect(screen.queryByText(/Eat apples, grow longer/i)).not.toBeInTheDocument()
    })
  })

  it('clicking Start Game shows Pause button', async () => {
    render(<SnakeBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)
    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument()
    })
  })

  it('clicking Start Game shows Restart button', async () => {
    render(<SnakeBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)
    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Restart/i })).toBeInTheDocument()
    })
  })

  it('speed picker buttons are disabled during active game', async () => {
    render(<SnakeBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)
    vi.runAllTimers()

    await waitFor(() => {
      const chillBtn = screen.getByRole('button', { name: /Chill/i })
      expect(chillBtn).toBeDisabled()
    })
  })

  it('d-pad direction buttons appear during active game', async () => {
    render(<SnakeBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })

    fireEvent.click(startBtn)
    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '▲' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '▼' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '◀' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '▶' })).toBeInTheDocument()
    })
  })
})

describe('Snake – E2E: pause/resume', () => {
  it('clicking Pause shows Resume button', async () => {
    render(<SnakeBoard />)
    const startBtn = screen.getByRole('button', { name: /Start Game/i })
    fireEvent.click(startBtn)
    vi.runAllTimers()

    await waitFor(() => {
      const pauseBtn = screen.queryByRole('button', { name: /Pause/i })
      if (pauseBtn) fireEvent.click(pauseBtn)
    })

    vi.runAllTimers()

    await waitFor(() => {
      const resumeBtn = screen.queryByRole('button', { name: /Resume/i })
      expect(resumeBtn !== null).toBe(true)
    })
  })
})
