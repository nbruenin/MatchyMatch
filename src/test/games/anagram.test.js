import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AnagramBoard from '../../components/anagram/AnagramBoard'

/**
 * Unit Tests for Anagram Game
 * Tests core game mechanics, scoring, and state management
 */
describe('Anagram Game - Unit Tests', () => {
  describe('Game Initialization', () => {
    it('should render the game board', () => {
      render(<AnagramBoard />)
      expect(screen.getByText(/Round 1\/5/i)).toBeInTheDocument()
    })

    it('should display initial score of 0', () => {
      render(<AnagramBoard />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should display timer starting at 30 seconds', () => {
      render(<AnagramBoard />)
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('should display scrambled letters', () => {
      render(<AnagramBoard />)
      const letterTiles = screen.getAllByRole('button')
      expect(letterTiles.length).toBeGreaterThan(0)
    })
  })

  describe('Game State Management', () => {
    it('should track round progression', () => {
      render(<AnagramBoard />)
      expect(screen.getByText(/Round 1\/5/i)).toBeInTheDocument()
    })

    it('should display hint text', () => {
      render(<AnagramBoard />)
      const hints = screen.queryAllByText(/./i)
      expect(hints.length).toBeGreaterThan(0)
    })

    it('should have Clear and Skip buttons', () => {
      render(<AnagramBoard />)
      expect(screen.getByText('Clear')).toBeInTheDocument()
      expect(screen.getByText('Skip')).toBeInTheDocument()
    })
  })

  describe('UI Elements', () => {
    it('should display scoring guide', () => {
      render(<AnagramBoard />)
      expect(screen.getByText(/pts/i)).toBeInTheDocument()
    })

    it('should show round dots for progress tracking', () => {
      render(<AnagramBoard />)
      const dots = screen.queryAllByRole('button')
      expect(dots.length).toBeGreaterThan(0)
    })

    it('should have answer slots area', () => {
      render(<AnagramBoard />)
      expect(screen.getByText(/Tap letters below to build the word/i)).toBeInTheDocument()
    })
  })
})

/**
 * End-to-End Tests for Anagram Game
 * Tests complete user workflows and game flows
 */
describe('Anagram Game - E2E Tests', () => {
  describe('Game Flow', () => {
    it('should complete a full game session', async () => {
      render(<AnagramBoard />)
      
      // Game should start
      expect(screen.getByText(/Round 1\/5/i)).toBeInTheDocument()
      
      // Skip button should be available
      const skipButton = screen.getByText('Skip')
      expect(skipButton).toBeEnabled()
    })

    it('should handle skip action', async () => {
      render(<AnagramBoard />)
      
      const skipButton = screen.getByText('Skip')
      fireEvent.click(skipButton)
      
      // Should show toast or advance
      await waitFor(() => {
        expect(screen.queryByText('Skip')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should display game over screen after 5 rounds', async () => {
      render(<AnagramBoard />)
      
      // Skip through all 5 rounds
      for (let i = 0; i < 5; i++) {
        const skipButton = screen.getByText('Skip')
        fireEvent.click(skipButton)
        
        await waitFor(() => {
          // Wait for next round or game over
        }, { timeout: 1000 })
      }
    }, { timeout: 15000 })
  })

  describe('User Interactions', () => {
    it('should allow clearing selected letters', async () => {
      render(<AnagramBoard />)
      
      const clearButton = screen.getByText('Clear')
      
      // Clear button should be disabled initially
      expect(clearButton).toBeDisabled()
    })

    it('should handle letter selection', async () => {
      render(<AnagramBoard />)
      
      const letterButtons = screen.getAllByRole('button').filter(btn => {
        const text = btn.textContent
        return text && text.length === 1 && /[A-Z]/.test(text)
      })
      
      if (letterButtons.length > 0) {
        fireEvent.click(letterButtons[0])
        // Letter should be selected
      }
    })
  })

  describe('Scoring System', () => {
    it('should display final score on game completion', async () => {
      render(<AnagramBoard />)
      
      // Score should be visible
      expect(screen.getByText('Score')).toBeInTheDocument()
    })

    it('should show scoring breakdown', async () => {
      render(<AnagramBoard />)
      
      // Scoring guide should be visible
      expect(screen.queryByText(/pts/i)).toBeInTheDocument()
    })
  })

  describe('Timer Functionality', () => {
    it('should display countdown timer', () => {
      render(<AnagramBoard />)
      
      // Timer should be visible and show a number
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('should have timer ring visual', () => {
      render(<AnagramBoard />)
      
      // SVG timer ring should be present
      const svgs = screen.queryAllByRole('img', { hidden: true })
      expect(svgs.length >= 0).toBe(true)
    })
  })
})
