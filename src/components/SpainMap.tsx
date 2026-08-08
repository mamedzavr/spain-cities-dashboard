import type { CityStats } from '../types'

export function SpainMap({
  cities,
  selected,
  focusId,
  onToggle,
}: {
  cities: CityStats[]
  selected: string[]
  focusId: string
  onToggle: (id: string) => void
}) {
  return (
    <div className="spain-map" aria-label="Карта городов Испании">
      <svg viewBox="0 0 100 100" role="img">
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d8ebe6" />
            <stop offset="100%" stopColor="#c5ddd6" />
          </linearGradient>
        </defs>
        {/* Simplified Iberian + islands silhouette */}
        <path
          className="land"
          d="M18,22 C22,14 34,10 44,11 C54,8 66,12 74,18 C82,24 86,34 84,44 C88,52 86,62 78,68 C70,78 58,84 46,86 C34,88 24,82 18,72 C12,62 10,48 12,36 C12,30 14,26 18,22 Z"
          fill="url(#land)"
        />
        <ellipse className="land island" cx="78" cy="52" rx="5.5" ry="3.2" fill="url(#land)" />
        <ellipse className="land island" cx="10" cy="90" rx="7" ry="3.5" fill="url(#land)" />
        {cities.map((city) => {
          const on = selected.includes(city.id)
          const focus = focusId === city.id
          return (
            <g key={city.id} className={`map-city${on ? ' on' : ''}${focus ? ' focus' : ''}`}>
              <circle
                cx={city.mapX}
                cy={city.mapY}
                r={focus ? 2.8 : on ? 2.3 : 1.8}
                className="dot"
                onClick={() => onToggle(city.id)}
              />
              <text
                x={city.mapX}
                y={city.mapY - 3.2}
                className="label"
                onClick={() => onToggle(city.id)}
              >
                {city.nameEs.split(' ')[0]}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="map-hint">Клик по точке — добавить/убрать город</p>
    </div>
  )
}
