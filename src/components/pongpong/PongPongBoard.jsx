import { useState, useEffect, useRef, useCallback } from 'react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 8;
const PADDLE_SPEED = 6;
const INITIAL_BALL_SPEED = 4;

export default function PongPongBoard() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('normal');
  const gameStateRef = useRef({
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballSpeedX: INITIAL_BALL_SPEED,
    ballSpeedY: INITIAL_BALL_SPEED,
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    score: 0,
    gameRunning: false,
  });
  const keysPressed = useRef({});

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballSpeedX: INITIAL_BALL_SPEED,
      ballSpeedY: INITIAL_BALL_SPEED,
      playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      score: 0,
      gameRunning: true,
    };
    setScore(0);
    setGameState('playing');
  }, []);

  const startGame = useCallback((diff) => {
    setDifficulty(diff);
    resetGame();
  }, [resetGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const gameLoop = () => {
      const state = gameStateRef.current;

      // Update player paddle
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        state.playerY = Math.max(0, state.playerY - PADDLE_SPEED);
      }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        state.playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.playerY + PADDLE_SPEED);
      }

      // Update AI paddle (simple AI)
      const aiSpeed = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 5 : 4;
      const aiCenter = state.aiY + PADDLE_HEIGHT / 2;
      if (aiCenter < state.ballY - 20) {
        state.aiY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.aiY + aiSpeed);
      } else if (aiCenter > state.ballY + 20) {
        state.aiY = Math.max(0, state.aiY - aiSpeed);
      }

      // Update ball position
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Ball collision with top/bottom
      if (state.ballY - BALL_SIZE / 2 <= 0 || state.ballY + BALL_SIZE / 2 >= CANVAS_HEIGHT) {
        state.ballSpeedY *= -1;
        state.ballY = Math.max(BALL_SIZE / 2, Math.min(CANVAS_HEIGHT - BALL_SIZE / 2, state.ballY));
      }

      // Ball collision with paddles
      // Player paddle (left)
      if (
        state.ballX - BALL_SIZE / 2 <= PADDLE_WIDTH &&
        state.ballY >= state.playerY &&
        state.ballY <= state.playerY + PADDLE_HEIGHT
      ) {
        state.ballSpeedX = Math.abs(state.ballSpeedX);
        state.ballX = PADDLE_WIDTH + BALL_SIZE / 2;
        // Add spin based on where ball hits paddle
        const hitPos = (state.ballY - state.playerY) / PADDLE_HEIGHT - 0.5;
        state.ballSpeedY += hitPos * 3;
      }

      // AI paddle (right)
      if (
        state.ballX + BALL_SIZE / 2 >= CANVAS_WIDTH - PADDLE_WIDTH &&
        state.ballY >= state.aiY &&
        state.ballY <= state.aiY + PADDLE_HEIGHT
      ) {
        state.ballSpeedX = -Math.abs(state.ballSpeedX);
        state.ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE / 2;
        // Add spin
        const hitPos = (state.ballY - state.aiY) / PADDLE_HEIGHT - 0.5;
        state.ballSpeedY += hitPos * 3;
      }

      // Ball out of bounds
      if (state.ballX < 0) {
        // AI scored
        setGameState('gameOver');
        return;
      }
      if (state.ballX > CANVAS_WIDTH) {
        // Player scored
        state.score += 1;
        setScore(state.score);
        state.ballX = CANVAS_WIDTH / 2;
        state.ballY = CANVAS_HEIGHT / 2;
        state.ballSpeedX = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        state.ballSpeedY = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
      }

      // Draw
      ctx.fillStyle = 'var(--bg-primary)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Center line
      ctx.strokeStyle = 'var(--label-tertiary)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player paddle
      ctx.fillStyle = '#0a84ff';
      ctx.fillRect(0, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // AI paddle
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState, difficulty]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--label-primary)' }}>
          🏓 Pong Pong
        </h1>
        <p style={{ color: 'var(--label-secondary)', fontSize: '0.95rem' }}>
          Beat the AI at classic Pong!
        </p>
      </div>

      {/* Canvas */}
      <div className="relative rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            display: 'block',
            background: 'var(--bg-primary)',
            border: '2px solid var(--label-tertiary)',
          }}
        />
      </div>

      {/* Score */}
      {gameState === 'playing' && (
        <div className="text-center">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--label-primary)' }}>
            {score}
          </div>
          <p style={{ color: 'var(--label-tertiary)', fontSize: '0.85rem' }}>Points</p>
        </div>
      )}

      {/* Menu */}
      {gameState === 'menu' && (
        <div
          className="flex flex-col items-center gap-4 p-8 rounded-2xl w-full max-w-sm"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--label-primary)' }}>
            Choose Difficulty
          </h2>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => startGame('easy')}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                background: '#34c759',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              🟢 Easy
            </button>
            <button
              onClick={() => startGame('normal')}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                background: '#ff9f0a',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              🟡 Normal
            </button>
            <button
              onClick={() => startGame('hard')}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                background: '#ff3b30',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              🔴 Hard
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameState === 'gameOver' && (
        <div
          className="flex flex-col items-center gap-4 p-8 rounded-2xl w-full max-w-sm"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div style={{ fontSize: '3rem' }}>😢</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--label-primary)' }}>
            Game Over!
          </h2>
          <p style={{ color: 'var(--label-secondary)', textAlign: 'center' }}>
            You scored <strong>{score} points</strong>
          </p>
          <button
            onClick={() => setGameState('menu')}
            className="px-6 py-3 rounded-lg font-semibold transition-all w-full"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Controls */}
      {gameState === 'playing' && (
        <div
          className="text-center p-4 rounded-lg"
          style={{ background: 'var(--fill-tertiary)', fontSize: '0.85rem', color: 'var(--label-secondary)' }}
        >
          <p>Use <strong>W/S</strong> or <strong>↑/↓</strong> to move your paddle</p>
        </div>
      )}
    </div>
  );
}
