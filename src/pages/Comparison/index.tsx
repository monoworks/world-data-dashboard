import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GitCompareArrows } from 'lucide-react'
import { useCountries } from '@/hooks/useCountries'
import { useIndicatorData } from '@/hooks/useIndicator'
import { useFileStorage } from '@/hooks/useFileStorage'
import { useUIStore } from '@/stores/uiStore'
import { LineChart } from '@/components/charts/LineChart'
import { BarChart } from '@/components/charts/BarChart'
import { CountrySelector } from '@/components/common/CountrySelector'
import { TimeRangeSelector } from '@/components/common/TimeRangeSelector'
import { DataExportButton } from '@/components/common/DataExportButton'
import { ErrorState } from '@/components/common/ErrorState'
import { IndicatorCategoryTabs } from '@/components/common/IndicatorCategoryTabs'
import {
  INDICATOR_REGISTRY,
  DEFAULT_YEAR_RANGE,
  COMPARISON_COLORS,
  getIndicatorsByCategory,
} from '@/utils/constants'
import { getIndicatorFormatter } from '@/utils/formatters'
import { t, indicatorName } from '@/utils/i18n'
import type { IndicatorCategory } from '@/types/indicator'

export default function Comparison() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchItems, isLoading: countriesLoading, isError: countriesError, refetch: refetchCountries } = useCountries()
  const { exportIndicatorData } = useFileStorage()
  const lang = useUIStore((s) => s.lang)

  // URL-driven state
  const countriesParam = searchParams.get('countries') || ''
  const indicatorParam = searchParams.get('indicator') || 'NY.GDP.MKTP.CD'
  const startParam = Number(searchParams.get('start')) || DEFAULT_YEAR_RANGE.start
  const endParam = Number(searchParams.get('end')) || DEFAULT_YEAR_RANGE.end

  const selectedCountries = countriesParam ? countriesParam.split(',').filter(Boolean) : []
  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory>('economy')

  const categoryIndicators = getIndicatorsByCategory(selectedCategory)
  const selectedIndicator = INDICATOR_REGISTRY[indicatorParam] ?? categoryIndicators[0]
  const indicatorCode = selectedIndicator?.code ?? indicatorParam

  // Fetch comparison data
  const comparisonQuery = useIndicatorData(
    selectedCountries,
    indicatorCode,
    { start: startParam, end: endParam },
    selectedCountries.length > 0 && indicatorCode.length > 0
  )

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams)
    for (const [k, v] of Object.entries(updates)) {
      if (v) newParams.set(k, v)
      else newParams.delete(k)
    }
    setSearchParams(newParams)
  }

  const handleCountriesChange = (codes: string | string[]) => {
    const arr = Array.isArray(codes) ? codes : [codes]
    updateParams({ countries: arr.join(',') })
  }

  const handleIndicatorChange = (code: string) => {
    updateParams({ indicator: code })
  }

  // Build chart series
  const { lineSeries, xAxisData, barData } = useMemo(() => {
    if (!comparisonQuery.data) return { lineSeries: [], xAxisData: [], barData: [] }

    const allYears = new Set<number>()
    comparisonQuery.data.forEach((s) => s.data.forEach((d) => allYears.add(d.year)))
    const sortedYears = [...allYears].sort()
    const xData = sortedYears.map(String)

    const lines = comparisonQuery.data.map((s) => {
      const dataMap = new Map(s.data.map((d) => [d.year, d.value]))
      return {
        name: s.countryName,
        data: sortedYears.map((y) => dataMap.get(y) ?? null),
      }
    })

    const bars = comparisonQuery.data.map((s) => {
      const latest = s.data[s.data.length - 1]
      return { name: s.countryName, value: latest?.value ?? 0 }
    })

    return { lineSeries: lines, xAxisData: xData, barData: bars }
  }, [comparisonQuery.data])

  const formatter = getIndicatorFormatter(indicatorCode)

  const handleExport = () => {
    if (comparisonQuery.data) {
      exportIndicatorData(comparisonQuery.data, [indicatorCode], {
        start: startParam,
        end: endParam,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitCompareArrows className="h-8 w-8 text-[hsl(var(--primary))]" />
        <h1 className="text-3xl font-bold">{t('comparison.title', lang)}</h1>
      </div>

      {/* Controls */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t('comparison.countries', lang)}</label>
            {countriesLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--muted-foreground))]">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[hsl(var(--primary))]" />
                {t('comparison.loadingCountries', lang)}
              </div>
            ) : countriesError ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-sm">
                <span className="text-red-600 dark:text-red-400">{t('comparison.failedLoadCountries', lang)}</span>
                <button
                  onClick={() => refetchCountries()}
                  className="text-red-700 dark:text-red-300 underline hover:no-underline text-xs"
                >
                  {t('comparison.retry', lang)}
                </button>
              </div>
            ) : (
              <CountrySelector
                countries={searchItems}
                selected={selectedCountries}
                onSelect={handleCountriesChange}
                multiple={true}
                maxSelections={5}
                placeholder={t('comparison.selectCountries', lang)}
              />
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t('comparison.timeRange', lang)}</label>
            <TimeRangeSelector
              startYear={startParam}
              endYear={endParam}
              onChangeStart={(y) => updateParams({ start: y.toString() })}
              onChangeEnd={(y) => updateParams({ end: y.toString() })}
            />
          </div>
        </div>

        {/* Indicator selection */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">{t('comparison.indicator', lang)}</label>
          <IndicatorCategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryIndicators.map((ind) => (
              <button
                key={ind.code}
                onClick={() => handleIndicatorChange(ind.code)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  ind.code === (indicatorCode)
                    ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
                }`}
              >
                {indicatorName(ind, lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {selectedCountries.length === 0 ? (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-12 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            {t('comparison.selectPrompt', lang)}
          </p>
        </div>
      ) : comparisonQuery.isError ? (
        <ErrorState onRetry={() => comparisonQuery.refetch()} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {indicatorName(selectedIndicator, lang) || indicatorParam}
            </h2>
            <DataExportButton onClick={handleExport} />
          </div>

          {/* Line chart */}
          <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
            <h3 className="text-sm font-medium mb-2">{t('comparison.trendOverTime', lang)}</h3>
            <LineChart
              series={lineSeries}
              xAxisData={xAxisData}
              formatTooltip={formatter}
              height={400}
              loading={comparisonQuery.isLoading}
              colors={COMPARISON_COLORS}
              showDataZoom={true}
            />
          </div>

          {/* Bar chart comparison */}
          {barData.length > 0 && (
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <h3 className="text-sm font-medium mb-2">{t('comparison.latestValues', lang)}</h3>
              <BarChart
                data={barData}
                formatValue={formatter}
                height={300}
                loading={comparisonQuery.isLoading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
