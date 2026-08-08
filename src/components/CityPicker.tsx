import { formatMetric, qualityLabel } from '../data'
import type { CityStats } from '../types'

export function CityPicker({
  cities,
  selected,
  allSelected,
  onToggle,
  onToggleAll,
}: {
  cities: CityStats[]
  selected: string[]
  allSelected: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Города · выбрано {selected.length}</h2>
        <button
          type="button"
          className="select-all-btn"
          onClick={onToggleAll}
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
              onClick={() => onToggle(city.id)}
              aria-pressed={on}
            >
              <span className="name">{city.nameEs}</span>
              <span className="meta">
                {city.region} · {formatMetric(city.salaryNet, 'euro')} net
              </span>
              <span className={`quality-badge q-${city.dataQuality}`}>
                {qualityLabel(city.dataQuality)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
