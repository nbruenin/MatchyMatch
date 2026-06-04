import { useState, useEffect, useRef, useCallback } from 'react';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 80;
const PIPE_GAP = 150;
const PIPE_SPEED = 5;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;

export default function FlappyBirdBoard() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('idle'); // idle, playing, gameOver
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('flappybird-best-score');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Game state refs
  const gameStateRef = useRef({
    birdY: GAME_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [],
    score: 0,
    gameOver: false,
    nextPipeId: 0,
  });

  const handleJump = useCallback(() => {
    if (gameStateRef.current.gameOver) {
      // Reset game
      gameStateRef.current = {
        birdY: GAME_HEIGHT / 2,
        birdVelocity: 0,
        pipes: [],
        score: 0,
        gameOver: false,
        nextPipeId: 0,
      };
      setScore(0);
      setGameState('playing');
    } else if (gameState === 'idle') {
      setGameState('playing');
      gameStateRef.current.birdVelocity = JUMP_STRENGTH;
    } else if (gameState === 'playing') {
      gameStateRef.current.birdVelocity = JUMP_STRENGTH;
    }
  }, [gameState]);

  // Handle keyboard and mouse/touch
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };

    const handleClick = () => {
      handleJump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [handleJump]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const gameLoop = () => {
      const state = gameStateRef.current;

      // Update bird physics
      state.birdVelocity += GRAVITY;
      state.birdY += state.birdVelocity;

      // Check collision with ground/ceiling
      if (state.birdY + BIRD_SIZE / 2 >= GAME_HEIGHT || state.birdY - BIRD_SIZE / 2 <= 0) {
        state.gameOver = true;
        setGameState('gameOver');
        if (state.score > bestScore) {
          setBestScore(state.score);
          localStorage.setItem('flappybird-best-score', state.score);
        }
        return;
      }

      // Move pipes
      for (let i = state.pipes.length - 1; i >= 0; i--) {
        state.pipes[i].x -= PIPE_SPEED;

        // Remove off-screen pipes
        if (state.pipes[i].x + PIPE_WIDTH < 0) {
          state.pipes.splice(i, 1);
        }
      }

      // Add new pipes
      if (state.pipes.length === 0 || state.pipes[state.pipes.length - 1].x < GAME_WIDTH - 200) {
        const gapY = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
        state.pipes.push({
          id: state.nextPipeId++,
          x: GAME_WIDTH,
          gapY,
          scored: false,
        });
      }

      // Check collision with pipes and scoring
      for (const pipe of state.pipes) {
        // Check if bird passed the pipe
        if (!pipe.scored && pipe.x + PIPE_WIDTH < GAME_WIDTH / 2) {
          pipe.scored = true;
          state.score++;
          setScore(state.score);
        }

        // Check collision
        const birdLeft = GAME_WIDTH / 2 - BIRD_SIZE / 2;
        const birdRight = GAME_WIDTH / 2 + BIRD_SIZE / 2;
        const birdTop = state.birdY - BIRD_SIZE / 2;
        const birdBottom = state.birdY + BIRD_SIZE / 2;

        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + PIPE_WIDTH &&
          (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP)
        ) {
          state.gameOver = true;
          setGameState('gameOver');
          if (state.score > bestScore) {
            setBestScore(state.score);
            localStorage.setItem('flappybird-best-score', state.score);
          }
          return;
        }
      }

      // Draw
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw pipes
      ctx.fillStyle = '#2ecc71';
      for (const pipe of state.pipes) {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, GAME_HEIGHT - pipe.gapY - PIPE_GAP);
      }

      // Draw bird
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(GAME_WIDTH / 2, state.birdY, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw bird eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(GAME_WIDTH / 2 + 8, state.birdY - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${state.score}`, 20, 40);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId);
  }, [gameState, bestScore]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--label-primary)' }}>
          🐦 Flappy Bird
        </h1>
        <p className="text-sm" style={{ color: 'var(--label-tertiary)' }}>
          Click or press Space to make the bird fly
        </p>
      </div>

      {/* Score display */}
      <div className="flex gap-6 justify-center">
        <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl" style={{ background: 'var(--fill-tertiary)' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--label-primary)' }}>
            {score}
          </span>
          <span className="text-xs font-semibold uppercase" style={{ color: 'var(--label-tertiary)' }}>
            Score
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl" style={{ background: 'var(--fill-tertiary)' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--label-primary)' }}>
            {bestScore}
          </span>
          <span className="text-xs font-semibold uppercase" style={{ color: 'var(--label-tertiary)' }}>
            Best
          </span>
        </div>
      </div>

      {/* Game canvas */}
      <div className="relative rounded-lg overflow-hidden shadow-lg border-2" style={{ borderColor: 'var(--fill-tertiary)' }}>
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="block bg-sky-300"
          style={{ cursor: 'pointer' }}
        />

        {/* Overlay messages */}
        {gameState === 'idle' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="text-center">
              <p className="text-white text-xl font-bold mb-2">Ready?</p>
              <p className="text-white text-sm">Click or press Space to start</p>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          >
            <div className="text-center">
              <p className="text-white text-2xl font-bold mb-2">Game Over!</p>
              <p className="text-white text-lg mb-4">Final Score: {score}</p>
              <p className="text-white text-sm">Click or press Space to play again</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div
        className="w-full p-4 rounded-lg text-sm"
        style={{ background: 'var(--fill-tertiary)', color: 'var(--label-secondary)' }}
      >
        <p className="font-semibold mb-2">How to Play:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Click the screen or press Space to make the bird jump</li>
          <li>Avoid the green pipes</li>
          <li>Each pipe you pass increases your score</li>
          <li>Don't hit the pipes or the ground!</li>
        </ul>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.location.reload()}
        className="btn-ghost"
      >
        ← Back to Games
      </button>
    </div>
  );
}
