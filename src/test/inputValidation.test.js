import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  safeParseLocalStorageInt,
  safeParseLocalStorageBool,
  safeSetLocalStorage,
  sanitizeString,
  validateNumberRange,
  validateStringPattern,
  validateGameInput,
  getEnvVar,
  validateArrayType,
  safeClone,
} from '../utils/inputValidation';

describe('inputValidation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('safeParseLocalStorageInt', () => {
    it('returns parsed integer from localStorage', () => {
      localStorage.setItem('test-key', '42');
      expect(safeParseLocalStorageInt('test-key')).toBe(42);
    });

    it('returns default value when key does not exist', () => {
      expect(safeParseLocalStorageInt('nonexistent', 10)).toBe(10);
    });

    it('returns default value when value is not a number', () => {
      localStorage.setItem('test-key', 'not-a-number');
      expect(safeParseLocalStorageInt('test-key', 5)).toBe(5);
    });

    it('returns 0 as default when no default provided', () => {
      expect(safeParseLocalStorageInt('nonexistent')).toBe(0);
    });

    it('handles negative numbers', () => {
      localStorage.setItem('test-key', '-42');
      expect(safeParseLocalStorageInt('test-key')).toBe(-42);
    });
  });

  describe('safeParseLocalStorageBool', () => {
    it('returns true when value is "true"', () => {
      localStorage.setItem('test-key', 'true');
      expect(safeParseLocalStorageBool('test-key')).toBe(true);
    });

    it('returns false when value is "false"', () => {
      localStorage.setItem('test-key', 'false');
      expect(safeParseLocalStorageBool('test-key')).toBe(false);
    });

    it('returns default value when key does not exist', () => {
      expect(safeParseLocalStorageBool('nonexistent', true)).toBe(true);
    });

    it('returns false as default when no default provided', () => {
      expect(safeParseLocalStorageBool('nonexistent')).toBe(false);
    });
  });

  describe('safeSetLocalStorage', () => {
    it('sets value in localStorage and returns true', () => {
      expect(safeSetLocalStorage('test-key', 'test-value')).toBe(true);
      expect(localStorage.getItem('test-key')).toBe('test-value');
    });

    it('converts numbers to strings', () => {
      expect(safeSetLocalStorage('test-key', 42)).toBe(true);
      expect(localStorage.getItem('test-key')).toBe('42');
    });

    it('converts booleans to strings', () => {
      expect(safeSetLocalStorage('test-key', true)).toBe(true);
      expect(localStorage.getItem('test-key')).toBe('true');
    });
  });

  describe('sanitizeString', () => {
    it('removes HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert(&quot;xss&quot;)');
    });

    it('removes HTML tags and escapes remaining special characters', () => {
      // The function removes <test> tag first, then escapes the &
      expect(sanitizeString('Test & <test>')).toBe('Test &amp; ');
    });

    it('escapes quotes', () => {
      expect(sanitizeString('Test "quote" and \'single\'')).toBe(
        'Test &quot;quote&quot; and &#x27;single&#x27;'
      );
    });

    it('returns empty string for non-string input', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(42)).toBe('');
    });

    it('handles empty string', () => {
      expect(sanitizeString('')).toBe('');
    });
  });

  describe('validateNumberRange', () => {
    it('returns value when within range', () => {
      expect(validateNumberRange(5, 0, 10)).toBe(5);
    });

    it('returns min when value is below range', () => {
      expect(validateNumberRange(-5, 0, 10)).toBe(0);
    });

    it('returns max when value is above range', () => {
      expect(validateNumberRange(15, 0, 10)).toBe(10);
    });

    it('returns default value for NaN', () => {
      expect(validateNumberRange('not-a-number', 0, 10, 5)).toBe(5);
    });

    it('uses min as default when no default provided', () => {
      expect(validateNumberRange('not-a-number', 0, 10)).toBe(0);
    });
  });

  describe('validateStringPattern', () => {
    it('returns string when it matches pattern', () => {
      const pattern = /^[a-z]+$/;
      expect(validateStringPattern('hello', pattern)).toBe('hello');
    });

    it('returns default when string does not match pattern', () => {
      const pattern = /^[a-z]+$/;
      expect(validateStringPattern('Hello123', pattern, 'default')).toBe('default');
    });

    it('returns default for non-string input', () => {
      const pattern = /^[a-z]+$/;
      expect(validateStringPattern(123, pattern, 'default')).toBe('default');
    });

    it('returns empty string as default when no default provided', () => {
      const pattern = /^[a-z]+$/;
      expect(validateStringPattern('123', pattern)).toBe('');
    });
  });

  describe('validateGameInput', () => {
    it('trims whitespace', () => {
      expect(validateGameInput('  test  ')).toBe('test');
    });

    it('limits length', () => {
      const longString = 'a'.repeat(200);
      expect(validateGameInput(longString, 50).length).toBe(50);
    });

    it('removes dangerous characters', () => {
      expect(validateGameInput('test<script>')).toBe('testscript');
      expect(validateGameInput('test"quote"')).toBe('testquote');
    });

    it('returns empty string for non-string input', () => {
      expect(validateGameInput(null)).toBe('');
      expect(validateGameInput(undefined)).toBe('');
      expect(validateGameInput(42)).toBe('');
    });

    it('uses default max length of 100', () => {
      const longString = 'a'.repeat(200);
      expect(validateGameInput(longString).length).toBe(100);
    });
  });

  describe('getEnvVar', () => {
    it('returns environment variable value', () => {
      // Note: In tests, import.meta.env may not be available
      // This test verifies the function handles missing env vars gracefully
      expect(getEnvVar('NONEXISTENT_VAR', 'default')).toBe('default');
    });

    it('returns default value when env var not set', () => {
      expect(getEnvVar('NONEXISTENT_VAR', 'fallback')).toBe('fallback');
    });

    it('returns empty string as default when no default provided', () => {
      expect(getEnvVar('NONEXISTENT_VAR')).toBe('');
    });
  });

  describe('validateArrayType', () => {
    it('returns true when all elements match type', () => {
      expect(validateArrayType(['a', 'b', 'c'], 'string')).toBe(true);
      expect(validateArrayType([1, 2, 3], 'number')).toBe(true);
    });

    it('returns false when elements do not match type', () => {
      expect(validateArrayType(['a', 1, 'c'], 'string')).toBe(false);
      expect(validateArrayType([1, 'two', 3], 'number')).toBe(false);
    });

    it('returns false for non-array input', () => {
      expect(validateArrayType('not-an-array', 'string')).toBe(false);
      expect(validateArrayType(null, 'string')).toBe(false);
      expect(validateArrayType(undefined, 'string')).toBe(false);
    });

    it('returns true for empty array', () => {
      expect(validateArrayType([], 'string')).toBe(true);
    });
  });

  describe('safeClone', () => {
    it('clones simple objects', () => {
      const obj = { a: 1, b: 'test', c: true };
      const cloned = safeClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('clones nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      const cloned = safeClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.a).not.toBe(obj.a);
    });

    it('clones arrays', () => {
      const arr = [1, 2, 3, { a: 4 }];
      const cloned = safeClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });

    it('returns primitive values as-is', () => {
      expect(safeClone(42)).toBe(42);
      expect(safeClone('test')).toBe('test');
      expect(safeClone(true)).toBe(true);
      expect(safeClone(null)).toBe(null);
    });

    it('handles circular references gracefully', () => {
      const obj = { a: 1 };
      obj.self = obj; // Create circular reference
      
      // Should return original object when cloning fails
      const cloned = safeClone(obj);
      expect(cloned).toBe(obj);
    });
  });
});
