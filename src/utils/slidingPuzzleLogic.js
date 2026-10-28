/**
 * Pure helpers for the Sliding Puzzle (15-puzzle) game.
 *
 * A board is a flat array of length size*size. Tiles are numbered 1..size*size-1
 * and the blank is represented by 0. The solved board is [1, 2, ..., n-1, 0].
 */

export function createSolvedBoard(size = 4) {
  const total = size * size
  return Array.from({ length: total }, (_, i) => (i === total - 1 ? 0 : i + 1))
}

export function isSolved(board) {
  const solved = createSolvedBoard(Math.round(Math.sqrt(board.length)))
  return board.every((tile, i) => tile === solved[i])
}

export function findBlankIndex(board) {
  return board.indexOf(0)
}

/**
 * Whether the tile at `index` can slide into the blank (must be orthogonally adjacent).
 */
export function canMove(
  board,
  index,
  size = Math.round(Math.sqrt(board.length))
) {
  const blank = findBlankIndex(board)
  if (index === blank || board[index] === 0) return false
  const row = Math.floor(index / size)
  const col = index % size
  const blankRow = Math.floor(blank / size)
  const blankCol = blank % size
  return (
    (row === blankRow && Math.abs(col - blankCol) === 1) ||
    (col === blankCol && Math.abs(row - blankRow) === 1)
  )
}

/**
 * Returns a new board with the tile at `index` slid into the blank,
 * or null if the move is not legal.
 */
export function applyMove(
  board,
  index,
  size = Math.round(Math.sqrt(board.length))
) {
  if (!canMove(board, index, size)) return null
  const blank = findBlankIndex(board)
  const next = board.slice()
  next[blank] = board[index]
  next[index] = 0
  return next
}

/**
 * Produces a solvable shuffled board by applying `steps` random legal moves
 * to the solved board. Never returns the solved board itself.
 */
export function shuffleBoard(size = 4, steps = 200, random = Math.random) {
  let board = createSolvedBoard(size)
  let lastBlank = -1
  for (let s = 0; s < steps; s++) {
    const blank = findBlankIndex(board)
    const neighbours = []
    for (let i = 0; i < board.length; i++) {
      if (canMove(board, i, size) && i !== lastBlank) neighbours.push(i)
    }
    const pick = neighbours[Math.floor(random() * neighbours.length)]
    lastBlank = blank
    board = applyMove(board, pick, size)
  }
  if (isSolved(board)) return shuffleBoard(size, steps, random)
  return board
}
