import { useState } from 'react'
import ExpenditureTracker from './components/ExpenditureTracker.jsx'
import InvestmentAdvisor from './components/InvestmentAdvisor.jsx'
import LiteracyQuiz from './components/LiteracyQuiz.jsx'

const TABS = [
  { key: 'expenditure', label: 'Expenditure Tracker', icon: '💰', accent: 'blue', Component: ExpenditureTracker },
  { key: 'invest', label: 'Investment Advisor', icon: '📈', accent: 'green', Component: InvestmentAdvisor },
  { key: 'quiz', label: 'Literacy Quiz', icon: '🧠', accent: 'violet', Component: LiteracyQuiz },
]

export default function App() {
  const [active, setActive] = useState('expenditure')
  const activeTab = TABS.find((t) => t.key === active)
  const ActiveComponent = activeTab.Component

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span className="brand">
            Fin<span className="brand-accent">Lit</span> Empower
          </span>
          <span className="topbar-tagline">Budgeting · Investing · Literacy</span>
        </div>
      </div>

      <div className="hero">
        <div className="hero-inner">
          <h1>Know your money. Instantly.</h1>
          <p>Transparent, rule-based financial analysis — every result computed live, no black-box model required.</p>
        </div>
      </div>

      <div className="app-shell">
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab-btn accent-${t.accent} ${active === t.key ? 'active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div data-accent={activeTab.accent}>
          <ActiveComponent />
        </div>

        <p className="footer-note">FinLit Empower — financial analysis runs as serverless functions, no ML model required.</p>
      </div>
    </>
  )
}
