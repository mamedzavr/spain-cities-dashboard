# España Atlas — сравнение жизни в городах Испании

Интерактивный дашборд: аренда, еда, финансы, работа, климат и образ жизни в 12 городах Испании из разных регионов.

**Города:** Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Granada, Alicante, A Coruña, Palma de Mallorca, Las Palmas.

## Стек

- Vite + React + TypeScript
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

## Деплой на GitHub Pages

Workflow: `.github/workflows/deploy.yml`

1. Создайте репозиторий `spain-cities-dashboard` (или поправьте `base` в `vite.config.ts`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Push в `main` — сайт соберётся и задеплоится автоматически.

URL: `https://<user>.github.io/spain-cities-dashboard/`

## Данные

- Numbeo (Madrid, Barcelona, Valencia — Aug 2026)
- Idealista (€/m² аренда/покупка, 2025)
- INE / рыночный контекст зарплат и rent effort
- Lifestyle-индексы 0–100 — композитные оценки для сравнения

## Лицензия

MIT
