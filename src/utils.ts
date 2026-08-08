import type { CityStats, MetricKey } from './types'
import type { MetricDef } from './types'

export const CITY_COLORS = ['#2a9d8f', '#e8a838', '#c45c3e', '#1a3544', '#3d7ea6', '#0b1f2a']

export const DEFAULT_IDS = ['madrid', 'barcelona', 'valencia', 'sevilla']

export function cityColor(index: number) {
  return CITY_COLORS[index % CITY_COLORS.length]
}

export function bestValue(values: number[], lowerIsBetter?: boolean) {
  return lowerIsBetter ? Math.min(...values) : Math.max(...values)
}

export function coastLabel(coast: CityStats['coast']) {
  switch (coast) {
    case 'mediterranean':
      return 'Средиземное море'
    case 'atlantic':
      return 'Атлантика'
    case 'cantabrian':
      return 'Бискайский залив'
    case 'island':
      return 'остров'
    default:
      return 'внутри страны'
  }
}

export const TABLE_ROWS: {
  label: string
  key: MetricKey
  lowerIsBetter?: boolean
  format?: MetricDef['format']
}[] = [
  { label: 'Аренда 1BR центр', key: 'rent1brCenter', lowerIsBetter: true, format: 'euro' },
  { label: 'Аренда 1BR вне центра', key: 'rent1brOutside', lowerIsBetter: true, format: 'euro' },
  { label: 'Аренда 3BR центр', key: 'rent3brCenter', lowerIsBetter: true, format: 'euro' },
  { label: 'Аренда €/м²', key: 'rentPerSqm', lowerIsBetter: true, format: 'euro' },
  { label: 'Покупка €/м² центр', key: 'buyPerSqmCenter', lowerIsBetter: true, format: 'euro' },
  { label: 'Рост аренды YoY', key: 'rentYoY', lowerIsBetter: true, format: 'percent' },
  { label: 'Обед в кафе', key: 'mealInexpensive', lowerIsBetter: true, format: 'euro' },
  { label: 'Продукты / мес', key: 'groceriesMonthly', lowerIsBetter: true, format: 'euro' },
  { label: 'Коммуналка', key: 'utilities', lowerIsBetter: true, format: 'euro' },
  { label: 'Интернет €', key: 'internet', lowerIsBetter: true, format: 'euro' },
  { label: 'Интернет Mbps', key: 'internetMbps', format: 'number' },
  { label: 'Проездной', key: 'transportPass', lowerIsBetter: true, format: 'euro' },
  { label: 'Coworking', key: 'coworkingMonthly', lowerIsBetter: true, format: 'euro' },
  { label: 'Бюджет single без аренды', key: 'singleMonthlyExRent', lowerIsBetter: true, format: 'euro' },
  { label: 'Бюджет семьи без аренды', key: 'familyMonthlyExRent', lowerIsBetter: true, format: 'euro' },
  { label: 'Зарплата net', key: 'salaryNet', format: 'euro' },
  { label: 'Безработица', key: 'unemployment', lowerIsBetter: true, format: 'percent' },
  { label: 'Доля зарплаты на аренду', key: 'rentBurden', lowerIsBetter: true, format: 'percent' },
  { label: 'Индекс преступности', key: 'crimeIndex', lowerIsBetter: true, format: 'index' },
  { label: 'Индекс безопасности', key: 'safetyIndex', format: 'index' },
  { label: 'Преступления / 1000 жит.', key: 'crimeRatePer1000', lowerIsBetter: true, format: 'number' },
  { label: 'Кражи / 1000 жит.', key: 'theftRatePer1000', lowerIsBetter: true, format: 'number' },
  { label: 'Грабежи / 1000 жит.', key: 'violentRobberyPer1000', lowerIsBetter: true, format: 'number' },
  { label: 'Солнечных дней', key: 'sunnyDays', format: 'number' },
  { label: 'Дни ≥35°C', key: 'heatDaysAbove35', lowerIsBetter: true, format: 'number' },
  { label: 'PM2.5', key: 'pm25', lowerIsBetter: true, format: 'number' },
  { label: 'Рынок труда', key: 'jobMarket', format: 'index' },
  { label: 'Tech-сцена', key: 'techScene', format: 'index' },
  { label: 'Школы', key: 'schoolScore', format: 'index' },
  { label: 'Связность', key: 'connectivity', format: 'index' },
  { label: 'Пляж', key: 'beachAccess', format: 'index' },
  { label: 'Для семей', key: 'familyFriendly', format: 'index' },
  { label: 'Expat', key: 'expatCommunity', format: 'index' },
  { label: 'Туристическое давление', key: 'tourismPressure', lowerIsBetter: true, format: 'index' },
]

export const radarKeys = [
  { key: 'jobMarket', label: 'Работа' },
  { key: 'techScene', label: 'Tech' },
  { key: 'safetyIndex', label: 'Безопасность' },
  { key: 'healthcareIndex', label: 'Здоровье' },
  { key: 'schoolScore', label: 'Школы' },
  { key: 'sunnyDays', label: 'Солнце', scale: (v: number) => Math.round((v / 320) * 100) },
  { key: 'beachAccess', label: 'Пляж' },
  { key: 'walkability', label: 'Пешком' },
  { key: 'airQuality', label: 'Воздух' },
  { key: 'culture', label: 'Культура' },
] as const
