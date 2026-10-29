import WordleBoard from './components/wordle/WordleBoard'
import NumberCrunchBoard from './components/numbercrunch/NumberCrunchBoard'
import CrosswordBoard from './components/crossword/CrosswordBoard'
import WordChainBoard from './components/wordchain/WordChainBoard'
import ScrambleBoard from './components/scramble/ScrambleBoard'
import AnagramBoard from './components/anagram/AnagramBoard'
import BreakoutBoard from './components/breakout/BreakoutBoard'
import TriviaBoard from './components/trivia/TriviaBoard'
import MemoryBoard from './components/memory/MemoryBoard'
import CardMatchBoard from './components/cardmatch/CardMatchBoard'
import FlipFlopBoard from './components/flipflop/FlipFlopBoard'
import TypeRaceBoard from './components/typerace/TypeRaceBoard'
import WordSearchBoard from './components/wordsearch/WordSearchBoard'
import MathQuizBoard from './components/mathquiz/MathQuizBoard'
import HangmanBoard from './components/hangman/HangmanBoard'
import SnakeBoard from './components/snake/SnakeBoard'
import SpellingBeeBoard from './components/spellingbee/SpellingBeeBoard'
import Game2048Board from './components/game2048/Game2048Board'
import DiceRollerBoard from './components/diceroller/DiceRollerBoard'
import FlappyBirdBoard from './components/flappybird/FlappyBirdBoard'
import QuizMasterBoard from './components/quizmaster/QuizMasterBoard'
import TicTacToeBoard from './components/tictactoe/TicTacToeBoard'
import RouletteBoard from './components/roulette/RouletteBoard'
import PongBoard from './components/pong/PongBoard'
import SimonSaysBoard from './components/simonsays/SimonSaysBoard'
import NumberNinjaBoard from './components/numberninja/NumberNinjaBoard'
import UnoBoard from './components/uno/UnoBoard'
import MastermindBoard from './components/mastermind/MastermindBoard'
import RockPaperScissorsBoard from './components/rockpaperscissors/RockPaperScissorsBoard'
import ColorMatchBoard from './components/colormatch/ColorMatchBoard'
import GuessTheNumberBoard from './components/guessthenumber/GuessTheNumberBoard'
import MinesweeperBoard from './components/minesweeper/MinesweeperBoard'
import BlackjackBoard from './components/blackjack/BlackjackBoard'
import MorseCodeBoard from './components/morsecode/MorseCodeBoard'
import LightsOutBoard from './components/lightsout/LightsOutBoard'
import ReactionTimeBoard from './components/reactiontime/ReactionTimeBoard'
import ConnectFourBoard from './components/connectfour/ConnectFourBoard'
import ColorFloodBoard from './components/colorflood/ColorFloodBoard'
import TypingSpeedBoard from './components/typingspeed/TypingSpeedBoard'
import CoinFlipBoard from './components/coinflip/CoinFlipBoard'
import BubblePopBoard from './components/bubblepop/BubblePopBoard'
import WhackAMoleBoard from './components/whackamole/WhackAMoleBoard'
import PatternMatchBoard from './components/patternmatch/PatternMatchBoard'
import PictureMatchBoard from './components/picturematch/PictureMatchBoard'
import ColorMixerBoard from './components/colormixer/ColorMixerBoard'
import SlidePuzzleBoard from './components/slidepuzzle/SlidePuzzleBoard'
import HanoiBoard from './components/hanoi/HanoiBoard'
import BattleshipBoard from './components/battleship/BattleshipBoard'
import HigherLowerBoard from './components/higherlower/HigherLowerBoard'
import SudokuBoard from './components/sudoku/SudokuBoard'

// Maps a game id to its board component. Unknown ids fall back to Sudoku.
export const GAME_COMPONENTS = {
  wordle: WordleBoard,
  crunch: NumberCrunchBoard,
  cross: CrosswordBoard,
  chain: WordChainBoard,
  scramble: ScrambleBoard,
  anagram: AnagramBoard,
  breakout: BreakoutBoard,
  trivia: TriviaBoard,
  memory: MemoryBoard,
  cardmatch: CardMatchBoard,
  flipflop: FlipFlopBoard,
  typerace: TypeRaceBoard,
  wordsearch: WordSearchBoard,
  mathquiz: MathQuizBoard,
  hangman: HangmanBoard,
  snake: SnakeBoard,
  spellingbee: SpellingBeeBoard,
  2048: Game2048Board,
  diceroller: DiceRollerBoard,
  flappybird: FlappyBirdBoard,
  quizmaster: QuizMasterBoard,
  tictactoe: TicTacToeBoard,
  roulette: RouletteBoard,
  pong: PongBoard,
  simonsays: SimonSaysBoard,
  numberninja: NumberNinjaBoard,
  uno: UnoBoard,
  mastermind: MastermindBoard,
  rockpaperscissors: RockPaperScissorsBoard,
  colormatch: ColorMatchBoard,
  guessthenumber: GuessTheNumberBoard,
  minesweeper: MinesweeperBoard,
  blackjack: BlackjackBoard,
  morsecode: MorseCodeBoard,
  lightsout: LightsOutBoard,
  reactiontime: ReactionTimeBoard,
  connectfour: ConnectFourBoard,
  colorflood: ColorFloodBoard,
  typingspeed: TypingSpeedBoard,
  coinflip: CoinFlipBoard,
  bubblepop: BubblePopBoard,
  whackamole: WhackAMoleBoard,
  patternmatch: PatternMatchBoard,
  picturematch: PictureMatchBoard,
  colormixer: ColorMixerBoard,
  slidepuzzle: SlidePuzzleBoard,
  hanoi: HanoiBoard,
  battleship: BattleshipBoard,
  higherlower: HigherLowerBoard,
  sudoku: SudokuBoard,
}

// Optional per-game props, derived from App-level state/handlers.
export const GAME_PROPS = {
  snake: ({ dark }) => ({ dark }),
  tictactoe: ({ onGoHome }) => ({ onGoHome }),
}

export const DEFAULT_GAME_COMPONENT = SudokuBoard
