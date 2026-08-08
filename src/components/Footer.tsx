import { SOURCES } from '../data'

export function Footer() {
  return (
    <footer className="footer">
      <strong>Источники и оговорки.</strong> COL/crime: Numbeo (Aug 2026) для Madrid /
      Barcelona / Valencia. Аренда €/м² и YoY: Idealista 2024–2025. Преступность: Numbeo +
      Balance de Criminalidad 2024 (MIR). Климат/жара: AEMET-калибровка. PM2.5: EEA/MITECO
      proxies. Интернет Mbps: Ookla/CNMC-калибровка. Soft-индексы 0–100 и города без Numbeo —
      композиты для сравнения; смотрите бейдж качества данных.
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
  )
}
