/**
 * Picture Match game data.
 * Each set has a theme with unique picture emojis.
 * The game creates pairs that players must match.
 */

export const PICTURE_MATCH_SETS = [
  {
    id: 'flags',
    label: 'Flags',
    emoji: '🏁',
    cards: ['🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇯🇵', '🇨🇦'],
  },
  {
    id: 'faces',
    label: 'Faces',
    emoji: '😊',
    cards: ['😀', '😂', '😍', '🤔', '😎', '🥳', '😴', '🤗'],
  },
  {
    id: 'tools',
    label: 'Tools',
    emoji: '🔧',
    cards: ['🔨', '🔧', '🪛', '⚒️', '🛠️', '⛏️', '🪚', '🔩'],
  },
  {
    id: 'flowers',
    label: 'Flowers',
    emoji: '🌺',
    cards: ['🌹', '🌺', '🌻', '🌷', '🌼', '💐', '🏵️', '🥀'],
  },
  {
    id: 'fruits',
    label: 'Fruits',
    emoji: '🍎',
    cards: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒'],
  },
  {
    id: 'buildings',
    label: 'Buildings',
    emoji: '🏛️',
    cards: ['🏠', '🏢', '🏰', '🏛️', '🗼', '🏟️', '🏭', '🏗️'],
  },
]

/**
 * Build a shuffled deck of card objects from a set.
 * Each card appears twice (as a pair).
 */
export function buildPictureMatchDeck(set) {
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
export function pickRandomPictureMatchSet() {
  return PICTURE_MATCH_SETS[
    Math.floor(Math.random() * PICTURE_MATCH_SETS.length)
  ]
}
