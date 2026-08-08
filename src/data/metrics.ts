import type { MetricDef } from '../types'

export const SOURCES = [
  { name: 'Numbeo COL', url: 'https://www.numbeo.com/cost-of-living/country_result.jsp?country=Spain' },
  { name: 'Numbeo Crime', url: 'https://www.numbeo.com/crime/country_result.jsp?country=Spain' },
  { name: 'Idealista', url: 'https://www.idealista.com/news/' },
  { name: 'INE', url: 'https://www.ine.es/' },
  { name: 'AEMET', url: 'https://www.aemet.es/' },
  { name: 'Ministerio del Interior (Balance 2024)', url: 'https://www.interior.gob.es/' },
  { name: 'EEA Air Quality', url: 'https://www.eea.europa.eu/en/topics/in-depth/air-pollution' },
  { name: 'Ookla / CNMC broadband', url: 'https://www.cnmc.es/' },
]

export const metrics: MetricDef[] = [
  { key: 'costOfLivingIndex', label: 'Индекс стоимости жизни', unit: '', category: 'overview', format: 'index' },
  { key: 'rentBurden', label: 'Доля зарплаты на аренду', unit: '%', category: 'overview', lowerIsBetter: true, format: 'percent' },
  { key: 'salaryNet', label: 'Средняя чистая зарплата', unit: '€', category: 'overview', format: 'euro' },
  { key: 'crimeIndex', label: 'Индекс преступности', unit: '', category: 'overview', lowerIsBetter: true, format: 'index' },
  { key: 'rentYoY', label: 'Рост аренды YoY', unit: '%', category: 'overview', lowerIsBetter: true, format: 'percent' },

  { key: 'rent1brCenter', label: '1BR центр', unit: '€/мес', category: 'housing', lowerIsBetter: true, format: 'euro' },
  { key: 'rent1brOutside', label: '1BR вне центра', unit: '€/мес', category: 'housing', lowerIsBetter: true, format: 'euro' },
  { key: 'rent3brCenter', label: '3BR центр', unit: '€/мес', category: 'housing', lowerIsBetter: true, format: 'euro' },
  { key: 'rentPerSqm', label: 'Аренда €/м²', unit: '€', category: 'housing', lowerIsBetter: true, format: 'euro' },
  { key: 'buyPerSqmCenter', label: 'Покупка €/м² центр', unit: '€', category: 'housing', lowerIsBetter: true, format: 'euro' },
  { key: 'rentYoY', label: 'Рост аренды за год', unit: '%', category: 'housing', lowerIsBetter: true, format: 'percent' },
  { key: 'tourismPressure', label: 'Туристическое давление', unit: '/100', category: 'housing', lowerIsBetter: true, format: 'index' },

  { key: 'mealInexpensive', label: 'Обед в кафе', unit: '€', category: 'food', lowerIsBetter: true, format: 'euro' },
  { key: 'groceriesMonthly', label: 'Продукты / месяц', unit: '€', category: 'food', lowerIsBetter: true, format: 'euro' },
  { key: 'fitness', label: 'Фитнес', unit: '€/мес', category: 'food', lowerIsBetter: true, format: 'euro' },
  { key: 'cinema', label: 'Кино', unit: '€', category: 'food', lowerIsBetter: true, format: 'euro' },

  { key: 'utilities', label: 'Коммуналка', unit: '€', category: 'finance', lowerIsBetter: true, format: 'euro' },
  { key: 'internet', label: 'Интернет €', unit: '€', category: 'finance', lowerIsBetter: true, format: 'euro' },
  { key: 'transportPass', label: 'Проездной', unit: '€', category: 'finance', lowerIsBetter: true, format: 'euro' },
  { key: 'coworkingMonthly', label: 'Coworking', unit: '€/мес', category: 'finance', lowerIsBetter: true, format: 'euro' },
  { key: 'singleMonthlyExRent', label: 'Бюджет single без аренды', unit: '€', category: 'finance', lowerIsBetter: true, format: 'euro' },
  { key: 'familyMonthlyExRent', label: 'Бюджет семьи без аренды', unit: '€', category: 'finance', lowerIsBetter: true, format: 'euro' },

  { key: 'salaryNet', label: 'Зарплата net', unit: '€', category: 'work', format: 'euro' },
  { key: 'unemployment', label: 'Безработица', unit: '%', category: 'work', lowerIsBetter: true, format: 'percent' },
  { key: 'jobMarket', label: 'Рынок труда', unit: '/100', category: 'work', format: 'index' },
  { key: 'techScene', label: 'Tech-сцена', unit: '/100', category: 'work', format: 'index' },
  { key: 'englishFriendly', label: 'Английский в городе', unit: '/100', category: 'work', format: 'index' },
  { key: 'connectivity', label: 'Связность (AVE/аэропорт)', unit: '/100', category: 'work', format: 'index' },
  { key: 'internetMbps', label: 'Интернет Mbps', unit: 'Mbps', category: 'work', format: 'number' },

  { key: 'sunnyDays', label: 'Солнечных дней', unit: '', category: 'climate', format: 'number' },
  { key: 'heatDaysAbove35', label: 'Дни ≥35°C', unit: '', category: 'climate', lowerIsBetter: true, format: 'number' },
  { key: 'avgTempSummer', label: 'Лето °C', unit: '°C', category: 'climate', format: 'number' },
  { key: 'avgTempWinter', label: 'Зима °C', unit: '°C', category: 'climate', format: 'number' },
  { key: 'rainfallMm', label: 'Осадки мм/год', unit: 'мм', category: 'climate', lowerIsBetter: true, format: 'number' },
  { key: 'pm25', label: 'PM2.5 µg/m³', unit: '', category: 'climate', lowerIsBetter: true, format: 'number' },
  { key: 'airQuality', label: 'Качество воздуха', unit: '/100', category: 'climate', format: 'index' },

  { key: 'crimeIndex', label: 'Индекс преступности (Numbeo)', unit: '', category: 'safety', lowerIsBetter: true, format: 'index' },
  { key: 'safetyIndex', label: 'Индекс безопасности', unit: '/100', category: 'safety', format: 'index' },
  { key: 'crimeRatePer1000', label: 'Преступления / 1000 жит.', unit: '', category: 'safety', lowerIsBetter: true, format: 'number' },
  { key: 'theftRatePer1000', label: 'Кражи / 1000 жит.', unit: '', category: 'safety', lowerIsBetter: true, format: 'number' },
  { key: 'violentRobberyPer1000', label: 'Грабежи / 1000 жит.', unit: '', category: 'safety', lowerIsBetter: true, format: 'number' },

  { key: 'healthcareIndex', label: 'Здравоохранение', unit: '/100', category: 'lifestyle', format: 'index' },
  { key: 'schoolScore', label: 'Школы / образование', unit: '/100', category: 'lifestyle', format: 'index' },
  { key: 'beachAccess', label: 'Доступ к пляжу', unit: '/100', category: 'lifestyle', format: 'index' },
  { key: 'walkability', label: 'Пешеходность', unit: '/100', category: 'lifestyle', format: 'index' },
  { key: 'nightlife', label: 'Ночная жизнь', unit: '/100', category: 'lifestyle', format: 'index' },
  { key: 'culture', label: 'Культура', unit: '/100', category: 'lifestyle', format: 'index' },
  { key: 'familyFriendly', label: 'Для семей', unit: '/100', category: 'lifestyle', format: 'index' },
  { key: 'expatCommunity', label: 'Expat-сообщество', unit: '/100', category: 'lifestyle', format: 'index' },
]

export const categories = [
  { id: 'overview' as const, label: 'Обзор', hint: 'Ключевые цифры для выбора города' },
  { id: 'housing' as const, label: 'Жильё', hint: 'Аренда, покупка, рост цен и туристическое давление' },
  { id: 'food' as const, label: 'Еда', hint: 'Кафе, продукты и ежедневные траты' },
  { id: 'finance' as const, label: 'Финансы', hint: 'Коммуналка, интернет, транспорт, бюджеты' },
  { id: 'work' as const, label: 'Работа', hint: 'Зарплаты, tech, английский, связность' },
  { id: 'climate' as const, label: 'Климат', hint: 'Солнце, жара, осадки и воздух' },
  { id: 'safety' as const, label: 'Безопасность', hint: 'Numbeo + официальная статистика MIR 2024' },
  { id: 'lifestyle' as const, label: 'Образ жизни', hint: 'Здоровье, школы, море, культура, семья' },
]

export function formatMetric(value: number, format?: MetricDef['format']): string {
  switch (format) {
    case 'euro':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: value >= 100 ? 0 : 2,
      }).format(value)
    case 'percent':
      return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`
    case 'index':
      return value.toFixed(value < 20 ? 1 : 0)
    default:
      return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(value)
  }
}
