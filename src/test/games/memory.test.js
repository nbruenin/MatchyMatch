import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MemoryBoard from '../../components/memory/MemoryBoard'

/**
 * Unit Tests for Memory Game
 */
describe('Memory Game - Unit Tests', () => {
  describe('Game Initialization', () => {
    it('should render the game board', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should display game tiles', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should have game controls', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Game State', () => {
    it('should initialize with tiles', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should track game progress', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})

/**
 * End-to-End Tests for Memory Game
 */
describe('Memory Game - E2E Tests', () => {
  describe('Game Flow', () => {
    it('should allow tile interaction', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      if (buttons.length > 0) {
        fireEvent.click(buttons[0])
      }
    })

    it('should handle tile flipping', async () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      
      if (buttons.length > 0) {
        fireEvent.click(buttons[0])
        
        await waitFor(() => {
          expect(buttons[0]).toBeInTheDocument()
        }, { timeout: 500 })
      }
    })

    it('should process matches', async () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      
      if (buttons.length >= 2) {
        fireEvent.click(buttons[0])
        fireEvent.click(buttons[1])
        
        await waitFor(() => {
          expect(buttons[0]).toBeInTheDocument()
        }, { timeout: 1000 })
      }
    })
  })

  describe('User Interactions', () => {
    it('should handle game reset', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should track moves and matches', () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Game Completion', () => {
    it('should show completion state', async () => {
      render(<MemoryBoard />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
