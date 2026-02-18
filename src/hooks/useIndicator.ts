import { useQuery, useQueries } from '@tanstack/react-query'
import { fetchIndicator } from '@/services/worldbank'
import type { CountryIndicatorSeries } from '@/types/indicator'
import { DEFAULT_YEAR_RANGE } from '@/utils/constants'

export function useIndicatorData(
  countryCodes: string | string[],
  indicatorCode: string,
  dateRange?: { start: number; end: number },
  enabled = true
) {
  const codes = Array.isArray(countryCodes) ? countryCodes : [countryCodes]
  const range = dateRange || DEFAULT_YEAR_RANGE

  return useQuery<CountryIndicatorSeries[]>({
    queryKey: ['indicator', indicatorCode, codes.sort().join(','), range.start, range.end],
    queryFn: () => fetchIndicator(codes, indicatorCode, range),
    enabled: enabled && codes.length > 0 && indicatorCode.length > 0,
  })
}

export function useMultiIndicator(
  countryCode: string | string[],
  indicatorCodes: string[],
  dateRange?: { start: number; end: number }
) {
  const codes = Array.isArray(countryCode) ? countryCode : [countryCode]
  const codesKey = codes.sort().join(',')
  const range = dateRange || DEFAULT_YEAR_RANGE

  return useQueries({
    queries: indicatorCodes.map((code) => ({
      queryKey: ['indicator', code, codesKey, range.start, range.end],
      queryFn: () => fetchIndicator(codes, code, range),
      enabled: codes.length > 0 && codes[0].length > 0 && code.length > 0,
    })),
  })
}
