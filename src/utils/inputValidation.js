/**
 * Input validation utilities for MatchyMatch
 * 
 * These utilities help ensure user input is properly validated and sanitized
 * to prevent security vulnerabilities and unexpected behavior.
 */

/**
 * Safely parse an integer from localStorage with fallback
 * @param {string} key - The localStorage key
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed integer or default value
 */
export function safeParseLocalStorageInt(key, defaultValue = 0) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely parse a boolean from localStorage with fallback
 * @param {string} key - The localStorage key
 * @param {boolean} defaultValue - Default value if parsing fails
 * @returns {boolean} Parsed boolean or default value
 */
export function safeParseLocalStorageBool(key, defaultValue = false) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return value === 'true';
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set a value in localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store (will be converted to string)
 * @returns {boolean} True if successful, false otherwise
 */
export function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Sanitize a string to prevent XSS attacks
 * Note: React automatically escapes strings in JSX, but this is useful
 * for cases where you need to manually sanitize input.
 * @param {string} input - The input string to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  return withoutTags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate that a number is within a specified range
 * @param {number} value - The value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {number} defaultValue - Default value if validation fails
 * @returns {number} Validated number or default value
 */
export function validateNumberRange(value, min, max, defaultValue = min) {
  const num = Number(value);
  if (isNaN(num)) return defaultValue;
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

/**
 * Validate that a string matches a specific pattern
 * @param {string} input - The input string to validate
 * @param {RegExp} pattern - The regex pattern to match
 * @param {string} defaultValue - Default value if validation fails
 * @returns {string} Validated string or default value
 */
export function validateStringPattern(input, pattern, defaultValue = '') {
  if (typeof input !== 'string') return defaultValue;
  return pattern.test(input) ? input : defaultValue;
}

/**
 * Validate and sanitize user input for game names/scores
 * @param {string} input - The input to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Validated and sanitized input
 */
export function validateGameInput(input, maxLength = 100) {
  if (typeof input !== 'string') return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Remove any potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"]/g, '');
  
  return sanitized;
}

/**
 * Validate environment variables
 * @param {string} key - The environment variable key
 * @param {string} defaultValue - Default value if not set
 * @returns {string} Environment variable value or default
 */
export function getEnvVar(key, defaultValue = '') {
  try {
    const value = import.meta.env[key];
    return value !== undefined ? String(value) : defaultValue;
  } catch (error) {
    console.error(`Error reading environment variable "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Validate that an array contains only expected types
 * @param {Array} arr - The array to validate
 * @param {string} expectedType - The expected type ('string', 'number', etc.)
 * @returns {boolean} True if all elements match the expected type
 */
export function validateArrayType(arr, expectedType) {
  if (!Array.isArray(arr)) return false;
  return arr.every(item => typeof item === expectedType);
}

/**
 * Deep clone an object safely (prevents prototype pollution)
 * @param {Object} obj - The object to clone
 * @returns {Object} Cloned object
 */
export function safeClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  try {
    // Use JSON parse/stringify for simple objects
    // This prevents prototype pollution attacks
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error cloning object:', error);
    return obj;
  }
}
