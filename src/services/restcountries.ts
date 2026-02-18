import type { RestCountry } from '@/types/api'
import { REST_COUNTRIES_BASE_URL } from '@/utils/constants'

export async function fetchAllCountries(): Promise<RestCountry[]> {
  // REST Countries API v3.1 allows max 10 fields per request
  const fields = 'name,cca2,cca3,capital,region,subregion,population,flags,latlng,unMember'
  const url = `${REST_COUNTRIES_BASE_URL}/all?fields=${fields}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`REST Countries API failed: ${response.status} ${response.statusText}`)
  }
  const data: RestCountry[] = await response.json()
  // Filter to UN member states only
  return data.filter((c) => c.unMember === true)
}

export async function fetchCountryByCode(code: string): Promise<RestCountry> {
  const fields = 'name,cca2,cca3,capital,region,subregion,population,flags,latlng,unMember'
  const response = await fetch(`${REST_COUNTRIES_BASE_URL}/alpha/${code}?fields=${fields}`)
  if (!response.ok) {
    throw new Error(`REST Countries API failed for ${code}: ${response.statusText}`)
  }
  const data = await response.json()
  return Array.isArray(data) ? data[0] : data
}
