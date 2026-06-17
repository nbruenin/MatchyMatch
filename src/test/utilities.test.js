/**
 * Tests for utility functions and custom hooks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from '../../hooks/useDarkMode'
import * as gameLogic from '../../utils/gameLogic'

// ── useDarkMode Hook Tests ────────────────────────────────────────────────────
// Note: the hook returns { dark, toggle } and uses 'puzzlr-dark-mode' as the key

describe('useDarkMode – Unit: hook functionality', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('initializes with dark mode off by default (no localStorage)', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.dark).toBe(false)
  })

  it('returns a toggle function', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(typeof result.current.toggle).toBe('function')
  })

  it('toggles dark mode on when toggle is called', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.dark).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.dark).toBe(true)
  })

  it('toggles dark mode off when called twice', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => { result.current.toggle() })
    act(() => { result.current.toggle() })

    expect(result.current.dark).toBe(false)
  })

  it('persists dark mode state to localStorage with key "puzzlr-dark-mode"', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggle()
    })

    const stored = localStorage.getItem('puzzlr-dark-mode')
    expect(stored).toBe('true')
  })

  it('restores dark mode state from localStorage', () => {
    localStorage.setItem('puzzlr-dark-mode', 'true')

    const { result } = renderHook(() => useDarkMode())

    expect(result.current.dark).toBe(true)
  })

  it('restores light mode state from localStorage', () => {
    localStorage.setItem('puzzlr-dark-mode', 'false')

    const { result } = renderHook(() => useDarkMode())

    expect(result.current.dark).toBe(false)
  })

  it('applies dark class to document element when toggled on', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggle()
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when toggled off', () => {
    localStorage.setItem('puzzlr-dark-mode', 'true')
    document.documentElement.classList.add('dark')

    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggle()
    })

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

// ── gameLogic Utility Tests ───────────────────────────────────────────────────

describe('gameLogic – Unit: module exports', () => {
  it('exports an object', () => {
    expect(typeof gameLogic).toBe('object')
  })

  it('exports isCorrectMatch function', () => {
    expect(typeof gameLogic.isCorrectMatch).toBe('function')
  })

  it('exports countMatchingWords function', () => {
    expect(typeof gameLogic.countMatchingWords).toBe('function')
  })

  it('exports isOneAway function', () => {
    expect(typeof gameLogic.isOneAway).toBe('function')
  })

  it('exports shuffleArray function', () => {
    expect(typeof gameLogic.shuffleArray).toBe('function')
  })

  it('exports getAllWords function', () => {
    expect(typeof gameLogic.getAllWords).toBe('function')
  })
})

// ── Data Validation Tests ─────────────────────────────────────────────────────

describe('Data – Unit: word lists and puzzles', () => {
  it('anagramWords exports an array', async () => {
    const { ANAGRAM_WORDS } = await import('../../data/anagramWords')
    expect(Array.isArray(ANAGRAM_WORDS)).toBe(true)
    expect(ANAGRAM_WORDS.length).toBeGreaterThan(0)
  })

  it('hangmanWords exports an array', async () => {
    const { HANGMAN_WORDS } = await import('../../data/hangmanWords')
    expect(Array.isArray(HANGMAN_WORDS)).toBe(true)
    expect(HANGMAN_WORDS.length).toBeGreaterThan(0)
  })

  it('scrambleWords exports an array', async () => {
    const { SCRAMBLE_WORDS } = await import('../../data/scrambleWords')
    expect(Array.isArray(SCRAMBLE_WORDS)).toBe(true)
    expect(SCRAMBLE_WORDS.length).toBeGreaterThan(0)
  })

  it('wordleWords exports WORDLE_ANSWERS array', async () => {
    const { WORDLE_ANSWERS } = await import('../../data/wordleWords')
    expect(Array.isArray(WORDLE_ANSWERS)).toBe(true)
    expect(WORDLE_ANSWERS.length).toBeGreaterThan(0)
  })

  it('wordleWords exports ALL_VALID_WORDS array', async () => {
    const { ALL_VALID_WORDS } = await import('../../data/wordleWords')
    expect(Array.isArray(ALL_VALID_WORDS)).toBe(true)
    expect(ALL_VALID_WORDS.length).toBeGreaterThan(0)
  })

  it('triviaQuestions exports an array', async () => {
    const { TRIVIA_QUESTIONS } = await import('../../data/triviaQuestions')
    expect(Array.isArray(TRIVIA_QUESTIONS)).toBe(true)
    expect(TRIVIA_QUESTIONS.length).toBeGreaterThan(0)
  })

  it('mathQuizProblems exports an array', async () => {
    const { MATH_QUIZ_PROBLEMS } = await import('../../data/mathQuizProblems')
    expect(Array.isArray(MATH_QUIZ_PROBLEMS)).toBe(true)
    expect(MATH_QUIZ_PROBLEMS.length).toBeGreaterThan(0)
  })

  it('typeRacePhrases exports an array', async () => {
    const { TYPE_RACE_PHRASES } = await import('../../data/typeRacePhrases')
    expect(Array.isArray(TYPE_RACE_PHRASES)).toBe(true)
    expect(TYPE_RACE_PHRASES.length).toBeGreaterThan(0)
  })

  it('wordChainPuzzles exports an array', async () => {
    const { WORD_CHAIN_PUZZLES } = await import('../../data/wordChainPuzzles')
    expect(Array.isArray(WORD_CHAIN_PUZZLES)).toBe(true)
    expect(WORD_CHAIN_PUZZLES.length).toBeGreaterThan(0)
  })

  it('wordSearchPuzzles exports PUZZLES array', async () => {
    const { PUZZLES } = await import('../../data/wordSearchPuzzles')
    expect(Array.isArray(PUZZLES)).toBe(true)
    expect(PUZZLES.length).toBeGreaterThan(0)
  })

  it('spellingBeeData exports SPELLING_BEE_PUZZLES array', async () => {
    const { SPELLING_BEE_PUZZLES } = await import('../../data/spellingBeeData')
    expect(Array.isArray(SPELLING_BEE_PUZZLES)).toBe(true)
    expect(SPELLING_BEE_PUZZLES.length).toBeGreaterThan(0)
  })

  it('memoryCards exports an array', async () => {
    const { MEMORY_CARDS } = await import('../../data/memoryCards')
    expect(Array.isArray(MEMORY_CARDS)).toBe(true)
    expect(MEMORY_CARDS.length).toBeGreaterThan(0)
  })

  it('game2048Data exports data', async () => {
    const data = await import('../../data/game2048Data')
    expect(data).toBeDefined()
  })

  it('puzzles exports data', async () => {
    const data = await import('../../data/puzzles')
    expect(data).toBeDefined()
  })
})

// ── Data Content Validation ───────────────────────────────────────────────────

describe('Data – Content validation', () => {
  it('anagramWords contains valid word strings', async () => {
    const { ANAGRAM_WORDS } = await import('../../data/anagramWords')
    ANAGRAM_WORDS.slice(0, 5).forEach((word) => {
      expect(typeof word).toBe('string')
      expect(word.length).toBeGreaterThan(0)
    })
  })

  it('hangmanWords contains valid word strings', async () => {
    const { HANGMAN_WORDS } = await import('../../data/hangmanWords')
    HANGMAN_WORDS.slice(0, 5).forEach((word) => {
      expect(typeof word).toBe('string')
      expect(word.length).toBeGreaterThan(0)
    })
  })

  it('triviaQuestions contains valid question objects', async () => {
    const { TRIVIA_QUESTIONS } = await import('../../data/triviaQuestions')
    TRIVIA_QUESTIONS.slice(0, 5).forEach((question) => {
      expect(question).toHaveProperty('question')
      expect(question).toHaveProperty('choices')
      expect(question).toHaveProperty('answer')
      expect(Array.isArray(question.choices)).toBe(true)
    })
  })

  it('mathQuizProblems contains valid problem objects', async () => {
    const { MATH_QUIZ_PROBLEMS } = await import('../../data/mathQuizProblems')
    MATH_QUIZ_PROBLEMS.slice(0, 5).forEach((problem) => {
      expect(problem).toHaveProperty('problem')
      expect(problem).toHaveProperty('answer')
      expect(typeof problem.answer).toBe('number')
    })
  })
})
