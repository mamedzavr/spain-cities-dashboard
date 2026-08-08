# España Atlas — сравнение жизни в городах Испании

Интерактивный дашборд: аренда и рост цен, бюджеты, работа, климат/жара, воздух, интернет, школы, безопасность и образ жизни в **16 городах** Испании.

**Города:** Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Granada, Alicante, A Coruña, Palma de Mallorca, Las Palmas, Murcia, Santander, Vitoria-Gasteiz, Pamplona.

**Live:** https://mamedzavr.github.io/spain-cities-dashboard/

## Возможности

- Сравнение 1–16 городов, режим одного города
- Профили рейтинга: Баланс / Remote / Семья / Бюджет / Климат
- Карта Испании с кликабельными городами
- Бейджи качества данных (`official` / `mixed` / `estimated`)
- Метрики: рост аренды YoY, дни ≥35°C, PM2.5, Mbps, coworking, школы, связность, туристическое давление, налоговые заметки

## Стек

- Vite + React 19 + TypeScript
- Recharts
- GitHub Actions → GitHub Pages

## Локальный запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Структура

```
src/
  App.tsx
  components/     # UI-блоки
  data/
    cities.ts     # данные городов
    metrics.ts    # метрики и источники
    scoring.ts    # профили и формулы рейтинга
  types.ts
```

## Данные

- Numbeo COL/Crime (Madrid, Barcelona, Valencia — Aug 2026)
- Idealista (€/м², рост аренды)
- INE / региональный рынок труда
- AEMET (климат, жаркие дни)
- MIR Balance de Criminalidad 2024
- EEA/MITECO (PM2.5 proxies), Ookla/CNMC (Mbps)
- Soft-индексы 0–100 — композиты для сравнения

## Лицензия

MIT
