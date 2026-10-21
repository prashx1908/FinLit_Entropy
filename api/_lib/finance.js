// Rule-based financial analysis engine.
// Replaces the old TensorFlow model (model.h5 / preprocessor.pkl) with transparent,
// deterministic algorithms so the app runs as plain Vercel serverless functions.

const NEEDS_KEYS = ['rent', 'utilities', 'transportation', 'healthcare']
const WANTS_KEYS = ['groceries', 'entertainment', 'others']
const SAVINGS_KEYS = ['savings']

const CATEGORY_LABELS = {
  rent: 'Rent',
  groceries: 'Groceries',
  utilities: 'Utilities',
  transportation: 'Transportation',
  healthcare: 'Healthcare',
  entertainment: 'Entertainment',
  savings: 'Savings',
  others: 'Others',
}

function round1(n) {
  return Math.round(n * 10) / 10
}

export function analyzeExpenditure(input) {
  const categories = Object.keys(CATEGORY_LABELS)
  const amounts = {}
  for (const key of categories) {
    const v = Number(input[key])
    amounts[key] = Number.isFinite(v) && v >= 0 ? v : 0
  }

  const total = categories.reduce((sum, key) => sum + amounts[key], 0)
  const safeTotal = total > 0 ? total : 1

  const breakdown = categories.map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    amount: amounts[key],
    pct: round1((amounts[key] / safeTotal) * 100),
  }))

  const sumOf = (keys) => keys.reduce((s, k) => s + amounts[k], 0)
  const needs = sumOf(NEEDS_KEYS)
  const wants = sumOf(WANTS_KEYS)
  const savings = sumOf(SAVINGS_KEYS)

  const buckets = {
    needs: { amount: needs, pct: round1((needs / safeTotal) * 100), target: 50 },
    wants: { amount: wants, pct: round1((wants / safeTotal) * 100), target: 30 },
    savings: { amount: savings, pct: round1((savings / safeTotal) * 100), target: 20 },
  }

  for (const key of Object.keys(buckets)) {
    const b = buckets[key]
    const delta = b.pct - b.target
    if (Math.abs(delta) <= 5) b.status = 'good'
    else if (key === 'savings' ? delta < 0 : delta > 0) b.status = delta > 15 || delta < -15 ? 'critical' : 'warning'
    else b.status = 'good'
  }

  const tips = []
  if (buckets.needs.pct > 55) {
    tips.push('Essential costs (rent, utilities, transport, healthcare) are eating up more than 55% of spending — look for a cheaper plan, roommate split, or commute change.')
  }
  if (buckets.wants.pct > 35) {
    tips.push('Discretionary spending (groceries, entertainment, other) is above the recommended 30% — trim non-essential subscriptions or dining out.')
  }
  if (buckets.savings.pct < 15) {
    tips.push('Savings are below 15% of your budget. Try automating a transfer right after payday so saving happens before spending.')
  }
  if (buckets.savings.pct >= 20) {
    tips.push('Great job — savings are at or above the 20% target. Consider directing the surplus toward an emergency fund or investments.')
  }
  const topCategory = [...breakdown].sort((a, b) => b.amount - a.amount)[0]
  if (topCategory && topCategory.key !== 'savings' && topCategory.pct > 30) {
    tips.push(`${topCategory.label} is your single biggest line item at ${topCategory.pct}% of spending — double check it against your budget plan.`)
  }
  if (tips.length === 0) {
    tips.push('Your spending is well balanced across needs, wants, and savings. Keep tracking monthly to stay on target.')
  }

  const deviation = Math.abs(buckets.needs.pct - 50) + Math.abs(buckets.wants.pct - 30) + Math.abs(buckets.savings.pct - 20)
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - deviation)))

  return { total: round1(total), breakdown, buckets, tips, healthScore }
}

// --- Investment advisor -----------------------------------------------------

const DURATION_SCORE = { 'Less than 1 year': 10, '1-3 years': 35, '3-5 years': 65, 'More than 5 years': 90 }
const EXPECT_SCORE = { '10%-20%': 30, '20%-30%': 75 }

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n))
}

export function analyzeInvestment(input) {
  const age = Number(input.age) || 30
  const prefRank = (v, fallback = 4) => {
    const n = Number(v)
    return Number.isFinite(n) && n >= 1 && n <= 7 ? n : fallback
  }
  // Lower rank = more preferred in the source survey data, so invert to a 0-100 "preference strength".
  const toPreference = (rank) => ((7 - rank) / 6) * 100

  const equityPref = toPreference(prefRank(input.equity_market))
  const mfPref = toPreference(prefRank(input.mutual_funds))
  const fdPref = toPreference(prefRank(input.fixed_deposits))
  const bondPref = toPreference(prefRank(input.government_bonds))
  const debPref = toPreference(prefRank(input.debentures))
  const ppfPref = toPreference(prefRank(input.ppf))
  const goldPref = toPreference(prefRank(input.gold))

  const ageCapacity = clamp(100 - age, 5, 95) // younger -> more risk capacity
  const durationScore = DURATION_SCORE[input.duration] ?? 35
  const expectScore = EXPECT_SCORE[input.expect] ?? 40
  const factorScore = input.factor === 'Returns' ? 70 : 30
  const stockBonus = input.stock_market === 'Yes' ? 10 : 0
  const avenueBonus = input.Investment_Avenues === 'Yes' ? 5 : 0

  const riskScore = clamp(
    Math.round(
      0.20 * ageCapacity +
      0.18 * durationScore +
      0.15 * expectScore +
      0.12 * factorScore +
      0.15 * equityPref +
      0.10 * mfPref +
      0.10 * (100 - fdPref) +
      stockBonus +
      avenueBonus - 15
    ),
    0,
    100
  )

  let riskProfile
  if (riskScore < 35) riskProfile = 'Conservative'
  else if (riskScore < 65) riskProfile = 'Moderate'
  else riskProfile = 'Aggressive'

  const base =
    riskProfile === 'Conservative'
      ? { equity: 10, mutualFunds: 20, fixedIncome: 55, gold: 15 }
      : riskProfile === 'Moderate'
      ? { equity: 25, mutualFunds: 30, fixedIncome: 35, gold: 10 }
      : { equity: 45, mutualFunds: 30, fixedIncome: 15, gold: 10 }

  // Nudge the base allocation using individual preferences, then renormalize to 100.
  const equityTilt = (equityPref - 50) / 50 // -1..1
  const mfTilt = (mfPref - 50) / 50
  const goldTilt = (goldPref - 50) / 50
  const fixedIncomeTilt = ((fdPref + bondPref + debPref + ppfPref) / 4 - 50) / 50

  let equity = base.equity + equityTilt * 8
  let mutualFunds = base.mutualFunds + mfTilt * 8
  let gold = base.gold + goldTilt * 5
  let fixedIncome = base.fixedIncome + fixedIncomeTilt * 8

  equity = clamp(equity, 5, 70)
  mutualFunds = clamp(mutualFunds, 5, 50)
  gold = clamp(gold, 0, 30)
  fixedIncome = clamp(fixedIncome, 10, 70)

  const rawTotal = equity + mutualFunds + gold + fixedIncome
  const allocation = [
    { label: 'Equity / Stock Market', pct: round1((equity / rawTotal) * 100) },
    { label: 'Mutual Funds', pct: round1((mutualFunds / rawTotal) * 100) },
    { label: 'Fixed Income (FD / Bonds / PPF)', pct: round1((fixedIncome / rawTotal) * 100) },
    { label: 'Gold', pct: round1((gold / rawTotal) * 100) },
  ]
  // Fix rounding drift so percentages sum to exactly 100.
  const drift = round1(100 - allocation.reduce((s, a) => s + a.pct, 0))
  allocation[0].pct = round1(allocation[0].pct + drift)

  const purpose = input.purpose || 'your financial goals'
  const duration = input.duration || 'your investment horizon'
  const notes = []
  if (riskProfile === 'Conservative') {
    notes.push('Capital preservation is prioritized — fixed-income instruments anchor the portfolio while equity exposure stays limited.')
  } else if (riskProfile === 'Moderate') {
    notes.push('A balanced mix targets steady growth without taking on outsized market risk.')
  } else {
    notes.push('Growth is prioritized — equity and mutual funds dominate the mix, accepting higher short-term volatility for better long-term returns.')
  }
  if (goldPref > 60) notes.push('Your stated preference for gold nudged the allocation up as an inflation hedge.')
  if (input.invest_monitor === 'Daily' && riskProfile !== 'Aggressive') {
    notes.push('Monitoring daily with a lower risk profile can lead to reactive decisions — consider a weekly or monthly review cadence instead.')
  }

  const recommendation =
    `Based on your profile (age ${age}, ${duration} horizon, goal: ${purpose}), your risk score is ${riskScore}/100 — ` +
    `a ${riskProfile} investor. Suggested allocation: ${allocation.map((a) => `${a.label} ${a.pct}%`).join(', ')}.`

  return { riskScore, riskProfile, allocation, recommendation, notes }
}

// --- Literacy quiz -----------------------------------------------------------

export const QUIZ_ANSWER_KEY = {
  q1: 'b', q2: 'b', q3: 'b', q4: 'b', q5: 'b',
  q6: 'b', q7: 'b', q8: 'a', q9: 'b', q10: 'a',
}

export function scoreQuiz(answers) {
  let score = 0
  for (const [q, correct] of Object.entries(QUIZ_ANSWER_KEY)) {
    if (answers[q] === correct) score += 1
  }

  let level, feedback, tips
  if (score <= 3) {
    level = 'Beginner'
    feedback = `You scored ${score}/10. You're just getting started with financial literacy — that's a great sign you're here.`
    tips = [
      'Start with a simple monthly budget: list income, then fixed costs, then everything else.',
      'Build a small emergency fund before anything else — even $500 breaks the paycheck-to-paycheck cycle.',
      'Learn the difference between a debit card and a credit card before taking on any borrowing.',
    ]
  } else if (score <= 6) {
    level = 'Intermediate'
    feedback = `You scored ${score}/10. You know the basics — budgeting and saving are familiar ground.`
    tips = [
      'Learn how compound interest works and use it with a retirement account, not just a savings account.',
      'Check your credit report at least once a year and understand what drives your score.',
      'Look into diversification — spreading money across asset types reduces risk without killing returns.',
    ]
  } else if (score <= 8) {
    level = 'Proficient'
    feedback = `You scored ${score}/10. Solid grasp of core concepts like compounding, credit, and diversification.`
    tips = [
      'Model out a retirement plan with real numbers — target savings rate, expected return, time horizon.',
      'Explore mutual funds and index funds if you haven\'t already — low fees compound just like interest does.',
      'Revisit your emergency fund size as your expenses change; 3-6 months of essentials is the usual target.',
    ]
  } else {
    level = 'Expert'
    feedback = `You scored ${score}/10. Excellent — you have a strong command of personal finance fundamentals.`
    tips = [
      'Consider tax-advantaged and asset-location strategies to squeeze more efficiency out of your portfolio.',
      'Periodically rebalance your investments so allocation drift doesn\'t quietly change your risk level.',
      'Mentor someone just starting out — explaining concepts is a great way to stress-test your own understanding.',
    ]
  }

  return { score, total: 10, level, feedback, tips }
}
