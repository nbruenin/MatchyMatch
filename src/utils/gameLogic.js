/**
 * Check if all selected words belong to the same category
 * @param {string[]} selectedWords - Array of selected words
 * @param {object} category - Category object with words array
 * @returns {boolean} - True if all selected words are in the category
 */
export function isCorrectMatch(selectedWords, category) {
  if (!selectedWords || !category || !category.words) {
    return false
  }
  return selectedWords.every((word) => category.words.includes(word))
}

/**
 * Count how many selected words belong to a category
 * @param {string[]} selectedWords - Array of selected words
 * @param {object} category - Category object with words array
 * @returns {number} - Count of matching words
 */
export function countMatchingWords(selectedWords, category) {
  if (!selectedWords || !category || !category.words) {
    return 0
  }
  return selectedWords.filter((word) => category.words.includes(word)).length
}

/**
 * Check if selection is "one away" from a category match
 * @param {string[]} selectedWords - Array of selected words (should be 4)
 * @param {object[]} categories - Array of category objects
 * @returns {boolean} - True if exactly 3 words match a category
 */
export function isOneAway(selectedWords, categories) {
  if (!selectedWords || selectedWords.length !== 4 || !categories) {
    return false
  }
  return categories.some((category) => countMatchingWords(selectedWords, category) === 3)
}

/**
 * Shuffle an array
 * @param {any[]} array - Array to shuffle
 * @returns {any[]} - New shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get all words from categories
 * @param {object[]} categories - Array of category objects
 * @returns {string[]} - Flattened array of all words
 */
export function getAllWords(categories) {
  if (!categories) {
    return []
  }
  return categories.flatMap((category) => category.words || [])
}
