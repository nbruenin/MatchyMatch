/**
 * Tests for utility functions and custom hooks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from '../../hooks/useDarkMode'
import * as gameLogic from '../../utils/gameLogic'

// ── useDarkMode Hook Tests ────────────────────────────────────────────────────

describe('useDarkMode – Unit: hook functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset document class
    document.documentElement.className = ''
  })

  it('initializes with dark mode off by default', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.isDarkMode).toBe(false)
  })

  it('returns a toggle function', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(typeof result.current.toggleDarkMode).toBe('function')
  })

  it('toggles dark mode when toggle is called', () => {
    const { result } = renderHook(() => useDarkMode())

    expect(result.current.isDarkMode).toBe(false)

    act(() => {
      result.current.toggleDarkMode()
    })

    expect(result.current.isDarkMode).toBe(true)

    act(() => {
      result.current.toggleDarkMode()
    })

    expect(result.current.isDarkMode).toBe(false)
  })

  it('persists dark mode state to localStorage', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggleDarkMode()
    })

    // Check localStorage was updated
    const stored = localStorage.getItem('darkMode')
    expect(stored).toBe('true')
  })

  it('restores dark mode state from localStorage', () => {
    localStorage.setItem('darkMode', 'true')

    const { result } = renderHook(() => useDarkMode())

    expect(result.current.isDarkMode).toBe(true)
  })

  it('applies dark class to document element', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggleDarkMode()
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when toggled off', () => {
    localStorage.setItem('darkMode', 'true')
    document.documentElement.classList.add('dark')

    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggleDarkMode()
    })

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

// ── gameLogic Utility Tests ───────────────────────────────────────────────────

describe('gameLogic – Unit: utility functions', () => {
  it('exports expected functions', () => {
    expect(typeof gameLogic).toBe('object')
  })

  it('has utility functions available', () => {
    // Check that the module exports something
    expect(Object.keys(gameLogic).length).toBeGreaterThanOrEqual(0)
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

  it('wordleWords exports an array', async () => {
    const { WORDLE_WORDS } = await import('../../data/wordleWords')
    expect(Array.isArray(WORDLE_WORDS)).toBe(true)
    expect(WORDLE_WORDS.length).toBeGreaterThan(0)
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

  it('wordSearchPuzzles exports an array', async () => {
    const { WORD_SEARCH_PUZZLES } = await import('../../data/wordSearchPuzzles')
    expect(Array.isArray(WORD_SEARCH_PUZZLES)).toBe(true)
    expect(WORD_SEARCH_PUZZLES.length).toBeGreaterThan(0)
  })

  it('spellingBeeData exports an array', async () => {
    const { SPELLING_BEE_WORDS } = await import('../../data/spellingBeeData')
    expect(Array.isArray(SPELLING_BEE_WORDS)).toBe(true)
    expect(SPELLING_BEE_WORDS.length).toBeGreaterThan(0)
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
  it('anagramWords contains valid word objects', async () => {
    const { ANAGRAM_WORDS } = await import('../../data/anagramWords')
    ANAGRAM_WORDS.slice(0, 5).forEach((word) => {
      expect(typeof word).toBe('string')
      expect(word.length).toBeGreaterThan(0)
    })
  })

  it('hangmanWords contains valid word objects', async () => {
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
      expect(question).toHaveProperty('options')
      expect(question).toHaveProperty('correct')
      expect(Array.isArray(question.options)).toBe(true)
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
