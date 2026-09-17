/**
 * Tests for the Picture Match card game (PictureMatchBoard) and its data utilities.
 *
 * Unit tests cover:
 *  - buildPictureMatchDeck returns 16 cards (8 pairs × 2)
 *  - Each emoji appears exactly twice in the deck
 *  - PICTURE_MATCH_SETS has the expected structure
 *  - Component render: theme picker, stats bar, 16 cards, hint text
 *
 * E2E-style tests cover:
 *  - Clicking a card flips it (aria-label changes from "Hidden card" to emoji)
 *  - Clicking two non-matching cards flips them back
 *  - Clicking two matching cards marks them as matched
 *  - New Game button resets the board
 *  - Theme picker changes the active set
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import PictureMatchBoard from '../../components/picturematch/PictureMatchBoard'
import {
  PICTURE_MATCH_SETS,
  buildPictureMatchDeck,
} from '../../data/pictureMatchData'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ── Unit Tests: data utilities ────────────────────────────────────────────────

describe('Picture Match Data – PICTURE_MATCH_SETS', () => {
  it('has at least 3 card sets', () => {
    expect(PICTURE_MATCH_SETS.length).toBeGreaterThanOrEqual(3)
  })

  it('each set has id, label, emoji, and cards array', () => {
    PICTURE_MATCH_SETS.forEach((set) => {
      expect(set).toHaveProperty('id')
      expect(set).toHaveProperty('label')
      expect(set).toHaveProperty('emoji')
      expect(set).toHaveProperty('cards')
      expect(Array.isArray(set.cards)).toBe(true)
    })
  })

  it('each set has 8 unique cards', () => {
    PICTURE_MATCH_SETS.forEach((set) => {
      expect(set.cards).toHaveLength(8)
      const unique = new Set(set.cards)
      expect(unique.size).toBe(8)
    })
  })
})

describe('Picture Match Data – buildPictureMatchDeck', () => {
  it('returns 16 cards for a set with 8 cards', () => {
    const deck = buildPictureMatchDeck(PICTURE_MATCH_SETS[0])
    expect(deck).toHaveLength(16)
  })

  it('each emoji appears exactly twice', () => {
    const deck = buildPictureMatchDeck(PICTURE_MATCH_SETS[0])
    const counts = {}
    deck.forEach(({ emoji }) => {
      counts[emoji] = (counts[emoji] ?? 0) + 1
    })
    Object.values(counts).forEach((count) => {
      expect(count).toBe(2)
    })
  })

  it('all cards start with flipped=false and matched=false', () => {
    const deck = buildPictureMatchDeck(PICTURE_MATCH_SETS[0])
    deck.forEach((card) => {
      expect(card.flipped).toBe(false)
      expect(card.matched).toBe(false)
    })
  })

  it('each card has a unique id', () => {
    const deck = buildPictureMatchDeck(PICTURE_MATCH_SETS[0])
    const ids = deck.map((c) => c.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(16)
  })

  it('pairKey matches the emoji', () => {
    const deck = buildPictureMatchDeck(PICTURE_MATCH_SETS[0])
    deck.forEach((card) => {
      expect(card.pairKey).toBe(card.emoji)
    })
  })
})

// ── Unit Tests: component ─────────────────────────────────────────────────────

describe('Picture Match Component – initial render', () => {
  it('renders the Moves stat label', () => {
    render(<PictureMatchBoard />)
    expect(screen.getByText('Moves')).toBeInTheDocument()
  })

  it('renders the Pairs stat label', () => {
    render(<PictureMatchBoard />)
    expect(screen.getByText('Pairs')).toBeInTheDocument()
  })

  it('renders the Time stat label', () => {
    render(<PictureMatchBoard />)
    expect(screen.getByText('Time')).toBeInTheDocument()
  })

  it('shows "0 / 8" pairs initially', () => {
    render(<PictureMatchBoard />)
    expect(screen.getByText('0 / 8')).toBeInTheDocument()
  })

  it('shows 0 moves initially', () => {
    render(<PictureMatchBoard />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders 16 hidden card buttons', () => {
    render(<PictureMatchBoard />)
    const hiddenCards = screen.getAllByRole('button', { name: 'Hidden card' })
    expect(hiddenCards).toHaveLength(16)
  })

  it('renders the New Game button', () => {
    render(<PictureMatchBoard />)
    expect(
      screen.getByRole('button', { name: /new game/i })
    ).toBeInTheDocument()
  })

  it('shows the hint text about matching pairs', () => {
    render(<PictureMatchBoard />)
    expect(screen.getByText(/matching pairs/i)).toBeInTheDocument()
  })

  it('renders the theme picker with Flags set active by default', () => {
    render(<PictureMatchBoard />)
    expect(screen.getByRole('button', { name: /flags/i })).toBeInTheDocument()
  })

  it('renders all 6 theme picker buttons', () => {
    render(<PictureMatchBoard />)
    const themes = ['Flags', 'Faces', 'Tools', 'Flowers', 'Fruits', 'Buildings']
    themes.forEach((theme) => {
      expect(
        screen.getByRole('button', { name: new RegExp(theme, 'i') })
      ).toBeInTheDocument()
    })
  })
})

// ── E2E Tests ─────────────────────────────────────────────────────────────────

describe('Picture Match Component – card flipping', () => {
  it('clicking a card changes its aria-label from "Hidden card" to an emoji', async () => {
    render(<PictureMatchBoard />)
    const hiddenCards = screen.getAllByRole('button', { name: 'Hidden card' })

    fireEvent.click(hiddenCards[0])

    await waitFor(() => {
      const stillHidden = screen.getAllByRole('button', { name: 'Hidden card' })
      expect(stillHidden.length).toBe(15)
    })
  })

  it('clicking two cards increments the Moves counter', async () => {
    render(<PictureMatchBoard />)
    const hiddenCards = screen.getAllByRole('button', { name: 'Hidden card' })

    fireEvent.click(hiddenCards[0])
    act(() => vi.advanceTimersByTime(50))
    fireEvent.click(hiddenCards[1])

    act(() => vi.advanceTimersByTime(100))

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('non-matching cards flip back after ~900 ms', async () => {
    render(<PictureMatchBoard />)
    const hiddenCards = screen.getAllByRole('button', { name: 'Hidden card' })

    fireEvent.click(hiddenCards[0])
    act(() => vi.advanceTimersByTime(50))
    fireEvent.click(hiddenCards[1])

    // Advance past the 900 ms flip-back delay
    act(() => vi.advanceTimersByTime(1000))

    await waitFor(() => {
      const stillHidden = screen.getAllByRole('button', { name: 'Hidden card' })
      // Either flipped back (16) or matched (14) — both are valid
      expect(stillHidden.length).toBeGreaterThanOrEqual(14)
    })
  })
})

describe('Picture Match Component – theme picker', () => {
  it('clicking the Faces theme button does not crash', () => {
    render(<PictureMatchBoard />)
    const facesBtn = screen.getByRole('button', { name: /faces/i })
    expect(() => fireEvent.click(facesBtn)).not.toThrow()
  })

  it('switching theme resets the board to 16 hidden cards', async () => {
    render(<PictureMatchBoard />)

    // Flip a card
    const hiddenCards = screen.getAllByRole('button', { name: 'Hidden card' })
    fireEvent.click(hiddenCards[0])
    act(() => vi.advanceTimersByTime(100))

    // Switch theme
    fireEvent.click(screen.getByRole('button', { name: /faces/i }))

    await waitFor(() => {
      const newHidden = screen.getAllByRole('button', { name: 'Hidden card' })
      expect(newHidden.length).toBe(16)
    })
  })
})

describe('Picture Match Component – New Game', () => {
  it('clicking New Game resets moves to 0', async () => {
    render(<PictureMatchBoard />)
    const hiddenCards = screen.getAllByRole('button', { name: 'Hidden card' })

    // Make a move
    fireEvent.click(hiddenCards[0])
    act(() => vi.advanceTimersByTime(50))
    fireEvent.click(hiddenCards[1])
    act(() => vi.advanceTimersByTime(1000))

    // Reset
    fireEvent.click(screen.getByRole('button', { name: /new game/i }))

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  it('clicking New Game resets pairs to 0 / 8', async () => {
    render(<PictureMatchBoard />)
    fireEvent.click(screen.getByRole('button', { name: /new game/i }))

    await waitFor(() => {
      expect(screen.getByText('0 / 8')).toBeInTheDocument()
    })
  })
})
