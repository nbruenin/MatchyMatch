import { useState, useEffect, useCallback } from 'react';
import Toast from '../Toast';

/**
 * Nathaniel's Number Ninja
 * A fast-paced number pattern game where players identify the next number in a sequence
 */

function NinjaCard({ number, isTarget, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        borderRadius: 16,
        background: isTarget
          ? 'linear-gradient(145deg, #34c759, #30d158)'
          : 'linear-gradient(145deg, var(--accent), #5856d6)',
        boxShadow: isTarget
          ? '0 4px 14px rgba(52,199,89,0.35)'
          : '0 4px 14px rgba(0,122,255,0.25)',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: 700,
        color: '#fff',
        transition: 'all 0.2s ease',
        transform: disabled ? 'scale(1)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.target.style.transform = 'scale(1)';
      }}
    >
      {number}
    </button>
  );
}

function SequenceDisplay({ sequence }) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
      {sequence.map((num, idx) => (
        <div
          key={idx}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: 'var(--fill-tertiary)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--label-primary)',
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {num}
        </div>
      ))}
      <span style={{ fontSize: '1.5rem', color: 'var(--label-tertiary)' }}>?</span>
    </div>
  );
}

function StatsBar({ score, streak, level }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
      {[
        { label: 'Score', value: score, emoji: '⭐' },
        { label: 'Streak', value: streak, emoji: '🔥' },
        { label: 'Level', value: level, emoji: '📈' },
      ].map(({ label, value, emoji }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--label-primary)' }}>
            {value}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function GameOverScreen({ score, streak, level, onPlayAgain }) {
  const rating =
    score >= 500
      ? { emoji: '🥷', label: 'Ninja Master!' }
      : score >= 300
      ? { emoji: '🎯', label: 'Excellent!' }
      : score >= 150
      ? { emoji: '👍', label: 'Good Job!' }
      : { emoji: '🎉', label: 'Nice Try!' };

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: 'linear-gradient(145deg, #34c759, #30d158)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 8px 24px rgba(52,199,89,0.35)',
        }}
      >
        {rating.emoji}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          {rating.label}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
          Game Over
        </p>
      </div>

      <div className="flex gap-6">
        {[
          { label: 'Final Score', value: score },
          { label: 'Best Streak', value: streak },
          { label: 'Level Reached', value: level },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--label-primary)',
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
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

// Pattern generators
function generateArithmeticSequence(level) {
  const start = Math.floor(Math.random() * 10) + 1;
  const diff = Math.floor(Math.random() * (level + 2)) + 1;
  const length = 3 + Math.floor(level / 2);
  const sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(start + i * diff);
  }
  return { sequence, next: start + length * diff, type: 'arithmetic' };
}

function generateGeometricSequence(level) {
  const start = Math.floor(Math.random() * 5) + 1;
  const ratio = Math.floor(Math.random() * 3) + 2;
  const length = 3 + Math.floor(level / 3);
  const sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(start * Math.pow(ratio, i));
  }
  return { sequence, next: start * Math.pow(ratio, length), type: 'geometric' };
}

function generateFibonacciLike(level) {
  const start1 = Math.floor(Math.random() * 5) + 1;
  const start2 = Math.floor(Math.random() * 5) + 1;
  const length = 4 + Math.floor(level / 2);
  const sequence = [start1, start2];
  for (let i = 2; i < length; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return {
    sequence,
    next: sequence[length - 1] + sequence[length - 2],
    type: 'fibonacci',
  };
}

function generateSequence(level) {
  const types = [generateArithmeticSequence, generateGeometricSequence, generateFibonacciLike];
  const generator = types[Math.floor(Math.random() * types.length)];
  return generator(level);
}

function generateOptions(correct, level) {
  const options = [correct];
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * (level * 10 + 20)) - level * 5;
    const option = correct + offset;
    if (option > 0 && !options.includes(option)) {
      options.push(option);
    }
  }
  return options.sort(() => Math.random() - 0.5);
}

export default function NathanielNinjaBoard() {
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'gameOver'
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [options, setOptions] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => setToast(msg), []);

  // Initialize first puzzle
  useEffect(() => {
    const puzzle = generateSequence(level);
    setSequence(puzzle.sequence);
    setCorrectAnswer(puzzle.next);
    setOptions(generateOptions(puzzle.next, level));
  }, [level]);

  const handleAnswer = (answer) => {
    if (disabled) return;
    setDisabled(true);

    if (answer === correctAnswer) {
      const newScore = score + (10 * level);
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      showToast('✨ Correct!');

      // Level up every 3 correct answers
      if (newStreak % 3 === 0) {
        setLevel((l) => l + 1);
      } else {
        // Generate next puzzle at same level
        setTimeout(() => {
          const puzzle = generateSequence(level);
          setSequence(puzzle.sequence);
          setCorrectAnswer(puzzle.next);
          setOptions(generateOptions(puzzle.next, level));
          setDisabled(false);
        }, 600);
      }
    } else {
      showToast('❌ Wrong!');
      setStreak(0);
      setTimeout(() => {
        setGameState('gameOver');
      }, 800);
    }
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setLevel(1);
    const puzzle = generateSequence(1);
    setSequence(puzzle.sequence);
    setCorrectAnswer(puzzle.next);
    setOptions(generateOptions(puzzle.next, 1));
    setDisabled(false);
  };

  if (gameState === 'gameOver') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <GameOverScreen
          score={score}
          streak={bestStreak}
          level={level}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="text-center mb-2">
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--label-primary)',
          }}
        >
          🥷 Nathaniel's Number Ninja
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--label-tertiary)', marginTop: 4 }}>
          Find the next number in the sequence
        </p>
      </div>

      <StatsBar score={score} streak={streak} level={level} />

      {sequence && (
        <>
          <SequenceDisplay sequence={sequence} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'clamp(8px, 2vw, 12px)',
              width: '100%',
            }}
          >
            {options.map((option, idx) => (
              <NinjaCard
                key={idx}
                number={option}
                isTarget={option === correctAnswer}
                onClick={() => handleAnswer(option)}
                disabled={disabled}
              />
            ))}
          </div>
        </>
      )}

      <p
        className="text-center"
        style={{
          fontSize: '0.78rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '-0.01em',
          maxWidth: 300,
        }}
      >
        Identify the pattern and select the next number. Get 3 correct in a row to level up!
      </p>

      <button onClick={handlePlayAgain} className="btn-ghost">
        🔄 New Game
      </button>
    </div>
  );
}
