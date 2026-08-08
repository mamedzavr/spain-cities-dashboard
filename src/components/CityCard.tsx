import { affordabilityScore, formatMetric, qualityLabel, scoreCity } from '../data'
import type { CityStats, PersonaId } from '../types'
import { coastLabel } from '../utils'

export function CityCard({
  city,
  persona,
  featured,
  delay = 0,
}: {
  city: CityStats
  persona: PersonaId
  featured?: boolean
  delay?: number
}) {
  return (
    <article
      className={`city-card${featured ? ' featured' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <header>
        <div>
          <h3>{city.nameEs}</h3>
          <div className="region">
            {city.name} · {city.region} · {coastLabel(city.coast)}
          </div>
        </div>
        <div className="score-stack">
          <div className="score-badge" title="Индекс по выбранному профилю">
            {scoreCity(city, persona)}
          </div>
          <span className={`quality-badge q-${city.dataQuality}`}>
            {qualityLabel(city.dataQuality)}
          </span>
        </div>
      </header>
      <p className="vibe">{city.vibe}</p>
      <p className="tax-note">{city.taxNote}</p>
      <div className="stat-grid">
        <div className="stat">
          <b>{formatMetric(city.rent1brCenter, 'euro')}</b>
          <span>аренда 1BR центр · +{city.rentYoY}% YoY</span>
        </div>
        <div className="stat">
          <b>{formatMetric(city.salaryNet, 'euro')}</b>
          <span>зарплата net</span>
        </div>
        <div className="stat">
          <b>{city.internetMbps}</b>
          <span>Mbps интернет</span>
        </div>
        <div className="stat">
          <b>{city.heatDaysAbove35}</b>
          <span>дней ≥35°C</span>
        </div>
        <div className="stat">
          <b>{city.pm25}</b>
          <span>PM2.5 µg/m³</span>
        </div>
        <div className="stat">
          <b>{city.safetyIndex}</b>
          <span>safety · crime {city.crimeIndex}</span>
        </div>
        <div className="stat">
          <b>{city.schoolScore}</b>
          <span>школы / образование</span>
        </div>
        <div className="stat">
          <b>{affordabilityScore(city)}</b>
          <span>доступность жилья</span>
        </div>
        <div className="stat">
          <b>{formatMetric(city.singleMonthlyExRent, 'euro')}</b>
          <span>бюджет single без аренды</span>
        </div>
        <div className="stat">
          <b>{formatMetric(city.familyMonthlyExRent, 'euro')}</b>
          <span>бюджет семьи без аренды</span>
        </div>
        <div className="stat">
          <b>{city.tourismPressure}</b>
          <span>туристическое давление</span>
        </div>
        <div className="stat">
          <b>{city.connectivity}</b>
          <span>связность AVE/аэропорт</span>
        </div>
      </div>
      <div className="lists">
        <div>
          <h4>Плюсы</h4>
          <ul>
            {city.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Минусы</h4>
          <ul>
            {city.tradeoffs.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      {city.dataNote ? <p className="data-note">Источник: {city.dataNote}</p> : null}
    </article>
  )
}
