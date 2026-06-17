import { useState, useCallback } from 'react'
import Toast from '../Toast'

// ── Deck helpers ──────────────────────────────────────────────────────────────

const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function buildDeck() {
  const deck = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank })
    }
  }
  return deck
}

function shuffle(deck) {
  const d = [...deck]
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[d[i], d[j]] = [d[j], d[i]]
  }
  return d
}

function cardValue(rank) {
  if (['J', 'Q', 'K'].includes(rank)) return 10
  if (rank === 'A') return 11
  return parseInt(rank, 10)
}

export function handTotal(hand) {
  let total = 0
  let aces = 0
  for (const card of hand) {
    total += cardValue(card.rank)
    if (card.rank === 'A') aces++
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  return total
}

function isBust(hand) {
  return handTotal(hand) > 21
}

function isBlackjack(hand) {
  return hand.length === 2 && handTotal(hand) === 21
}

// ── Card component ────────────────────────────────────────────────────────────

function PlayingCard({ card, faceDown = false }) {
  const isRed = card.suit === '♥' || card.suit === '♦'

  if (faceDown) {
    return (
      <div
        aria-label="Face-down card"
        style={{
          width: 60,
          height: 88,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #1a3a6b 25%, #2563eb 100%)',
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0,
        }}
      >
        🂠
      </div>
    )
  }

  return (
    <div
      aria-label={`${card.rank} of ${card.suit}`}
      style={{
        width: 60,
        height: 88,
        borderRadius: 10,
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--separator)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '5px 7px',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      <div
        style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          lineHeight: 1,
          color: isRed ? '#e53e3e' : 'var(--label-primary)',
        }}
      >
        {card.rank}
        <br />
        {card.suit}
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          lineHeight: 1,
          color: isRed ? '#e53e3e' : 'var(--label-primary)',
          transform: 'rotate(180deg)',
          alignSelf: 'flex-end',
        }}
      >
        {card.rank}
        <br />
        {card.suit}
      </div>
    </div>
  )
}

// ── Hand display ──────────────────────────────────────────────────────────────

function HandDisplay({ label, hand, hideSecond = false, total }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--label-tertiary)',
          }}
        >
          {label}
        </span>
        {!hideSecond && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 10px',
              borderRadius: 999,
              background: 'var(--fill-secondary)',
              color: 'var(--label-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            {total}
          </span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {hand.map((card, i) => (
          <PlayingCard
            key={i}
            card={card}
            faceDown={hideSecond && i === 1}
          />
        ))}
      </div>
    </div>
  )
}

// ── Chip selector ─────────────────────────────────────────────────────────────

const CHIP_VALUES = [5, 10, 25, 50, 100]

function ChipSelector({ balance, currentBet, onAddChip, onClearBet }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p
        style={{
          fontSize: '0.78rem',
          color: 'var(--label-tertiary)',
          letterSpacing: '-0.01em',
        }}
      >
        Current bet:{' '}
        <strong style={{ color: 'var(--label-primary)' }}>${currentBet}</strong>
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {CHIP_VALUES.map((val) => (
          <button
            key={val}
            onClick={() => onAddChip(val)}
            disabled={balance < val || currentBet + val > balance}
            aria-label={`Add $${val} chip`}
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: '3px solid',
              borderColor:
                val === 5
                  ? '#e53e3e'
                  : val === 10
                    ? '#3182ce'
                    : val === 25
                      ? '#38a169'
                      : val === 50
                        ? '#d69e2e'
                        : '#805ad5',
              background: 'var(--bg-surface)',
              color: 'var(--label-primary)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'transform 0.12s ease, opacity 0.15s',
              opacity:
                balance < val || currentBet + val > balance ? 0.35 : 1,
            }}
          >
            ${val}
          </button>
        ))}
      </div>
      {currentBet > 0 && (
        <button
          onClick={onClearBet}
          className="btn-ghost"
          style={{ fontSize: '0.8rem' }}
        >
          Clear Bet
        </button>
      )}
    </div>
  )
}

// ── Result banner ─────────────────────────────────────────────────────────────

function ResultBanner({ result, playerTotal, dealerTotal, payout }) {
  const configs = {
    blackjack: {
      emoji: '🃏',
      title: 'Blackjack!',
      subtitle: 'You hit 21 with two cards — paid 3:2',
      bg: 'linear-gradient(145deg, #d69e2e, #f6ad55)',
      shadow: 'rgba(214,158,46,0.4)',
    },
    win: {
      emoji: '🎉',
      title: 'You Win!',
      subtitle: `Your ${playerTotal} beat the dealer's ${dealerTotal}`,
      bg: 'linear-gradient(145deg, #38a169, #48bb78)',
      shadow: 'rgba(56,161,105,0.4)',
    },
    lose: {
      emoji: '😞',
      title: 'Dealer Wins',
      subtitle:
        playerTotal > 21
          ? `You busted with ${playerTotal}`
          : `Dealer's ${dealerTotal} beat your ${playerTotal}`,
      bg: 'linear-gradient(145deg, #e53e3e, #fc8181)',
      shadow: 'rgba(229,62,62,0.4)',
    },
    push: {
      emoji: '🤝',
      title: 'Push',
      subtitle: `Both you and the dealer have ${playerTotal}`,
      bg: 'linear-gradient(145deg, #718096, #a0aec0)',
      shadow: 'rgba(113,128,150,0.4)',
    },
    bust: {
      emoji: '💥',
      title: 'Bust!',
      subtitle: `You went over 21 with ${playerTotal}`,
      bg: 'linear-gradient(145deg, #e53e3e, #fc8181)',
      shadow: 'rgba(229,62,62,0.4)',
    },
    dealer_bust: {
      emoji: '🎊',
      title: 'Dealer Busts!',
      subtitle: 'Dealer went over 21 — you win!',
      bg: 'linear-gradient(145deg, #38a169, #48bb78)',
      shadow: 'rgba(56,161,105,0.4)',
    },
  }

  const cfg = configs[result] ?? configs.push

  return (
    <div
      className="spring-pop flex flex-col items-center gap-2 px-6 py-4 rounded-2xl w-full"
      style={{
        background: cfg.bg,
        boxShadow: `0 8px 24px ${cfg.shadow}`,
      }}
    >
      <span style={{ fontSize: '2rem' }}>{cfg.emoji}</span>
      <p
        style={{
          fontSize: '1.3rem',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.02em',
        }}
      >
        {cfg.title}
      </p>
      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>
        {cfg.subtitle}
      </p>
      {payout !== 0 && (
        <p
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fff',
            marginTop: 2,
          }}
        >
          {payout > 0 ? `+$${payout}` : `-$${Math.abs(payout)}`}
        </p>
      )}
    </div>
  )
}

// ── Main board ────────────────────────────────────────────────────────────────

export default function BlackjackBoard() {
  const [deck, setDeck] = useState(() => shuffle(buildDeck()))
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [balance, setBalance] = useState(500)
  const [bet, setBet] = useState(0)
  const [phase, setPhase] = useState('betting') // 'betting' | 'playing' | 'result'
  const [result, setResult] = useState(null)
  const [payout, setPayout] = useState(0)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => setToast(msg), [])

  // ── Deal ──────────────────────────────────────────────────────────
  const handleDeal = useCallback(() => {
    if (bet === 0) {
      showToast('Place a bet first!')
      return
    }

    let d = deck.length < 15 ? shuffle(buildDeck()) : [...deck]

    const p = [d.pop(), d.pop()]
    const dealer = [d.pop(), d.pop()]

    setDeck(d)
    setPlayerHand(p)
    setDealerHand(dealer)

    // Check for immediate blackjack
    if (isBlackjack(p)) {
      const dealerBJ = isBlackjack(dealer)
      if (dealerBJ) {
        setResult('push')
        setPayout(0)
      } else {
        const winnings = Math.floor(bet * 1.5)
        setResult('blackjack')
        setPayout(winnings)
        setBalance((b) => b + winnings)
      }
      setPhase('result')
    } else {
      setPhase('playing')
    }
  }, [bet, deck, showToast])

  // ── Hit ───────────────────────────────────────────────────────────
  const handleHit = useCallback(() => {
    let d = [...deck]
    const newCard = d.pop()
    const newHand = [...playerHand, newCard]
    setDeck(d)
    setPlayerHand(newHand)

    if (isBust(newHand)) {
      setBalance((b) => b - bet)
      setResult('bust')
      setPayout(-bet)
      setPhase('result')
    }
  }, [deck, playerHand, bet])

  // ── Stand (dealer plays) ──────────────────────────────────────────
  const handleStand = useCallback(() => {
    let d = [...deck]
    let dHand = [...dealerHand]

    while (handTotal(dHand) < 17) {
      dHand.push(d.pop())
    }

    setDeck(d)
    setDealerHand(dHand)

    const playerTotal = handTotal(playerHand)
    const dealerTotal = handTotal(dHand)

    let res, pay
    if (isBust(dHand)) {
      res = 'dealer_bust'
      pay = bet
      setBalance((b) => b + bet)
    } else if (playerTotal > dealerTotal) {
      res = 'win'
      pay = bet
      setBalance((b) => b + bet)
    } else if (dealerTotal > playerTotal) {
      res = 'lose'
      pay = -bet
      setBalance((b) => b - bet)
    } else {
      res = 'push'
      pay = 0
    }

    setResult(res)
    setPayout(pay)
    setPhase('result')
  }, [deck, dealerHand, playerHand, bet])

  // ── Double Down ───────────────────────────────────────────────────
  const handleDouble = useCallback(() => {
    if (balance < bet) {
      showToast("Not enough chips to double!")
      return
    }
    const doubleBet = bet * 2
    setBet(doubleBet)

    let d = [...deck]
    const newCard = d.pop()
    const newHand = [...playerHand, newCard]
    setDeck(d)
    setPlayerHand(newHand)

    if (isBust(newHand)) {
      setBalance((b) => b - doubleBet)
      setResult('bust')
      setPayout(-doubleBet)
      setPhase('result')
      return
    }

    let dHand = [...dealerHand]
    while (handTotal(dHand) < 17) {
      dHand.push(d.pop())
    }
    setDeck(d)
    setDealerHand(dHand)

    const playerTotal = handTotal(newHand)
    const dealerTotal = handTotal(dHand)

    let res, pay
    if (isBust(dHand)) {
      res = 'dealer_bust'
      pay = doubleBet
      setBalance((b) => b + doubleBet)
    } else if (playerTotal > dealerTotal) {
      res = 'win'
      pay = doubleBet
      setBalance((b) => b + doubleBet)
    } else if (dealerTotal > playerTotal) {
      res = 'lose'
      pay = -doubleBet
      setBalance((b) => b - doubleBet)
    } else {
      res = 'push'
      pay = 0
    }

    setResult(res)
    setPayout(pay)
    setPhase('result')
  }, [balance, bet, deck, playerHand, dealerHand, showToast])

  // ── New round ─────────────────────────────────────────────────────
  const handleNewRound = useCallback(() => {
    setPlayerHand([])
    setDealerHand([])
    setBet(0)
    setResult(null)
    setPayout(0)
    setPhase('betting')
  }, [])

  // ── Full reset (broke) ────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setDeck(shuffle(buildDeck()))
    setPlayerHand([])
    setDealerHand([])
    setBalance(500)
    setBet(0)
    setResult(null)
    setPayout(0)
    setPhase('betting')
  }, [])

  const playerTotal = handTotal(playerHand)
  const dealerTotal = handTotal(dealerHand)
  const canDouble =
    phase === 'playing' && playerHand.length === 2 && balance >= bet

  // ── Bust-out screen ───────────────────────────────────────────────
  if (balance <= 0 && phase === 'result') {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto px-4 pt-6 pb-12">
        <div
          className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(145deg, #e53e3e, #fc8181)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              boxShadow: '0 8px 24px rgba(229,62,62,0.35)',
            }}
          >
            💸
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--label-primary)',
              }}
            >
              Broke!
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--label-tertiary)' }}>
              You've run out of chips.
            </p>
          </div>
          <button onClick={handleReset} className="btn-primary">
            Start Over ($500)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-4 pt-4 pb-12"
      aria-label="Blackjack game"
    >
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Balance bar */}
      <div
        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl"
        style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex flex-col">
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
            }}
          >
            Balance
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--label-primary)',
            }}
          >
            ${balance}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--label-tertiary)',
            }}
          >
            Bet
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: bet > 0 ? 'var(--accent)' : 'var(--label-quaternary)',
            }}
          >
            ${bet}
          </span>
        </div>
      </div>

      {/* Dealer hand */}
      {dealerHand.length > 0 && (
        <div
          className="w-full flex flex-col items-center gap-3 rounded-3xl py-5 px-4"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }}
        >
          <HandDisplay
            label="Dealer"
            hand={dealerHand}
            hideSecond={phase === 'playing'}
            total={phase === 'playing' ? cardValue(dealerHand[0].rank) : dealerTotal}
          />
        </div>
      )}

      {/* Result banner */}
      {phase === 'result' && result && (
        <ResultBanner
          result={result}
          playerTotal={playerTotal}
          dealerTotal={dealerTotal}
          payout={payout}
        />
      )}

      {/* Player hand */}
      {playerHand.length > 0 && (
        <div
          className="w-full flex flex-col items-center gap-3 rounded-3xl py-5 px-4"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }}
        >
          <HandDisplay
            label="You"
            hand={playerHand}
            hideSecond={false}
            total={playerTotal}
          />
        </div>
      )}

      {/* Betting phase */}
      {phase === 'betting' && (
        <div
          className="w-full flex flex-col items-center gap-4 rounded-3xl py-5 px-4"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }}
        >
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--label-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Place your bet
          </p>
          <ChipSelector
            balance={balance}
            currentBet={bet}
            onAddChip={(val) => setBet((b) => Math.min(b + val, balance))}
            onClearBet={() => setBet(0)}
          />
          <button
            onClick={handleDeal}
            disabled={bet === 0}
            className="btn-primary w-full"
            style={{ opacity: bet === 0 ? 0.5 : 1 }}
          >
            Deal
          </button>
        </div>
      )}

      {/* Playing phase actions */}
      {phase === 'playing' && (
        <div className="flex gap-3 w-full">
          <button
            onClick={handleHit}
            className="btn-primary flex-1"
            aria-label="Hit"
          >
            Hit
          </button>
          <button
            onClick={handleStand}
            className="btn-outline flex-1"
            aria-label="Stand"
          >
            Stand
          </button>
          {canDouble && (
            <button
              onClick={handleDouble}
              className="btn-ghost flex-1"
              aria-label="Double Down"
            >
              Double
            </button>
          )}
        </div>
      )}

      {/* Result phase — next round */}
      {phase === 'result' && balance > 0 && (
        <button onClick={handleNewRound} className="btn-primary w-full">
          Next Round
        </button>
      )}

      {/* Rules hint */}
      {phase === 'betting' && (
        <p
          className="text-center"
          style={{
            fontSize: '0.75rem',
            color: 'var(--label-tertiary)',
            letterSpacing: '-0.01em',
            maxWidth: 280,
          }}
        >
          Get closer to 21 than the dealer without going over. Blackjack pays 3:2.
        </p>
      )}
    </div>
  )
}
