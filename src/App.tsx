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
  cityListLabel,
  DATA_AS_OF,
  formatMetric,
  metrics,
  overallScore,
  SOURCES,
} from './data/cities'
import type { CategoryId, CityStats, MetricKey } from './types'
import './App.css'

const DEFAULT_IDS = ['madrid', 'barcelona', 'valencia', 'sevilla']
const CITY_COLORS = ['#2a9d8f', '#e8a838', '#c45c3e', '#1a3544', '#3d7ea6', '#0b1f2a']
const ALL_IDS = cities.map((c) => c.id)

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

const TABLE_ROWS: {
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
  { label: 'Индекс преступности', key: 'crimeIndex', lowerIsBetter: true, format: 'index' },
  { label: 'Индекс безопасности', key: 'safetyIndex', format: 'index' },
  { label: 'Преступления / 1000 жит.', key: 'crimeRatePer1000', lowerIsBetter: true, format: 'number' },
  { label: 'Кражи / 1000 жит.', key: 'theftRatePer1000', lowerIsBetter: true, format: 'number' },
  { label: 'Грабежи / 1000 жит.', key: 'violentRobberyPer1000', lowerIsBetter: true, format: 'number' },
  { label: 'Солнечных дней', key: 'sunnyDays', format: 'number' },
  { label: 'Рынок труда', key: 'jobMarket', format: 'index' },
  { label: 'Tech-сцена', key: 'techScene', format: 'index' },
  { label: 'Пляж', key: 'beachAccess', format: 'index' },
]

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
  const isSolo = selectedCities.length === 1
  const solo = isSolo ? selectedCities[0] : null
  const scopeLabel = isSolo
    ? solo!.nameEs
    : `среднее по: ${cityListLabel(selectedCities)}`

  const categoryMetrics = useMemo(
    () => metrics.filter((m) => m.category === category),
    [category],
  )
  const activeMetric =
    categoryMetrics.find((m) => m.key === metricKey) ?? categoryMetrics[0] ?? metrics[0]

  const ranked = useMemo(() => {
    return [...cities]
      .map((c) => ({ city: c, score: overallScore(c) }))
      .sort((a, b) => b.score - a.score)
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
  const safest = [...selectedCities].sort((a, b) => b.safetyIndex - a.safetyIndex)[0]
  const bestJob = [...selectedCities].sort((a, b) => b.jobMarket - a.jobMarket)[0]

  const allSelected = selected.length === ALL_IDS.length

  function toggleCity(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev
        return prev.filter((x) => x !== id)
      }
      return [...prev, id]
    })
    setFocusId(id)
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(DEFAULT_IDS)
      setFocusId(DEFAULT_IDS[0])
    } else {
      setSelected(ALL_IDS)
    }
  }

  function onCategory(id: CategoryId) {
    setCategory(id)
    const first = metrics.find((m) => m.category === id)
    if (first) setMetricKey(first.key)
  }

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">
          España <span>Atlas</span>
        </h1>
        <p>
          Дашборд жизни в 12 городах Испании: аренда, еда, финансы, работа,
          климат, преступность и образ жизни. Можно смотреть один город или
          сравнивать несколько.
        </p>
        <div className="hero-meta">
          <span className="chip">Данные: {DATA_AS_OF}</span>
          <span className="chip">Numbeo · Idealista · MIR 2024</span>
          <span className="chip">
            {isSolo ? `Режим: ${solo!.nameEs}` : `Сравнение: ${selectedCities.length} города`}
          </span>
        </div>
      </header>

      <section className="toolbar">
        <div className="panel">
          <div className="panel-head">
            <h2>Города · выбрано {selectedCities.length}</h2>
            <button
              type="button"
              className="select-all-btn"
              onClick={toggleSelectAll}
              aria-pressed={allSelected}
            >
              {allSelected ? 'Сбросить' : 'Выбрать все'}
            </button>
          </div>
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
                    {city.region} · {formatMetric(city.salaryNet, 'euro')} net
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
          <p className="cat-hint">{categories.find((c) => c.id === category)?.hint}</p>
        </div>
      </section>

      <p className="scope-banner">
        {isSolo ? (
          <>
            Сейчас открыт <strong>{solo!.nameEs}</strong> — все цифры ниже про этот город.
          </>
        ) : (
          <>
            Сравнение: <strong>{cityListLabel(selectedCities, 6)}</strong>. KPI со
            словом «среднее» — среднее арифметическое по выбранным городам.
          </>
        )}
      </p>

      <section className={`kpis${isSolo ? ' solo' : ''}`}>
        {isSolo && solo ? (
          <>
            <Kpi
              accent="#2a9d8f"
              label={`Зарплата · ${solo.nameEs}`}
              value={formatMetric(solo.salaryNet, 'euro')}
              sub="средняя net / месяц (Numbeo)"
            />
            <Kpi
              accent="#e8a838"
              label={`Аренда 1BR центр · ${solo.nameEs}`}
              value={formatMetric(solo.rent1brCenter, 'euro')}
              sub={`${formatMetric(solo.rent1brOutside, 'euro')} вне центра`}
            />
            <Kpi
              accent="#c45c3e"
              label={`Преступность · ${solo.nameEs}`}
              value={String(solo.crimeIndex)}
              sub={`Numbeo · официально ${solo.crimeRatePer1000}/1000 жит.`}
            />
            <Kpi
              accent="#1a3544"
              label={`Безопасность · ${solo.nameEs}`}
              value={`${solo.safetyIndex}/100`}
              sub={`кражи ${solo.theftRatePer1000}/1000 · грабежи ${solo.violentRobberyPer1000}/1000`}
            />
          </>
        ) : (
          <>
            <Kpi
              accent="#2a9d8f"
              label="Средняя зарплата"
              value={formatMetric(avgSalary, 'euro')}
              sub={scopeLabel}
            />
            <Kpi
              accent="#e8a838"
              label="Средняя аренда 1BR центр"
              value={formatMetric(avgRent, 'euro')}
              sub={scopeLabel}
            />
            <Kpi
              accent="#c45c3e"
              label="Дешевле аренда"
              value={cheapest?.nameEs ?? '—'}
              sub={
                cheapest
                  ? `${formatMetric(cheapest.rent1brCenter, 'euro')} · 1BR центр`
                  : ''
              }
            />
            <Kpi
              accent="#1a3544"
              label="Безопаснее"
              value={safest?.nameEs ?? '—'}
              sub={
                safest
                  ? `safety ${safest.safetyIndex} · crime ${safest.crimeIndex} · ${bestJob?.nameEs ?? ''} — рынок труда`
                  : ''
              }
            />
          </>
        )}
      </section>

      <section className="grid-2">
        <div className="panel chart-box">
          <div className="metric-select">
            <strong>{isSolo ? `Метрика · ${solo!.nameEs}` : 'Метрика сравнения'}:</strong>
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
                labelFormatter={(label) => String(label)}
                contentStyle={{ borderRadius: 12, borderColor: 'rgba(11,31,42,0.1)' }}
              />
              <Bar dataKey="value" name={activeMetric?.label ?? 'Значение'} radius={[8, 8, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h2 className="section-title">Рейтинг всех городов</h2>
          <p className="cat-hint">Клик — добавить или убрать город из сравнения</p>
          <div className="rank-list">
            {ranked.map(({ city, score }, i) => {
              const max = ranked[0].score
              return (
                <button
                  key={city.id}
                  type="button"
                  className={`rank-row${focusId === city.id ? ' active' : ''}${selected.includes(city.id) ? ' selected' : ''}`}
                  onClick={() => toggleCity(city.id)}
                >
                  <span className="pos">{i + 1}</span>
                  <span className="rank-body">
                    <strong>{city.nameEs}</strong>
                    <span className="rank-meta">
                      {formatMetric(city.salaryNet, 'euro')} · аренда{' '}
                      {formatMetric(city.rent1brCenter, 'euro')} · crime {city.crimeIndex}
                    </span>
                    <div className="bar">
                      <i style={{ width: `${(score / max) * 100}%` }} />
                    </div>
                  </span>
                  <strong className="rank-score">{score}</strong>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid-2">
        <div className="panel chart-box">
          <h2 className="section-title">
            {isSolo ? `Аренда и зарплата · ${solo!.nameEs}` : 'Аренда vs зарплата по городам'}
          </h2>
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
          <h2 className="section-title">
            {isSolo ? `Профиль · ${solo!.nameEs}` : 'Профиль образа жизни'}
          </h2>
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
                  fillOpacity={isSolo ? 0.22 : 0.12}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {!isSolo && (
        <section className="panel" style={{ marginTop: '1rem' }}>
          <h2 className="section-title">Сводная таблица · {cityListLabel(selectedCities, 6)}</h2>
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
                {TABLE_ROWS.map((row) => {
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
      )}

      <section className="city-cards">
        {selectedCities.map((city, i) => (
          <article
            key={city.id}
            className={`city-card${isSolo ? ' featured' : ''}`}
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
                <span>аренда 1BR центр · {city.nameEs}</span>
              </div>
              <div className="stat">
                <b>{formatMetric(city.salaryNet, 'euro')}</b>
                <span>зарплата net · {city.nameEs}</span>
              </div>
              <div className="stat">
                <b>{city.crimeIndex}</b>
                <span>crime index · ниже лучше</span>
              </div>
              <div className="stat">
                <b>{city.safetyIndex}</b>
                <span>safety · выше лучше</span>
              </div>
              <div className="stat">
                <b>{city.crimeRatePer1000}</b>
                <span>преступл. / 1000 жит. (MIR)</span>
              </div>
              <div className="stat">
                <b>{city.theftRatePer1000}</b>
                <span>кражи / 1000 · грабежи {city.violentRobberyPer1000}</span>
              </div>
              <div className="stat">
                <b>{affordabilityScore(city)}</b>
                <span>доступность жилья</span>
              </div>
              <div className="stat">
                <b>{city.sunnyDays}</b>
                <span>солнечных дней</span>
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
        <strong>Источники и оговорки.</strong> Стоимость жизни: Numbeo (Aug 2026) для
        Madrid / Barcelona / Valencia. Аренда €/м²: Idealista 2025. Преступность:
        Numbeo Crime/Safety Index + официальный Balance de Criminalidad 2024
        (Ministerio del Interior) — conventional crimes, hurtos и robos con violencia
        на 1000 жителей. Туристические города часто завышают кражи на душу. Lifestyle
        0–100 — композит для сравнения.
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

function Kpi({
  accent,
  label,
  value,
  sub,
}: {
  accent: string
  label: string
  value: string
  sub: string
}) {
  return (
    <article className="kpi" style={{ ['--accent' as string]: accent }}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="sub">{sub}</div>
    </article>
  )
}
