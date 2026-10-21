import { useState } from 'react'

const QUESTIONS = [
  { id: 'q1', q: 'What is the primary purpose of a budget?', options: [['a', 'To keep track of your daily activities'], ['b', 'To help you manage your money'], ['c', 'To calculate your net worth']] },
  { id: 'q2', q: 'What does it mean to diversify your investments?', options: [['a', 'Putting all your money in one stock'], ['b', 'Spreading your investments across different assets'], ['c', 'Investing only in government bonds']] },
  { id: 'q3', q: 'What is compound interest?', options: [['a', 'Interest calculated only on the principal amount'], ['b', 'Interest calculated on both the principal and the accumulated interest'], ['c', 'Interest that decreases over time']] },
  { id: 'q4', q: 'What is an emergency fund?', options: [['a', 'A fund for daily expenses'], ['b', 'Money set aside for unexpected expenses'], ['c', 'A fund for buying luxury items']] },
  { id: 'q5', q: 'What is the best way to improve your credit score?', options: [['a', 'Max out your credit cards'], ['b', 'Pay your bills on time'], ['c', 'Close old credit accounts']] },
  { id: 'q6', q: 'What is the difference between a debit card and a credit card?', options: [['a', 'Debit cards allow you to borrow money; credit cards do not'], ['b', 'Debit cards are linked to your bank account; credit cards allow you to borrow money'], ['c', 'Debit cards and credit cards are the same']] },
  { id: 'q7', q: 'What is a mutual fund?', options: [['a', 'A fund where you can lend money to your friends'], ['b', 'A pool of money from many investors used to buy securities'], ['c', 'A savings account offered by mutual banks']] },
  { id: 'q8', q: 'Why is it important to have a retirement plan?', options: [['a', 'To ensure you have enough money to live on when you retire'], ['b', 'To buy a house when you retire'], ['c', 'To spend all your money before you retire']] },
  { id: 'q9', q: 'What is the purpose of a credit report?', options: [['a', 'To track your spending habits'], ['b', 'To provide a detailed history of your credit activity'], ['c', 'To show your employment history']] },
  { id: 'q10', q: 'What is an interest rate?', options: [['a', 'The fee charged by a lender for borrowing money'], ['b', 'The amount of money you save over time'], ['c', 'The amount of money deducted from your bank account']] },
]

export default function LiteracyQuiz() {
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) throw new Error('Scoring failed')
      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const allAnswered = QUESTIONS.every((q) => answers[q.id])

  return (
    <>
      <div className="card">
        <h2>Financial Literacy Quiz</h2>
        <p className="muted">Scored and explained by a fixed rule set — no language model involved.</p>
        <form onSubmit={submit}>
          {QUESTIONS.map((question, idx) => (
            <div className="question-block" key={question.id}>
              <h3>{idx + 1}. {question.q}</h3>
              <div className="radio-group" style={{ flexDirection: 'column', gap: '0.4rem' }}>
                {question.options.map(([val, text]) => (
                  <label key={val}>
                    <input
                      type="radio"
                      name={question.id}
                      value={val}
                      checked={answers[question.id] === val}
                      onChange={() => setAnswers((a) => ({ ...a, [question.id]: val }))}
                    />
                    {text}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn" type="submit" disabled={loading || !allAnswered}>
            {loading ? 'Scoring…' : 'Submit Quiz'}
          </button>
          {!allAnswered && <p className="muted">Answer all questions to submit.</p>}
        </form>
        {error && <p style={{ color: 'var(--critical)' }}>{error}</p>}
      </div>

      {result && (
        <div className="card">
          <h2>Results</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="score-badge">
              <strong>{result.score}/{result.total}</strong>
              <span>{result.level}</span>
            </div>
            <p style={{ margin: 0 }}>{result.feedback}</p>
          </div>
          <h3>Tips</h3>
          <ul className="tip-list">
            {result.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
