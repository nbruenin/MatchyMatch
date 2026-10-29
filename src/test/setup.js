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

// jsdom has no canvas implementation (getContext returns null). Give games a
// no-op 2D context so drawing code runs; any method is a vi.fn().
function createCanvasContextStub(canvas) {
  const state = { canvas }
  return new Proxy(state, {
    get(target, prop) {
      if (!(prop in target)) {
        target[prop] =
          prop === 'measureText'
            ? vi.fn((text = '') => ({ width: String(text).length * 8 }))
            : prop === 'createLinearGradient' || prop === 'createRadialGradient'
              ? vi.fn(() => ({ addColorStop: vi.fn() }))
              : prop === 'getImageData'
                ? vi.fn((x, y, w, h) => ({
                    data: new Uint8ClampedArray(w * h * 4),
                    width: w,
                    height: h,
                  }))
                : vi.fn()
      }
      return target[prop]
    },
    set(target, prop, value) {
      target[prop] = value
      return true
    },
  })
}
HTMLCanvasElement.prototype.getContext = function getContext() {
  this.__ctx ??= createCanvasContextStub(this)
  return this.__ctx
}

// jsdom has no Web Audio API; games that play sounds get a silent stub.
if (!globalThis.AudioContext) {
  const audioParam = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  })
  const audioNode = () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: audioParam(),
    gain: audioParam(),
    type: 'sine',
  })
  class AudioContextStub {
    currentTime = 0
    state = 'running'
    destination = {}
    createOscillator = vi.fn(audioNode)
    createGain = vi.fn(audioNode)
    resume = vi.fn(() => Promise.resolve())
    close = vi.fn(() => Promise.resolve())
  }
  globalThis.AudioContext = AudioContextStub
  globalThis.webkitAudioContext = AudioContextStub
}
