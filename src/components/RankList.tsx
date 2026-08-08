import { formatMetric } from '../data'
import type { CityStats } from '../types'

export function RankList({
  ranked,
  selected,
  focusId,
  personaLabel,
  onToggle,
}: {
  ranked: { city: CityStats; score: number }[]
  selected: string[]
  focusId: string
  personaLabel: string
  onToggle: (id: string) => void
}) {
  const max = ranked[0]?.score || 1
  return (
    <div className="panel">
      <h2 className="section-title">Рейтинг · {personaLabel}</h2>
      <p className="cat-hint">Веса зависят от профиля. Клик — в сравнение</p>
      <div className="rank-list">
        {ranked.map(({ city, score }, i) => (
          <button
            key={city.id}
            type="button"
            className={`rank-row${focusId === city.id ? ' active' : ''}${selected.includes(city.id) ? ' selected' : ''}`}
            onClick={() => onToggle(city.id)}
          >
            <span className="pos">{i + 1}</span>
            <span className="rank-body">
              <strong>{city.nameEs}</strong>
              <span className="rank-meta">
                {formatMetric(city.salaryNet, 'euro')} · аренда{' '}
                {formatMetric(city.rent1brCenter, 'euro')} · +{city.rentYoY}% YoY
              </span>
              <div className="bar">
                <i style={{ width: `${(score / max) * 100}%` }} />
              </div>
            </span>
            <strong className="rank-score">{score}</strong>
          </button>
        ))}
      </div>
    </div>
  )
}
