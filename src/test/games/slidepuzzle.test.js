/**
 * Tests for Slide Puzzle logic helpers
 */

import { describe, it, expect } from 'vitest'
import {
  createSolvedBoard,
  isSolved,
  getNeighbors,
  canMove,
  moveTile,
  shuffleBoard,
  tileForArrowKey,
} from '../../utils/slidePuzzleLogic'

describe('SlidePuzzle – logic', () => {
  it('creates a solved board', () => {
    expect(createSolvedBoard(3)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0])
    expect(isSolved(createSolvedBoard(4))).toBe(true)
  })

  it('computes neighbors', () => {
    expect(getNeighbors(0, 3).sort()).toEqual([1, 3])
    expect(getNeighbors(4, 3).sort()).toEqual([1, 3, 5, 7])
  })

  it('only allows tiles adjacent to the blank to move', () => {
    const b = createSolvedBoard(3)
    expect(canMove(b, 7, 3)).toBe(true)
    expect(canMove(b, 5, 3)).toBe(true)
    expect(canMove(b, 0, 3)).toBe(false)
  })

  it('moveTile swaps with the blank and ignores illegal moves', () => {
    const b = createSolvedBoard(3)
    expect(moveTile(b, 7, 3)).toEqual([1, 2, 3, 4, 5, 6, 7, 0, 8])
    expect(moveTile(b, 0, 3)).toBe(b)
  })

  it.each([3, 4])('shuffleBoard(%i) is a permutation and not solved', (size) => {
    const board = shuffleBoard(size)
    expect([...board].sort((a, b) => a - b)).toEqual(
      [0, ...createSolvedBoard(size).slice(0, -1)]
    )
    expect(isSolved(board)).toBe(false)
  })

  it('shuffleBoard avoids a solved result even with a degenerate rng', () => {
    expect(isSolved(shuffleBoard(3, 0))).toBe(false)
  })

  it('maps arrow keys to the tile that slides', () => {
    const b = createSolvedBoard(3) // blank at index 8
    expect(tileForArrowKey(b, 'ArrowDown', 3)).toBe(5)
    expect(tileForArrowKey(b, 'ArrowRight', 3)).toBe(7)
    expect(tileForArrowKey(b, 'ArrowUp', 3)).toBe(-1)
    expect(tileForArrowKey(b, 'ArrowLeft', 3)).toBe(-1)
    expect(tileForArrowKey(b, 'a', 3)).toBe(-1)
  })
})
