import { useState, useEffect, useCallback } from 'react'
import Toast from '../Toast'

// Quiz questions data
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct: 2,
    category: 'Geography',
  },
  {
    id: 2,
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
    category: 'Science',
  },
  {
    id: 3,
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Jane Austen', 'William Shakespeare', 'Mark Twain', 'Charles Dickens'],
    correct: 1,
    category: 'Literature',
  },
  {
    id: 4,
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correct: 3,
    category: 'Geography',
  },
  {
    id: 5,
    question: 'In what year did the Titanic sink?',
    options: ['1912', '1915', '1920', '1905'],
    correct: 0,
    category: 'History',
  },
  {
    id: 6,
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
    category: 'Science',
  },
  {
    id: 7,
    question: 'Which country is home to the kangaroo?',
    options: ['New Zealand', 'Australia', 'South Africa', 'Brazil'],
    correct: 1,
    category: 'Geography',
  },
  {
    id: 8,
    question: 'What is the smallest prime number?',
    options: ['0', '1', '2', '3'],
    correct: 2,
    category: 'Math',
  },
  {
    id: 9,
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
    correct: 1,
    category: 'Art',
  },
  {
    id: 10,
    question: 'What is the speed of light?',
    options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'],
    correct: 0,
    category: 'Science',
  },
]

function QuestionCard({ question, onAnswerSelect, answered, selectedAnswer, disabled }) {
  return (
    <div
      className="w-full max-w-2xl mx-auto p-6 rounded-2xl"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }}
    >
      {/* Category badge */}
      <div className="mb-4 inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--fill-tertiary)', color: 'var(--label-secondary)' }}>
        {question.category}
      </div>

      {/* Question */}
      <h3
        className="text-xl sm:text-2xl font-bold mb-6"
        style={{ color: 'var(--label-primary)' }}
      >
        {question.question}
      </h3>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === question.correct
          const showCorrect = answered && isCorrect
          const showIncorrect = answered && isSelected && !isCorrect

          let bgColor = 'var(--fill-tertiary)'
          let textColor = 'var(--label-primary)'
          let borderColor = 'transparent'

          if (showCorrect) {
            bgColor = 'rgba(52, 199, 89, 0.15)'
            borderColor = '#34c759'
            textColor = '#34c759'
          } else if (showIncorrect) {
            bgColor = 'rgba(255, 59, 48, 0.15)'
            borderColor = '#ff3b30'
            textColor = '#ff3b30'
          } else if (isSelected && !answered) {
            bgColor = 'var(--accent)'
            textColor = '#fff'
          }

          return (
            <button
              key={index}
              onClick={() => !answered && onAnswerSelect(index)}
              disabled={disabled || answered}
              className="p-4 rounded-lg text-left font-medium transition-all"
              style={{
                background: bgColor,
                color: textColor,
                border: `2px solid ${borderColor}`,
                cursor: answered || disabled ? 'default' : 'pointer',
                opacity: answered && !isSelected && !isCorrect ? 0.5 : 1,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: showCorrect ? '#34c759' : showIncorrect ? '#ff3b30' : 'currentColor',
                    color: showCorrect || showIncorrect ? '#fff' : 'var(--bg-surface)',
                    opacity: showCorrect || showIncorrect ? 1 : 0.3,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--label-secondary)' }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--label-secondary)' }}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--fill-tertiary)' }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #0a84ff, #30d158)',
          }}
        />
      </div>
    </div>
  )
}

function ResultsScreen({ score, total, onPlayAgain }) {
  const percentage = Math.round((score / total) * 100)
  let rating = { emoji: '🎉', label: 'Great job!', color: '#34c759' }

  if (percentage === 100) {
    rating = { emoji: '🏆', label: 'Perfect Score!', color: '#FFD700' }
  } else if (percentage >= 80) {
    rating = { emoji: '⭐', label: 'Excellent!', color: '#0a84ff' }
  } else if (percentage >= 60) {
    rating = { emoji: '👍', label: 'Good job!', color: '#30d158' }
  } else if (percentage >= 40) {
    rating = { emoji: '💪', label: 'Keep trying!', color: '#ff9f0a' }
  } else {
    rating = { emoji: '📚', label: 'Study more!', color: '#ff3b30' }
  }

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: `linear-gradient(145deg, ${rating.color}, ${rating.color}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: `0 8px 24px ${rating.color}40`,
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
          You got {score} out of {total} correct
        </p>
      </div>

      {/* Score display */}
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-0.5">
          <span
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: rating.color,
            }}
          >
            {percentage}%
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
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Try Again
      </button>
    </div>
  )
}

export default function QuizMasterBoard() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'finished'
  const [toast, setToast] = useState(null)
  const [questions, setQuestions] = useState([])

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
  }, [])

  const showToast = useCallback((msg) => setToast(msg), [])

  const handleAnswerSelect = (index) => {
    if (answered) return

    setSelectedAnswer(index)
    setAnswered(true)

    const question = questions[currentQuestion]
    if (index === question.correct) {
      setScore((s) => s + 1)
      showToast('Correct! ✅')
    } else {
      showToast('Incorrect! ❌')
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setGameState('finished')
    }
  }

  const handlePlayAgain = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setGameState('playing')
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p style={{ color: 'var(--label-secondary)' }}>Loading quiz...</p>
      </div>
    )
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-12">
        <ResultsScreen
          score={score}
          total={questions.length}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-12">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <ProgressBar current={currentQuestion + 1} total={questions.length} />

      <QuestionCard
        question={question}
        onAnswerSelect={handleAnswerSelect}
        answered={answered}
        selectedAnswer={selectedAnswer}
        disabled={false}
      />

      {answered && (
        <button onClick={handleNextQuestion} className="btn-primary">
          {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
        </button>
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
        {answered
          ? currentQuestion === questions.length - 1
            ? 'This is the last question!'
            : 'Click next to continue'
          : 'Select an answer to continue'}
      </p>
    </div>
  )
}
