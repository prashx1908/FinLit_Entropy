import { useState } from 'react'
import DonutChart from './DonutChart.jsx'

const FIELDS = [
  ['rent', 'Rent'],
  ['groceries', 'Groceries'],
  ['utilities', 'Utilities'],
  ['transportation', 'Transportation'],
  ['healthcare', 'Healthcare'],
  ['entertainment', 'Entertainment'],
  ['savings', 'Savings'],
  ['others', 'Others'],
]

const DEFAULTS = { rent: 15000, groceries: 6000, utilities: 3000, transportation: 2500, healthcare: 1500, entertainment: 2000, savings: 8000, others: 2000 }

export default function ExpenditureTracker() {
  const [form, setForm] = useState(DEFAULTS)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/expenditure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Analysis failed')
      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="card">
        <h2>Expenditure Tracker</h2>
        <p className="muted">Enter your monthly amounts and the backend runs a 50/30/20 budget-rule analysis — no ML model, just transparent math.</p>
        <form onSubmit={submit}>
          <div className="grid-2">
            {FIELDS.map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  type="number"
                  min="0"
                  step="100"
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze Spending'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--critical)' }}>{error}</p>}
      </div>

      {result && (
        <div className="card">
          <h2>Results</h2>
          <div className="results-layout">
            <DonutChart data={result.breakdown} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div className="score-badge">
                  <strong>{result.healthScore}</strong>
                  <span>health score</span>
                </div>
                <p className="muted" style={{ margin: 0 }}>
                  Total monthly outflow: <strong>₹{result.total.toLocaleString()}</strong>
                </p>
              </div>

              <h3>50 / 30 / 20 check</h3>
              {['needs', 'wants', 'savings'].map((key) => {
                const b = result.buckets[key]
                const label = key === 'needs' ? 'Needs' : key === 'wants' ? 'Wants' : 'Savings'
                return (
                  <div className="bucket-row" key={key}>
                    <span>{label}</span>
                    <span className="muted">target {b.target}%</span>
                    <strong>{b.pct}%</strong>
                    <span className={`pill ${b.status}`}>{b.status}</span>
                  </div>
                )
              })}

              <h3 style={{ marginTop: '1.25rem' }}>Recommendations</h3>
              <ul className="tip-list">
                {result.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
