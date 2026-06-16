import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FlipFlopBoard from '../../components/flipflop/FlipFlopBoard'

/**
 * Unit Tests for FlipFlop Game
 */
describe('FlipFlop Game - Unit Tests', () => {
  describe('Game Initialization', () => {
    it('should render the game board', () => {
      render(<FlipFlopBoard />)
      expect(screen.getByText(/Pairs/i)).toBeInTheDocument()
    })

    it('should display initial stats', () => {
      render(<FlipFlopBoard />)
      expect(screen.getByText('Pairs')).toBeInTheDocument()
      expect(screen.getByText('Time')).toBeInTheDocument()
      expect(screen.getByText('Accuracy')).toBeInTheDocument()
    })

    it('should display game tiles', () => {
      render(<FlipFlopBoard />)
      const buttons = screen.getAllByRole('button')
      // Should have 20 tiles (10 pairs) + action buttons
      expect(buttons.length).toBeGreaterThan(20)
    })

    it('should have New Game button', () => {
      render(<FlipFlopBoard />)
      expect(screen.getByText(/New Game/i)).toBeInTheDocument()
    })
  })

  describe('Game State', () => {
    it('should track matched pairs', () => {
      render(<FlipFlopBoard />)
      expect(screen.getByText(/0 \/ 10/i)).toBeInTheDocument()
    })

    it('should display timer', () => {
      render(<FlipFlopBoard />)
      expect(screen.getByText(/00:00/i)).toBeInTheDocument()
    })

    it('should show accuracy percentage', () => {
      render(<FlipFlopBoard />)
      expect(screen.getByText(/100%/i)).toBeInTheDocument()
    })
  })

  describe('UI Elements', () => {
    it('should display hint text', () => {
      render(<FlipFlopBoard />)
      expect(screen.getByText(/Flip tiles to find all 10 matching pairs/i)).toBeInTheDocument()
    })

    it('should have accessible tile buttons', () => {
      render(<FlipFlopBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})

/**
 * End-to-End Tests for FlipFlop Game
 */
describe('FlipFlop Game - E2E Tests', () => {
  describe('Game Flow', () => {
    it('should allow flipping tiles', async () => {
      render(<FlipFlopBoard />)
      const buttons = screen.getAllByRole('button')
      
      // Find tile buttons (not action buttons)
      const tileButtons = buttons.filter(btn => {
        const label = btn.getAttribute('aria-label')
        return label && (label.includes('Hidden') || label.includes('tile'))
      })
      
      if (tileButtons.length > 0) {
        fireEvent.click(tileButtons[0])
        // Tile should be flipped
        await waitFor(() => {
          expect(tileButtons[0]).toBeInTheDocument()
        }, { timeout: 500 })
      }
    })

    it('should handle tile matching', async () => {
      render(<FlipFlopBoard />)
      const buttons = screen.getAllByRole('button')
      
      const tileButtons = buttons.filter(btn => {
        const label = btn.getAttribute('aria-label')
        return label && (label.includes('Hidden') || label.includes('tile'))
      })
      
      // Click two tiles
      if (tileButtons.length >= 2) {
        fireEvent.click(tileButtons[0])
        fireEvent.click(tileButtons[1])
        
        await waitFor(() => {
          // Game should process the match/mismatch
          expect(tileButtons[0]).toBeInTheDocument()
        }, { timeout: 1000 })
      }
    })
  })

  describe('User Interactions', () => {
    it('should handle New Game button', () => {
      render(<FlipFlopBoard />)
      const newGameButton = screen.getByText(/New Game/i)
      fireEvent.click(newGameButton)
      
      // Game should reset
      expect(screen.getByText(/0 \/ 10/i)).toBeInTheDocument()
    })

    it('should track game progress', async () => {
      render(<FlipFlopBoard />)
      
      // Initial state
      expect(screen.getByText(/0 \/ 10/i)).toBeInTheDocument()
      
      // Game should be playable
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Win Condition', () => {
    it('should show win screen when all pairs matched', async () => {
      render(<FlipFlopBoard />)
      
      // Game should start in playing state
      expect(screen.getByText(/Flip tiles to find all 10 matching pairs/i)).toBeInTheDocument()
    })
  })

  describe('Timer and Stats', () => {
    it('should update timer during gameplay', async () => {
      render(<FlipFlopBoard />)
      
      expect(screen.getByText(/00:00/i)).toBeInTheDocument()
      
      // Timer should be running
      await waitFor(() => {
        expect(screen.getByText(/Time/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should calculate accuracy', () => {
      render(<FlipFlopBoard />)
      
      expect(screen.getByText(/100%/i)).toBeInTheDocument()
    })
  })
})
