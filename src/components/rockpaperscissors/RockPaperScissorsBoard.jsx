import { useState, useCallback } from "react";
import Toast from "../Toast";

const CHOICES = [
  { id: "rock", emoji: "🪨", label: "Rock" },
  { id: "paper", emoji: "📄", label: "Paper" },
  { id: "scissors", emoji: "✂️", label: "Scissors" },
];

const WINNING_COMBINATIONS = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function determineWinner(playerChoice, aiChoice) {
  if (playerChoice === aiChoice) return "tie";
  if (WINNING_COMBINATIONS[playerChoice] === aiChoice) return "win";
  return "lose";
}

export default function RockPaperScissorsBoard() {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle, playing, result
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [roundCount, setRoundCount] = useState(0);

  const showToast = useCallback((msg) => setToast(msg), []);

  const handleChoiceClick = (choice) => {
    if (gameState !== "idle") return;

    setPlayerChoice(choice);
    setGameState("playing");

    // Simulate AI thinking
    setTimeout(() => {
      const ai = getRandomChoice();
      setAiChoice(ai);

      const outcome = determineWinner(choice.id, ai.id);
      setResult(outcome);

      // Update scores
      if (outcome === "win") {
        setPlayerScore((s) => s + 1);
        showToast("You win! 🎉");
      } else if (outcome === "lose") {
        setAiScore((s) => s + 1);
        showToast("AI wins! 🤖");
      } else {
        showToast("It's a tie! 🤝");
      }

      setRoundCount((r) => r + 1);
      setGameState("result");
    }, 800);
  };

  const handlePlayAgain = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setGameState("idle");
  };

  const handleReset = () => {
    setPlayerScore(0);
    setAiScore(0);
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setGameState("idle");
    setRoundCount(0);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Title */}
      <div className="text-center">
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--label-primary)",
          }}
        >
          Rock Paper Scissors
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--label-tertiary)",
            marginTop: "0.5rem",
          }}
        >
          Beat the AI in this classic game
        </p>
      </div>

      {/* Score board */}
      <div className="flex gap-6 w-full justify-center">
        <div
          className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl"
          style={{ background: "var(--fill-tertiary)" }}
        >
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--label-primary)",
            }}
          >
            {playerScore}
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
            You
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl"
          style={{ background: "var(--fill-tertiary)" }}
        >
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--label-primary)",
            }}
          >
            {aiScore}
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
            AI
          </span>
        </div>
      </div>

      {/* Game area */}
      {gameState === "idle" && (
        <div className="flex flex-col items-center gap-6 w-full">
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--label-secondary)",
              textAlign: "center",
            }}
          >
            Make your choice:
          </p>

          {/* Choice buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            {CHOICES.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice)}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all"
                style={{
                  background: "var(--fill-secondary)",
                  border: "1.5px solid var(--fill-tertiary)",
                  cursor: "pointer",
                  fontSize: "2rem",
                }}
              >
                <span>{choice.emoji}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--label-secondary)",
                  }}
                >
                  {choice.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="flex flex-col items-center gap-4 w-full">
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--label-tertiary)",
              textAlign: "center",
            }}
          >
            AI is thinking...
          </p>
          <div
            style={{
              fontSize: "3rem",
              animation: "pulse 1s infinite",
            }}
          >
            🤔
          </div>
        </div>
      )}

      {gameState === "result" && playerChoice && aiChoice && (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Choices display */}
          <div className="flex gap-8 justify-center items-end">
            {/* Player choice */}
            <div className="flex flex-col items-center gap-2">
              <div
                style={{
                  fontSize: "3rem",
                  padding: "1rem",
                  background: "var(--fill-secondary)",
                  borderRadius: "1rem",
                  border: "2px solid var(--accent)",
                }}
              >
                {playerChoice.emoji}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--label-secondary)",
                }}
              >
                You
              </span>
            </div>

            {/* VS */}
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--label-tertiary)",
                marginBottom: "1rem",
              }}
            >
              VS
            </div>

            {/* AI choice */}
            <div className="flex flex-col items-center gap-2">
              <div
                style={{
                  fontSize: "3rem",
                  padding: "1rem",
                  background: "var(--fill-secondary)",
                  borderRadius: "1rem",
                  border: "2px solid #ff9f0a",
                }}
              >
                {aiChoice.emoji}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--label-secondary)",
                }}
              >
                AI
              </span>
            </div>
          </div>

          {/* Result message */}
          <div
            className="spring-pop flex flex-col items-center gap-2 p-6 rounded-2xl w-full"
            style={{
              background: "var(--fill-tertiary)",
              border:
                result === "win"
                  ? "2px solid #34c759"
                  : result === "lose"
                  ? "2px solid #ff3b30"
                  : "2px solid #ff9f0a",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color:
                  result === "win"
                    ? "#34c759"
                    : result === "lose"
                    ? "#ff3b30"
                    : "#ff9f0a",
              }}
            >
              {result === "win"
                ? "🎉 You Win!"
                : result === "lose"
                ? "😔 You Lose!"
                : "🤝 It's a Tie!"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button onClick={handlePlayAgain} className="btn-primary flex-1">
              Play Again
            </button>
            <button onClick={handleReset} className="btn-ghost flex-1">
              Reset Score
            </button>
          </div>
        </div>
      )}

      {/* Round counter */}
      {roundCount > 0 && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--label-tertiary)",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Round {roundCount}
        </p>
      )}
    </div>
  );
}
