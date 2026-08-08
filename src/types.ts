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
  | 'Cantabria'
  | 'Navarra'
  | 'Murcia'

export type Coast =
  | 'inland'
  | 'mediterranean'
  | 'atlantic'
  | 'cantabrian'
  | 'island'

/** How hard the hard numbers are to trust for this city */
export type DataQuality = 'official' | 'mixed' | 'estimated'

export interface CityStats {
  id: string
  name: string
  nameEs: string
  region: Region
  coast: Coast
  population: number
  /** Approximate map position on Spain silhouette (0–100) */
  mapX: number
  mapY: number
  dataQuality: DataQuality
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
  /** Idealista-style YoY rent change %, approx 2024→2025 */
  rentYoY: number
  mealInexpensive: number
  mealForTwo: number
  cappuccino: number
  beerDraft: number
  groceriesMonthly: number
  utilities: number
  internet: number
  /** Median fixed broadband download Mbps (Ookla/CNMC-calibrated) */
  internetMbps: number
  transportPass: number
  fitness: number
  cinema: number
  coworkingMonthly: number
  /** Average monthly net salary after tax (€) */
  salaryNet: number
  unemployment: number
  /** Share of salary spent on typical 1BR rent (approx %) */
  rentBurden: number
  sunnyDays: number
  avgTempSummer: number
  avgTempWinter: number
  rainfallMm: number
  /** Days/year with Tmax ≥ 35°C (AEMET-calibrated) */
  heatDaysAbove35: number
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
  /** Composite air quality 0–100 (higher = cleaner) */
  airQuality: number
  /** Annual mean PM2.5 µg/m³ (EEA/MITECO-calibrated) */
  pm25: number
  englishFriendly: number
  jobMarket: number
  techScene: number
  nightlife: number
  culture: number
  beachAccess: number
  walkability: number
  familyFriendly: number
  expatCommunity: number
  /** Schools / education proxy 0–100 (PISA region + city amenity) */
  schoolScore: number
  /** Airport + AVE + highway connectivity 0–100 */
  connectivity: number
  /** Short-term rental / overtourism pressure 0–100 */
  tourismPressure: number
  singleMonthlyExRent: number
  familyMonthlyExRent: number
  /** Short note on regional tax / special regimes */
  taxNote: string
  highlights: string[]
  tradeoffs: string[]
  vibe: string
  dataNote?: string
}

export type MetricKey = keyof Pick<
  CityStats,
  | 'rent1brCenter'
  | 'rent1brOutside'
  | 'rent3brCenter'
  | 'rentPerSqm'
  | 'buyPerSqmCenter'
  | 'rentYoY'
  | 'rentBurden'
  | 'mealInexpensive'
  | 'groceriesMonthly'
  | 'utilities'
  | 'internet'
  | 'internetMbps'
  | 'transportPass'
  | 'coworkingMonthly'
  | 'salaryNet'
  | 'unemployment'
  | 'costOfLivingIndex'
  | 'safetyIndex'
  | 'crimeIndex'
  | 'crimeRatePer1000'
  | 'theftRatePer1000'
  | 'violentRobberyPer1000'
  | 'healthcareIndex'
  | 'sunnyDays'
  | 'avgTempSummer'
  | 'avgTempWinter'
  | 'rainfallMm'
  | 'heatDaysAbove35'
  | 'airQuality'
  | 'pm25'
  | 'jobMarket'
  | 'techScene'
  | 'beachAccess'
  | 'walkability'
  | 'nightlife'
  | 'culture'
  | 'englishFriendly'
  | 'familyFriendly'
  | 'expatCommunity'
  | 'schoolScore'
  | 'connectivity'
  | 'tourismPressure'
  | 'singleMonthlyExRent'
  | 'familyMonthlyExRent'
  | 'fitness'
  | 'cinema'
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

export type PersonaId = 'balanced' | 'remote' | 'family' | 'budget' | 'climate'

export interface Persona {
  id: PersonaId
  label: string
  hint: string
}
