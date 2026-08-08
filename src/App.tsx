import { useMemo, useState } from 'react'
import {
  categories,
  cities,
  cityListLabel,
  DATA_AS_OF,
  formatMetric,
  metrics,
  personas,
  scoreCity,
} from './data'
import type { CategoryId, MetricKey, PersonaId } from './types'
import { DEFAULT_IDS } from './utils'
import { MetricBarChart, HousingChart, LifestyleRadar } from './components/Charts'
import { CityCard } from './components/CityCard'
import { CityPicker } from './components/CityPicker'
import { CompareTable } from './components/CompareTable'
import { Footer } from './components/Footer'
import { Kpi } from './components/Kpi'
import { PersonaPicker } from './components/PersonaPicker'
import { RankList } from './components/RankList'
import { SpainMap } from './components/SpainMap'
import './App.css'

const ALL_IDS = cities.map((c) => c.id)

export default function App() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_IDS)
  const [category, setCategory] = useState<CategoryId>('overview')
  const [metricKey, setMetricKey] = useState<MetricKey>('rent1brCenter')
  const [focusId, setFocusId] = useState<string>('valencia')
  const [persona, setPersona] = useState<PersonaId>('balanced')

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
      .map((c) => ({ city: c, score: scoreCity(c, persona) }))
      .sort((a, b) => b.score - a.score)
  }, [persona])

  const personaLabel = personas.find((p) => p.id === persona)?.label ?? 'Баланс'

  const avgSalary =
    selectedCities.reduce((s, c) => s + c.salaryNet, 0) / Math.max(selectedCities.length, 1)
  const avgRent =
    selectedCities.reduce((s, c) => s + c.rent1brCenter, 0) / Math.max(selectedCities.length, 1)
  const cheapest = [...selectedCities].sort((a, b) => a.rent1brCenter - b.rent1brCenter)[0]
  const safest = [...selectedCities].sort((a, b) => b.safetyIndex - a.safetyIndex)[0]
  const coolest = [...selectedCities].sort((a, b) => a.heatDaysAbove35 - b.heatDaysAbove35)[0]
  const fastestNet = [...selectedCities].sort((a, b) => b.internetMbps - a.internetMbps)[0]

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
          Дашборд жизни в {cities.length} городах Испании: аренда и её рост, бюджеты,
          работа, жара, воздух, интернет, школы и безопасность. Один город или сравнение —
          плюс рейтинг под ваш профиль.
        </p>
        <div className="hero-meta">
          <span className="chip">Данные: {DATA_AS_OF}</span>
          <span className="chip">Numbeo · Idealista · MIR · AEMET</span>
          <span className="chip">
            {isSolo ? `Режим: ${solo!.nameEs}` : `Сравнение: ${selectedCities.length}`}
          </span>
          <span className="chip">Профиль: {personaLabel}</span>
        </div>
      </header>

      <section className="toolbar">
        <CityPicker
          cities={cities}
          selected={selected}
          allSelected={allSelected}
          onToggle={toggleCity}
          onToggleAll={toggleSelectAll}
        />
        <div className="toolbar-side">
          <PersonaPicker value={persona} onChange={setPersona} />
          <div className="panel">
            <h2>Карта</h2>
            <SpainMap
              cities={cities}
              selected={selected}
              focusId={focusId}
              onToggle={toggleCity}
            />
          </div>
        </div>
      </section>

      <section className="panel aspect-panel">
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
        <div className="aspect-row">
          <p className="cat-hint">{categories.find((c) => c.id === category)?.hint}</p>
          <label className="metric-inline">
            Метрика
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
          </label>
        </div>
      </section>

      <p className="scope-banner">
        {isSolo ? (
          <>
            Сейчас открыт <strong>{solo!.nameEs}</strong> — все цифры ниже про этот город.
            Качество данных: <strong>{solo!.dataQuality}</strong>.
          </>
        ) : (
          <>
            Сравнение: <strong>{cityListLabel(selectedCities, 6)}</strong>. KPI со словом
            «среднее» — среднее по выбранным. Рейтинг пересчитан под профиль{' '}
            <strong>{personaLabel}</strong>.
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
              sub={`${formatMetric(solo.rent1brCenter, 'euro')} аренда 1BR · +${solo.rentYoY}% YoY`}
            />
            <Kpi
              accent="#e8a838"
              label={`Интернет · ${solo.nameEs}`}
              value={`${solo.internetMbps} Mbps`}
              sub={`${formatMetric(solo.coworkingMonthly, 'euro')} coworking / мес`}
            />
            <Kpi
              accent="#c45c3e"
              label={`Жара · ${solo.nameEs}`}
              value={`${solo.heatDaysAbove35} дн.`}
              sub={`≥35°C · PM2.5 ${solo.pm25} · ${solo.sunnyDays} солнечных`}
            />
            <Kpi
              accent="#1a3544"
              label={`Безопасность · ${solo.nameEs}`}
              value={`${solo.safetyIndex}/100`}
              sub={`crime ${solo.crimeIndex} · школы ${solo.schoolScore}`}
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
              sub={
                cheapest
                  ? `дешевле: ${cheapest.nameEs} · ${formatMetric(cheapest.rent1brCenter, 'euro')}`
                  : scopeLabel
              }
            />
            <Kpi
              accent="#c45c3e"
              label="Меньше жары"
              value={coolest?.nameEs ?? '—'}
              sub={
                coolest
                  ? `${coolest.heatDaysAbove35} дн. ≥35°C · net ${fastestNet?.internetMbps ?? '—'} Mbps лидер`
                  : ''
              }
            />
            <Kpi
              accent="#1a3544"
              label="Безопаснее"
              value={safest?.nameEs ?? '—'}
              sub={
                safest
                  ? `safety ${safest.safetyIndex} · crime ${safest.crimeIndex}`
                  : ''
              }
            />
          </>
        )}
      </section>

      <section className="grid-2">
        {activeMetric ? (
          <MetricBarChart
            cities={selectedCities}
            metric={activeMetric}
            soloName={solo?.nameEs}
          />
        ) : null}
        <RankList
          ranked={ranked}
          selected={selected}
          focusId={focusId}
          personaLabel={personaLabel}
          onToggle={toggleCity}
        />
      </section>

      <section className="grid-2">
        <HousingChart cities={selectedCities} soloName={solo?.nameEs} />
        <LifestyleRadar
          cities={selectedCities}
          soloName={solo?.nameEs}
          isSolo={isSolo}
        />
      </section>

      {!isSolo && <CompareTable cities={selectedCities} />}

      <section className="city-cards">
        {selectedCities.map((city, i) => (
          <CityCard
            key={city.id}
            city={city}
            persona={persona}
            featured={isSolo}
            delay={i * 0.05}
          />
        ))}
      </section>

      <Footer />
    </div>
  )
}
