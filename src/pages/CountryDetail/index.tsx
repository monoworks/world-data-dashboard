import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, GitCompareArrows } from 'lucide-react'
import { useCountries } from '@/hooks/useCountries'
import { useMultiIndicator } from '@/hooks/useIndicator'
import { useFileStorage } from '@/hooks/useFileStorage'
import { useUIStore } from '@/stores/uiStore'
import { LineChart } from '@/components/charts/LineChart'
import { DataCard } from '@/components/common/DataCard'
import { IndicatorCategoryTabs } from '@/components/common/IndicatorCategoryTabs'
import { TimeRangeSelector } from '@/components/common/TimeRangeSelector'
import { DataExportButton } from '@/components/common/DataExportButton'
import { ErrorState } from '@/components/common/ErrorState'
import {
  getIndicatorsByCategory,
  DEFAULT_YEAR_RANGE,
  INDICATOR_REGISTRY,
} from '@/utils/constants'
import { getIndicatorFormatter } from '@/utils/formatters'
import { t, indicatorName } from '@/utils/i18n'
import type { IndicatorCategory } from '@/types/indicator'

const QUICK_STATS = [
  'SP.POP.TOTL',
  'NY.GDP.MKTP.CD',
  'NY.GDP.PCAP.CD',
  'SP.DYN.LE00.IN',
  'SL.UEM.TOTL.ZS',
  'NY.GDP.MKTP.KD.ZG',
]

export default function CountryDetail() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const iso3 = (code || '').toUpperCase()
  const { countryMap, isLoading: countriesLoading } = useCountries()
  const { exportIndicatorData } = useFileStorage()
  const lang = useUIStore((s) => s.lang)

  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory>('economy')
  const [startYear, setStartYear] = useState(DEFAULT_YEAR_RANGE.start)
  const [endYear, setEndYear] = useState(DEFAULT_YEAR_RANGE.end)

  const country = countryMap.get(iso3)
  const addRecentCountry = useUIStore((s) => s.addRecentCountry)

  // Track recent country visits
  useEffect(() => {
    if (iso3) addRecentCountry(iso3)
  }, [iso3, addRecentCountry])

  const categoryIndicators = getIndicatorsByCategory(selectedCategory)
  const indicatorCodes = categoryIndicators.map((ind) => ind.code)

  const quickStatQueries = useMultiIndicator(iso3, QUICK_STATS, { start: 2019, end: 2023 })
  const categoryQueries = useMultiIndicator(iso3, indicatorCodes, { start: startYear, end: endYear })

  const handleExport = () => {
    const allSeries = categoryQueries
      .filter((q) => q.data)
      .flatMap((q) => q.data || [])
    if (allSeries.length > 0) {
      exportIndicatorData(allSeries, indicatorCodes, { start: startYear, end: endYear })
    }
  }

  if (countriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md hover:bg-[hsl(var(--accent))]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {country ? (
          <div className="flex items-center gap-3">
            <img
              src={country.flagSvg || country.flag}
              alt={country.name}
              className="h-8 w-12 object-cover rounded shadow"
            />
            <div>
              <h1 className="text-3xl font-bold">{country.name}</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {country.region}
                {country.subregion ? ` / ${country.subregion}` : ''}
                {' · '}{t('country.capital', lang)}{': '}
                {country.capitalCity || 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold">{iso3}</h1>
        )}
      </div>

      {/* Compare button */}
      <Link
        to={`/compare?countries=${iso3}`}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--accent))] no-underline"
      >
        <GitCompareArrows className="h-4 w-4" />
        {t('country.compareWith', lang)}
      </Link>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_STATS.map((statCode, i) => {
          const query = quickStatQueries[i]
          const series = query.data?.[0]
          const latest = series?.data[series.data.length - 1]
          const prev =
            series?.data.length && series.data.length >= 2
              ? series.data[series.data.length - 2]
              : undefined
          const meta = INDICATOR_REGISTRY[statCode]
          const formatter = getIndicatorFormatter(statCode)
          return (
            <DataCard
              key={statCode}
              title={indicatorName(meta, lang) || statCode}
              value={latest?.value != null ? formatter(latest.value) : '--'}
              currentValue={latest?.value ?? undefined}
              previousValue={prev?.value ?? undefined}
              loading={query.isLoading}
            />
          )
        })}
      </div>

      {/* Category tabs + time range + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <IndicatorCategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        <div className="flex items-center gap-3">
          <TimeRangeSelector
            startYear={startYear}
            endYear={endYear}
            onChangeStart={setStartYear}
            onChangeEnd={setEndYear}
          />
          <DataExportButton onClick={handleExport} />
        </div>
      </div>

      {/* Category indicator charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categoryIndicators.map((ind, i) => {
          const query = categoryQueries[i]
          const series = query?.data?.[0]
          const formatter = getIndicatorFormatter(ind.code)

          if (query?.isError) {
            return (
              <div
                key={ind.code}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4"
              >
                <h3 className="text-sm font-semibold mb-2">{indicatorName(ind, lang)}</h3>
                <ErrorState onRetry={() => query.refetch()} />
              </div>
            )
          }

          const chartData = series?.data.map((d) => d.value) || []
          const xLabels = series?.data.map((d) => d.year.toString()) || []

          return (
            <div
              key={ind.code}
              className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4"
            >
              <h3 className="text-sm font-semibold mb-2">{indicatorName(ind, lang)}</h3>
              <LineChart
                series={[{ name: country?.name || iso3, data: chartData }]}
                xAxisData={xLabels}
                formatTooltip={formatter}
                height={250}
                loading={query?.isLoading || false}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
