import type { WorldBankPaginationHeader, WorldBankIndicatorValue, WorldBankCountry } from '@/types/api'
import type { CountryIndicatorSeries, IndicatorDataPoint } from '@/types/indicator'
import { WORLD_BANK_BASE_URL } from '@/utils/constants'

export class ApiError extends Error {
  status: number
  endpoint: string

  constructor(status: number, message: string, endpoint: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.endpoint = endpoint
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`, url)
  }
  return response.json()
}

export async function fetchIndicator(
  countryCodes: string | string[],
  indicatorCode: string,
  dateRange?: { start: number; end: number }
): Promise<CountryIndicatorSeries[]> {
  const codes = Array.isArray(countryCodes) ? countryCodes.join(';') : countryCodes
  const dateParam = dateRange ? `&date=${dateRange.start}:${dateRange.end}` : ''
  const url = `${WORLD_BANK_BASE_URL}/country/${codes}/indicator/${indicatorCode}?format=json&per_page=1000${dateParam}`

  const raw = await fetchJson<[WorldBankPaginationHeader, WorldBankIndicatorValue[] | null]>(url)

  // World Bank returns [pagination, data[]] - data can be null if no results
  const data = raw[1]
  if (!data || data.length === 0) {
    return []
  }

  // Handle pagination if needed
  const pagination = raw[0]
  let allData = [...data]

  if (pagination.pages > 1) {
    const pagePromises: Promise<[WorldBankPaginationHeader, WorldBankIndicatorValue[] | null]>[] = []
    for (let page = 2; page <= pagination.pages; page++) {
      pagePromises.push(fetchJson(`${url}&page=${page}`))
    }
    const pages = await Promise.all(pagePromises)
    for (const page of pages) {
      if (page[1]) {
        allData = allData.concat(page[1])
      }
    }
  }

  // Group by country
  const grouped = new Map<string, { countryName: string; points: IndicatorDataPoint[] }>()

  for (const item of allData) {
    if (item.value === null) continue

    const key = item.countryiso3code
    if (!grouped.has(key)) {
      grouped.set(key, { countryName: item.country.value, points: [] })
    }
    grouped.get(key)!.points.push({
      year: parseInt(item.date, 10),
      value: item.value,
    })
  }

  // Sort each country's data by year ascending
  const result: CountryIndicatorSeries[] = []
  for (const [code, { countryName, points }] of grouped) {
    points.sort((a, b) => a.year - b.year)
    result.push({
      countryCode: code,
      countryName,
      indicatorCode,
      data: points,
    })
  }

  return result
}

export async function fetchCountries(): Promise<WorldBankCountry[]> {
  const url = `${WORLD_BANK_BASE_URL}/country/all?format=json&per_page=300`
  const raw = await fetchJson<[WorldBankPaginationHeader, WorldBankCountry[]]>(url)
  return raw[1] || []
}
