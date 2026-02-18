export type IndicatorCategory = 'economy' | 'population' | 'trade' | 'social' | 'governance'

export interface IndicatorMeta {
  code: string
  name: string
  nameJa: string
  category: IndicatorCategory
  unit: string
  description: string
}

export interface IndicatorDataPoint {
  year: number
  value: number | null
}

export interface CountryIndicatorSeries {
  countryCode: string
  countryName: string
  indicatorCode: string
  data: IndicatorDataPoint[]
}
