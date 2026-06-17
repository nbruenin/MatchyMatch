/**
 * Comprehensive tests for data modules and utility functions
 *
 * Covers:
 *  - spellingBeeData: validateWord, wordScore, isPangram, maxScore, getRank, pickPuzzle
 *  - typeRacePhrases: pickPhrase, TYPE_RACE_PHRASES structure
 *  - wordChainPuzzles: WORD_CHAIN_PUZZLES structure, VALID_WORDS
 *  - wordSearchPuzzles: PUZZLES structure, pickPuzzle, getWordCells
 *  - wordleWords: WORDLE_ANSWERS, ALL_VALID_WORDS
 *  - triviaQuestions: pickQuestions, LETTERS
 *  - mathQuizProblems: structure validation
 *  - memoryCards: structure validation
 *  - game2048Data: structure validation
 *  - gameLogic: edge cases
 */

import { describe, it, expect, vi } from 'vitest'

// ── spellingBeeData ───────────────────────────────────────────────────────────

describe('spellingBeeData – validateWord', () => {
  const puzzle = {
    center: 'A',
    outer: ['P', 'L', 'N', 'T', 'E', 'R'],
    words: ['PLAN', 'PLANE', 'PLANET', 'PLANT', 'PANEL'],
  }

  it('returns "too_short" for words shorter than 4 letters', async () => {
    const { validateWord } = await import('../data/spellingBeeData')
    expect(validateWord('PL', puzzle)).toBe('too_short')
    expect(validateWord('PLA', puzzle)).toBe('too_short')
  })

  it('returns "missing_center" when word does not contain center letter', async () => {
    const { validateWord } = await import('../data/spellingBeeData')
    expect(validateWord('RENT', puzzle)).toBe('missing_center')
  })

  it('returns "bad_letters" when word contains letters not in the puzzle', async () => {
    const { validateWord } = await import('../data/spellingBeeData')
    expect(validateWord('PLAN', { ...puzzle, center: 'A', outer: ['P', 'L', 'N', 'T', 'E', 'R'] })).toBe('valid')
    expect(validateWord('PLANS', { ...puzzle, words: ['PLANS'] })).toBe('bad_letters') // S not in puzzle
  })

  it('returns "not_a_word" for valid letters but not in word list', async () => {
    const { validateWord } = await import('../data/spellingBeeData')
    expect(validateWord('PANT', puzzle)).toBe('not_a_word') // PANT not in words list
  })

  it('returns "valid" for a correct word', async () => {
    const { validateWord } = await import('../data/spellingBeeData')
    expect(validateWord('PLAN', puzzle)).toBe('valid')
    expect(validateWord('PLANE', puzzle)).toBe('valid')
    expect(validateWord('PANEL', puzzle)).toBe('valid')
  })

  it('is case-insensitive', async () => {
    const { validateWord } = await import('../data/spellingBeeData')
    expect(validateWord('plan', puzzle)).toBe('valid')
    expect(validateWord('Plan', puzzle)).toBe('valid')
  })
})

describe('spellingBeeData – wordScore', () => {
  const puzzle = {
    center: 'A',
    outer: ['P', 'L', 'N', 'T', 'E', 'R'],
    words: ['PLAN', 'PLANE', 'PLANET', 'PLANT', 'PANEL', 'PLANTER'],
  }

  it('returns 1 for a 4-letter word', async () => {
    const { wordScore } = await import('../data/spellingBeeData')
    expect(wordScore('PLAN', puzzle)).toBe(1)
  })

  it('returns word length for 5+ letter words', async () => {
    const { wordScore } = await import('../data/spellingBeeData')
    expect(wordScore('PLANE', puzzle)).toBe(5)
    expect(wordScore('PLANET', puzzle)).toBe(6)
  })

  it('adds 7 bonus points for pangrams', async () => {
    const { wordScore } = await import('../data/spellingBeeData')
    // PLANTER uses all 7 letters: P, L, A, N, T, E, R
    const pangramScore = wordScore('PLANTER', puzzle)
    expect(pangramScore).toBe(7 + 7) // 7 letters + 7 bonus
  })
})

describe('spellingBeeData – isPangram', () => {
  const puzzle = {
    center: 'A',
    outer: ['P', 'L', 'N', 'T', 'E', 'R'],
    words: ['PLANTER'],
  }

  it('returns true for a word using all 7 letters', async () => {
    const { isPangram } = await import('../data/spellingBeeData')
    expect(isPangram('PLANTER', puzzle)).toBe(true)
  })

  it('returns false for a word not using all 7 letters', async () => {
    const { isPangram } = await import('../data/spellingBeeData')
    expect(isPangram('PLAN', puzzle)).toBe(false)
    expect(isPangram('PLANE', puzzle)).toBe(false)
  })
})

describe('spellingBeeData – maxScore', () => {
  it('returns the sum of all word scores', async () => {
    const { maxScore, wordScore } = await import('../data/spellingBeeData')
    const puzzle = {
      center: 'A',
      outer: ['P', 'L', 'N', 'T', 'E', 'R'],
      words: ['PLAN', 'PLANE'],
    }
    const expected = wordScore('PLAN', puzzle) + wordScore('PLANE', puzzle)
    expect(maxScore(puzzle)).toBe(expected)
  })

  it('returns 0 for empty word list', async () => {
    const { maxScore } = await import('../data/spellingBeeData')
    expect(maxScore({ center: 'A', outer: [], words: [] })).toBe(0)
  })
})

describe('spellingBeeData – getRank', () => {
  it('returns "Queen Bee" at 100%', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(100, 100).label).toContain('Queen Bee')
  })

  it('returns "Genius" at 70%+', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(70, 100).label).toContain('Genius')
  })

  it('returns "Amazing" at 50%+', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(50, 100).label).toContain('Amazing')
  })

  it('returns "Great" at 35%+', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(35, 100).label).toContain('Great')
  })

  it('returns "Nice" at 20%+', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(20, 100).label).toContain('Nice')
  })

  it('returns "Solid" at 10%+', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(10, 100).label).toContain('Solid')
  })

  it('returns "Beginner" at 0%', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(0, 100).label).toContain('Beginner')
  })

  it('returns "Beginner" when max is 0', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    expect(getRank(0, 0).label).toContain('Beginner')
  })

  it('each rank has a color property', async () => {
    const { getRank } = await import('../data/spellingBeeData')
    const ranks = [0, 10, 20, 35, 50, 70, 100].map((s) => getRank(s, 100))
    ranks.forEach((r) => {
      expect(r).toHaveProperty('color')
      expect(typeof r.color).toBe('string')
    })
  })
})

describe('spellingBeeData – pickPuzzle', () => {
  it('returns a puzzle with center, outer, and words', async () => {
    const { pickPuzzle } = await import('../data/spellingBeeData')
    const puzzle = pickPuzzle()
    expect(puzzle).toHaveProperty('center')
    expect(puzzle).toHaveProperty('outer')
    expect(puzzle).toHaveProperty('words')
    expect(typeof puzzle.center).toBe('string')
    expect(Array.isArray(puzzle.outer)).toBe(true)
    expect(puzzle.outer.length).toBe(6)
    expect(Array.isArray(puzzle.words)).toBe(true)
  })

  it('center is a single uppercase letter', async () => {
    const { pickPuzzle } = await import('../data/spellingBeeData')
    const puzzle = pickPuzzle()
    expect(/^[A-Z]$/.test(puzzle.center)).toBe(true)
  })
})

describe('spellingBeeData – SPELLING_BEE_PUZZLES', () => {
  it('exports an array of puzzles', async () => {
    const { SPELLING_BEE_PUZZLES } = await import('../data/spellingBeeData')
    expect(Array.isArray(SPELLING_BEE_PUZZLES)).toBe(true)
    expect(SPELLING_BEE_PUZZLES.length).toBeGreaterThan(0)
  })

  it('each puzzle has required fields', async () => {
    const { SPELLING_BEE_PUZZLES } = await import('../data/spellingBeeData')
    SPELLING_BEE_PUZZLES.forEach((p) => {
      expect(p).toHaveProperty('center')
      expect(p).toHaveProperty('outer')
      expect(p).toHaveProperty('words')
      expect(p.outer.length).toBe(6)
    })
  })
})

// ── typeRacePhrases ───────────────────────────────────────────────────────────

describe('typeRacePhrases – TYPE_RACE_PHRASES', () => {
  it('exports an array', async () => {
    const { TYPE_RACE_PHRASES } = await import('../data/typeRacePhrases')
    expect(Array.isArray(TYPE_RACE_PHRASES)).toBe(true)
    expect(TYPE_RACE_PHRASES.length).toBeGreaterThan(0)
  })

  it('each phrase has id, text, and category', async () => {
    const { TYPE_RACE_PHRASES } = await import('../data/typeRacePhrases')
    TYPE_RACE_PHRASES.forEach((p) => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('text')
      expect(p).toHaveProperty('category')
      expect(typeof p.id).toBe('number')
      expect(typeof p.text).toBe('string')
      expect(p.text.length).toBeGreaterThan(0)
      expect(typeof p.category).toBe('string')
    })
  })

  it('all phrase ids are unique', async () => {
    const { TYPE_RACE_PHRASES } = await import('../data/typeRacePhrases')
    const ids = TYPE_RACE_PHRASES.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})

describe('typeRacePhrases – pickPhrase', () => {
  it('returns a phrase object', async () => {
    const { pickPhrase } = await import('../data/typeRacePhrases')
    const phrase = pickPhrase()
    expect(phrase).toHaveProperty('id')
    expect(phrase).toHaveProperty('text')
    expect(phrase).toHaveProperty('category')
  })

  it('excludes the given id when excludeId is provided', async () => {
    const { pickPhrase, TYPE_RACE_PHRASES } = await import('../data/typeRacePhrases')
    // Run many times to check exclusion
    const excludeId = TYPE_RACE_PHRASES[0].id
    for (let i = 0; i < 20; i++) {
      const phrase = pickPhrase(excludeId)
      expect(phrase.id).not.toBe(excludeId)
    }
  })

  it('returns any phrase when excludeId is null', async () => {
    const { pickPhrase } = await import('../data/typeRacePhrases')
    const phrase = pickPhrase(null)
    expect(phrase).toBeDefined()
  })
})

// ── wordChainPuzzles ──────────────────────────────────────────────────────────

describe('wordChainPuzzles – WORD_CHAIN_PUZZLES', () => {
  it('exports an array', async () => {
    const { WORD_CHAIN_PUZZLES } = await import('../data/wordChainPuzzles')
    expect(Array.isArray(WORD_CHAIN_PUZZLES)).toBe(true)
    expect(WORD_CHAIN_PUZZLES.length).toBeGreaterThan(0)
  })

  it('each puzzle has start, end, par, and solution', async () => {
    const { WORD_CHAIN_PUZZLES } = await import('../data/wordChainPuzzles')
    WORD_CHAIN_PUZZLES.forEach((p) => {
      expect(p).toHaveProperty('start')
      expect(p).toHaveProperty('end')
      expect(p).toHaveProperty('par')
      expect(p).toHaveProperty('solution')
      expect(typeof p.start).toBe('string')
      expect(typeof p.end).toBe('string')
      expect(typeof p.par).toBe('number')
      expect(Array.isArray(p.solution)).toBe(true)
    })
  })

  it('start and end words have the same length', async () => {
    const { WORD_CHAIN_PUZZLES } = await import('../data/wordChainPuzzles')
    WORD_CHAIN_PUZZLES.forEach((p) => {
      expect(p.start.length).toBe(p.end.length)
    })
  })

  it('solution starts with start word and ends with end word', async () => {
    const { WORD_CHAIN_PUZZLES } = await import('../data/wordChainPuzzles')
    WORD_CHAIN_PUZZLES.forEach((p) => {
      expect(p.solution[0]).toBe(p.start)
      expect(p.solution[p.solution.length - 1]).toBe(p.end)
    })
  })

  it('par matches solution length minus 1', async () => {
    const { WORD_CHAIN_PUZZLES } = await import('../data/wordChainPuzzles')
    WORD_CHAIN_PUZZLES.forEach((p) => {
      expect(p.par).toBe(p.solution.length - 1)
    })
  })
})

describe('wordChainPuzzles – VALID_WORDS', () => {
  it('exports a Set', async () => {
    const { VALID_WORDS } = await import('../data/wordChainPuzzles')
    expect(VALID_WORDS instanceof Set).toBe(true)
    expect(VALID_WORDS.size).toBeGreaterThan(0)
  })

  it('contains common English words', async () => {
    const { VALID_WORDS } = await import('../data/wordChainPuzzles')
    // Common 4-letter words that should be in any word list
    const commonWords = ['WORD', 'GAME', 'PLAY', 'LOVE', 'LIFE', 'TIME', 'WORK', 'HAND', 'FIRE', 'COLD']
    const found = commonWords.filter((w) => VALID_WORDS.has(w))
    expect(found.length).toBeGreaterThan(0)
  })
})

// ── wordSearchPuzzles ─────────────────────────────────────────────────────────

describe('wordSearchPuzzles – PUZZLES', () => {
  it('exports an array', async () => {
    const { PUZZLES } = await import('../data/wordSearchPuzzles')
    expect(Array.isArray(PUZZLES)).toBe(true)
    expect(PUZZLES.length).toBeGreaterThan(0)
  })

  it('each puzzle has id, theme, emoji, grid, words, and placements', async () => {
    const { PUZZLES } = await import('../data/wordSearchPuzzles')
    PUZZLES.forEach((p) => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('theme')
      expect(p).toHaveProperty('emoji')
      expect(p).toHaveProperty('grid')
      expect(p).toHaveProperty('words')
      expect(p).toHaveProperty('placements')
      expect(Array.isArray(p.grid)).toBe(true)
      expect(Array.isArray(p.words)).toBe(true)
      expect(Array.isArray(p.placements)).toBe(true)
    })
  })

  it('grid is a 2D array of uppercase letters', async () => {
    const { PUZZLES } = await import('../data/wordSearchPuzzles')
    PUZZLES.forEach((p) => {
      p.grid.forEach((row) => {
        expect(Array.isArray(row)).toBe(true)
        row.forEach((cell) => {
          expect(/^[A-Z]$/.test(cell)).toBe(true)
        })
      })
    })
  })

  it('all grid rows have the same length', async () => {
    const { PUZZLES } = await import('../data/wordSearchPuzzles')
    PUZZLES.forEach((p) => {
      const colCount = p.grid[0].length
      p.grid.forEach((row) => {
        expect(row.length).toBe(colCount)
      })
    })
  })

  it('placements count matches words count', async () => {
    const { PUZZLES } = await import('../data/wordSearchPuzzles')
    PUZZLES.forEach((p) => {
      expect(p.placements.length).toBe(p.words.length)
    })
  })
})

describe('wordSearchPuzzles – getWordCells', () => {
  it('returns an array of {row, col} objects', async () => {
    const { PUZZLES, getWordCells } = await import('../data/wordSearchPuzzles')
    const puzzle = PUZZLES[0]
    const placement = puzzle.placements[0]
    const cells = getWordCells(placement)
    expect(Array.isArray(cells)).toBe(true)
    expect(cells.length).toBeGreaterThan(0)
    cells.forEach((cell) => {
      expect(cell).toHaveProperty('row')
      expect(cell).toHaveProperty('col')
    })
  })

  it('returns the correct number of cells for the word length', async () => {
    const { PUZZLES, getWordCells } = await import('../data/wordSearchPuzzles')
    const puzzle = PUZZLES[0]
    puzzle.placements.forEach((placement) => {
      const cells = getWordCells(placement)
      expect(cells.length).toBe(placement.word.length)
    })
  })
})

describe('wordSearchPuzzles – pickPuzzle', () => {
  it('returns a puzzle from the PUZZLES array', async () => {
    const { pickPuzzle, PUZZLES } = await import('../data/wordSearchPuzzles')
    const puzzle = pickPuzzle()
    expect(PUZZLES.some((p) => p.id === puzzle.id)).toBe(true)
  })
})

// ── wordleWords ───────────────────────────────────────────────────────────────

describe('wordleWords – WORDLE_ANSWERS', () => {
  it('exports an array', async () => {
    const { WORDLE_ANSWERS } = await import('../data/wordleWords')
    expect(Array.isArray(WORDLE_ANSWERS)).toBe(true)
    expect(WORDLE_ANSWERS.length).toBeGreaterThan(0)
  })

  it('all answers are 5 uppercase letters', async () => {
    const { WORDLE_ANSWERS } = await import('../data/wordleWords')
    WORDLE_ANSWERS.forEach((word) => {
      expect(word.length).toBe(5)
      expect(/^[A-Z]+$/.test(word)).toBe(true)
    })
  })
})

describe('wordleWords – ALL_VALID_WORDS', () => {
  it('exports an array', async () => {
    const { ALL_VALID_WORDS } = await import('../data/wordleWords')
    expect(Array.isArray(ALL_VALID_WORDS)).toBe(true)
    expect(ALL_VALID_WORDS.length).toBeGreaterThan(0)
  })

  it('all valid words are 5 uppercase letters', async () => {
    const { ALL_VALID_WORDS } = await import('../data/wordleWords')
    ALL_VALID_WORDS.forEach((word) => {
      expect(word.length).toBe(5)
      expect(/^[A-Z]+$/.test(word)).toBe(true)
    })
  })

  it('ALL_VALID_WORDS contains all WORDLE_ANSWERS', async () => {
    const { ALL_VALID_WORDS, WORDLE_ANSWERS } = await import('../data/wordleWords')
    const validSet = new Set(ALL_VALID_WORDS)
    WORDLE_ANSWERS.forEach((word) => {
      expect(validSet.has(word)).toBe(true)
    })
  })
})

// ── triviaQuestions ───────────────────────────────────────────────────────────

describe('triviaQuestions – TRIVIA_QUESTIONS', () => {
  it('exports an array', async () => {
    const { TRIVIA_QUESTIONS } = await import('../data/triviaQuestions')
    expect(Array.isArray(TRIVIA_QUESTIONS)).toBe(true)
    expect(TRIVIA_QUESTIONS.length).toBeGreaterThan(0)
  })

  it('each question has required fields', async () => {
    const { TRIVIA_QUESTIONS } = await import('../data/triviaQuestions')
    TRIVIA_QUESTIONS.forEach((q) => {
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('choices')
      expect(q).toHaveProperty('answer')
      expect(q).toHaveProperty('category')
      expect(Array.isArray(q.choices)).toBe(true)
      expect(q.choices.length).toBe(4)
    })
  })

  it('answer is one of A, B, C, D', async () => {
    const { TRIVIA_QUESTIONS } = await import('../data/triviaQuestions')
    TRIVIA_QUESTIONS.forEach((q) => {
      expect(['A', 'B', 'C', 'D']).toContain(q.answer)
    })
  })

  it('all question ids are unique', async () => {
    const { TRIVIA_QUESTIONS } = await import('../data/triviaQuestions')
    const ids = TRIVIA_QUESTIONS.map((q) => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})

describe('triviaQuestions – pickQuestions', () => {
  it('returns the requested number of questions', async () => {
    const { pickQuestions } = await import('../data/triviaQuestions')
    const questions = pickQuestions(10)
    expect(questions.length).toBe(10)
  })

  it('returns unique questions (no duplicates)', async () => {
    const { pickQuestions } = await import('../data/triviaQuestions')
    const questions = pickQuestions(10)
    const ids = questions.map((q) => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(10)
  })

  it('each returned question has all required fields', async () => {
    const { pickQuestions } = await import('../data/triviaQuestions')
    const questions = pickQuestions(5)
    questions.forEach((q) => {
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('choices')
      expect(q).toHaveProperty('answer')
    })
  })
})

describe('triviaQuestions – LETTERS', () => {
  it('exports ["A", "B", "C", "D"]', async () => {
    const { LETTERS } = await import('../data/triviaQuestions')
    expect(LETTERS).toEqual(['A', 'B', 'C', 'D'])
  })
})

// ── mathQuizProblems ──────────────────────────────────────────────────────────

describe('mathQuizProblems – MATH_QUIZ_PROBLEMS', () => {
  it('exports an array', async () => {
    const { MATH_QUIZ_PROBLEMS } = await import('../data/mathQuizProblems')
    expect(Array.isArray(MATH_QUIZ_PROBLEMS)).toBe(true)
    expect(MATH_QUIZ_PROBLEMS.length).toBeGreaterThan(0)
  })

  it('each problem has problem and answer fields', async () => {
    const { MATH_QUIZ_PROBLEMS } = await import('../data/mathQuizProblems')
    MATH_QUIZ_PROBLEMS.forEach((p) => {
      expect(p).toHaveProperty('problem')
      expect(p).toHaveProperty('answer')
      expect(typeof p.problem).toBe('string')
      expect(typeof p.answer).toBe('number')
    })
  })
})

// ── memoryCards ───────────────────────────────────────────────────────────────

describe('memoryCards – MEMORY_CARDS', () => {
  it('exports an array', async () => {
    const { MEMORY_CARDS } = await import('../data/memoryCards')
    expect(Array.isArray(MEMORY_CARDS)).toBe(true)
    expect(MEMORY_CARDS.length).toBeGreaterThan(0)
  })

  it('has an even number of cards (for matching pairs)', async () => {
    const { MEMORY_CARDS } = await import('../data/memoryCards')
    expect(MEMORY_CARDS.length % 2).toBe(0)
  })
})

// ── game2048Data ──────────────────────────────────────────────────────────────

describe('game2048Data', () => {
  it('exports data', async () => {
    const data = await import('../data/game2048Data')
    expect(data).toBeDefined()
  })
})

// ── gameLogic – additional edge cases ────────────────────────────────────────

describe('gameLogic – isCorrectMatch edge cases', () => {
  it('returns true for empty selected array against any category', async () => {
    const { isCorrectMatch } = await import('../utils/gameLogic')
    const category = { words: ['A', 'B', 'C', 'D'] }
    // every() on empty array returns true
    expect(isCorrectMatch([], category)).toBe(true)
  })

  it('returns false when category has no words property', async () => {
    const { isCorrectMatch } = await import('../utils/gameLogic')
    expect(isCorrectMatch(['A'], {})).toBe(false)
  })
})

describe('gameLogic – shuffleArray edge cases', () => {
  it('handles empty array', async () => {
    const { shuffleArray } = await import('../utils/gameLogic')
    expect(shuffleArray([])).toEqual([])
  })

  it('handles single-element array', async () => {
    const { shuffleArray } = await import('../utils/gameLogic')
    expect(shuffleArray(['A'])).toEqual(['A'])
  })

  it('returns a new array (not the same reference)', async () => {
    const { shuffleArray } = await import('../utils/gameLogic')
    const arr = ['A', 'B', 'C']
    const result = shuffleArray(arr)
    expect(result).not.toBe(arr)
  })
})

describe('gameLogic – getAllWords edge cases', () => {
  it('handles categories with empty words arrays', async () => {
    const { getAllWords } = await import('../utils/gameLogic')
    const categories = [{ words: [] }, { words: ['A', 'B'] }]
    expect(getAllWords(categories)).toEqual(['A', 'B'])
  })

  it('handles categories without words property', async () => {
    const { getAllWords } = await import('../utils/gameLogic')
    const categories = [{ title: 'No words' }]
    expect(getAllWords(categories)).toEqual([])
  })
})
