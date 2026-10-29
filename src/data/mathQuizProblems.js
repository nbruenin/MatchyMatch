/**
 * Math Quiz — problem bank
 *
 * Each problem has:
 *   id       — unique string
 *   question — display string, e.g. "12 × 7"
 *   answer   — numeric answer
 *   tier     — 1 (easy) | 2 (medium) | 3 (hard)
 */

const mathProblems = [
  // ── Tier 1 — Addition & Subtraction (small numbers) ──────────────
  { id: "t1-01", problem: "3 + 5",   answer: 8,   tier: 1 },
  { id: "t1-02", problem: "7 + 4",   answer: 11,  tier: 1 },
  { id: "t1-03", problem: "9 + 6",   answer: 15,  tier: 1 },
  { id: "t1-04", problem: "12 + 8",  answer: 20,  tier: 1 },
  { id: "t1-05", problem: "15 + 7",  answer: 22,  tier: 1 },
  { id: "t1-06", problem: "18 + 5",  answer: 23,  tier: 1 },
  { id: "t1-07", problem: "10 − 4",  answer: 6,   tier: 1 },
  { id: "t1-08", problem: "14 − 6",  answer: 8,   tier: 1 },
  { id: "t1-09", problem: "20 − 9",  answer: 11,  tier: 1 },
  { id: "t1-10", problem: "25 − 8",  answer: 17,  tier: 1 },
  { id: "t1-11", problem: "30 − 13", answer: 17,  tier: 1 },
  { id: "t1-12", problem: "6 + 9",   answer: 15,  tier: 1 },
  { id: "t1-13", problem: "11 + 11", answer: 22,  tier: 1 },
  { id: "t1-14", problem: "17 − 5",  answer: 12,  tier: 1 },
  { id: "t1-15", problem: "8 + 13",  answer: 21,  tier: 1 },
  { id: "t1-16", problem: "22 − 7",  answer: 15,  tier: 1 },
  { id: "t1-17", problem: "4 + 16",  answer: 20,  tier: 1 },
  { id: "t1-18", problem: "19 − 11", answer: 8,   tier: 1 },
  { id: "t1-19", problem: "5 + 17",  answer: 22,  tier: 1 },
  { id: "t1-20", problem: "28 − 14", answer: 14,  tier: 1 },

  // ── Tier 2 — Multiplication & Division (tables) ───────────────────
  { id: "t2-01", problem: "3 × 4",   answer: 12,  tier: 2 },
  { id: "t2-02", problem: "6 × 7",   answer: 42,  tier: 2 },
  { id: "t2-03", problem: "8 × 9",   answer: 72,  tier: 2 },
  { id: "t2-04", problem: "5 × 12",  answer: 60,  tier: 2 },
  { id: "t2-05", problem: "7 × 8",   answer: 56,  tier: 2 },
  { id: "t2-06", problem: "9 × 6",   answer: 54,  tier: 2 },
  { id: "t2-07", problem: "4 × 11",  answer: 44,  tier: 2 },
  { id: "t2-08", problem: "12 × 3",  answer: 36,  tier: 2 },
  { id: "t2-09", problem: "48 ÷ 6",  answer: 8,   tier: 2 },
  { id: "t2-10", problem: "63 ÷ 7",  answer: 9,   tier: 2 },
  { id: "t2-11", problem: "56 ÷ 8",  answer: 7,   tier: 2 },
  { id: "t2-12", problem: "72 ÷ 9",  answer: 8,   tier: 2 },
  { id: "t2-13", problem: "36 ÷ 4",  answer: 9,   tier: 2 },
  { id: "t2-14", problem: "11 × 7",  answer: 77,  tier: 2 },
  { id: "t2-15", problem: "9 × 9",   answer: 81,  tier: 2 },
  { id: "t2-16", problem: "6 × 8",   answer: 48,  tier: 2 },
  { id: "t2-17", problem: "84 ÷ 7",  answer: 12,  tier: 2 },
  { id: "t2-18", problem: "5 × 9",   answer: 45,  tier: 2 },
  { id: "t2-19", problem: "66 ÷ 6",  answer: 11,  tier: 2 },
  { id: "t2-20", problem: "7 × 12",  answer: 84,  tier: 2 },

  // ── Tier 3 — Mixed harder problems ───────────────────────────────
  { id: "t3-01", problem: "13 × 7",  answer: 91,  tier: 3 },
  { id: "t3-02", problem: "144 ÷ 12",answer: 12,  tier: 3 },
  { id: "t3-03", problem: "25 × 4",  answer: 100, tier: 3 },
  { id: "t3-04", problem: "17 × 6",  answer: 102, tier: 3 },
  { id: "t3-05", problem: "196 ÷ 14",answer: 14,  tier: 3 },
  { id: "t3-06", problem: "15 × 15", answer: 225, tier: 3 },
  { id: "t3-07", problem: "132 ÷ 11",answer: 12,  tier: 3 },
  { id: "t3-08", problem: "19 × 8",  answer: 152, tier: 3 },
  { id: "t3-09", problem: "225 ÷ 15",answer: 15,  tier: 3 },
  { id: "t3-10", problem: "23 × 9",  answer: 207, tier: 3 },
  { id: "t3-11", problem: "18 × 12", answer: 216, tier: 3 },
  { id: "t3-12", problem: "169 ÷ 13",answer: 13,  tier: 3 },
  { id: "t3-13", problem: "27 × 7",  answer: 189, tier: 3 },
  { id: "t3-14", problem: "256 ÷ 16",answer: 16,  tier: 3 },
  { id: "t3-15", problem: "14 × 14", answer: 196, tier: 3 },
  { id: "t3-16", problem: "21 × 11", answer: 231, tier: 3 },
  { id: "t3-17", problem: "288 ÷ 12",answer: 24,  tier: 3 },
  { id: "t3-18", problem: "16 × 13", answer: 208, tier: 3 },
  { id: "t3-19", problem: "324 ÷ 18",answer: 18,  tier: 3 },
  { id: "t3-20", problem: "29 × 6",  answer: 174, tier: 3 },
];

// Export with both names for compatibility
export { mathProblems };
export const MATH_QUIZ_PROBLEMS = mathProblems;

/**
 * Pick `count` problems, balanced across tiers.
 * Returns a shuffled array of `count` problems.
 */
export function pickProblems(count = 10) {
  const byTier = [1, 2, 3].map((t) => shuffle(mathProblems.filter((p) => p.tier === t)));

  const result = [];
  // Distribute evenly: for 10 questions → ~3 easy, ~4 medium, ~3 hard
  const distribution = [3, 4, 3];
  distribution.forEach((n, i) => {
    result.push(...byTier[i].slice(0, n));
  });

  // If count differs from 10, just pick from all shuffled
  if (count !== 10) {
    return shuffle(mathProblems).slice(0, count);
  }

  return shuffle(result);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
