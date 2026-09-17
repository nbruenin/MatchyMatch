/**
 * Memory card sets.
 * Each set has a theme name and an array of unique emoji/symbol pairs.
 * The board duplicates each item to create pairs.
 */

const CARD_SETS = [
  {
    id: "animals",
    label: "Animals",
    emoji: "🐾",
    cards: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
  },
  {
    id: "food",
    label: "Food",
    emoji: "🍕",
    cards: ["🍕", "🍔", "🌮", "🍣", "🍩", "🍦", "🍇", "🥑"],
  },
  {
    id: "nature",
    label: "Nature",
    emoji: "🌿",
    cards: ["🌸", "🌊", "🌋", "🌈", "⛄", "🌵", "🍄", "🌙"],
  },
  {
    id: "sports",
    label: "Sports",
    emoji: "⚽",
    cards: ["⚽", "🏀", "🎾", "🏈", "⚾", "🏐", "🎱", "🏓"],
  },
  {
    id: "travel",
    label: "Travel",
    emoji: "✈️",
    cards: ["✈️", "🗼", "🗽", "🏯", "🗿", "🎡", "🚂", "⛵"],
  },
];

// Export with both names for compatibility
export { CARD_SETS };

// MEMORY_CARDS is a flat array of all cards from all sets (for test compatibility)
export const MEMORY_CARDS = CARD_SETS.flatMap(set => set.cards);

/**
 * Build a shuffled deck of card objects from a set.
 * Each card appears twice (as a pair).
 */
export function buildDeck(set) {
  const pairs = [...set.cards, ...set.cards].map((emoji, i) => ({
    id: i,
    emoji,
    pairKey: emoji,
    flipped: false,
    matched: false,
  }));
  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

/** Pick a random set */
export function pickRandomSet() {
  return CARD_SETS[Math.floor(Math.random() * CARD_SETS.length)];
}
