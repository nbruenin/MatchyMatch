// Pure game logic for Tower of Hanoi.
// A tower is an array of disk sizes ordered bottom → top (larger = wider).

export const PEG_COUNT = 3
export const MIN_DISKS = 3
export const MAX_DISKS = 7

/**
 * Creates the starting pegs: all disks stacked on the first peg.
 * @param {number} diskCount
 * @returns {number[][]}
 */
export function createPegs(diskCount) {
  const first = Array.from({ length: diskCount }, (_, i) => diskCount - i)
  return [first, [], []]
}

/**
 * Minimum number of moves needed to solve the puzzle.
 * @param {number} diskCount
 * @returns {number}
 */
export function minMoves(diskCount) {
  return 2 ** diskCount - 1
}

/**
 * Whether the top disk of `from` may be moved onto `to`.
 * @param {number[][]} pegs
 * @param {number} from
 * @param {number} to
 * @returns {boolean}
 */
export function isValidMove(pegs, from, to) {
  if (from === to) return false
  const src = pegs[from]
  const dst = pegs[to]
  if (!src || !dst || src.length === 0) return false
  if (dst.length === 0) return true
  return src[src.length - 1] < dst[dst.length - 1]
}

/**
 * Returns new pegs with the top disk moved, or the same pegs if invalid.
 * @param {number[][]} pegs
 * @param {number} from
 * @param {number} to
 * @returns {number[][]}
 */
export function moveDisk(pegs, from, to) {
  if (!isValidMove(pegs, from, to)) return pegs
  const next = pegs.map((p) => [...p])
  next[to].push(next[from].pop())
  return next
}

/**
 * The puzzle is solved when every disk is on the last peg.
 * @param {number[][]} pegs
 * @param {number} diskCount
 * @returns {boolean}
 */
export function isSolved(pegs, diskCount) {
  return pegs[PEG_COUNT - 1].length === diskCount
}
