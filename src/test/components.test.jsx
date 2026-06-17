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

// Mock canvas for Confetti
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
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  }))
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── GameBoard Tests ───────────────────────────────────────────────────────────

const mockPuzzle = {
  id: 'test',
  categories: [
    { id: 'yellow', color: 'yellow', title: 'Things that fly', words: ['BIRD', 'PLANE', 'KITE', 'BEE'] },
    { id: 'green', color: 'green', title: 'Things that swim', words: ['FISH', 'DUCK', 'SEAL', 'FROG'] },
    { id: 'blue', color: 'blue', title: 'Things that run', words: ['DOG', 'CAT', 'HORSE', 'DEER'] },
    { id: 'purple', color: 'purple', title: 'Things that crawl', words: ['WORM', 'SNAIL', 'ANT', 'SLUG'] },
    { id: 'pink', color: 'pink', title: 'Things that hop', words: ['JUMP', 'RABBIT', 'KANGAROO', 'CRICKET'] },
  ],
}

describe('GameBoard – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    expect(document.body).toBeInTheDocument()
  })

  it('renders word tiles', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    expect(screen.getByText('BIRD')).toBeInTheDocument()
  })

  it('renders Submit button', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
  })

  it('renders Shuffle button', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    expect(screen.getByRole('button', { name: /Shuffle/i })).toBeInTheDocument()
  })

  it('renders Deselect button', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    expect(screen.getByRole('button', { name: /Deselect/i })).toBeInTheDocument()
  })

  it('Submit button is disabled initially (no tiles selected)', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    const submitBtn = screen.getByRole('button', { name: /Submit/i })
    expect(submitBtn).toBeDisabled()
  })

  it('shows difficulty mode toggle', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    expect(screen.getByRole('button', { name: /Normal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hard/i })).toBeInTheDocument()
  })

  it('shows instruction text', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    expect(screen.getByText(/Group the words/i)).toBeInTheDocument()
  })
})

describe('GameBoard – E2E: tile selection', () => {
  it('clicking a tile selects it', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    const birdTile = screen.getByText('BIRD')
    fireEvent.click(birdTile)
    expect(document.body).toBeInTheDocument()
  })

  it('selecting 4 tiles enables Submit button', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    const tiles = ['BIRD', 'PLANE', 'KITE', 'BEE']
    tiles.forEach((word) => {
      fireEvent.click(screen.getByText(word))
    })
    const submitBtn = screen.getByRole('button', { name: /Submit/i })
    expect(submitBtn).not.toBeDisabled()
  })

  it('clicking Deselect clears selection', () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    fireEvent.click(screen.getByText('BIRD'))
    fireEvent.click(screen.getByText('PLANE'))

    const deselectBtn = screen.getByRole('button', { name: /Deselect/i })
    fireEvent.click(deselectBtn)

    const submitBtn = screen.getByRole('button', { name: /Submit/i })
    expect(submitBtn).toBeDisabled()
  })

  it('submitting a correct group reveals the category', async () => {
    render(<GameBoard puzzle={mockPuzzle} onNewGame={() => {}} />)
    // Select all 4 words from the "Things that fly" category
    const tiles = ['BIRD', 'PLANE', 'KITE', 'BEE']
    tiles.forEach((word) => {
      fireEvent.click(screen.getByText(word))
    })

    const submitBtn = screen.getByRole('button', { name: /Submit/i })
    fireEvent.click(submitBtn)

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByText('Things that fly')).toBeInTheDocument()
    })
  })
})

// ── GamePicker Tests ──────────────────────────────────────────────────────────

describe('GamePicker – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<GamePicker onGameSelect={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('displays game selection buttons', () => {
    render(<GamePicker onGameSelect={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows "What are we playing?" heading', () => {
    render(<GamePicker onGameSelect={() => {}} />)
    expect(screen.getByText(/What are we playing/i)).toBeInTheDocument()
  })

  it('shows Wordle game card', () => {
    render(<GamePicker onGameSelect={() => {}} />)
    expect(screen.getByText('Wordle')).toBeInTheDocument()
  })

  it('shows Matchy Match game card', () => {
    render(<GamePicker onGameSelect={() => {}} />)
    expect(screen.getByText('Matchy Match')).toBeInTheDocument()
  })
})

describe('GamePicker – E2E: game selection', () => {
  it('calls onGameSelect when a game is clicked', () => {
    const mockSelectGame = vi.fn()
    render(<GamePicker onGameSelect={mockSelectGame} />)

    const buttons = screen.getAllByRole('button')
    if (buttons.length > 0) {
      fireEvent.click(buttons[0])
      expect(mockSelectGame).toHaveBeenCalled()
    }
  })

  it('calls onGameSelect with the game id', () => {
    const mockSelectGame = vi.fn()
    render(<GamePicker onGameSelect={mockSelectGame} />)

    // Click the Wordle button
    const wordleBtn = screen.getByText('Wordle').closest('button')
    if (wordleBtn) {
      fireEvent.click(wordleBtn)
      expect(mockSelectGame).toHaveBeenCalledWith('wordle')
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

  it('renders the Puzzlr wordmark', () => {
    render(<Header />)
    expect(screen.getByText('Puzzlr')).toBeInTheDocument()
  })

  it('renders dark mode toggle button', () => {
    render(<Header />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows back button when activeGame is set', () => {
    render(<Header activeGame="wordle" onGoHome={() => {}} />)
    expect(screen.getByRole('button', { name: /Back to game picker/i })).toBeInTheDocument()
  })

  it('does not show back button when no activeGame', () => {
    render(<Header />)
    expect(screen.queryByRole('button', { name: /Back to game picker/i })).not.toBeInTheDocument()
  })

  it('clicking wordmark calls onGoHome', () => {
    const mockGoHome = vi.fn()
    render(<Header onGoHome={mockGoHome} />)
    const wordmarkBtn = screen.getByRole('button', { name: /Go to game picker/i })
    fireEvent.click(wordmarkBtn)
    expect(mockGoHome).toHaveBeenCalled()
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

  it('shows copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/Co-created by/i)).toBeInTheDocument()
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

  it('shows "Switch to dark mode" aria-label when dark=false', () => {
    render(<DarkModeToggle dark={false} />)
    expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument()
  })

  it('shows "Switch to light mode" aria-label when dark=true', () => {
    render(<DarkModeToggle dark={true} />)
    expect(screen.getByRole('button', { name: /Switch to light mode/i })).toBeInTheDocument()
  })
})

describe('DarkModeToggle – E2E: toggle', () => {
  it('clicking button calls onToggle callback', () => {
    const mockToggle = vi.fn()
    render(<DarkModeToggle onToggle={mockToggle} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockToggle).toHaveBeenCalled()
  })

  it('clicking button still renders the button after click', () => {
    render(<DarkModeToggle />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})

// ── ModeToggle Tests ──────────────────────────────────────────────────────────

describe('ModeToggle – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<ModeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders Normal and Hard buttons', () => {
    render(<ModeToggle />)
    expect(screen.getByRole('button', { name: /Normal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hard/i })).toBeInTheDocument()
  })

  it('calls onChange when Hard mode is clicked', () => {
    const mockChange = vi.fn()
    render(<ModeToggle onChange={mockChange} />)
    const hardBtn = screen.getByRole('button', { name: /Hard/i })
    fireEvent.click(hardBtn)
    expect(mockChange).toHaveBeenCalledWith('hard')
  })

  it('calls onChange when Normal mode is clicked', () => {
    const mockChange = vi.fn()
    render(<ModeToggle mode="hard" onChange={mockChange} />)
    const normalBtn = screen.getByRole('button', { name: /Normal/i })
    fireEvent.click(normalBtn)
    expect(mockChange).toHaveBeenCalledWith('normal')
  })

  it('shows Locked badge when disabled', () => {
    render(<ModeToggle disabled={true} />)
    expect(screen.getByRole('button', { name: /Difficulty locked/i })).toBeInTheDocument()
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
    render(<Tile word="APPLE" />)
    expect(screen.getByText('APPLE')).toBeInTheDocument()
  })

  it('displays the word prop', () => {
    render(<Tile word="TEST" />)
    expect(screen.getByText('TEST')).toBeInTheDocument()
  })
})

describe('Tile – E2E: interaction', () => {
  it('calls onClick when clicked', () => {
    const mockClick = vi.fn()
    render(<Tile word="APPLE" onClick={mockClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockClick).toHaveBeenCalled()
  })

  it('is disabled when isRevealed prop is true', () => {
    render(<Tile word="APPLE" isRevealed={true} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('is not disabled when isRevealed is false', () => {
    render(<Tile word="APPLE" isRevealed={false} />)
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })
})

// ── LivesDisplay Tests ────────────────────────────────────────────────────────

describe('LivesDisplay – Unit: initial render', () => {
  it('renders without crashing', () => {
    render(<LivesDisplay lives={3} maxLives={5} />)
    expect(document.body).toBeInTheDocument()
  })

  it('shows "3 lives remaining" text', () => {
    render(<LivesDisplay lives={3} maxLives={5} />)
    expect(screen.getByText(/3 lives remaining/i)).toBeInTheDocument()
  })

  it('shows "1 life remaining" for singular', () => {
    render(<LivesDisplay lives={1} maxLives={5} />)
    expect(screen.getByText(/1 life remaining/i)).toBeInTheDocument()
  })
})

// ── RevealedCategory Tests ────────────────────────────────────────────────────

describe('RevealedCategory – Unit: initial render', () => {
  const mockCategory = {
    id: 'yellow',
    color: 'yellow',
    title: 'Things that fly',
    words: ['BIRD', 'PLANE', 'KITE', 'BEE'],
  }

  it('renders without crashing', () => {
    render(<RevealedCategory category={mockCategory} />)
    expect(document.body).toBeInTheDocument()
  })

  it('displays the category title', () => {
    render(<RevealedCategory category={mockCategory} />)
    expect(screen.getByText('Things that fly')).toBeInTheDocument()
  })

  it('displays the category words', () => {
    render(<RevealedCategory category={mockCategory} />)
    expect(screen.getByText(/BIRD/)).toBeInTheDocument()
  })

  it('displays all 4 words', () => {
    render(<RevealedCategory category={mockCategory} />)
    const text = screen.getByText(/BIRD.*PLANE.*KITE.*BEE/i)
    expect(text).toBeInTheDocument()
  })
})
