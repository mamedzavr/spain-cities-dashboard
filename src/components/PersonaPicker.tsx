import { personas } from '../data'
import type { PersonaId } from '../types'

export function PersonaPicker({
  value,
  onChange,
}: {
  value: PersonaId
  onChange: (id: PersonaId) => void
}) {
  const active = personas.find((p) => p.id === value)
  return (
    <div className="panel">
      <h2>Профиль рейтинга</h2>
      <div className="tabs" role="tablist" aria-label="Профиль рейтинга">
        {personas.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={value === p.id}
            className={`tab${value === p.id ? ' active' : ''}`}
            onClick={() => onChange(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="cat-hint">{active?.hint}</p>
    </div>
  )
}
