import { useState } from 'react'

const RANK_FIELDS = [
  ['mutual_funds', 'Mutual Funds preference (1=most preferred, 7=least)'],
  ['equity_market', 'Equity Market preference (1-7)'],
  ['debentures', 'Debentures preference (1-7)'],
  ['government_bonds', 'Government Bonds preference (1-7)'],
  ['fixed_deposits', 'Fixed Deposits preference (1-7)'],
  ['ppf', 'PPF preference (1-7)'],
  ['gold', 'Gold preference (1-7)'],
]

const ALLOC_COLORS = ['var(--series-1)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)']

const DEFAULTS = {
  age: 28,
  salary: 60000,
  Investment_Avenues: 'Yes',
  mutual_funds: 2,
  equity_market: 3,
  debentures: 5,
  government_bonds: 4,
  fixed_deposits: 3,
  ppf: 4,
  gold: 5,
  stock_market: 'Yes',
  factor: 'Returns',
  purpose: 'Wealth Creation',
  duration: '3-5 years',
  invest_monitor: 'Monthly',
  expect: '20%-30%',
}

export default function InvestmentAdvisor() {
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
      const res = await fetch('/api/invest', {
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
        <h2>Investment Advisor</h2>
        <p className="muted">A rule-based scoring engine — combining age, horizon, return expectations, and stated preferences — recommends a risk profile and allocation.</p>
        <form onSubmit={submit}>
          <div className="grid-2">
            <div>
              <label htmlFor="age">Age</label>
              <input id="age" type="number" min="18" max="80" value={form.age} onChange={(e) => update('age', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="salary">Monthly Salary</label>
              <input id="salary" type="number" min="0" value={form.salary} onChange={(e) => update('salary', e.target.value)} required />
            </div>
          </div>

          <div className="grid-2">
            {RANK_FIELDS.map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key}>{label}</label>
                <input id={key} type="number" min="1" max="7" value={form[key]} onChange={(e) => update(key, e.target.value)} required />
              </div>
            ))}
          </div>

          <div className="grid-2">
            <div>
              <label htmlFor="duration">Investment Duration</label>
              <select id="duration" value={form.duration} onChange={(e) => update('duration', e.target.value)}>
                {['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="expect">Expected Returns</label>
              <select id="expect" value={form.expect} onChange={(e) => update('expect', e.target.value)}>
                {['10%-20%', '20%-30%'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="factor">Primary Factor</label>
              <select id="factor" value={form.factor} onChange={(e) => update('factor', e.target.value)}>
                {['Returns', 'Locking Period'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="purpose">Purpose</label>
              <select id="purpose" value={form.purpose} onChange={(e) => update('purpose', e.target.value)}>
                {['Wealth Creation', 'Savings for Future', 'Returns', 'Early Retirement'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="invest_monitor">Monitoring Frequency</label>
              <select id="invest_monitor" value={form.invest_monitor} onChange={(e) => update('invest_monitor', e.target.value)}>
                {['Daily', 'Weekly', 'Monthly'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="radio-group">
            <span className="muted" style={{ alignSelf: 'center' }}>Invest in Stock Market?</span>
            {['Yes', 'No'].map((v) => (
              <label key={v}>
                <input type="radio" name="stock_market" value={v} checked={form.stock_market === v} onChange={() => update('stock_market', v)} />
                {v}
              </label>
            ))}
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Analyzing…' : 'Get Recommendation'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--critical)' }}>{error}</p>}
      </div>

      {result && (
        <div className="card">
          <h2>Your Recommendation</h2>
          <p>
            Risk score <strong>{result.riskScore}/100</strong> — profile: <strong>{result.riskProfile}</strong>
          </p>
          <div className="alloc-bar">
            {result.allocation.map((a, i) => (
              <span key={a.label} style={{ width: `${a.pct}%`, background: ALLOC_COLORS[i % ALLOC_COLORS.length] }} title={`${a.label}: ${a.pct}%`} />
            ))}
          </div>
          <ul className="legend">
            {result.allocation.map((a, i) => (
              <li key={a.label}>
                <span className="swatch" style={{ background: ALLOC_COLORS[i % ALLOC_COLORS.length] }} />
                {a.label}
                <span className="amount">{a.pct}%</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '1rem' }}>{result.recommendation}</p>
          <ul className="tip-list">
            {result.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
