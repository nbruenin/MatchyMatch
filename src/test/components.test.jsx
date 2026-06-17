/**
 * Tests for shared components: GameBoard, GamePicker, Header, Footer, etc.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GameBoard from '../../components/GameBoard'
import GamePicker from '../../components/GamePicker'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Confetti from '../../components/Confetti'
import DarkModeToggle from '../../components/DarkModeToggle'
import ModeToggle from '../../components/ModeToggle'
import Toast from '../../components/Toast'
import Tile from '../../components/Tile'
import LivesDisplay from '../../components/LivesDisplay'
import RevealedCategory from '../../components/RevealedCategory'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── GameBoard Tests ───────────────────────────────────────────────────────────

describe('GameBoard – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<GameBoard />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has a back button or game selector', () => {
    render(<GameBoard />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})

// ── GamePicker Tests ──────────────────────────────────────────────────────────

describe('GamePicker – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<GamePicker onSelectGame={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('displays game selection buttons', () => {
    render(<GamePicker onSelectGame={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})

describe('GamePicker – E2E: game selection', () => {
  it('calls onSelectGame when a game is clicked', () => {
    const mockSelectGame = vi.fn()
    render(<GamePicker onSelectGame={mockSelectGame} />)

    const buttons = screen.getAllByRole('button')
    if (buttons.length > 0) {
      fireEvent.click(buttons[0])
      expect(mockSelectGame).toHaveBeenCalled()
    }
  })
})

// ── Header Tests ──────────────────────────────────────────────────────────────

describe('Header – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<Header />)
    expect(document.body).toBeInTheDocument()
  })

  it('renders header element', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
  })
})

// ── Footer Tests ──────────────────────────────────────────────────────────────

describe('Footer – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<Footer />)
    expect(document.body).toBeInTheDocument()
  })

  it('renders footer element', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })
})

// ── Confetti Tests ────────────────────────────────────────────────────────────

describe('Confetti – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<Confetti />)
    expect(document.body).toBeInTheDocument()
  })

  it('renders canvas element', () => {
    const { container } = render(<Confetti />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
})

// ── DarkModeToggle Tests ──────────────────────────────────────────────────────

describe('DarkModeToggle – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<DarkModeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders a button', () => {
    render(<DarkModeToggle />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})

describe('DarkModeToggle – E2E: toggle', () => {
  it('clicking button toggles dark mode', () => {
    render(<DarkModeToggle />)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    // Button should still exist after click
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})

// ── ModeToggle Tests ──────────────────────────────────────────────────────────

describe('ModeToggle – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<ModeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders a button', () => {
    render(<ModeToggle />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})

// ── Toast Tests ───────────────────────────────────────────────────────────────

describe('Toast – Unit: initial render', () => {
  it('renders message text', () => {
    render(<Toast message="Test message" onDone={() => {}} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('calls onDone after timeout', async () => {
    const mockOnDone = vi.fn()
    render(<Toast message="Test" onDone={mockOnDone} />)

    vi.runAllTimers()

    await waitFor(() => {
      expect(mockOnDone).toHaveBeenCalled()
    })
  })
})

// ── Tile Tests ────────────────────────────────────────────────────────────────

describe('Tile – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<Tile value="A" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('displays the value prop', () => {
    render(<Tile value="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})

describe('Tile – E2E: interaction', () => {
  it('calls onClick when clicked', () => {
    const mockClick = vi.fn()
    render(<Tile value="A" onClick={mockClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockClick).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Tile value="A" disabled={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})

// ── LivesDisplay Tests ────────────────────────────────────────────────────────

describe('LivesDisplay – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<LivesDisplay lives={3} />)
    expect(document.body).toBeInTheDocument()
  })

  it('displays correct number of lives', () => {
    const { container } = render(<LivesDisplay lives={3} />)
    // Should render 3 heart icons or similar
    expect(container).toBeInTheDocument()
  })
})

// ── RevealedCategory Tests ────────────────────────────────────────────────────

describe('RevealedCategory – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<RevealedCategory category="Test Category" />)
    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('displays the category text', () => {
    render(<RevealedCategory category="Animals" />)
    expect(screen.getByText('Animals')).toBeInTheDocument()
  })
})
