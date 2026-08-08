export type Region =
  | 'Centro'
  | 'Cataluña'
  | 'Com. Valenciana'
  | 'Andalucía'
  | 'País Vasco'
  | 'Aragón'
  | 'Galicia'
  | 'Baleares'
  | 'Canarias'

export type Coast =
  | 'inland'
  | 'mediterranean'
  | 'atlantic'
  | 'cantabrian'
  | 'island'

export interface CityStats {
  id: string
  name: string
  nameEs: string
  region: Region
  coast: Coast
  population: number
  /** Numbeo-style COL index (NYC = 100), approx */
  costOfLivingIndex: number
  rentIndex: number
  /** € / m² / month, Idealista mid-2025 */
  rentPerSqm: number
  rent1brCenter: number
  rent1brOutside: number
  rent3brCenter: number
  rent3brOutside: number
  buyPerSqmCenter: number
  mealInexpensive: number
  mealForTwo: number
  cappuccino: number
  beerDraft: number
  groceriesMonthly: number
  utilities: number
  internet: number
  transportPass: number
  fitness: number
  cinema: number
  /** Average monthly net salary after tax (€) */
  salaryNet: number
  unemployment: number
  /** Share of salary spent on typical 1BR rent (approx %) */
  rentBurden: number
  sunnyDays: number
  avgTempSummer: number
  avgTempWinter: number
  rainfallMm: number
  /** Numbeo Safety Index (higher = safer) */
  safetyIndex: number
  /** Numbeo Crime Index (higher = more crime perceived) */
  crimeIndex: number
  /** Official conventional crimes / 1000 inhab. (MIR 2024) */
  crimeRatePer1000: number
  /** Official thefts (hurtos) / 1000 inhab. (MIR 2024) */
  theftRatePer1000: number
  /** Official violent robberies / 1000 inhab. (MIR 2024) */
  violentRobberyPer1000: number
  healthcareIndex: number
  airQuality: number
  englishFriendly: number
  jobMarket: number
  techScene: number
  nightlife: number
  culture: number
  beachAccess: number
  walkability: number
  familyFriendly: number
  expatCommunity: number
  singleMonthlyExRent: number
  familyMonthlyExRent: number
  highlights: string[]
  tradeoffs: string[]
  vibe: string
  dataNote?: string
}

export type MetricKey = keyof Pick<
  CityStats,
  | 'rent1brCenter'
  | 'rent1brOutside'
  | 'rentPerSqm'
  | 'buyPerSqmCenter'
  | 'mealInexpensive'
  | 'groceriesMonthly'
  | 'utilities'
  | 'transportPass'
  | 'salaryNet'
  | 'unemployment'
  | 'rentBurden'
  | 'costOfLivingIndex'
  | 'safetyIndex'
  | 'crimeIndex'
  | 'crimeRatePer1000'
  | 'theftRatePer1000'
  | 'violentRobberyPer1000'
  | 'healthcareIndex'
  | 'sunnyDays'
  | 'jobMarket'
  | 'techScene'
  | 'beachAccess'
  | 'walkability'
  | 'singleMonthlyExRent'
  | 'familyMonthlyExRent'
>

export interface MetricDef {
  key: MetricKey
  label: string
  unit: string
  category: CategoryId
  /** lower is better for ranking bars */
  lowerIsBetter?: boolean
  format?: 'euro' | 'percent' | 'number' | 'index'
}

export type CategoryId =
  | 'overview'
  | 'housing'
  | 'food'
  | 'finance'
  | 'work'
  | 'climate'
  | 'safety'
  | 'lifestyle'
