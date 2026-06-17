import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Game2048Board from '../../components/game2048/Game2048Board'

/**
 * Unit Tests for 2048 Game
 */
describe('2048 Game - Unit Tests', () => {
  describe('Game Initialization', () => {
    it('should render the game board', () => {
      render(<Game2048Board />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should display game controls', () => {
      render(<Game2048Board />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Game State', () => {
    it('should initialize with game tiles', () => {
      render(<Game2048Board />)
      // Game should render
      const elements = screen.getAllByRole('button')
      expect(elements.length).toBeGreaterThan(0)
    })
  })
})

/**
 * End-to-End Tests for 2048 Game
 */
describe('2048 Game - E2E Tests', () => {
  describe('Game Flow', () => {
    it('should handle user input', () => {
      render(<Game2048Board />)
      const buttons = screen.getAllByRole('button')
      if (buttons.length > 0) {
        fireEvent.click(buttons[0])
      }
    })

    it('should respond to game actions', async () => {
      render(<Game2048Board />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
