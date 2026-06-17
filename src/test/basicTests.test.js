import { describe, it, expect } from 'vitest'
import { puzzles, COLOR_STYLES } from '../data/puzzles'
import { isCorrectMatch, countMatchingWords, shuffleArray, getAllWords } from '../utils/gameLogic'

/**
 * Test 1: Verify puzzle data structure
 * Tests that all puzzles have the correct structure with 5 categories and 4 words each
 */
describe('Test 1: Puzzle Data Structure Validation', () => {
  it('should have 20 puzzles with 5 categories each', () => {
    expect(puzzles).toHaveLength(20)
    puzzles.forEach((puzzle) => {
      expect(puzzle.categories).toHaveLength(5)
    })
  })
})

/**
 * Test 2: Verify category structure
 * Tests that each category has the required properties
 */
describe('Test 2: Category Structure Validation', () => {
  it('should have all required category properties', () => {
    const requiredProps = ['id', 'color', 'title', 'words']

    puzzles.forEach((puzzle) => {
      puzzle.categories.forEach((category) => {
        requiredProps.forEach((prop) => {
          expect(category).toHaveProperty(prop)
        })
        expect(category.words).toHaveLength(4)
      })
    })
  })
})

/**
 * Test 3: Verify color styles exist
 * Tests that all required color styles are defined
 */
describe('Test 3: Color Styles Validation', () => {
  it('should have all required color styles with proper properties', () => {
    const requiredColors = ['yellow', 'green', 'blue', 'purple', 'pink']

    requiredColors.forEach((color) => {
      expect(COLOR_STYLES).toHaveProperty(color)
      expect(COLOR_STYLES[color]).toHaveProperty('bg')
      expect(COLOR_STYLES[color]).toHaveProperty('titleColor')
      expect(COLOR_STYLES[color]).toHaveProperty('wordsColor')
    })
  })
})

/**
 * Test 4: Game logic - correct match detection
 * Tests that the game can correctly identify when selected words match a category
 */
describe('Test 4: Game Logic - Correct Match Detection', () => {
  it('should correctly identify matching categories', () => {
    const category = {
      id: 'yellow',
      color: 'yellow',
      title: 'Things you plug in',
      words: ['LAMP', 'TOASTER', 'FAN', 'ROUTER'],
    }

    // Test correct match
    expect(isCorrectMatch(['LAMP', 'TOASTER', 'FAN', 'ROUTER'], category)).toBe(true)

    // Test partial match
    expect(countMatchingWords(['LAMP', 'TOASTER', 'FAN', 'MIRROR'], category)).toBe(3)

    // Test no match
    expect(isCorrectMatch(['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'], category)).toBe(false)
  })
})

/**
 * Test 5: Game logic - shuffle and array utilities
 * Tests that utility functions work correctly for game mechanics
 */
describe('Test 5: Game Logic - Utilities', () => {
  it('should shuffle arrays and get all words correctly', () => {
    const categories = [
      {
        id: 'yellow',
        color: 'yellow',
        title: 'Things you plug in',
        words: ['LAMP', 'TOASTER', 'FAN', 'ROUTER'],
      },
      {
        id: 'green',
        color: 'green',
        title: 'In the bathroom',
        words: ['MIRROR', 'TOWEL', 'FAUCET', 'DRAIN'],
      },
    ]

    // Test getAllWords
    const allWords = getAllWords(categories)
    expect(allWords).toHaveLength(8)
    expect(allWords).toContain('LAMP')
    expect(allWords).toContain('MIRROR')

    // Test shuffleArray
    const original = ['A', 'B', 'C', 'D']
    const shuffled = shuffleArray(original)
    expect(shuffled).toHaveLength(original.length)
    expect([...shuffled].sort()).toEqual([...original].sort())
    expect(original).toEqual(['A', 'B', 'C', 'D']) // Original not mutated
  })
})
