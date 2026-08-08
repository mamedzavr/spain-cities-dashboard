import type { CityStats, Persona, PersonaId } from '../types'

export const personas: Persona[] = [
  {
    id: 'balanced',
    label: 'Баланс',
    hint: 'Зарплата, жильё, безопасность, климат и сервисы без перекоса',
  },
  {
    id: 'remote',
    label: 'Remote',
    hint: 'Интернет, coworking, tech-сцена, английский и связность',
  },
  {
    id: 'family',
    label: 'Семья',
    hint: 'Школы, безопасность, воздух, family-friendly и доступность жилья',
  },
  {
    id: 'budget',
    label: 'Бюджет',
    hint: 'Аренда, COL, рост цен и остаток зарплаты после жилья',
  },
  {
    id: 'climate',
    label: 'Климат',
    hint: 'Солнце и пляж без экстремальной жары и смога',
  },
]

export function affordabilityScore(city: CityStats): number {
  const rentShare = city.rent1brCenter / city.salaryNet
  const col = city.costOfLivingIndex / 100
  const yoyPenalty = Math.max(0, city.rentYoY - 5) * 1.2
  const raw = 100 - rentShare * 65 - col * 22 - yoyPenalty
  return Math.max(5, Math.min(95, Math.round(raw)))
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n))
}

function heatComfort(city: CityStats): number {
  // Prefer sun, but punish extreme heat days
  const sun = (city.sunnyDays / 320) * 100
  const heatPenalty = Math.min(45, city.heatDaysAbove35 * 0.7)
  return clamp(sun * 0.7 + (100 - heatPenalty) * 0.3)
}

function airScore(city: CityStats): number {
  // Blend composite with PM2.5 (WHO guideline ~5, EU limit 25)
  const fromPm = clamp(100 - (city.pm25 - 5) * 5)
  return clamp(city.airQuality * 0.45 + fromPm * 0.55)
}

export function scoreCity(city: CityStats, persona: PersonaId = 'balanced'): number {
  const afford = affordabilityScore(city)
  const leftover =
    ((city.salaryNet - city.rent1brCenter - city.singleMonthlyExRent) / city.salaryNet) * 100

  const weights: Record<PersonaId, Record<string, number>> = {
    balanced: {
      afford: 0.16,
      salary: 0.1,
      job: 0.1,
      safety: 0.12,
      health: 0.07,
      climate: 0.09,
      walk: 0.06,
      culture: 0.06,
      beach: 0.04,
      unemp: 0.05,
      air: 0.05,
      school: 0.05,
      tourism: 0.05,
    },
    remote: {
      internet: 0.16,
      tech: 0.14,
      english: 0.1,
      cowork: 0.08,
      connect: 0.12,
      afford: 0.1,
      job: 0.1,
      climate: 0.08,
      culture: 0.06,
      safety: 0.06,
    },
    family: {
      school: 0.16,
      family: 0.14,
      safety: 0.14,
      air: 0.1,
      afford: 0.12,
      health: 0.1,
      walk: 0.08,
      unemp: 0.06,
      climate: 0.05,
      tourism: 0.05,
    },
    budget: {
      afford: 0.28,
      leftover: 0.18,
      rentYoY: 0.12,
      col: 0.12,
      salary: 0.1,
      unemp: 0.08,
      utilities: 0.06,
      safety: 0.06,
    },
    climate: {
      climate: 0.22,
      beach: 0.16,
      heat: 0.16,
      air: 0.14,
      rain: 0.1,
      walk: 0.08,
      afford: 0.08,
      tourism: 0.06,
    },
  }

  const values: Record<string, number> = {
    afford,
    salary: clamp(city.salaryNet / 22),
    job: city.jobMarket,
    safety: city.safetyIndex * 0.7 + (100 - city.crimeIndex) * 0.3,
    health: city.healthcareIndex,
    climate: heatComfort(city),
    heat: clamp(100 - city.heatDaysAbove35 * 1.2),
    walk: city.walkability,
    culture: city.culture,
    beach: city.beachAccess,
    unemp: clamp(100 - city.unemployment * 3.2),
    air: airScore(city),
    school: city.schoolScore,
    tourism: clamp(100 - city.tourismPressure * 0.85),
    internet: clamp(city.internetMbps / 2.6),
    tech: city.techScene,
    english: city.englishFriendly,
    cowork: clamp(100 - city.coworkingMonthly / 3.2),
    connect: city.connectivity,
    family: city.familyFriendly,
    leftover: clamp(leftover),
    rentYoY: clamp(100 - city.rentYoY * 5),
    col: clamp(100 - city.costOfLivingIndex),
    utilities: clamp(100 - city.utilities / 2.2),
    rain: clamp(100 - city.rainfallMm / 14),
  }

  const w = weights[persona]
  let sum = 0
  let totalW = 0
  for (const [k, weight] of Object.entries(w)) {
    sum += (values[k] ?? 0) * weight
    totalW += weight
  }
  return Math.round(sum / totalW)
}

/** @deprecated use scoreCity(city, persona) */
export function overallScore(city: CityStats, persona: PersonaId = 'balanced'): number {
  return scoreCity(city, persona)
}

export function cityListLabel(list: CityStats[], max = 4): string {
  const names = list.map((c) => c.nameEs)
  if (names.length <= max) return names.join(', ')
  return `${names.slice(0, max).join(', ')} +${names.length - max}`
}

export function qualityLabel(q: CityStats['dataQuality']): string {
  switch (q) {
    case 'official':
      return 'офиц. якоря'
    case 'mixed':
      return 'смешанные'
    default:
      return 'оценка'
  }
}
