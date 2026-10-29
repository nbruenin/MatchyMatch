import { useState } from 'react'
import Header from './components/Header'
import { useDarkMode } from './hooks/useDarkMode'
import Footer from './components/Footer'
import GamePicker from './components/GamePicker'
import GameBoard from './components/GameBoard'
import {
  GAME_COMPONENTS,
  GAME_PROPS,
  DEFAULT_GAME_COMPONENT,
} from './gameComponents'
import { puzzles } from './data/puzzles'

const envIndex = parseInt(import.meta.env.VITE_PUZZLE_INDEX, 10)
const PUZZLE_INDEX =
  Number.isFinite(envIndex) && envIndex >= 0 && envIndex < puzzles.length
    ? envIndex
    : 0

function App() {
  // null = home / game picker screen
  const [activeGame, setActiveGame] = useState(null)
  const [gameKey, setGameKey] = useState(0)
  const { dark, toggle: toggleDark } = useDarkMode()

  const handleNewGame = () => {
    setGameKey((k) => k + 1)
  }

  const handleGameSelect = (game) => {
    setActiveGame(game)
    setGameKey((k) => k + 1)
  }

  const handleGoHome = () => {
    setActiveGame(null)
  }

  const ActiveBoard = GAME_COMPONENTS[activeGame] ?? DEFAULT_GAME_COMPONENT

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activeGame={activeGame}
        onGameChange={handleGameSelect}
        onGoHome={handleGoHome}
        dark={dark}
        onToggleDark={toggleDark}
      />
      <main className="flex-1 flex flex-col items-center pt-6 pb-10 px-4 sm:px-6">
        {!activeGame ? (
          <GamePicker onGameSelect={handleGameSelect} />
        ) : activeGame === 'matchy' ? (
          <GameBoard
            key={`matchy-${gameKey}`}
            puzzle={puzzles[PUZZLE_INDEX]}
            onNewGame={handleNewGame}
          />
        ) : (
          <ActiveBoard
            key={`${activeGame}-${gameKey}`}
            {...(GAME_PROPS[activeGame]?.({ dark, onGoHome: handleGoHome }) ??
              {})}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
