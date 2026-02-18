import { useState, useEffect } from 'react'
import { BaseChart } from './BaseChart'
import { ensureWorldMapRegistered } from '@/lib/echarts'
import { isoToEchartsName, echartsNameToIso } from '@/utils/countryNameMap'
import { useUIStore } from '@/stores/uiStore'
import { getIndicatorFormatter } from '@/utils/formatters'
import { INDICATOR_REGISTRY } from '@/utils/constants'
import type { EChartsOption } from 'echarts'

interface MapDataItem {
  countryCode: string
  value: number
}

interface WorldChoroplethMapProps {
  data: MapDataItem[]
  indicatorCode: string
  onCountryClick?: (countryCode: string) => void
  height?: string | number
  loading?: boolean
}

export function WorldChoroplethMap({
  data,
  indicatorCode,
  onCountryClick,
  height = 500,
  loading = false,
}: WorldChoroplethMapProps) {
  const [mapReady, setMapReady] = useState(false)
  const theme = useUIStore((s) => s.theme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    ensureWorldMapRegistered().then(() => setMapReady(true))
  }, [])

  if (!mapReady) {
    return (
      <div style={{ height }} className="flex items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))]" />
      </div>
    )
  }

  const formatter = getIndicatorFormatter(indicatorCode)
  const indicatorName = INDICATOR_REGISTRY[indicatorCode]?.name || indicatorCode

  // Transform data: ISO3 codes -> ECharts map names
  const mappedData = data
    .filter((d) => isoToEchartsName[d.countryCode])
    .map((d) => ({
      name: isoToEchartsName[d.countryCode],
      value: d.value,
    }))

  const values = mappedData.map((d) => d.value).filter((v) => !isNaN(v))
  const minVal = values.length > 0 ? Math.min(...values) : 0
  const maxVal = values.length > 0 ? Math.max(...values) : 100

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { name: string; value?: number }
        if (p.value === undefined || isNaN(p.value)) {
          return `${p.name}: No data`
        }
        return `<strong>${p.name}</strong><br/>${indicatorName}: ${formatter(p.value)}`
      },
    },
    visualMap: [
      {
        type: 'continuous',
        min: minVal,
        max: maxVal,
        inRange: {
          color: isDark
            ? ['#0d2137', '#1a4a6e', '#2d7bb5', '#5da8d6', '#99d1f2']
            : ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        },
        text: [formatter(maxVal), formatter(minVal)],
        textStyle: { color: isDark ? '#ccc' : '#333' },
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
      },
    ],
    series: [
      {
        type: 'map',
        map: 'world',
        roam: true,
        zoom: 1.2,
        scaleLimit: { min: 1, max: 8 },
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            areaColor: '#fbbf24',
            borderColor: isDark ? '#fff' : '#333',
            borderWidth: 1,
          },
        },
        itemStyle: {
          areaColor: isDark ? '#1e293b' : '#e2e8f0',
          borderColor: isDark ? '#334155' : '#cbd5e1',
        },
        data: mappedData,
      },
    ],
  }

  const handleClick = (params: unknown) => {
    const p = params as { name: string }
    const iso3 = echartsNameToIso[p.name]
    if (iso3 && onCountryClick) {
      onCountryClick(iso3)
    }
  }

  return <BaseChart option={option} height={height} loading={loading} onEvents={{ click: handleClick }} />
}
