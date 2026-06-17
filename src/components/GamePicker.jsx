const GAMES = [
  {
    id: 'matchy',
    emoji: '🟪',
    name: 'Matchy Match',
    description: 'Group 20 words into 5 hidden categories',
    color: '#5e5ce6',
  },
  {
    id: 'wordle',
    emoji: '🟩',
    name: 'Wordle',
    description: 'Guess the 5-letter word in 6 tries',
    color: '#34c759',
  },
  {
    id: 'crunch',
    emoji: '🔢',
    name: 'Number Crunch',
    description: 'Hit the target using 6 numbers & operators',
    color: '#ff9f0a',
  },
  {
    id: 'cross',
    emoji: '✏️',
    name: 'Crossword',
    description: 'Fill in the classic crossword grid',
    color: '#007aff',
  },
  {
    id: 'chain',
    emoji: '🔗',
    name: 'Word Chain',
    description: 'Link words one letter change at a time',
    color: '#30d158',
  },
  {
    id: 'scramble',
    emoji: '🔀',
    name: 'Scramble',
    description: 'Unscramble the jumbled letters',
    color: '#ff6b6b',
  },
  {
    id: 'anagram',
    emoji: '🔤',
    name: 'Anagram',
    description: 'Rearrange letters to find the hidden word',
    color: '#bf5af2',
  },
  {
    id: 'sudoku',
    emoji: '🔲',
    name: 'Sudoku',
    description: 'Fill the 9×9 grid with digits 1–9',
    color: '#636366',
  },
  {
    id: 'trivia',
    emoji: '🧠',
    name: 'Trivia',
    description: 'Test your knowledge across many topics',
    color: '#ff9f0a',
  },
  {
    id: 'memory',
    emoji: '🃏',
    name: 'Memory',
    description: 'Flip cards and find every matching pair',
    color: '#0a84ff',
  },
  {
    id: 'flipflop',
    emoji: '🎯',
    name: 'Flip Flop',
    description: 'Match fruit pairs with perfect accuracy',
    color: '#ff6b6b',
  },
  {
    id: 'typerace',
    emoji: '⌨️',
    name: 'Type Race',
    description: 'Type the passage as fast as you can',
    color: '#30d158',
  },
  {
    id: 'wordsearch',
    emoji: '🔍',
    name: 'Word Search',
    description: 'Hunt for hidden words in the grid',
    color: '#5e5ce6',
  },
  {
    id: 'mathquiz',
    emoji: '➕',
    name: 'Math Quiz',
    description: 'Solve rapid-fire arithmetic questions',
    color: '#ff6b6b',
  },
  {
    id: 'hangman',
    emoji: '🪢',
    name: 'Hangman',
    description: 'Guess the word before the drawing is done',
    color: '#636366',
  },
  {
    id: 'snake',
    emoji: '🐍',
    name: 'Snake',
    description: "Eat, grow, and don't hit the walls",
    color: '#30d158',
  },
  {
    id: 'spellingbee',
    emoji: '🐝',
    name: 'Spelling Bee',
    description: 'Make words from 7 letters — use the centre one',
    color: '#ff9f0a',
  },
  {
    id: '2048',
    emoji: '🟧',
    name: '2048',
    description: 'Slide & merge tiles to reach the 2048 tile',
    color: '#f65e3b',
  },
  {
    id: 'diceroller',
    emoji: '🎲',
    name: 'Dice Roller',
    description: 'Roll the dice 10 times and test your luck',
    color: '#ff3b30',
  },
  {
    id: 'flappybird',
    emoji: '🐦',
    name: 'Flappy Bird',
    description: 'Navigate the bird through the pipes',
    color: '#FFD700',
  },
  {
    id: 'quizmaster',
    emoji: '🎓',
    name: 'Quiz Master',
    description: 'Answer trivia questions and test your knowledge',
    color: '#5ac8fa',
  },
  {
    id: 'tictactoe',
    emoji: '⭕',
    name: 'Tic Tac Toe',
    description: 'Get three in a row to win',
    color: '#ff3b30',
  },
  {
    id: 'roulette',
    emoji: '🎡',
    name: 'Roulette',
    description: 'Spin the wheel and test your luck',
    color: '#FF1493',
  },
  {
    id: 'pong',
    emoji: '🏓',
    name: 'Pong',
    description: 'Classic arcade game — beat the AI',
    color: '#00D9FF',
  },
  {
    id: 'simonsays',
    emoji: '🎮',
    name: 'Simon Says',
    description: 'Repeat the color sequence and test your memory',
    color: '#5AC8FA',
  },
  {
    id: 'numberninja',
    emoji: '🥷',
    name: 'Number Ninja',
    description: 'Find the target number before time runs out',
    color: '#FF6B6B',
  },
  {
    id: 'uno',
    emoji: '🎴',
    name: 'Uno',
    description: 'Play the classic card game against AI',
    color: '#FF6B35',
  },
  {
    id: 'mastermind',
    emoji: '🧩',
    name: 'Mastermind',
    description: 'Crack the secret code in 10 attempts',
    color: '#A855F7',
  },
  {
    id: 'rockpaperscissors',
    emoji: '✊',
    name: 'Rock Paper Scissors',
    description: 'Beat the AI in this classic hand game',
    color: '#FF6B9D',
  },
  {
    id: 'colormatch',
    emoji: '🎨',
    name: 'Color Match',
    description: 'Find matching colors and test your memory',
    color: '#FF6B6B',
  },
  {
    id: 'guessthenumber',
    emoji: '🎯',
    name: 'Guess the Number',
    description: 'Guess the secret number with hints',
    color: '#FF6B35',
  },
]

export default function GamePicker({ onGameSelect }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <p
          className="text-sm font-medium tracking-wide uppercase mb-2"
          style={{ color: 'var(--label-tertiary)' }}
        >
          Pick a game
        </p>
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: 'var(--label-primary)' }}
        >
          What are we playing?
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => onGameSelect(game.id)}
            className="game-card group text-left"
            style={{ '--card-accent': game.color }}
          >
            {/* Emoji badge */}
            <span className="game-card__emoji">{game.emoji}</span>

            {/* Text */}
            <span className="game-card__name">{game.name}</span>
            <span className="game-card__desc">{game.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
