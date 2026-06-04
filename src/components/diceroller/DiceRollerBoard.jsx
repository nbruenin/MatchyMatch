import { useState, useCallback } from "react";
import Toast from "../Toast";

// ── Single die ─────────────────────────────────────────────────────

function Die({ value, isRolling }) {
  const getDots = (num) => {
    const dotPatterns = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
    };
    return dotPatterns[num] || [];
  };

  const dots = getDots(value);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 120,
        height: 120,
        background: "linear-gradient(145deg, var(--bg-surface), var(--fill-tertiary))",
        border: "2px solid var(--fill-secondary)",
        borderRadius: 16,
        boxShadow: isRolling ? "0 8px 24px rgba(0,122,255,0.3)" : "var(--shadow-md)",
        transition: "all 0.2s ease",
        transform: isRolling ? "scale(0.95) rotateZ(360deg)" : "scale(1) rotateZ(0deg)",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          width: "100%",
          height: "100%",
          padding: 12,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const hasDot = dots.some((d) => d[0] === row && d[1] === col);
          return (
            <div
              key={i}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                background: hasDot ? "var(--accent)" : "transparent",
                boxShadow: hasDot ? "0 2px 8px rgba(0,122,255,0.3)" : "none",
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────

function StatsBar({ rolls, total, average }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {[
        { label: "Rolls", value: rolls },
        { label: "Total", value: total },
        { label: "Average", value: average.toFixed(1) },
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

// ── Win screen ────────────────────────────────────────────────────

function WinScreen({ rolls, total, average, onPlayAgain }) {
  const rating =
    average >= 5.5
      ? { emoji: "🏆", label: "Lucky rolls!" }
      : average >= 4.5
        ? { emoji: "🌟", label: "Great luck!" }
        : average >= 3.5
          ? { emoji: "👍", label: "Good rolls!" }
          : { emoji: "🎲", label: "Keep rolling!" };

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
          You rolled {rolls} times!
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        {[
          { label: "Total", value: total },
          { label: "Average", value: average.toFixed(1) },
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
        Roll Again
      </button>
    </div>
  );
}

// ── Main board ────────────────────────────────────────────────────

export default function DiceRollerBoard() {
  const [dice, setDice] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameState, setGameState] = useState("playing"); // 'playing' | 'won'
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => setToast(msg), []);

  const handleRoll = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);

    // Animate rolling
    const rollInterval = setInterval(() => {
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    }, 50);

    setTimeout(() => {
      clearInterval(rollInterval);
      const newDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
      setDice(newDice);
      setIsRolling(false);

      const newRolls = rolls + 1;
      setRolls(newRolls);
      setHistory([...history, newDice[0] + newDice[1]]);

      if (newDice[0] === newDice[1]) {
        showToast("Double! 🎉");
      }

      // Win after 10 rolls
      if (newRolls === 10) {
        setGameState("won");
      }
    }, 600);
  }, [isRolling, rolls, history, showToast]);

  const handlePlayAgain = () => {
    setDice([1, 1]);
    setRolls(0);
    setHistory([]);
    setGameState("playing");
  };

  const total = history.reduce((sum, val) => sum + val, 0);
  const average = history.length > 0 ? total / history.length : 0;

  // ── Won screen ───────────────────────────────────────────────────
  if (gameState === "won") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <WinScreen rolls={rolls} total={total} average={average} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  // ── Playing screen ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Stats */}
      <StatsBar rolls={rolls} total={total} average={average} />

      {/* Dice */}
      <div className="flex gap-6 justify-center flex-wrap">
        {dice.map((value, idx) => (
          <Die key={idx} value={value} isRolling={isRolling} />
        ))}
      </div>

      {/* Total display */}
      <div
        className="text-center"
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "var(--label-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        Total: {dice[0] + dice[1]}
      </div>

      {/* Roll button */}
      <button
        onClick={handleRoll}
        disabled={isRolling}
        className="btn-primary"
        style={{
          opacity: isRolling ? 0.6 : 1,
          cursor: isRolling ? "not-allowed" : "pointer",
        }}
      >
        {isRolling ? "Rolling..." : "🎲 Roll Dice"}
      </button>

      {/* History */}
      {history.length > 0 && (
        <div className="w-full">
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--label-tertiary)",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Roll History
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
            }}
          >
            {history.map((value, idx) => (
              <div
                key={idx}
                style={{
                  padding: "6px 12px",
                  borderRadius: 12,
                  background: "var(--fill-tertiary)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--label-primary)",
                }}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}

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
        Roll the dice 10 times and see how lucky you are!
      </p>

      {/* New game button */}
      <button onClick={handlePlayAgain} className="btn-ghost">
        🔀 New Game
      </button>
    </div>
  );
}
