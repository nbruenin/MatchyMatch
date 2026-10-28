// Tower of Hanoi logic.
// A state is an array of three pegs. Each peg is an array of disk sizes
// (1 = smallest), ordered bottom → top, so the last element is the top disk.

export const PEG_COUNT = 3

export function createTowers(disks) {
  const first = Array.from({ length: disks }, (_, i) => disks - i)
  return [first, [], []]
}

export function minimumMoves(disks) {
  return 2 ** disks - 1
}

export function canMove(towers, from, to) {
  if (from === to) return false
  if (from < 0 || to < 0 || from >= PEG_COUNT || to >= PEG_COUNT) return false
  const source = towers[from]
  if (source.length === 0) return false
  const target = towers[to]
  if (target.length === 0) return true
  return source[source.length - 1] < target[target.length - 1]
}

// Returns a new state with the top disk moved, or null if the move is illegal.
export function applyMove(towers, from, to) {
  if (!canMove(towers, from, to)) return null
  const next = towers.map((peg) => [...peg])
  next[to].push(next[from].pop())
  return next
}

export function isSolved(towers, disks) {
  return towers[PEG_COUNT - 1].length === disks
}
