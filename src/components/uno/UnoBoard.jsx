import { useState, useEffect, useCallback, useRef } from "react";
import { clsx } from "clsx";
import Toast from "../Toast";

// ── Constants ────────────────────────────────────────────────────────────────

const COLORS = ["red", "yellow", "green", "blue"];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ACTION_CARDS = ["skip", "reverse", "draw2"];
const WILD_CARDS = ["wild", "wild_draw4"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function createDeck() {
  const deck = [];
  let id = 0;

  // Number cards (0-9) - 2 of each per color (except 0 is 1 per color)
  COLORS.forEach((color) => {
    NUMBERS.forEach((number) => {
      if (number === "0") {
        deck.push({ id: id++, type: "number", color, value: number });
      } else {
        deck.push({ id: id++, type: "number", color, value: number });
        deck.push({ id: id++, type: "number", color, value: number });
      }
    });

    // Action cards (2 of each per color)
    ACTION_CARDS.forEach((action) => {
      deck.push({ id: id++, type: "action", color, action });
      deck.push({ id: id++, type: "action", color, action });
    });
  });

  // Wild cards (4 of each type)
  WILD_CARDS.forEach((wild) => {
    for (let i = 0; i < 4; i++) {
      deck.push({ id: id++, type: "wild", color: null, wild });
    }
  });

  return deck.sort(() => Math.random() - 0.5);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCardColor(card) {
  if (card.type === "wild") return "#888";
  const colorMap = {
    red: "#ff3b30",
    yellow: "#ff9f0a",
    green: "#34c759",
    blue: "#007aff",
  };
  return colorMap[card.color] || "#888";
}

function getCardLabel(card) {
  if (card.type === "number") return card.value;
  if (card.type === "action") {
    const labels = { skip: "SKIP", reverse: "REV", draw2: "+2" };
    return labels[card.action];
  }
  if (card.type === "wild") {
    return card.wild === "wild" ? "WILD" : "+4";
  }
  return "?";
}

// ── Card component ──────────────────────────────────────────────────────────

function Card({ card, onClick, isPlayable = true, isSelected = false, style = {} }) {
  const bgColor = getCardColor(card);
  const label = getCardLabel(card);
  const isWild = card.type === "wild";

  return (
    <button
      onClick={onClick}
      disabled={!isPlayable}
      style={{
        width: 60,
        height: 90,
        borderRadius: 8,
        background: isWild
          ? "linear-gradient(135deg, #ff3b30, #ff9f0a, #34c759, #007aff)"
          : bgColor,
        border: isSelected ? "3px solid #fff" : "2px solid rgba(0,0,0,0.2)",
        color: "#fff",
        fontSize: "0.7rem",
        fontWeight: 700,
        cursor: isPlayable ? "pointer" : "not-allowed",
        opacity: isPlayable ? 1 : 0.5,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow: isSelected
          ? "0 0 0 3px rgba(255,255,255,0.5)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        ...style,
      }}
    >
      <div>{label}</div>
      {card.type === "number" && (
        <div style={{ fontSize: "0.5rem", opacity: 0.7 }}>
          {card.color.charAt(0).toUpperCase()}
        </div>
      )}
    </button>
  );
}

// ── Main board ───────────────────────────────────────────────────────────────

export default function UnoBoard() {
  const [gameKey, setGameKey] = useState(0);
  return (
    <Game
      key={gameKey}
      onNewGame={() => setGameKey((k) => k + 1)}
    />
  );
}

function Game({ onNewGame }) {
  const [deck, setDeck] = useState(() => createDeck());
  const [discard, setDiscard] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("player"); // 'player' | 'ai'
  const [gamePhase, setGamePhase] = useState("setup"); // 'setup' | 'playing' | 'won' | 'lost'
  const [selectedCard, setSelectedCard] = useState(null);
  const [toast, setToast] = useState(null);
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [wildColorPicker, setWildColorPicker] = useState(null);

  const deckRef = useRef(deck);
  const discardRef = useRef(discard);

  // Initialize game
  useEffect(() => {
    if (gamePhase === "setup") {
      const newDeck = createDeck();
      const playerCards = newDeck.splice(0, 7);
      const aiCards = newDeck.splice(0, 7);
      const firstCard = newDeck.splice(0, 1)[0];

      setDeck(newDeck);
      setPlayerHand(playerCards);
      setAiHand(aiCards);
      setDiscard([firstCard]);
      setCurrentColor(firstCard.color || "red");
      setCurrentPlayer("player");
      setGamePhase("playing");
      setRoundCount((r) => r + 1);

      deckRef.current = newDeck;
      discardRef.current = [firstCard];
    }
  }, [gamePhase]);

  const drawCards = useCallback((count, isPlayer) => {
    let newDeck = [...deckRef.current];
    const cardsToAdd = [];

    for (let i = 0; i < count; i++) {
      if (newDeck.length === 0) {
        // Reshuffle discard pile
        newDeck = shuffle([...discardRef.current.slice(0, -1)]);
        discardRef.current = [discardRef.current[discardRef.current.length - 1]];
      }
      if (newDeck.length > 0) {
        cardsToAdd.push(newDeck.shift());
      }
    }

    deckRef.current = newDeck;
    setDeck(newDeck);

    if (isPlayer) {
      setPlayerHand((prev) => [...prev, ...cardsToAdd]);
    } else {
      setAiHand((prev) => [...prev, ...cardsToAdd]);
    }
  }, []);

  const canPlayCard = useCallback(
    (card) => {
      if (card.type === "wild") return true;
      if (card.type === "number" || card.type === "action") {
        const topCard = discard[discard.length - 1];
        if (topCard.type === "wild") {
          return card.color === currentColor;
        }
        return card.color === topCard.color || card.value === topCard.value;
      }
      return false;
    },
    [discard, currentColor]
  );

  const playCard = useCallback(
    (card, isPlayer, wildColor = null) => {
      const newDiscard = [...discard, card];
      discardRef.current = newDiscard;
      setDiscard(newDiscard);

      let newColor = currentColor;
      if (card.type === "wild") {
        newColor = wildColor || "red";
        setCurrentColor(newColor);
      } else if (card.type === "number" || card.type === "action") {
        newColor = card.color;
        setCurrentColor(newColor);
      }

      if (isPlayer) {
        setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));
      } else {
        setAiHand((prev) => prev.filter((c) => c.id !== card.id));
      }

      // Handle action cards
      if (card.type === "action") {
        if (card.action === "draw2") {
          drawCards(2, !isPlayer);
          setToast(isPlayer ? "AI draws 2" : "You draw 2");
        } else if (card.action === "skip") {
          setToast(isPlayer ? "AI skipped" : "You skipped");
        }
      } else if (card.type === "wild") {
        if (card.wild === "wild_draw4") {
          drawCards(4, !isPlayer);
          setToast(isPlayer ? "AI draws 4" : "You draw 4");
        }
      }

      return newColor;
    },
    [discard, currentColor, drawCards]
  );

  const handlePlayCard = (card) => {
    if (currentPlayer !== "player" || gamePhase !== "playing") return;
    if (!canPlayCard(card)) {
      setToast("Can't play this card!");
      return;
    }

    if (card.type === "wild") {
      setWildColorPicker(card);
      setSelectedCard(card.id);
      return;
    }

    playCard(card, true);
    setSelectedCard(null);

    // Check win
    if (playerHand.length === 1) {
      setToast("UNO!");
    } else if (playerHand.filter((c) => c.id !== card.id).length === 0) {
      setScore((s) => s + 500);
      setToast("You won! 🎉");
      setTimeout(() => setGamePhase("won"), 1000);
      return;
    }

    // AI turn
    setTimeout(() => {
      setCurrentPlayer("ai");
    }, 500);
  };

  const handleWildColor = (color) => {
    if (!wildColorPicker) return;
    playCard(wildColorPicker, true, color);
    setWildColorPicker(null);
    setSelectedCard(null);
    setTimeout(() => {
      setCurrentPlayer("ai");
    }, 500);
  };

  const handleDrawCard = () => {
    if (currentPlayer !== "player" || gamePhase !== "playing") return;
    drawCards(1, true);
    setToast("Drew a card");
    setTimeout(() => {
      setCurrentPlayer("ai");
    }, 500);
  };

  // AI turn
  useEffect(() => {
    if (currentPlayer !== "ai" || gamePhase !== "playing") return;

    const timer = setTimeout(() => {
      const playableCards = aiHand.filter((c) => canPlayCard(c));

      if (playableCards.length === 0) {
        drawCards(1, false);
        setToast("AI drew a card");
        setCurrentPlayer("player");
      } else {
        const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
        let wildColor = null;
        if (cardToPlay.type === "wild") {
          wildColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        playCard(cardToPlay, false, wildColor);

        if (aiHand.length === 1) {
          setToast("AI: UNO!");
        } else if (aiHand.filter((c) => c.id !== cardToPlay.id).length === 0) {
          setToast("AI won! 😢");
          setTimeout(() => setGamePhase("lost"), 1000);
          return;
        }

        setCurrentPlayer("player");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentPlayer, gamePhase, aiHand, canPlayCard, playCard, drawCards]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (gamePhase === "won") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
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
              boxShadow: "0 8px 28px rgba(52,199,89,0.35)",
            }}
          >
            🎉
          </div>

          <div className="flex flex-col items-center gap-1">
            <h2
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "var(--label-primary)",
              }}
            >
              You Won!
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--label-tertiary)" }}>
              Round {roundCount} complete
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "16px 32px",
              borderRadius: 18,
              background: "var(--accent-light)",
              border: "1px solid rgba(0,122,255,0.15)",
            }}
          >
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Total Score
            </span>
            <span style={{ fontSize: "2.8rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.04em" }}>
              {score}
            </span>
          </div>

          <button onClick={onNewGame} className="btn-primary w-full" style={{ justifyContent: "center" }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gamePhase === "lost") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
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
              boxShadow: "0 8px 28px rgba(255,59,48,0.35)",
            }}
          >
            😢
          </div>

          <div className="flex flex-col items-center gap-1">
            <h2
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "var(--label-primary)",
              }}
            >
              AI Won
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--label-tertiary)" }}>
              Better luck next time!
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "16px 32px",
              borderRadius: 18,
              background: "var(--accent-light)",
              border: "1px solid rgba(0,122,255,0.15)",
            }}
          >
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Total Score
            </span>
            <span style={{ fontSize: "2.8rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.04em" }}>
              {score}
            </span>
          </div>

          <button onClick={onNewGame} className="btn-primary w-full" style={{ justifyContent: "center" }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 pt-6 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <p style={{ fontSize: "0.75rem", color: "var(--label-tertiary)", letterSpacing: "-0.01em" }}>
            Round {roundCount}
          </p>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--label-primary)" }}>
            Score: {score}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--label-tertiary)" }}>
            {currentPlayer === "player" ? "Your turn" : "AI's turn"}
          </p>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: currentPlayer === "player" ? "#34c759" : "#ff9f0a" }}>
            {currentPlayer === "player" ? "🎮" : "🤖"}
          </p>
        </div>
      </div>

      {/* Game area */}
      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "space-around",
          width: "100%",
          padding: "20px",
          borderRadius: 18,
          background: "var(--fill-quaternary)",
          minHeight: 150,
          alignItems: "center",
        }}
      >
        {/* Deck */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleDrawCard}
            disabled={currentPlayer !== "player"}
            style={{
              width: 70,
              height: 105,
              borderRadius: 8,
              background: "linear-gradient(135deg, #007aff, #5856d6)",
              border: "2px solid rgba(0,122,255,0.3)",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: currentPlayer === "player" ? "pointer" : "not-allowed",
              opacity: currentPlayer === "player" ? 1 : 0.5,
              transition: "transform 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🂠
          </button>
          <p style={{ fontSize: "0.7rem", color: "var(--label-tertiary)" }}>
            {deck.length} left
          </p>
        </div>

        {/* Discard pile */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {discard.length > 0 && (
            <Card
              card={discard[discard.length - 1]}
              style={{ width: 70, height: 105 }}
            />
          )}
          <p style={{ fontSize: "0.7rem", color: "var(--label-tertiary)" }}>
            {currentColor && (
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: getCardColor({ color: currentColor }),
                  marginRight: 4,
                }}
              />
            )}
            Discard
          </p>
        </div>

        {/* AI hand info */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 70,
              height: 105,
              borderRadius: 8,
              background: "var(--bg-surface)",
              border: "2px dashed var(--separator)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            🤖
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--label-tertiary)" }}>
            AI: {aiHand.length}
          </p>
        </div>
      </div>

      {/* Wild color picker */}
      {wildColorPicker && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 16,
            borderRadius: 12,
            background: "var(--fill-quaternary)",
            width: "100%",
          }}
        >
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--label-primary)", textAlign: "center" }}>
            Choose a color:
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleWildColor(color)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  background: getCardColor({ color }),
                  border: "2px solid rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Player hand */}
      <div style={{ width: "100%" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--label-tertiary)", marginBottom: 8 }}>
          Your hand ({playerHand.length})
        </p>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            padding: 12,
            borderRadius: 12,
            background: "var(--fill-quaternary)",
            minHeight: 110,
          }}
        >
          {playerHand.map((card) => (
            <Card
              key={card.id}
              card={card}
              isPlayable={canPlayCard(card) && currentPlayer === "player"}
              isSelected={selectedCard === card.id}
              onClick={() => handlePlayCard(card)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
