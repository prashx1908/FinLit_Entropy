const SERIES_VARS = [
  'var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)',
  'var(--series-5)', 'var(--series-6)', 'var(--series-7)', 'var(--series-8)',
]

const SIZE = 180
const STROKE = 26
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP_DEG = 1.5 // visual surface gap between segments

export default function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.amount, 0) || 1
  let cumulativeDeg = -90

  const segments = data.map((d, i) => {
    const fraction = d.amount / total
    const deg = fraction * 360
    const startDeg = cumulativeDeg
    cumulativeDeg += deg
    const dashLength = Math.max(fraction * CIRCUMFERENCE - GAP_DEG, 0)
    const dashOffset = -((startDeg + 90) / 360) * CIRCUMFERENCE
    return {
      ...d,
      color: SERIES_VARS[i % SERIES_VARS.length],
      dashLength,
      dashOffset,
      showLabel: fraction >= 0.08,
      labelAngle: startDeg + deg / 2,
      pct: fraction * 100,
    }
  })

  return (
    <div>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Spending breakdown donut chart">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--gridline)" strokeWidth={STROKE} />
        {segments.map((s) => (
          <circle
            key={s.key}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={s.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${s.dashLength} ${CIRCUMFERENCE}`}
            strokeDashoffset={s.dashOffset}
          >
            <title>{`${s.label}: ${s.pct.toFixed(1)}%`}</title>
          </circle>
        ))}
        {segments
          .filter((s) => s.showLabel)
          .map((s) => {
            const rad = (s.labelAngle * Math.PI) / 180
            const labelR = RADIUS;
            const x = SIZE / 2 + labelR * Math.cos(rad)
            const y = SIZE / 2 + labelR * Math.sin(rad)
            return (
              <text
                key={`${s.key}-label`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="700"
                fill="#fff"
              >
                {Math.round(s.pct)}%
              </text>
            )
          })}
      </svg>
      <ul className="legend">
        {segments.map((s) => (
          <li key={s.key}>
            <span className="swatch" style={{ background: s.color }} />
            {s.label}
            <span className="amount">₹{s.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
