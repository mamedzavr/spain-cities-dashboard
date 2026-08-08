import { cityListLabel, formatMetric } from '../data'
import type { CityStats } from '../types'
import { TABLE_ROWS, bestValue } from '../utils'

export function CompareTable({ cities }: { cities: CityStats[] }) {
  return (
    <section className="panel" style={{ marginTop: '1rem' }}>
      <h2 className="section-title">Сводная таблица · {cityListLabel(cities, 6)}</h2>
      <div className="table-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th>Показатель</th>
              {cities.map((c) => (
                <th key={c.id}>{c.nameEs}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map((row) => {
              const values = cities.map((c) => c[row.key] as number)
              const best = bestValue(values, row.lowerIsBetter)
              return (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {cities.map((c, idx) => {
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
  )
}
