import { useState, useEffect, useCallback, useRef } from "react";
import Toast from "../Toast";

// ── Tile Component ────────────────────────────────────────────────

function FlipFlopTile({ tile, onClick, disabled, isFlipping }) {
  const { id, value, flipped, matched } = tile;

  return (
    <button
      onClick={onClick}
      disabled={disabled || matched}
      aria-label={flipped || matched ? value : "Hidden tile"}
      className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-transform hover:scale-105"
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        perspective: 600,
        cursor: matched ? "default" : "pointer",
        opacity: matched ? 0.5 : 1,
      }}
    >
      {/* Tile inner — flips on state change */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.34,1.2,0.64,1)",
          transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 12,
            background: matched
              ? "linear-gradient(145deg, #34c759, #30d158)"
              : "linear-gradient(145deg, #007aff, #0051d5)",
            boxShadow: matched
              ? "0 4px 14px rgba(52,199,89,0.35)"
              : "0 4px 14px rgba(0,122,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", opacity: 0.6 }}>
            ❓
          </span>
        </div>

        {/* Front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 12,
            background: matched
              ? "linear-gradient(145deg, rgba(52,199,89,0.15), rgba(48,209,88,0.08))"
              : "var(--bg-surface)",
            border: matched
              ? "1.5px solid rgba(52,199,89,0.45)"
              : "0.5px solid rgba(0,0,0,0.08)",
            boxShadow: matched
              ? "0 4px 14px rgba(52,199,89,0.2)"
              : "var(--shadow-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
              filter: matched ? "none" : "none",
              transition: "transform 0.2s ease",
              transform: matched ? "scale(1.1)" : "scale(1)",
            }}
          >
            {value}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────

function StatsBar({ pairs, total, elapsed, accuracy }) {
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {[
        { label: "Pairs", value: `${pairs} / ${total}` },
        { label: "Time", value: `${mm}:${ss}` },
        { label: "Accuracy", value: `${accuracy}%` },
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
  );
}

// ── Win Screen ────────────────────────────────────────────────────

function WinScreen({ pairs, elapsed, accuracy, onPlayAgain }) {
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const rating =
    accuracy === 100
      ? { emoji: "🏆", label: "Perfect!" }
      : accuracy >= 90
      ? { emoji: "🌟", label: "Excellent!" }
      : accuracy >= 75
      ? { emoji: "👍", label: "Good job!" }
      : { emoji: "🎉", label: "You did it!" };

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)" }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: "linear-gradient(145deg, #34c759, #30d158)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          boxShadow: "0 8px 24px rgba(52,199,89,0.35)",
        }}
      >
        {rating.emoji}
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
          {rating.label}
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--label-tertiary)" }}>
          All {pairs} pairs matched!
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        {[
          { label: "Time", value: `${mm}:${ss}` },
          { label: "Accuracy", value: `${accuracy}%` },
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
  );
}

// ── Tile data generator ───────────────────────────────────────────

const TILE_VALUES = [
  "🍎",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍓",
  "🍒",
  "🍑",
  "🥝",
  "🍍",
];

function generateTiles() {
  const shuffled = [...TILE_VALUES].sort(() => Math.random() - 0.5);
  const tiles = [];
  let id = 0;

  shuffled.forEach((value) => {
    tiles.push({ id: id++, value, flipped: false, matched: false });
    tiles.push({ id: id++, value, flipped: false, matched: false });
  });

  return tiles.sort(() => Math.random() - 0.5);
}

// ── Main Board ────────────────────────────────────────────────────

export default function FlipFlopBoard() {
  const [tiles, setTiles] = useState(() => generateTiles());
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [gameState, setGameState] = useState("playing"); // 'playing' | 'won'
  const [toast, setToast] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const timerRef = useRef(null);

  const TOTAL_PAIRS = TILE_VALUES.length; // 10

  // Timer
  useEffect(() => {
    if (gameState !== "playing") {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const showToast = useCallback((msg) => setToast(msg), []);

  const handleTileClick = useCallback(
    (tileId) => {
      if (locked) return;
      if (flippedIds.includes(tileId)) return;

      const newFlipped = [...flippedIds, tileId];
      setFlippedIds(newFlipped);

      // Flip the tile visually
      setTiles((prev) =>
        prev.map((t) => (t.id === tileId ? { ...t, flipped: true } : t))
      );

      if (newFlipped.length === 2) {
        setTotalAttempts((a) => a + 1);
        setLocked(true);

        const [id1, id2] = newFlipped;
        const tile1 = tiles.find((t) => t.id === id1);
        const tile2 = tiles.find((t) => t.id === id2);

        if (tile1.value === tile2.value) {
          // Match!
          setTimeout(() => {
            setTiles((prev) =>
              prev.map((t) =>
                t.id === id1 || t.id === id2 ? { ...t, flipped: false, matched: true } : t
              )
            );
            setFlippedIds([]);
            setLocked(false);
            const newCount = matchedCount + 1;
            setMatchedCount(newCount);
            showToast("Match! 🎉");
            if (newCount === TOTAL_PAIRS) {
              setGameState("won");
            }
          }, 500);
        } else {
          // No match — flip back after delay
          setTimeout(() => {
            setTiles((prev) =>
              prev.map((t) =>
                t.id === id1 || t.id === id2 ? { ...t, flipped: false } : t
              )
            );
            setFlippedIds([]);
            setLocked(false);
          }, 900);
        }
      }
    },
    [locked, flippedIds, tiles, matchedCount, TOTAL_PAIRS, showToast]
  );

  const handlePlayAgain = () => {
    setTiles(generateTiles());
    setFlippedIds([]);
    setMatchedCount(0);
    setLocked(false);
    setGameState("playing");
    setElapsed(0);
    setTotalAttempts(0);
  };

  const accuracy =
    totalAttempts === 0
      ? 100
      : Math.round(((TOTAL_PAIRS / totalAttempts) * 100));

  // ── Won screen ───────────────────────────────────────────────────
  if (gameState === "won") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <WinScreen
          pairs={TOTAL_PAIRS}
          elapsed={elapsed}
          accuracy={accuracy}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    );
  }

  // ── Playing screen ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Stats */}
      <StatsBar
        pairs={matchedCount}
        total={TOTAL_PAIRS}
        elapsed={elapsed}
        accuracy={accuracy}
      />

      {/* Grid — 5 columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "clamp(8px, 2vw, 12px)",
          width: "100%",
        }}
      >
        {tiles.map((tile) => (
          <FlipFlopTile
            key={tile.id}
            tile={tile}
            onClick={() => handleTileClick(tile.id)}
            disabled={locked || flippedIds.length === 2}
          />
        ))}
      </div>

      {/* Hint text */}
      <p
        className="text-center"
        style={{
          fontSize: "0.78rem",
          color: "var(--label-tertiary)",
          letterSpacing: "-0.01em",
          maxWidth: 300,
        }}
      >
        Flip tiles to find all {TOTAL_PAIRS} matching pairs. Beat your best time!
      </p>

      {/* New game button */}
      <button onClick={handlePlayAgain} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  );
}
