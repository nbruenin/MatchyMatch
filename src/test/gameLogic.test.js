import { describe, it, expect } from 'vitest'
import {
  isCorrectMatch,
  countMatchingWords,
  isOneAway,
  shuffleArray,
  getAllWords,
} from '../utils/gameLogic'

describe('Game Logic Utilities', () => {
  const mockCategory = {
    id: 'yellow',
    color: 'yellow',
    title: 'Things you plug in',
    words: ['LAMP', 'TOASTER', 'FAN', 'ROUTER'],
  }

  const mockCategories = [
    mockCategory,
    {
      id: 'green',
      color: 'green',
      title: 'In the bathroom',
      words: ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'],
    },
  ]

  describe('isCorrectMatch', () => {
    it('should return true when all selected words match a category', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER']
      expect(isCorrectMatch(selected, mockCategory)).toBe(true)
    })

    it('should return false when not all selected words match', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'MIRROR']
      expect(isCorrectMatch(selected, mockCategory)).toBe(false)
    })

    it('should return false with invalid inputs', () => {
      expect(isCorrectMatch(null, mockCategory)).toBe(false)
      expect(isCorrectMatch(['LAMP'], null)).toBe(false)
      expect(isCorrectMatch([], mockCategory)).toBe(true) // edge case: empty array matches
    })
  })

  describe('countMatchingWords', () => {
    it('should count matching words correctly', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'MIRROR']
      expect(countMatchingWords(selected, mockCategory)).toBe(3)
    })

    it('should return 0 when no words match', () => {
      const selected = ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN']
      expect(countMatchingWords(selected, mockCategory)).toBe(0)
    })

    it('should return 0 with invalid inputs', () => {
      expect(countMatchingWords(null, mockCategory)).toBe(0)
      expect(countMatchingWords(['LAMP'], null)).toBe(0)
    })
  })

  describe('isOneAway', () => {
    it('should return true when exactly 3 words match a category', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'MIRROR']
      expect(isOneAway(selected, mockCategories)).toBe(true)
    })

    it('should return false when all 4 words match', () => {
      const selected = ['LAMP', 'TOASTER', 'FAN', 'ROUTER']
      expect(isOneAway(selected, mockCategories)).toBe(false)
    })

    it('should return false when fewer than 3 words match', () => {
      const selected = ['LAMP', 'TOASTER', 'MIRROR', 'TOWEL']
      expect(isOneAway(selected, mockCategories)).toBe(false)
    })

    it('should return false with invalid inputs', () => {
      expect(isOneAway(null, mockCategories)).toBe(false)
      expect(isOneAway(['LAMP', 'TOASTER'], mockCategories)).toBe(false)
    })
  })

  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const arr = ['A', 'B', 'C', 'D']
      const shuffled = shuffleArray(arr)
      expect(shuffled).toHaveLength(arr.length)
    })

    it('should contain all original elements', () => {
      const arr = ['A', 'B', 'C', 'D']
      const shuffled = shuffleArray(arr)
      expect(shuffled.sort()).toEqual(arr.sort())
    })

    it('should not mutate the original array', () => {
      const arr = ['A', 'B', 'C', 'D']
      const original = [...arr]
      shuffleArray(arr)
      expect(arr).toEqual(original)
    })
  })

  describe('getAllWords', () => {
    it('should return all words from categories', () => {
      const words = getAllWords(mockCategories)
      expect(words).toHaveLength(8)
      expect(words).toContain('LAMP')
      expect(words).toContain('MIRROR')
    })

    it('should return empty array with null input', () => {
      expect(getAllWords(null)).toEqual([])
    })

    it('should return empty array with empty categories', () => {
      expect(getAllWords([])).toEqual([])
    })
  })
})
