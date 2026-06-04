import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from '../hooks/useDarkMode'

describe('useDarkMode Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should initialize with dark mode from localStorage if set', () => {
    localStorage.setItem('puzzlr-dark-mode', 'true')
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.dark).toBe(true)
  })

  it('should initialize with light mode from localStorage if set', () => {
    localStorage.setItem('puzzlr-dark-mode', 'false')
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.dark).toBe(false)
  })

  it('should toggle dark mode', () => {
    const { result } = renderHook(() => useDarkMode())
    const initialDark = result.current.dark

    act(() => {
      result.current.toggle()
    })

    expect(result.current.dark).toBe(!initialDark)
  })

  it('should persist dark mode to localStorage when toggled', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggle()
    })

    const stored = localStorage.getItem('puzzlr-dark-mode')
    expect(stored).toBe(String(result.current.dark))
  })
})
