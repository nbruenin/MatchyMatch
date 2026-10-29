export const SUITS = ['♠', '♥', '♦', '♣']
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

/**
 * Builds a fresh 52-card deck. Card value is the rank index + 2 (2..14).
 * @returns {{rank: string, suit: string, value: number}[]}
 */
export function createDeck() {
  const deck = []
  for (const suit of SUITS) {
    RANKS.forEach((rank, i) => deck.push({ rank, suit, value: i + 2 }))
  }
  return deck
}

/**
 * Returns a shuffled copy of the deck (Fisher–Yates).
 * @param {Array} deck
 * @param {() => number} [rng] Random function returning [0, 1)
 * @returns {Array}
 */
export function shuffleDeck(deck, rng = Math.random) {
  const copy = [...deck]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Evaluates a guess. Ties are neither higher nor lower, so they count as
 * a "push": the streak is kept but no point is scored.
 * @param {{value: number}} current
 * @param {{value: number}} next
 * @param {'higher'|'lower'} guess
 * @returns {'correct'|'wrong'|'push'}
 */
export function evaluateGuess(current, next, guess) {
  if (next.value === current.value) return 'push'
  const wasHigher = next.value > current.value
  return (guess === 'higher') === wasHigher ? 'correct' : 'wrong'
}

/**
 * Whether a card is red (hearts or diamonds).
 * @param {{suit: string}} card
 * @returns {boolean}
 */
export function isRed(card) {
  return card.suit === '♥' || card.suit === '♦'
}
