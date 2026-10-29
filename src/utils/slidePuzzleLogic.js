/**
 * Pure helpers for the Slide Puzzle game.
 * The board is a flat array of size*size numbers; 0 represents the blank.
 */

/**
 * Returns the solved board for a given size, e.g. [1,2,3,4,5,6,7,8,0].
 * @param {number} size
 * @returns {number[]}
 */
export function createSolvedBoard(size) {
  const board = Array.from({ length: size * size - 1 }, (_, i) => i + 1)
  board.push(0)
  return board
}

/**
 * Whether the board is in the solved state.
 * @param {number[]} board
 * @returns {boolean}
 */
export function isSolved(board) {
  return board.every((tile, i) =>
    i === board.length - 1 ? tile === 0 : tile === i + 1
  )
}

/**
 * Returns indexes of tiles that are orthogonally adjacent to `index`.
 * @param {number} index
 * @param {number} size
 * @returns {number[]}
 */
export function getNeighbors(index, size) {
  const row = Math.floor(index / size)
  const col = index % size
  const result = []
  if (row > 0) result.push(index - size)
  if (row < size - 1) result.push(index + size)
  if (col > 0) result.push(index - 1)
  if (col < size - 1) result.push(index + 1)
  return result
}

/**
 * Whether the tile at `index` can slide into the blank.
 * @param {number[]} board
 * @param {number} index
 * @param {number} size
 * @returns {boolean}
 */
export function canMove(board, index, size) {
  const blank = board.indexOf(0)
  return getNeighbors(blank, size).includes(index)
}

/**
 * Slides the tile at `index` into the blank. Returns the same board
 * reference if the move is illegal.
 * @param {number[]} board
 * @param {number} index
 * @param {number} size
 * @returns {number[]}
 */
export function moveTile(board, index, size) {
  if (!canMove(board, index, size)) return board
  const blank = board.indexOf(0)
  const next = [...board]
  next[blank] = next[index]
  next[index] = 0
  return next
}

/**
 * Generates a shuffled, always-solvable board by applying random legal
 * moves to the solved board. Never returns an already-solved board.
 * @param {number} size
 * @param {number} [steps]
 * @param {() => number} [rng] random function returning [0,1)
 * @returns {number[]}
 */
export function shuffleBoard(size, steps = size * size * 20, rng = Math.random) {
  let board = createSolvedBoard(size)
  let previousBlank = -1
  for (let i = 0; i < steps; i++) {
    const blank = board.indexOf(0)
    const options = getNeighbors(blank, size).filter((n) => n !== previousBlank)
    const pick = options[Math.floor(rng() * options.length)]
    previousBlank = blank
    board = moveTile(board, pick, size)
  }
  if (isSolved(board)) {
    // Guaranteed different: one legal move away from solved
    board = moveTile(board, size * size - 2, size)
  }
  return board
}

/**
 * Maps an arrow key to the index of the tile that should slide
 * (the tile on the opposite side of the blank from the arrow direction).
 * Returns -1 when no tile can move that way.
 * @param {number[]} board
 * @param {string} key
 * @param {number} size
 * @returns {number}
 */
export function tileForArrowKey(board, key, size) {
  const blank = board.indexOf(0)
  const row = Math.floor(blank / size)
  const col = blank % size
  // Pressing ArrowUp slides a tile up, i.e. the tile below the blank.
  const offsets = {
    ArrowUp: [1, 0],
    ArrowDown: [-1, 0],
    ArrowLeft: [0, 1],
    ArrowRight: [0, -1],
  }
  const offset = offsets[key]
  if (!offset) return -1
  const r = row + offset[0]
  const c = col + offset[1]
  if (r < 0 || r >= size || c < 0 || c >= size) return -1
  return r * size + c
}
