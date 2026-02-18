export interface Country {
  iso2: string
  iso3: string
  name: string
  officialName: string
  flag: string
  flagSvg: string
  region: string
  subregion: string
  population: number
  capitalCity: string
  lat: number
  lng: number
  currencies: Record<string, { name: string; symbol: string }>
  languages: Record<string, string>
  incomeLevel: string
  borders: string[]
}

export interface CountrySearchItem {
  iso3: string
  iso2: string
  name: string
  flag: string
  region: string
}
