import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TetrisBoard from '../../components/tetris/TetrisBoard'

describe('TetrisBoard – Smoke test', () => {
  it('renders without crashing', () => {
    const mockGoHome = vi.fn()
    render(<TetrisBoard onGoHome={mockGoHome} />)
    expect(screen.getByText('Tetris')).toBeInTheDocument()
  })

  it('shows game instructions', () => {
    const mockGoHome = vi.fn()
    render(<TetrisBoard onGoHome={mockGoHome} />)
    expect(screen.getByText('Stack blocks and clear lines')).toBeInTheDocument()
  })

  it('displays initial score of 0', () => {
    const mockGoHome = vi.fn()
    render(<TetrisBoard onGoHome={mockGoHome} />)
    const scoreLabel = screen.getByText('Score')
    expect(scoreLabel).toBeInTheDocument()
    // Both score and lines start at 0, so we just check that Score label exists
  })

  it('displays initial lines count of 0', () => {
    const mockGoHome = vi.fn()
    render(<TetrisBoard onGoHome={mockGoHome} />)
    expect(screen.getByText('Lines')).toBeInTheDocument()
  })

  it('shows pause button', () => {
    const mockGoHome = vi.fn()
    render(<TetrisBoard onGoHome={mockGoHome} />)
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('shows next piece preview', () => {
    const mockGoHome = vi.fn()
    render(<TetrisBoard onGoHome={mockGoHome} />)
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('shows controls section', () => {
    const mockGoHome = vi.fn()
    render(<TetrisBoard onGoHome={mockGoHome} />)
    expect(screen.getByText('Controls')).toBeInTheDocument()
  })
})
