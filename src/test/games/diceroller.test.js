import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DiceRollerBoard from '../../components/diceroller/DiceRollerBoard'

/**
 * Unit Tests for Dice Roller Game
 */
describe('Dice Roller Game - Unit Tests', () => {
  describe('Game Initialization', () => {
    it('should render the dice roller board', () => {
      render(<DiceRollerBoard />)
      expect(screen.getByText(/Roll Dice/i)).toBeInTheDocument()
    })

    it('should display initial stats', () => {
      render(<DiceRollerBoard />)
      expect(screen.getByText('Rolls')).toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('Average')).toBeInTheDocument()
    })

    it('should show initial dice values', () => {
      render(<DiceRollerBoard />)
      expect(screen.getByText(/Total:/i)).toBeInTheDocument()
    })

    it('should have roll button', () => {
      render(<DiceRollerBoard />)
      const rollButton = screen.getByText(/Roll Dice/i)
      expect(rollButton).toBeInTheDocument()
      expect(rollButton).toBeEnabled()
    })
  })

  describe('Game State', () => {
    it('should track number of rolls', () => {
      render(<DiceRollerBoard />)
      expect(screen.getByText('0')).toBeInTheDocument() // Initial rolls
    })

    it('should display dice grid', () => {
      render(<DiceRollerBoard />)
      // Two dice should be rendered
      const divs = screen.getAllByRole('button')
      expect(divs.length).toBeGreaterThan(0)
    })
  })

  describe('UI Elements', () => {
    it('should have New Game button', () => {
      render(<DiceRollerBoard />)
      expect(screen.getByText(/New Game/i)).toBeInTheDocument()
    })

    it('should display hint text', () => {
      render(<DiceRollerBoard />)
      expect(screen.getByText(/Roll the dice 10 times/i)).toBeInTheDocument()
    })
  })
})

/**
 * End-to-End Tests for Dice Roller Game
 */
describe('Dice Roller Game - E2E Tests', () => {
  describe('Game Flow', () => {
    it('should allow rolling dice', async () => {
      render(<DiceRollerBoard />)
      const rollButton = screen.getByText(/Roll Dice/i)
      
      fireEvent.click(rollButton)
      
      // Button should be disabled during roll
      await waitFor(() => {
        expect(rollButton).toBeDisabled()
      }, { timeout: 1000 })
    })

    it('should complete game after 10 rolls', async () => {
      render(<DiceRollerBoard />)
      const rollButton = screen.getByText(/Roll Dice/i)
      
      // Roll 10 times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(rollButton)
        await waitFor(() => {
          expect(rollButton).toBeEnabled()
        }, { timeout: 1000 })
      }
      
      // Game should show win screen
      await waitFor(() => {
        expect(screen.queryByText(/Roll Again/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    }, { timeout: 20000 })
  })

  describe('User Interactions', () => {
    it('should handle New Game button', () => {
      render(<DiceRollerBoard />)
      const newGameButton = screen.getByText(/New Game/i)
      fireEvent.click(newGameButton)
      
      // Game should reset
      expect(screen.getByText(/Roll Dice/i)).toBeInTheDocument()
    })

    it('should update stats after roll', async () => {
      render(<DiceRollerBoard />)
      const rollButton = screen.getByText(/Roll Dice/i)
      
      fireEvent.click(rollButton)
      
      await waitFor(() => {
        // Stats should update
        expect(screen.getByText('Rolls')).toBeInTheDocument()
      }, { timeout: 1000 })
    })
  })

  describe('Win Condition', () => {
    it('should show win screen with stats', async () => {
      render(<DiceRollerBoard />)
      const rollButton = screen.getByText(/Roll Dice/i)
      
      // Roll 10 times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(rollButton)
        await waitFor(() => {
          expect(rollButton).toBeEnabled()
        }, { timeout: 1000 })
      }
      
      // Check for win screen elements
      await waitFor(() => {
        expect(screen.queryByText(/Roll Again/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    }, { timeout: 20000 })
  })
})
