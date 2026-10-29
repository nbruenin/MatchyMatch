import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Testing Library only detects fake timers (and auto-advances them inside
// waitFor/findBy*) when a Jest-style global is present. Expose the minimal
// surface it uses, backed by Vitest's fake timers, so waitFor doesn't hang
// when a test calls vi.useFakeTimers().
globalThis.jest = {
  advanceTimersByTime: (ms) => vi.advanceTimersByTime(ms),
}

// Mock window.matchMedia globally
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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
