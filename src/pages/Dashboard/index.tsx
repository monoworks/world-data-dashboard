import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { useIndicatorData, useMultiIndicator } from '@/hooks/useIndicator'
import { useFileStorage } from '@/hooks/useFileStorage'
import { useUIStore } from '@/stores/uiStore'
import { WorldChoroplethMap } from '@/components/charts/WorldChoroplethMap'
import { BarChart } from '@/components/charts/BarChart'
import { DataCard } from '@/components/common/DataCard'
import { IndicatorCategoryTabs } from '@/components/common/IndicatorCategoryTabs'
import { DataExportButton } from '@/components/common/DataExportButton'
import { ErrorState } from '@/components/common/ErrorState'
import {
  getIndicatorsByCategory,
  WORLD_COUNTRY_CODE,
} from '@/utils/constants'
import { getIndicatorFormatter, formatCurrency, formatPopulation, formatPercent } from '@/utils/formatters'
import { t, indicatorName } from '@/utils/i18n'
import type { IndicatorCategory } from '@/types/indicator'

const OVERVIEW_INDICATORS = [
  { code: 'SP.POP.TOTL', labelKey: 'dashboard.worldPopulation' as const, format: formatPopulation },
  { code: 'NY.GDP.MKTP.CD', labelKey: 'dashboard.globalGDP' as const, format: (v: number) => formatCurrency(v) },
  { code: 'SP.DYN.LE00.IN', labelKey: 'dashboard.avgLifeExpectancy' as const, format: (v: number) => `${v.toFixed(1)} yrs` },
  { code: 'SL.UEM.TOTL.ZS', labelKey: 'dashboard.avgUnemployment' as const, format: (v: number) => formatPercent(v) },
]

const OVERVIEW_CODES = OVERVIEW_INDICATORS.map((ind) => ind.code)

export default function Dashboard() {
  const navigate = useNavigate()
  const lang = useUIStore((s) => s.lang)
  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory>('economy')
  const { exportIndicatorData } = useFileStorage()

  const categoryIndicators = getIndicatorsByCategory(selectedCategory)
  const [selectedIndicatorIndex, setSelectedIndicatorIndex] = useState(0)
  const selectedIndicator = categoryIndicators[selectedIndicatorIndex] || categoryIndicators[0]

  // Fetch world overview data using useQueries (proper hook usage)
  const overviewQueries = useMultiIndicator(
    WORLD_COUNTRY_CODE,
    OVERVIEW_CODES,
    { start: 2020, end: 2023 }
  )

  // Fetch all-countries data for selected indicator (latest year)
  const mapQuery = useIndicatorData('all', selectedIndicator?.code || '', {
    start: 2020,
    end: 2023,
  }, !!selectedIndicator)

  // Process map data: take latest available value per country
  const mapData = useMemo(() => {
    if (!mapQuery.data) return []
    return mapQuery.data.map((series) => {
      const latestPoint = series.data[series.data.length - 1]
      return {
        countryCode: series.countryCode,
        value: latestPoint?.value ?? 0,
      }
    }).filter((d) => d.value !== 0)
  }, [mapQuery.data])

  // Top 10 countries for bar chart
  const top10 = useMemo(() => {
    return [...mapData]
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map((d) => {
        const series = mapQuery.data?.find((s) => s.countryCode === d.countryCode)
        return {
          name: series?.countryName || d.countryCode,
          value: d.value,
        }
      })
  }, [mapData, mapQuery.data])

  const handleCountryClick = (iso3: string) => {
    navigate(`/country/${iso3.toLowerCase()}`)
  }

  const handleExport = () => {
    if (mapQuery.data) {
      exportIndicatorData(
        mapQuery.data,
        [selectedIndicator.code],
        { start: 2020, end: 2023 }
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-[hsl(var(--primary))]" />
        <h1 className="text-3xl font-bold">{t('dashboard.title', lang)}</h1>
      </div>
      <p className="text-[hsl(var(--muted-foreground))]">
        {t('app.description', lang)}
      </p>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_INDICATORS.map((ind, i) => {
          const query = overviewQueries[i]
          const series = query?.data?.[0]
          const latestData = series?.data[series.data.length - 1]
          const prevData = series?.data.length && series.data.length >= 2
            ? series.data[series.data.length - 2]
            : undefined

          return (
            <DataCard
              key={ind.code}
              title={t(ind.labelKey, lang)}
              value={latestData?.value != null ? ind.format(latestData.value) : '--'}
              currentValue={latestData?.value ?? undefined}
              previousValue={prevData?.value ?? undefined}
              loading={query?.isLoading || false}
            />
          )
        })}
      </div>

      {/* Category tabs + indicator selector */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <IndicatorCategoryTabs
            selected={selectedCategory}
            onSelect={(cat) => {
              setSelectedCategory(cat)
              setSelectedIndicatorIndex(0)
            }}
          />
          <DataExportButton onClick={handleExport} label={t('dashboard.exportMapData', lang)} />
        </div>

        {/* Indicator sub-selector */}
        <div className="flex flex-wrap gap-2">
          {categoryIndicators.map((ind, i) => (
            <button
              key={ind.code}
              onClick={() => setSelectedIndicatorIndex(i)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                i === selectedIndicatorIndex
                  ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
              }`}
            >
              {indicatorName(ind, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* World Map */}
      {mapQuery.isError ? (
        <ErrorState onRetry={() => mapQuery.refetch()} />
      ) : (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <h2 className="text-lg font-semibold mb-3">
            {indicatorName(selectedIndicator, lang) || t('dashboard.selectIndicator', lang)}
          </h2>
          <WorldChoroplethMap
            data={mapData}
            indicatorCode={selectedIndicator?.code || ''}
            onCountryClick={handleCountryClick}
            loading={mapQuery.isLoading}
            height={450}
          />
        </div>
      )}

      {/* Top 10 Countries */}
      {top10.length > 0 && (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <h2 className="text-lg font-semibold mb-3">
            {t('dashboard.top10', lang)} - {indicatorName(selectedIndicator, lang)}
          </h2>
          <BarChart
            data={top10}
            horizontal={true}
            height={350}
            formatValue={getIndicatorFormatter(selectedIndicator?.code || '')}
            loading={mapQuery.isLoading}
          />
        </div>
      )}
    </div>
  )
}
