// World Bank API response types
export interface WorldBankPaginationHeader {
  page: number
  pages: number
  per_page: string
  total: number
}

export interface WorldBankIndicatorValue {
  indicator: { id: string; value: string }
  country: { id: string; value: string }
  countryiso3code: string
  date: string
  value: number | null
  unit: string
  obs_status: string
  decimal: number
}

export interface WorldBankCountry {
  id: string
  iso2Code: string
  name: string
  region: { id: string; value: string }
  adminregion: { id: string; value: string }
  incomeLevel: { id: string; value: string }
  lendingType: { id: string; value: string }
  capitalCity: string
  longitude: string
  latitude: string
}

// REST Countries API response types
export interface RestCountryCurrency {
  name: string
  symbol: string
}

export interface RestCountryName {
  common: string
  official: string
  nativeName?: Record<string, { official: string; common: string }>
}

export interface RestCountry {
  name: RestCountryName
  cca2: string
  cca3: string
  ccn3?: string
  capital?: string[]
  region: string
  subregion?: string
  population: number
  flags: { png: string; svg: string; alt?: string }
  currencies?: Record<string, RestCountryCurrency>
  languages?: Record<string, string>
  latlng?: [number, number]
  area?: number
  borders?: string[]
  unMember?: boolean
}
