import { describe, it, expect } from 'vitest'
import { puzzles, COLOR_STYLES } from '../data/puzzles'

describe('Puzzle Data Structure', () => {
  it('should have exactly 20 puzzles', () => {
    expect(puzzles).toHaveLength(20)
  })

  it('should have all required color styles', () => {
    const requiredColors = ['yellow', 'green', 'blue', 'purple', 'pink']
    requiredColors.forEach((color) => {
      expect(COLOR_STYLES).toHaveProperty(color)
      expect(COLOR_STYLES[color]).toHaveProperty('bg')
      expect(COLOR_STYLES[color]).toHaveProperty('titleColor')
      expect(COLOR_STYLES[color]).toHaveProperty('wordsColor')
    })
  })

  it('should have each puzzle with exactly 5 categories', () => {
    puzzles.forEach((puzzle) => {
      expect(puzzle.categories).toHaveLength(5)
    })
  })

  it('should have each category with exactly 4 words', () => {
    puzzles.forEach((puzzle) => {
      puzzle.categories.forEach((category) => {
        expect(category.words).toHaveLength(4)
        category.words.forEach((word) => {
          expect(typeof word).toBe('string')
          expect(word.length).toBeGreaterThan(0)
        })
      })
    })
  })

  it('should have all required category properties', () => {
    const requiredProps = ['id', 'color', 'title', 'words']
    puzzles.forEach((puzzle) => {
      puzzle.categories.forEach((category) => {
        requiredProps.forEach((prop) => {
          expect(category).toHaveProperty(prop)
        })
      })
    })
  })
})
