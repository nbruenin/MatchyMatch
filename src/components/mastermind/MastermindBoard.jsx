import { useState, useEffect, useCallback } from "react";
import Toast from "../Toast";

const COLORS = ["🔴", "🟡", "🟢", "🔵", "🟣", "🟠"];
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

// Generate a random secret code
function generateSecretCode() {
  return Array.from({ length: CODE_LENGTH }, () =>
    COLORS[Math.floor(Math.random() * COLORS.length)]
  );
}

// Check guess against secret code
function checkGuess(guess, secret) {
  const secretCopy = [...secret];
  const guessCopy = [...guess];
  let correctPosition = 0;
  let correctColor = 0;

  // First pass: check correct positions
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] === secretCopy[i]) {
      correctPosition++;
      guessCopy[i] = null;
      secretCopy[i] = null;
    }
  }

  // Second pass: check correct colors in wrong positions
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] !== null) {
      const idx = secretCopy.indexOf(guessCopy[i]);
      if (idx !== -1) {
        correctColor++;
        secretCopy[idx] = null;
      }
    }
  }

  return { correctPosition, correctColor };
}

// Feedback peg display
function FeedbackPegs({ correctPosition, correctColor }) {
  const pegs = [];
  for (let i = 0; i < correctPosition; i++) {
    pegs.push("🟤"); // Black peg = correct position
  }
  for (let i = 0; i < correctColor; i++) {
    pegs.push("⚪"); // White peg = correct color, wrong position
  }
  while (pegs.length < 4) {
    pegs.push("⬜"); // Empty slot
  }

  return (
    <div className="flex gap-1">
      {pegs.map((peg, i) => (
        <span key={i} style={{ fontSize: "0.9rem" }}>
          {peg}
        </span>
      ))}
    </div>
  );
}

// Color picker for current guess
function ColorPicker({ currentGuess, onColorSelect, onSubmit, canSubmit }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Current guess display */}
      <div className="flex gap-2 justify-center">
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <button
            key={i}
            onClick={() => onColorSelect(i)}
            className="w-12 h-12 rounded-lg transition-all"
            style={{
              background: currentGuess[i] ? "var(--bg-surface)" : "var(--fill-tertiary)",
              border: "2px solid var(--fill-secondary)",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: currentGuess[i] ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {currentGuess[i] || "?"}
          </button>
        ))}
      </div>

      {/* Color palette */}
      <div className="flex flex-wrap gap-2 justify-center">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => {
              const emptyIdx = currentGuess.findIndex((c) => !c);
              if (emptyIdx !== -1) {
                onColorSelect(emptyIdx, color);
              }
            }}
            className="w-10 h-10 rounded-lg transition-transform hover:scale-110"
            style={{
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "var(--fill-tertiary)",
              border: "1px solid var(--fill-secondary)",
            }}
          >
            {color}
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="btn-primary w-full"
        style={{
          opacity: canSubmit ? 1 : 0.5,
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        Submit Guess
      </button>
    </div>
  );
}

// Win screen
function WinScreen({ attempts, onPlayAgain }) {
  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)" }}
    >
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
          You Won!
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--label-tertiary)" }}>
          You cracked the code!
        </p>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--label-primary)",
          }}
        >
          {attempts}
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
          Attempts
        </span>
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  );
}

// Lose screen
function LoseScreen({ secretCode, onPlayAgain }) {
  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-xl)" }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: "linear-gradient(145deg, #ff3b30, #ff453a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          boxShadow: "0 8px 24px rgba(255,59,48,0.35)",
        }}
      >
        😢
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
          Game Over
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--label-tertiary)" }}>
          You ran out of attempts!
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--label-tertiary)",
          }}
        >
          The Code Was:
        </span>
        <div className="flex gap-2">
          {secretCode.map((color, i) => (
            <span key={i} style={{ fontSize: "1.5rem" }}>
              {color}
            </span>
          ))}
        </div>
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Try Again
      </button>
    </div>
  );
}

// Main game board
export default function MastermindBoard() {
  const [secretCode, setSecretCode] = useState(() => generateSecretCode());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(Array(CODE_LENGTH).fill(null));
  const [gameState, setGameState] = useState("playing"); // 'playing' | 'won' | 'lost'
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => setToast(msg), []);

  const handleColorSelect = (index, color = null) => {
    if (gameState !== "playing") return;

    const newGuess = [...currentGuess];
    if (color) {
      newGuess[index] = color;
    } else {
      // Toggle color selection
      newGuess[index] = null;
    }
    setCurrentGuess(newGuess);
  };

  const handleSubmitGuess = () => {
    if (!currentGuess.every((c) => c)) {
      showToast("Complete your guess first!");
      return;
    }

    const feedback = checkGuess(currentGuess, secretCode);
    const newGuesses = [...guesses, { guess: currentGuess, feedback }];
    setGuesses(newGuesses);

    if (feedback.correctPosition === CODE_LENGTH) {
      setGameState("won");
      showToast("You cracked the code! 🎉");
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameState("lost");
      showToast("Game over! Out of attempts.");
    } else {
      setCurrentGuess(Array(CODE_LENGTH).fill(null));
    }
  };

  const handlePlayAgain = () => {
    setSecretCode(generateSecretCode());
    setGuesses([]);
    setCurrentGuess(Array(CODE_LENGTH).fill(null));
    setGameState("playing");
  };

  if (gameState === "won") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <WinScreen attempts={guesses.length} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  if (gameState === "lost") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <LoseScreen secretCode={secretCode} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Stats */}
      <div
        className="flex gap-6"
        style={{
          background: "var(--fill-tertiary)",
          padding: "1rem",
          borderRadius: "1rem",
          width: "100%",
        }}
      >
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--label-primary)",
            }}
          >
            {guesses.length}
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
            Attempts
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--label-primary)",
            }}
          >
            {MAX_ATTEMPTS - guesses.length}
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
            Remaining
          </span>
        </div>
      </div>

      {/* Previous guesses */}
      {guesses.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--label-tertiary)",
            }}
          >
            Previous Guesses
          </p>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {guesses.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ background: "var(--fill-tertiary)" }}
              >
                <div className="flex gap-1">
                  {g.guess.map((color, j) => (
                    <span key={j} style={{ fontSize: "1rem" }}>
                      {color}
                    </span>
                  ))}
                </div>
                <FeedbackPegs
                  correctPosition={g.feedback.correctPosition}
                  correctColor={g.feedback.correctColor}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color picker */}
      <ColorPicker
        currentGuess={currentGuess}
        onColorSelect={handleColorSelect}
        onSubmit={handleSubmitGuess}
        canSubmit={currentGuess.every((c) => c)}
      />

      {/* Instructions */}
      <div
        className="text-center text-sm"
        style={{ color: "var(--label-tertiary)", maxWidth: 300 }}
      >
        <p>🟤 = Correct color, correct position</p>
        <p>⚪ = Correct color, wrong position</p>
        <p>⬜ = Not in the code</p>
      </div>
    </div>
  );
}
