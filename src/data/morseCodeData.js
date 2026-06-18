// ── Morse Code Data ───────────────────────────────────────────────────────────
// International Morse Code alphabet and digit mappings

export const MORSE_MAP = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
}

// Reverse map: morse string → character
export const REVERSE_MORSE_MAP = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([char, code]) => [code, char])
)

// Encode a word to Morse (letters separated by spaces, words by ' / ')
export function encodeToMorse(text) {
  return text
    .toUpperCase()
    .split('')
    .map((ch) => MORSE_MAP[ch] ?? ch)
    .join(' ')
}

// ── Challenge rounds ──────────────────────────────────────────────────────────
// Each round has a `type` ('letter' | 'word'), the `answer`, and a `hint`.

export const LETTER_CHALLENGES = Object.entries(MORSE_MAP)
  .filter(([char]) => /^[A-Z]$/.test(char))
  .map(([char, code]) => ({
    type: 'letter',
    answer: char,
    morse: code,
    hint: `Single letter`,
  }))

export const WORD_CHALLENGES = [
  { answer: 'SOS', morse: '... --- ...', hint: 'Universal distress signal' },
  { answer: 'CAT', morse: '-.-. .- -', hint: 'Furry pet' },
  { answer: 'DOG', morse: '-.. --- --.', hint: 'Man\'s best friend' },
  { answer: 'SUN', morse: '... ..- -.', hint: 'Star at the centre of our solar system' },
  { answer: 'MOON', morse: '-- --- --- -.', hint: 'Earth\'s natural satellite' },
  { answer: 'STAR', morse: '... - .- .-.', hint: 'Shines in the night sky' },
  { answer: 'FIRE', morse: '..-. .. .-. .', hint: 'Hot and bright' },
  { answer: 'RAIN', morse: '.-. .- .. -.', hint: 'Falls from clouds' },
  { answer: 'SNOW', morse: '... -. --- .--', hint: 'White and cold' },
  { answer: 'WIND', morse: '.-- .. -. -..', hint: 'Moving air' },
  { answer: 'TREE', morse: '- .-. . .', hint: 'Has leaves and branches' },
  { answer: 'BIRD', morse: '-... .. .-. -..', hint: 'Has wings and feathers' },
  { answer: 'FISH', morse: '..-. .. ... ....', hint: 'Lives in water' },
  { answer: 'BOOK', morse: '-... --- --- -.-', hint: 'You read it' },
  { answer: 'SHIP', morse: '... .... .. .--.', hint: 'Sails the ocean' },
  { answer: 'CODE', morse: '-.-. --- -.. .', hint: 'Secret language' },
  { answer: 'WAVE', morse: '.-- .- ...- .', hint: 'Motion of water or hand' },
  { answer: 'HELP', morse: '.... . .-.. .--.', hint: 'What you call for in trouble' },
  { answer: 'LOVE', morse: '.-.. --- ...- .', hint: 'Deep affection' },
  { answer: 'TIME', morse: '- .. -- .', hint: 'Measured in seconds' },
]

// ── Difficulty configuration ──────────────────────────────────────────────────

export const DIFFICULTIES = {
  easy: {
    label: 'Easy',
    emoji: '🟢',
    description: 'Decode single letters',
    rounds: 10,
    timePerRound: 15, // seconds
    challengePool: LETTER_CHALLENGES,
    showHint: true,
  },
  medium: {
    label: 'Medium',
    emoji: '🟡',
    description: 'Decode 3-letter words',
    rounds: 8,
    timePerRound: 20,
    challengePool: WORD_CHALLENGES.filter((w) => w.answer.length === 3),
    showHint: true,
  },
  hard: {
    label: 'Hard',
    emoji: '🔴',
    description: 'Decode 4–5 letter words, no hints',
    rounds: 8,
    timePerRound: 20,
    challengePool: WORD_CHALLENGES.filter((w) => w.answer.length >= 4),
    showHint: false,
  },
}

// Pick `count` unique random challenges from a pool
export function pickChallenges(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
