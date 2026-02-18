import { useQueryClient } from '@tanstack/react-query'
import { downloadAsJson, importFromJson, generateFilename } from '@/utils/fileStorage'
import type { ExportData } from '@/utils/fileStorage'
import type { CountryIndicatorSeries } from '@/types/indicator'
import { useCallback } from 'react'

export function useFileStorage() {
  const queryClient = useQueryClient()

  const exportIndicatorData = useCallback(
    (
      series: CountryIndicatorSeries[],
      indicatorCodes: string[],
      dateRange?: { start: number; end: number }
    ) => {
      const countries = [...new Set(series.map((s) => s.countryCode))]
      const metadata = { countries, indicators: indicatorCodes, dateRange }
      const exportObj: ExportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        type: 'indicators',
        metadata,
        data: series,
      }
      const filename = generateFilename('indicators', metadata)
      downloadAsJson(exportObj, filename)
    },
    []
  )

  const exportFullSnapshot = useCallback(() => {
    const allQueries = queryClient.getQueriesData({ queryKey: [] })
    const snapshot: Record<string, unknown> = {}
    for (const [key, data] of allQueries) {
      if (data !== undefined) {
        snapshot[JSON.stringify(key)] = data
      }
    }
    const exportObj: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      type: 'full-snapshot',
      metadata: {},
      data: snapshot,
    }
    const filename = generateFilename('full-snapshot')
    downloadAsJson(exportObj, filename)
  }, [queryClient])

  const importData = useCallback(
    async (file: File): Promise<{ type: string; count: number }> => {
      const imported = await importFromJson(file)

      switch (imported.type) {
        case 'indicators': {
          const series = imported.data as CountryIndicatorSeries[]
          // Group by indicator and country combination to set query data
          const byIndicator = new Map<string, CountryIndicatorSeries[]>()
          for (const s of series) {
            const key = s.indicatorCode
            if (!byIndicator.has(key)) byIndicator.set(key, [])
            byIndicator.get(key)!.push(s)
          }
          for (const [indicatorCode, indicatorSeries] of byIndicator) {
            const countries = indicatorSeries.map((s) => s.countryCode).sort().join(',')
            const years = indicatorSeries.flatMap((s) => s.data.map((d) => d.year))
            const start = Math.min(...years)
            const end = Math.max(...years)
            queryClient.setQueryData(
              ['indicator', indicatorCode, countries, start, end],
              indicatorSeries
            )
          }
          return { type: 'indicators', count: series.length }
        }

        case 'countries': {
          queryClient.setQueryData(['countries'], imported.data)
          const arr = imported.data as unknown[]
          return { type: 'countries', count: Array.isArray(arr) ? arr.length : 0 }
        }

        case 'full-snapshot': {
          const snapshot = imported.data as Record<string, unknown>
          let count = 0
          for (const [keyStr, data] of Object.entries(snapshot)) {
            try {
              const key = JSON.parse(keyStr)
              queryClient.setQueryData(key, data)
              count++
            } catch {
              // Skip invalid keys
            }
          }
          return { type: 'full-snapshot', count }
        }

        default:
          throw new Error(`Unknown data type: ${imported.type}`)
      }
    },
    [queryClient]
  )

  return {
    exportIndicatorData,
    exportFullSnapshot,
    importData,
  }
}
