import { useState } from 'react'
import ExpenditureTracker from './components/ExpenditureTracker.jsx'
import InvestmentAdvisor from './components/InvestmentAdvisor.jsx'
import LiteracyQuiz from './components/LiteracyQuiz.jsx'

const TABS = [
  { key: 'expenditure', label: 'Expenditure Tracker', Component: ExpenditureTracker },
  { key: 'invest', label: 'Investment Advisor', Component: InvestmentAdvisor },
  { key: 'quiz', label: 'Literacy Quiz', Component: LiteracyQuiz },
]

export default function App() {
  const [active, setActive] = useState('expenditure')
  const ActiveComponent = TABS.find((t) => t.key === active).Component

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>FinLit Empower</h1>
          <p>Rule-based financial analysis — budgeting, investing, and literacy, all computed on the fly.</p>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${active === t.key ? 'active' : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <ActiveComponent />

      <p className="footer-note">FinLit Empower — financial analysis runs as serverless functions, no ML model required.</p>
    </div>
  )
}
