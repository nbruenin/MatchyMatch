/**
 * Card Match game data.
 * Each set has a theme with unique symbols/icons.
 * The game creates pairs that players must match.
 */

export const CARD_MATCH_SETS = [
  {
    id: 'planets',
    label: 'Planets',
    emoji: '🪐',
    cards: ['🌍', '🪐', '🌙', '☀️', '⭐', '☄️', '🌌', '🛸'],
  },
  {
    id: 'weather',
    label: 'Weather',
    emoji: '⛅',
    cards: ['☀️', '🌧️', '⛈️', '🌈', '❄️', '🌪️', '🌫️', '⛅'],
  },
  {
    id: 'music',
    label: 'Music',
    emoji: '🎵',
    cards: ['🎸', '🎹', '🥁', '🎺', '🎻', '🎤', '🎧', '🎵'],
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    emoji: '🚗',
    cards: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑'],
  },
  {
    id: 'ocean',
    label: 'Ocean',
    emoji: '🌊',
    cards: ['🐠', '🐟', '🐡', '🦈', '🐙', '🦀', '🐚', '🦑'],
  },
  {
    id: 'gems',
    label: 'Gems',
    emoji: '💎',
    cards: ['💎', '💍', '👑', '🔮', '🪙', '⚱️', '🏺', '📿'],
  },
]

/**
 * Build a shuffled deck of card objects from a set.
 * Each card appears twice (as a pair).
 */
export function buildCardMatchDeck(set) {
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
export function pickRandomCardMatchSet() {
  return CARD_MATCH_SETS[Math.floor(Math.random() * CARD_MATCH_SETS.length)]
}
