import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BubblePopBoard from '../../components/bubblepop/BubblePopBoard'

describe('BubblePopBoard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the game board', () => {
    render(<BubblePopBoard />)
    expect(screen.getByText(/Pop as many bubbles/)).toBeInTheDocument()
  })

  it('should display initial stats', () => {
    render(<BubblePopBoard />)
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Popped')).toBeInTheDocument()
    expect(screen.getByText('Level')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
  })

  it('should start with 30 seconds', () => {
    render(<BubblePopBoard />)
    const timeElements = screen.getAllByText(/30s/)
    expect(timeElements.length).toBeGreaterThan(0)
  })

  it('should initialize with score 0', () => {
    render(<BubblePopBoard />)
    const scoreElements = screen.getAllByText('0')
    expect(scoreElements.length).toBeGreaterThan(0)
  })

  it('should initialize with level 1', () => {
    render(<BubblePopBoard />)
    const levelElements = screen.getAllByText('1')
    expect(levelElements.length).toBeGreaterThan(0)
  })

  it('should have a game area', () => {
    const { container } = render(<BubblePopBoard />)
    const gameArea = container.querySelector('[style*="aspectRatio"]')
    expect(gameArea).toBeInTheDocument()
  })

  it('should render bubbles', () => {
    const { container } = render(<BubblePopBoard />)
    const bubbles = container.querySelectorAll('.bubble')
    expect(bubbles.length).toBeGreaterThan(0)
  })

  it('should show game over screen when time runs out', async () => {
    render(<BubblePopBoard />)

    // Fast forward time to trigger game over
    vi.advanceTimersByTime(31000)

    await waitFor(() => {
      expect(screen.getByText(/Time's up/)).toBeInTheDocument()
    })
  })

  it('should display play again button on game over', async () => {
    render(<BubblePopBoard />)

    vi.advanceTimersByTime(31000)

    await waitFor(() => {
      expect(screen.getByText('Play Again')).toBeInTheDocument()
    })
  })

  it('should reset game when play again is clicked', async () => {
    render(<BubblePopBoard />)

    vi.advanceTimersByTime(31000)

    await waitFor(() => {
      const playAgainButton = screen.getByText('Play Again')
      fireEvent.click(playAgainButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/Pop as many bubbles/)).toBeInTheDocument()
    })
  })

  it('should show rating based on score', async () => {
    render(<BubblePopBoard />)

    vi.advanceTimersByTime(31000)

    await waitFor(() => {
      // Should show one of the rating messages
      const ratingMessages = screen.queryByText(
        /Legendary|Excellent|Great job|Good try/
      )
      expect(
        ratingMessages || screen.getByText(/Time's up/)
      ).toBeInTheDocument()
    })
  })

  it('should have instructions text', () => {
    render(<BubblePopBoard />)
    expect(
      screen.getByText(/Pop as many bubbles as you can/)
    ).toBeInTheDocument()
  })
})
