/**
 * Pure game rules for Tower of Hanoi.
 *
 * A peg is an array of disk sizes, bottom first. Disk sizes are 1..n,
 * where n is the largest disk. The puzzle starts with all disks stacked
 * on peg 0 (largest at the bottom) and is solved when all disks are on
 * peg 2 in the same order.
 */

export const PEG_COUNT = 3

export const MIN_DISKS = 3
export const MAX_DISKS = 6

/**
 * Creates the starting pegs with all `disks` stacked on the first peg.
 * @param {number} disks - Number of disks
 * @returns {number[][]} Three pegs, bottom first
 */
export function createPegs(disks) {
  const first = []
  for (let size = disks; size >= 1; size--) first.push(size)
  return [first, [], []]
}

/**
 * Checks whether the top disk of `from` may be placed on `to`.
 * @param {number[][]} pegs - Current pegs
 * @param {number} from - Source peg index
 * @param {number} to - Target peg index
 * @returns {boolean} Whether the move is legal
 */
export function canMove(pegs, from, to) {
  if (from === to) return false
  const source = pegs[from]
  if (!source || source.length === 0) return false
  const target = pegs[to]
  if (!target) return false
  if (target.length === 0) return true
  return source[source.length - 1] < target[target.length - 1]
}

/**
 * Returns new pegs with the top disk moved from `from` to `to`.
 * Does not mutate the input. Returns the input unchanged if the move is illegal.
 * @param {number[][]} pegs - Current pegs
 * @param {number} from - Source peg index
 * @param {number} to - Target peg index
 * @returns {number[][]} Updated pegs
 */
export function moveDisk(pegs, from, to) {
  if (!canMove(pegs, from, to)) return pegs
  const next = pegs.map((peg) => peg.slice())
  next[to].push(next[from].pop())
  return next
}

/**
 * Checks whether every disk is on the last peg.
 * @param {number[][]} pegs - Current pegs
 * @param {number} disks - Total number of disks
 * @returns {boolean} Whether the puzzle is solved
 */
export function isSolved(pegs, disks) {
  return pegs[PEG_COUNT - 1].length === disks
}

/**
 * Minimum number of moves needed to solve the puzzle: 2^n - 1.
 * @param {number} disks - Number of disks
 * @returns {number} Optimal move count
 */
export function optimalMoves(disks) {
  return 2 ** disks - 1
}
