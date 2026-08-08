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
import { formatMetric } from '../data'
import type { CityStats, MetricDef } from '../types'
import { cityColor, radarKeys } from '../utils'

export function MetricBarChart({
  cities,
  metric,
  soloName,
}: {
  cities: CityStats[]
  metric: MetricDef
  soloName?: string
}) {
  const data = cities.map((c, i) => ({
    name: c.nameEs,
    value: c[metric.key] as number,
    fill: cityColor(i),
  }))

  return (
    <div className="panel chart-box">
      <div className="metric-select">
        <strong>{soloName ? `Метрика · ${soloName}` : 'Метрика сравнения'}:</strong>
        <span className="metric-static">{metric.label}</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,31,42,0.08)" />
          <XAxis dataKey="name" tick={{ fill: '#1a3544', fontSize: 12 }} />
          <YAxis tick={{ fill: '#1a3544', fontSize: 12 }} />
          <Tooltip
            formatter={(value) => formatMetric(Number(value), metric.format)}
            contentStyle={{ borderRadius: 12, borderColor: 'rgba(11,31,42,0.1)' }}
          />
          <Bar dataKey="value" name={metric.label} radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function HousingChart({
  cities,
  soloName,
}: {
  cities: CityStats[]
  soloName?: string
}) {
  const data = cities.map((c) => ({
    name: c.nameEs,
    '1BR центр': c.rent1brCenter,
    '1BR вне': c.rent1brOutside,
    'Зарплата net': c.salaryNet,
  }))

  return (
    <div className="panel chart-box">
      <h2 className="section-title">
        {soloName ? `Аренда и зарплата · ${soloName}` : 'Аренда vs зарплата'}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
  )
}

export function LifestyleRadar({
  cities,
  soloName,
  isSolo,
}: {
  cities: CityStats[]
  soloName?: string
  isSolo: boolean
}) {
  const data = radarKeys.map((rk) => {
    const row: Record<string, string | number> = { axis: rk.label }
    for (const city of cities) {
      const raw = city[rk.key as keyof CityStats] as number
      row[city.nameEs] = 'scale' in rk && rk.scale ? rk.scale(raw) : raw
    }
    return row
  })

  return (
    <div className="panel chart-box">
      <h2 className="section-title">
        {soloName ? `Профиль · ${soloName}` : 'Профиль образа жизни'}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(11,31,42,0.12)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#1a3544', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          {cities.map((city, i) => (
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
  )
}
