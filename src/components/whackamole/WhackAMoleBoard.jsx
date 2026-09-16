import { useState, useEffect, useCallback, useRef } from 'react'
import Toast from '../Toast'

const GRID_SIZE = 9 // 3x3 grid
const GAME_DURATION = 30000 // 30 seconds
const MOLE_APPEAR_TIME = 800 // How long mole stays visible
const MIN_SPAWN_DELAY = 400 // Minimum time between mole spawns
const MAX_SPAWN_DELAY = 1200 // Maximum time between mole spawns

export default function WhackAMoleBoard() {
  const [gameState, setGameState] = useState('idle') // idle, playing, finished
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000)
  const [activeMoles, setActiveMoles] = useState(new Set())
  const [whackedMoles, setWhackedMoles] = useState(new Set())
  const [highScore, setHighScore] = useState(0)
  const [toast, setToast] = useState(null)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)

  const gameTimerRef = useRef(null)
  const moleTimerRef = useRef(null)
  const comboTimerRef = useRef(null)
  const spawnMoleRef = useRef(null)

  const showToast = useCallback((msg) => setToast(msg), [])

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current)
    if (moleTimerRef.current) clearTimeout(moleTimerRef.current)
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current)
  }, [])

  // Spawn a mole at random position
  useEffect(() => {
    spawnMoleRef.current = () => {
      if (gameState !== 'playing') return

      setActiveMoles((currentActiveMoles) => {
        const availableHoles = []
        for (let i = 0; i < GRID_SIZE; i++) {
          if (!currentActiveMoles.has(i)) {
            availableHoles.push(i)
          }
        }

        if (availableHoles.length > 0) {
          const randomHole =
            availableHoles[Math.floor(Math.random() * availableHoles.length)]

          const newActiveMoles = new Set([...currentActiveMoles, randomHole])

          // Remove mole after MOLE_APPEAR_TIME
          setTimeout(() => {
            setActiveMoles((prev) => {
              const newSet = new Set(prev)
              newSet.delete(randomHole)
              return newSet
            })
            setWhackedMoles((prev) => {
              const newSet = new Set(prev)
              newSet.delete(randomHole)
              return newSet
            })
          }, MOLE_APPEAR_TIME)

          // Schedule next mole spawn
          const nextSpawnDelay =
            MIN_SPAWN_DELAY +
            Math.random() * (MAX_SPAWN_DELAY - MIN_SPAWN_DELAY)
          moleTimerRef.current = setTimeout(() => {
            if (spawnMoleRef.current) {
              spawnMoleRef.current()
            }
          }, nextSpawnDelay)

          return newActiveMoles
        }

        // Schedule next mole spawn even if no holes available
        const nextSpawnDelay =
          MIN_SPAWN_DELAY + Math.random() * (MAX_SPAWN_DELAY - MIN_SPAWN_DELAY)
        moleTimerRef.current = setTimeout(() => {
          if (spawnMoleRef.current) {
            spawnMoleRef.current()
          }
        }, nextSpawnDelay)

        return currentActiveMoles
      })
    }
  }, [gameState])

  // Handle game finish - check high score
  const finishGame = useCallback(() => {
    setGameState('finished')
    clearAllTimers()

    // Check and update high score
    setHighScore((currentHighScore) => {
      setScore((currentScore) => {
        if (currentScore > currentHighScore) {
          showToast('🎉 New High Score!')
          return currentScore
        }
        return currentScore
      })
      return currentHighScore > score ? currentHighScore : score
    })
  }, [clearAllTimers, showToast, score])

  // Start game
  const handleStartGame = useCallback(() => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(GAME_DURATION / 1000)
    setActiveMoles(new Set())
    setWhackedMoles(new Set())
    setCombo(0)
    setMaxCombo(0)
    clearAllTimers()

    // Start game timer
    const startTime = Date.now()
    gameTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, GAME_DURATION - elapsed)
      setTimeLeft(Math.ceil(remaining / 1000))

      if (remaining <= 0) {
        finishGame()
      }
    }, 100)

    // Start spawning moles
    setTimeout(() => {
      if (spawnMoleRef.current) {
        spawnMoleRef.current()
      }
    }, 500)
  }, [clearAllTimers, finishGame])

  // Whack a mole
  const handleWhack = useCallback(
    (holeIndex) => {
      if (gameState !== 'playing') return
      if (!activeMoles.has(holeIndex)) return
      if (whackedMoles.has(holeIndex)) return

      // Mark as whacked
      setWhackedMoles((prev) => new Set([...prev, holeIndex]))

      // Update score
      const comboBonus = Math.floor(combo / 3)
      const points = 10 + comboBonus * 5
      setScore((prev) => prev + points)

      // Update combo
      setCombo((prev) => {
        const newCombo = prev + 1
        setMaxCombo((max) => Math.max(max, newCombo))
        return newCombo
      })

      // Show combo toast for streaks
      if (combo > 0 && combo % 5 === 4) {
        showToast(`🔥 ${combo + 1} Combo!`)
      }

      // Reset combo timer
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current)
      comboTimerRef.current = setTimeout(() => {
        setCombo(0)
      }, 1500)
    },
    [gameState, activeMoles, whackedMoles, combo, showToast]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers()
  }, [clearAllTimers])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Title */}
      <div className="text-center">
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          Whack-a-Mole
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--label-tertiary)',
            marginTop: '0.5rem',
          }}
        >
          Click the moles before they disappear!
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 w-full justify-center flex-wrap">
        <div
          className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
            }}
          >
            Score
          </span>
        </div>

        {gameState === 'playing' && (
          <>
            <div
              className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
              style={{ background: 'var(--fill-tertiary)' }}
            >
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: timeLeft <= 5 ? '#ff3b30' : '#ff9f0a',
                }}
              >
                {timeLeft}s
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--label-tertiary)',
                }}
              >
                Time
              </span>
            </div>

            {combo > 0 && (
              <div
                className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl spring-pop"
                style={{ background: 'var(--fill-tertiary)' }}
              >
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#ff6b6b',
                  }}
                >
                  {combo}x
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--label-tertiary)',
                  }}
                >
                  Combo
                </span>
              </div>
            )}
          </>
        )}

        {highScore > 0 && (
          <div
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
            style={{ background: 'var(--fill-tertiary)' }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#34c759',
              }}
            >
              {highScore}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
              }}
            >
              High Score
            </span>
          </div>
        )}
      </div>

      {/* Game Area */}
      {gameState === 'idle' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div
            className="text-center p-6 rounded-2xl"
            style={{ background: 'var(--fill-secondary)' }}
          >
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--label-secondary)',
                lineHeight: '1.6',
              }}
            >
              Click the moles as they pop up to score points!
              <br />
              Build combos for bonus points.
              <br />
              You have 30 seconds — good luck! 🎯
            </p>
          </div>

          <button onClick={handleStartGame} className="btn-primary px-8 py-4">
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full">
          {/* Game Grid */}
          <div
            className="grid gap-3 mx-auto"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              maxWidth: '400px',
            }}
          >
            {Array.from({ length: GRID_SIZE }).map((_, index) => {
              const isActive = activeMoles.has(index)
              const isWhacked = whackedMoles.has(index)

              return (
                <button
                  key={index}
                  onClick={() => handleWhack(index)}
                  className="hole-button"
                  style={{
                    aspectRatio: '1',
                    borderRadius: '1rem',
                    background: 'var(--fill-secondary)',
                    border: '3px solid var(--fill-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    cursor: isActive && !isWhacked ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isActive && !isWhacked && (
                    <span className="mole-pop" style={{ fontSize: '3rem' }}>
                      🦫
                    </span>
                  )}
                  {isWhacked && (
                    <span className="mole-whacked" style={{ fontSize: '2rem' }}>
                      💫
                    </span>
                  )}
                  {!isActive && !isWhacked && (
                    <span style={{ fontSize: '2rem', opacity: 0.3 }}>🕳️</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Results */}
          <div
            className="w-full p-6 rounded-2xl text-center"
            style={{
              background: 'var(--fill-secondary)',
              border: '2px solid var(--accent)',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--label-primary)',
                marginBottom: '1rem',
              }}
            >
              Game Over!
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--label-tertiary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Final Score
                </p>
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#ff6b6b',
                  }}
                >
                  {score}
                </p>
              </div>

              {maxCombo > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--label-tertiary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Max Combo
                  </p>
                  <p
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--label-secondary)',
                    }}
                  >
                    {maxCombo}x
                  </p>
                </div>
              )}

              {score === highScore && score > 0 && (
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#34c759',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                  }}
                >
                  🎉 New High Score!
                </p>
              )}
            </div>
          </div>

          {/* Play Again Button */}
          <button onClick={handleStartGame} className="btn-primary px-8 py-4">
            Play Again
          </button>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes mole-pop {
            0% {
              transform: translateY(100%) scale(0.5);
              opacity: 0;
            }
            50% {
              transform: translateY(-10%) scale(1.1);
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }

          @keyframes mole-whack {
            0% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: scale(1.3) rotate(180deg);
              opacity: 0.8;
            }
            100% {
              transform: scale(0.5) rotate(360deg);
              opacity: 0;
            }
          }

          .mole-pop {
            animation: mole-pop 0.2s ease-out;
          }

          .mole-whacked {
            animation: mole-whack 0.3s ease-out;
          }

          .hole-button:hover {
            transform: scale(1.05);
          }

          .hole-button:active {
            transform: scale(0.95);
          }

          .spring-pop {
            animation: spring-pop 0.3s ease-out;
          }

          @keyframes spring-pop {
            0% {
              transform: scale(0.8);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}
