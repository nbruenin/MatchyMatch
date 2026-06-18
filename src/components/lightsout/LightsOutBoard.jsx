import { useState, useCallback } from "react";
import Toast from "../Toast";

// ── Constants ────────────────────────────────────────────────────────────────

const GRID_SIZE = 5;

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the flat index for a (row, col) pair.
 * @param {number} row
 * @param {number} col
 * @returns {number}
 */
function cellIdx(row, col) {
  return row * GRID_SIZE + col;
}

/**
 * Toggles the cell at (row, col) and its orthogonal neighbours.
 * @param {boolean[]} grid
 * @param {number} row
 * @param {number} col
 * @returns {boolean[]}
 */
function applyToggle(grid, row, col) {
  const next = [...grid];
  const neighbours = [
    [row, col],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
  for (const [r, c] of neighbours) {
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      next[cellIdx(r, c)] = !next[cellIdx(r, c)];
    }
  }
  return next;
}

/**
 * Generates a solvable random puzzle by starting from a solved (all-off)
 * board and applying a set of random moves.
 * @param {number} moves  Number of random moves to apply.
 * @returns {boolean[]}
 */
function generatePuzzle(moves) {
  let grid = Array(GRID_SIZE * GRID_SIZE).fill(false);
  const usedMoves = new Set();
  let applied = 0;
  while (applied < moves) {
    const r = Math.floor(Math.random() * GRID_SIZE);
    const c = Math.floor(Math.random() * GRID_SIZE);
    const key = `${r},${c}`;
    if (!usedMoves.has(key)) {
      usedMoves.add(key);
      grid = applyToggle(grid, r, c);
      applied++;
    }
  }
  // If we accidentally produced a solved board, retry
  if (grid.every((cell) => !cell)) return generatePuzzle(moves);
  return grid;
}

// ── Difficulty presets ────────────────────────────────────────────────────────

const DIFFICULTIES = [
  {
    id: "easy",
    label: "Easy",
    emoji: "🟢",
    description: "8–10 seed moves",
    moves: () => Math.floor(Math.random() * 3) + 8,
  },
  {
    id: "medium",
    label: "Medium",
    emoji: "🟡",
    description: "11–13 seed moves",
    moves: () => Math.floor(Math.random() * 3) + 11,
  },
  {
    id: "hard",
    label: "Hard",
    emoji: "🔴",
    description: "14–16 seed moves",
    moves: () => Math.floor(Math.random() * 3) + 14,
  },
];

// ── Difficulty selector ───────────────────────────────────────────────────────

function DifficultySelector({ onSelect }) {
  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)" }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span style={{ fontSize: "2.5rem" }}>💡</span>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--label-primary)",
          }}
        >
          Lights Out
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--label-tertiary)" }}>
          Toggle cells to turn all lights off. Each click also flips adjacent
          cells.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.id}
            onClick={() => onSelect(diff)}
            className="group relative overflow-hidden rounded-2xl p-4 text-left transition-all hover:scale-105"
            style={{
              background: "var(--fill-tertiary)",
              border: "2px solid var(--fill-secondary)",
            }}
            aria-label={`${diff.label} difficulty – ${diff.description}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span style={{ fontSize: "1.5rem" }}>{diff.emoji}</span>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "var(--label-primary)",
                      fontSize: "1rem",
                    }}
                  >
                    {diff.label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--label-tertiary)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {diff.description}
                  </p>
                </div>
              </div>
              <span
                style={{ fontSize: "1.25rem", color: "var(--label-tertiary)" }}
              >
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Grid cell ─────────────────────────────────────────────────────────────────

function Cell({ lit, onClick, row, col, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell row ${row + 1} column ${col + 1} ${lit ? "on" : "off"}`}
      aria-pressed={lit}
      style={{
        width: "100%",
        aspectRatio: "1",
        borderRadius: 10,
        border: "none",
        cursor: disabled ? "default" : "pointer",
        background: lit
          ? "linear-gradient(145deg, #ffd60a, #ff9f0a)"
          : "var(--fill-secondary)",
        boxShadow: lit
          ? "0 0 14px 4px rgba(255,214,10,0.55), inset 0 1px 0 rgba(255,255,255,0.25)"
          : "inset 0 2px 4px rgba(0,0,0,0.15)",
        transition:
          "background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease",
        transform: lit ? "scale(1.04)" : "scale(1)",
      }}
    />
  );
}

// ── Game screen ───────────────────────────────────────────────────────────────

function GameScreen({ difficulty, grid, moves, gameState, onToggle, onPlayAgain }) {
  const litCount = grid.filter(Boolean).length;

  // ── Win screen ────────────────────────────────────────────────────
  if (gameState === "won") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
          style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: "linear-gradient(145deg, #ffd60a, #ff9f0a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              boxShadow: "0 8px 24px rgba(255,214,10,0.45)",
            }}
          >
            🎉
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--label-primary)",
              }}
            >
              Lights Out!
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--label-tertiary)" }}>
              You solved it in {moves} {moves === 1 ? "move" : "moves"}
            </p>
          </div>

          <div className="flex gap-6">
            {[
              { label: "Moves", value: moves },
              { label: "Difficulty", value: difficulty.label },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "var(--label-primary)",
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--label-tertiary)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <button onClick={onPlayAgain} className="btn-primary w-full">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // ── Playing screen ────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4 pt-4 pb-12">
      {/* Stats bar */}
      <div className="flex items-center justify-center gap-4 flex-wrap w-full">
        {[
          { label: "Difficulty", value: difficulty.label },
          { label: "Moves", value: moves },
          { label: "Lights On", value: litCount },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
            style={{ background: "var(--fill-tertiary)", minWidth: 72 }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--label-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--label-tertiary)",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        role="grid"
        aria-label="Lights Out grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: 8,
          width: "100%",
          padding: 16,
          borderRadius: 20,
          background: "var(--bg-surface)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        {grid.map((lit, i) => {
          const row = Math.floor(i / GRID_SIZE);
          const col = i % GRID_SIZE;
          return (
            <Cell
              key={i}
              lit={lit}
              row={row}
              col={col}
              disabled={gameState !== "playing"}
              onClick={() => onToggle(row, col)}
            />
          );
        })}
      </div>

      {/* Hint */}
      <p
        className="text-center"
        style={{
          fontSize: "0.78rem",
          color: "var(--label-tertiary)",
          letterSpacing: "-0.01em",
          maxWidth: 280,
        }}
      >
        Click a cell to toggle it and its neighbours. Turn all lights off to
        win!
      </p>
    </div>
  );
}

// ── Main board ────────────────────────────────────────────────────────────────

export default function LightsOutBoard() {
  const [phase, setPhase] = useState("selecting"); // 'selecting' | 'playing' | 'won'
  const [difficulty, setDifficulty] = useState(null);
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(0);
  const [toast, setToast] = useState(null);

  const startGame = useCallback((diff) => {
    const puzzle = generatePuzzle(diff.moves());
    setDifficulty(diff);
    setGrid(puzzle);
    setMoves(0);
    setPhase("playing");
  }, []);

  const handleToggle = useCallback(
    (row, col) => {
      if (phase !== "playing") return;
      const next = applyToggle(grid, row, col);
      const nextMoves = moves + 1;
      setGrid(next);
      setMoves(nextMoves);

      if (next.every((cell) => !cell)) {
        setPhase("won");
      }
    },
    [grid, moves, phase]
  );

  const handlePlayAgain = useCallback(() => {
    setPhase("selecting");
    setDifficulty(null);
    setGrid([]);
    setMoves(0);
  }, []);

  if (phase === "selecting") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4 pt-6 pb-12">
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        <DifficultySelector onSelect={startGame} />
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      <GameScreen
        difficulty={difficulty}
        grid={grid}
        moves={moves}
        gameState={phase}
        onToggle={handleToggle}
        onPlayAgain={handlePlayAgain}
      />
    </>
  );
}
