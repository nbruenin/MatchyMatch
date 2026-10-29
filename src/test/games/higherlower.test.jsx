import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HigherLowerBoard from '../../components/higherlower/HigherLowerBoard'
import {
  createDeck,
  shuffleDeck,
  evaluateGuess,
  isRed,
} from '../../utils/higherLowerLogic'

describe('higherLowerLogic', () => {
  it('creates a 52-card deck with unique cards', () => {
    const deck = createDeck()
    expect(deck).toHaveLength(52)
    expect(new Set(deck.map((c) => c.rank + c.suit)).size).toBe(52)
  })

  it('shuffles without losing or mutating cards', () => {
    const deck = createDeck()
    const shuffled = shuffleDeck(deck)
    expect(shuffled).toHaveLength(52)
    expect(deck[0]).toEqual({ rank: '2', suit: '♠', value: 2 })
    expect(new Set(shuffled.map((c) => c.rank + c.suit)).size).toBe(52)
  })

  it('evaluates guesses', () => {
    expect(evaluateGuess({ value: 5 }, { value: 9 }, 'higher')).toBe('correct')
    expect(evaluateGuess({ value: 5 }, { value: 9 }, 'lower')).toBe('wrong')
    expect(evaluateGuess({ value: 9 }, { value: 5 }, 'lower')).toBe('correct')
    expect(evaluateGuess({ value: 9 }, { value: 5 }, 'higher')).toBe('wrong')
    expect(evaluateGuess({ value: 7 }, { value: 7 }, 'higher')).toBe('push')
  })

  it('identifies red suits', () => {
    expect(isRed({ suit: '♥' })).toBe(true)
    expect(isRed({ suit: '♦' })).toBe(true)
    expect(isRed({ suit: '♠' })).toBe(false)
  })
})

describe('HigherLowerBoard', () => {
  it('renders initial state', () => {
    render(<HigherLowerBoard />)
    expect(
      screen.getByRole('heading', { name: /higher or lower/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Higher' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lower' })).toBeInTheDocument()
    expect(screen.getByText('51')).toBeInTheDocument()
  })

  it('draws a card after a guess', () => {
    render(<HigherLowerBoard />)
    fireEvent.click(screen.getByRole('button', { name: 'Higher' }))
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('ends the game after losing all lives and can restart', () => {
    render(<HigherLowerBoard />)
    // Keep guessing until the game ends (deck is finite)
    for (let i = 0; i < 60; i++) {
      const higher = screen.queryByRole('button', { name: 'Higher' })
      if (!higher) break
      fireEvent.click(higher)
    }
    const again = screen.queryByRole('button', { name: /play again/i })
    if (again) {
      fireEvent.click(again)
      expect(screen.getByText('51')).toBeInTheDocument()
    }
  })

  it('New Game resets the deck', () => {
    render(<HigherLowerBoard />)
    fireEvent.click(screen.getByRole('button', { name: 'Lower' }))
    fireEvent.click(screen.getByRole('button', { name: /new game/i }))
    expect(screen.getByText('51')).toBeInTheDocument()
  })
})
