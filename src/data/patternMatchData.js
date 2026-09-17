/**
 * Pattern Match game data.
 * Each set has a theme with unique pattern symbols.
 * The game creates pairs that players must match.
 */

export const PATTERN_MATCH_SETS = [
  {
    id: 'shapes',
    label: 'Shapes',
    emoji: '🔷',
    cards: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫'],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    emoji: '✨',
    cards: ['⭐', '✨', '💫', '🌟', '⚡', '🔥', '💥', '✴️'],
  },
  {
    id: 'hearts',
    label: 'Hearts',
    emoji: '💖',
    cards: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍'],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    emoji: '➡️',
    cards: ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'],
  },
  {
    id: 'geometric',
    label: 'Geometric',
    emoji: '🔶',
    cards: ['🔷', '🔶', '🔸', '🔹', '🔺', '🔻', '💠', '🔘'],
  },
  {
    id: 'zodiac',
    label: 'Zodiac',
    emoji: '♈',
    cards: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏'],
  },
]

/**
 * Build a shuffled deck of card objects from a set.
 * Each card appears twice (as a pair).
 */
export function buildPatternMatchDeck(set) {
  const pairs = [...set.cards, ...set.cards].map((emoji, i) => ({
    id: i,
    emoji,
    pairKey: emoji,
    flipped: false,
    matched: false,
  }))
  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs
}

/** Pick a random set */
export function pickRandomPatternMatchSet() {
  return PATTERN_MATCH_SETS[
    Math.floor(Math.random() * PATTERN_MATCH_SETS.length)
  ]
}
