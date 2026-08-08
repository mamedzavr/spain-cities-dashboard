import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  affordabilityScore,
  categories,
  cities,
  DATA_AS_OF,
  formatMetric,
  metrics,
  overallScore,
  SOURCES,
} from './data/cities'
import type { CategoryId, CityStats, MetricKey } from './types'
import './App.css'

const DEFAULT_IDS = ['madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao', 'malaga']
const CITY_COLORS = ['#2a9d8f', '#e8a838', '#c45c3e', '#1a3544', '#3d7ea6', '#0b1f2a']

const radarKeys = [
  { key: 'jobMarket', label: 'Работа' },
  { key: 'techScene', label: 'Tech' },
  { key: 'safetyIndex', label: 'Безопасность' },
  { key: 'healthcareIndex', label: 'Здоровье' },
  { key: 'sunnyDays', label: 'Солнце', scale: (v: number) => Math.round((v / 320) * 100) },
  { key: 'beachAccess', label: 'Пляж' },
  { key: 'walkability', label: 'Пешком' },
  { key: 'culture', label: 'Культура' },
] as const

function cityColor(index: number) {
  return CITY_COLORS[index % CITY_COLORS.length]
}

function bestValue(values: number[], lowerIsBetter?: boolean) {
  return lowerIsBetter ? Math.min(...values) : Math.max(...values)
}

function coastLabel(coast: CityStats['coast']) {
  switch (coast) {
    case 'mediterranean':
      return 'Средиземное море'
    case 'atlantic':
      return 'Атлантика'
    case 'cantabrian':
      return 'Бискайский залив'
    case 'island':
      return 'остров'
    default:
      return 'внутри страны'
  }
}

export default function App() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_IDS)
  const [category, setCategory] = useState<CategoryId>('overview')
  const [metricKey, setMetricKey] = useState<MetricKey>('rent1brCenter')
  const [focusId, setFocusId] = useState<string>('valencia')

  const selectedCities = useMemo(
    () => cities.filter((c) => selected.includes(c.id)),
    [selected],
  )

  const categoryMetrics = useMemo(
    () => metrics.filter((m) => m.category === category),
    [category],
  )

  const activeMetric =
    categoryMetrics.find((m) => m.key === metricKey) ?? categoryMetrics[0] ?? metrics[0]

  const ranked = useMemo(() => {
    const list = [...cities].map((c) => ({ city: c, score: overallScore(c) }))
    list.sort((a, b) => b.score - a.score)
    return list
  }, [])

  const barData = useMemo(() => {
    if (!activeMetric) return []
    return selectedCities.map((c, i) => ({
      name: c.nameEs,
      value: c[activeMetric.key] as number,
      fill: cityColor(i),
    }))
  }, [selectedCities, activeMetric])

  const radarData = useMemo(() => {
    return radarKeys.map((rk) => {
      const row: Record<string, string | number> = { axis: rk.label }
      for (const city of selectedCities) {
        const raw = city[rk.key as keyof CityStats] as number
        row[city.nameEs] = 'scale' in rk && rk.scale ? rk.scale(raw) : raw
      }
      return row
    })
  }, [selectedCities])

  const housingCompare = useMemo(() => {
    return selectedCities.map((c) => ({
      name: c.nameEs,
      '1BR центр': c.rent1brCenter,
      '1BR вне': c.rent1brOutside,
      'Зарплата net': c.salaryNet,
    }))
  }, [selectedCities])

  const avgSalary =
    selectedCities.reduce((s, c) => s + c.salaryNet, 0) / Math.max(selectedCities.length, 1)
  const avgRent =
    selectedCities.reduce((s, c) => s + c.rent1brCenter, 0) / Math.max(selectedCities.length, 1)
  const cheapest = [...selectedCities].sort((a, b) => a.rent1brCenter - b.rent1brCenter)[0]
  const bestJob = [...selectedCities].sort((a, b) => b.jobMarket - a.jobMarket)[0]

  function toggleCity(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev
        return prev.filter((x) => x !== id)
      }
      if (prev.length >= 6) return prev
      return [...prev, id]
    })
    setFocusId(id)
  }

  function onCategory(id: CategoryId) {
    setCategory(id)
    const first = metrics.find((m) => m.category === id)
    if (first) setMetricKey(first.key)
  }

  const tableRows: {
    label: string
    key: MetricKey
    lowerIsBetter?: boolean
    format?: 'euro' | 'percent' | 'number' | 'index'
  }[] = [
    { label: 'Аренда 1BR центр', key: 'rent1brCenter', lowerIsBetter: true, format: 'euro' },
    { label: 'Аренда 1BR вне центра', key: 'rent1brOutside', lowerIsBetter: true, format: 'euro' },
    { label: 'Аренда €/м²', key: 'rentPerSqm', lowerIsBetter: true, format: 'euro' },
    { label: 'Покупка €/м² центр', key: 'buyPerSqmCenter', lowerIsBetter: true, format: 'euro' },
    { label: 'Обед в кафе', key: 'mealInexpensive', lowerIsBetter: true, format: 'euro' },
    { label: 'Продукты / мес', key: 'groceriesMonthly', lowerIsBetter: true, format: 'euro' },
    { label: 'Коммуналка', key: 'utilities', lowerIsBetter: true, format: 'euro' },
    { label: 'Проездной', key: 'transportPass', lowerIsBetter: true, format: 'euro' },
    { label: 'Зарплата net', key: 'salaryNet', format: 'euro' },
    { label: 'Безработица', key: 'unemployment', lowerIsBetter: true, format: 'percent' },
    { label: 'Доля зарплаты на аренду', key: 'rentBurden', lowerIsBetter: true, format: 'percent' },
    { label: 'Бюджет одного без аренды', key: 'singleMonthlyExRent', lowerIsBetter: true, format: 'euro' },
    { label: 'Солнечных дней', key: 'sunnyDays', format: 'number' },
    { label: 'Безопасность', key: 'safetyIndex', format: 'index' },
    { label: 'Рынок труда', key: 'jobMarket', format: 'index' },
    { label: 'Tech-сцена', key: 'techScene', format: 'index' },
    { label: 'Пляж', key: 'beachAccess', format: 'index' },
  ]

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">
          España <span>Atlas</span>
        </h1>
        <p>
          Дашборд сравнения жизни в 12 городах Испании — от Мадрида до Канар:
          аренда, еда, финансы, работа, климат и образ жизни на одной карте
          решений.
        </p>
        <div className="hero-meta">
          <span className="chip">Данные: {DATA_AS_OF}</span>
          <span className="chip">12 городов · 7 регионов</span>
          <span className="chip">Numbeo · Idealista · INE</span>
        </div>
      </header>

      <section className="toolbar">
        <div className="panel">
          <h2>Города для сравнения (2–6)</h2>
          <div className="city-grid">
            {cities.map((city) => {
              const on = selected.includes(city.id)
              return (
                <button
                  key={city.id}
                  type="button"
                  className={`city-toggle${on ? ' active' : ''}`}
                  onClick={() => toggleCity(city.id)}
                  aria-pressed={on}
                >
                  <span className="name">{city.nameEs}</span>
                  <span className="meta">
                    {city.region} · {city.population.toLocaleString('ru-RU')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="panel">
          <h2>Аспект</h2>
          <div className="tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={category === cat.id}
                className={`tab${category === cat.id ? ' active' : ''}`}
                onClick={() => onCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <p style={{ margin: '0.75rem 0 0', color: 'rgba(11,31,42,0.6)', fontSize: '0.9rem' }}>
            {categories.find((c) => c.id === category)?.hint}
          </p>
        </div>
      </section>

      <section className="kpis">
        <article className="kpi" style={{ ['--accent' as string]: '#2a9d8f' }}>
          <div className="label">Средняя зарплата (выбор)</div>
          <div className="value">{formatMetric(avgSalary, 'euro')}</div>
          <div className="sub">чистыми в месяц</div>
        </article>
        <article className="kpi" style={{ ['--accent' as string]: '#e8a838' }}>
          <div className="label">Средняя аренда 1BR центр</div>
          <div className="value">{formatMetric(avgRent, 'euro')}</div>
          <div className="sub">по выбранным городам</div>
        </article>
        <article className="kpi" style={{ ['--accent' as string]: '#c45c3e' }}>
          <div className="label">Самая доступная аренда</div>
          <div className="value">{cheapest?.nameEs ?? '—'}</div>
          <div className="sub">
            {cheapest ? `${formatMetric(cheapest.rent1brCenter, 'euro')} / мес` : ''}
          </div>
        </article>
        <article className="kpi" style={{ ['--accent' as string]: '#1a3544' }}>
          <div className="label">Сильнее рынок труда</div>
          <div className="value">{bestJob?.nameEs ?? '—'}</div>
          <div className="sub">индекс {bestJob?.jobMarket ?? '—'}/100</div>
        </article>
      </section>

      <section className="grid-2">
        <div className="panel chart-box">
          <div className="metric-select">
            <strong>Метрика:</strong>
            <select
              value={activeMetric?.key}
              onChange={(e) => setMetricKey(e.target.value as MetricKey)}
            >
              {categoryMetrics.map((m) => (
                <option key={`${m.category}-${m.key}-${m.label}`} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,31,42,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#1a3544', fontSize: 12 }} />
              <YAxis tick={{ fill: '#1a3544', fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatMetric(Number(value), activeMetric?.format)}
                contentStyle={{ borderRadius: 12, borderColor: 'rgba(11,31,42,0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h2 className="section-title">Рейтинг качества выбора</h2>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'rgba(11,31,42,0.6)' }}>
            Композит: доступность, зарплата, работа, климат, безопасность
          </p>
          <div className="rank-list">
            {ranked.map(({ city, score }, i) => {
              const max = ranked[0].score
              return (
                <button
                  key={city.id}
                  type="button"
                  className={`rank-row${focusId === city.id ? ' active' : ''}`}
                  onClick={() => {
                    setFocusId(city.id)
                    if (!selected.includes(city.id)) toggleCity(city.id)
                  }}
                >
                  <span className="pos">{i + 1}</span>
                  <span>
                    <strong>{city.nameEs}</strong>
                    <div className="bar">
                      <i style={{ width: `${(score / max) * 100}%` }} />
                    </div>
                  </span>
                  <strong>{score}</strong>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid-2">
        <div className="panel chart-box">
          <h2 className="section-title">Аренда vs зарплата</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={housingCompare}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,31,42,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#1a3544', fontSize: 12 }} />
              <YAxis tick={{ fill: '#1a3544', fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatMetric(Number(value), 'euro')}
                contentStyle={{ borderRadius: 12, borderColor: 'rgba(11,31,42,0.1)' }}
              />
              <Legend />
              <Bar dataKey="1BR центр" fill="#c45c3e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="1BR вне" fill="#e8a838" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Зарплата net" fill="#2a9d8f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart-box">
          <h2 className="section-title">Профиль образа жизни</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(11,31,42,0.12)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#1a3544', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              {selectedCities.map((city, i) => (
                <Radar
                  key={city.id}
                  name={city.nameEs}
                  dataKey={city.nameEs}
                  stroke={cityColor(i)}
                  fill={cityColor(i)}
                  fillOpacity={0.12}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <h2 className="section-title">Сводная таблица</h2>
        <div className="table-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th>Показатель</th>
                {selectedCities.map((c) => (
                  <th key={c.id}>{c.nameEs}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const values = selectedCities.map((c) => c[row.key] as number)
                const best = bestValue(values, row.lowerIsBetter)
                return (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    {selectedCities.map((c, idx) => {
                      const v = values[idx]
                      return (
                        <td key={c.id} className={v === best ? 'best' : undefined}>
                          {formatMetric(v, row.format)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="city-cards">
        {selectedCities.map((city, i) => (
          <article
            key={city.id}
            className="city-card"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <header>
              <div>
                <h3>{city.nameEs}</h3>
                <div className="region">
                  {city.name} · {city.region} · {coastLabel(city.coast)}
                </div>
              </div>
              <div className="score-badge" title="Общий индекс">
                {overallScore(city)}
              </div>
            </header>
            <p className="vibe">{city.vibe}</p>
            <div className="stat-grid">
              <div className="stat">
                <b>{formatMetric(city.rent1brCenter, 'euro')}</b>
                <span>1BR центр</span>
              </div>
              <div className="stat">
                <b>{formatMetric(city.salaryNet, 'euro')}</b>
                <span>зарплата net</span>
              </div>
              <div className="stat">
                <b>{affordabilityScore(city)}</b>
                <span>доступность</span>
              </div>
              <div className="stat">
                <b>{city.sunnyDays}</b>
                <span>солнечных дней</span>
              </div>
              <div className="stat">
                <b>{formatMetric(city.mealInexpensive, 'euro')}</b>
                <span>обед</span>
              </div>
              <div className="stat">
                <b>{city.unemployment}%</b>
                <span>безработица</span>
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
          </article>
        ))}
      </section>

      <footer className="footer">
        <strong>Источники и оговорки.</strong> Цифры по Мадриду, Барселоне и Валенсии
        сверены с Numbeo (обновление август 2026). Аренда €/м² опирается на Idealista
        2025. Lifestyle-индексы (0–100) — композитные оценки для сравнения, не
        официальные рейтинги. Зарплаты Numbeo часто выше медианы INE — смотрите и
        rent burden.
        <ul>
          {SOURCES.map((s) => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}
