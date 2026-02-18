import { BaseChart } from './BaseChart'
import type { EChartsOption } from 'echarts'
import { useUIStore } from '@/stores/uiStore'

interface Series {
  name: string
  data: (number | null)[]
}

interface LineChartProps {
  series: Series[]
  xAxisData: string[]
  yAxisLabel?: string
  formatTooltip?: (value: number) => string
  height?: string | number
  loading?: boolean
  colors?: string[]
  showDataZoom?: boolean
}

export function LineChart({
  series,
  xAxisData,
  yAxisLabel,
  formatTooltip,
  height = 400,
  loading = false,
  colors,
  showDataZoom = false,
}: LineChartProps) {
  const theme = useUIStore((s) => s.theme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const option: EChartsOption = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: formatTooltip
        ? (params: unknown) => {
            const arr = params as Array<{ seriesName: string; value: number | null; marker: string }>
            if (!Array.isArray(arr)) return ''
            const lines = arr.map((p) => {
              const val = p.value !== null && p.value !== undefined ? formatTooltip(p.value) : 'N/A'
              return `${p.marker} ${p.seriesName}: ${val}`
            })
            return `${(arr[0] as unknown as { axisValue: string }).axisValue}<br/>${lines.join('<br/>')}`
          }
        : undefined,
    },
    legend: {
      data: series.map((s) => s.name),
      bottom: showDataZoom ? 40 : 0,
      textStyle: { color: isDark ? '#ccc' : '#333' },
    },
    grid: {
      left: 60,
      right: 20,
      top: 20,
      bottom: showDataZoom ? 80 : 40,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      boundaryGap: false,
      axisLabel: { color: isDark ? '#aaa' : '#666' },
      axisLine: { lineStyle: { color: isDark ? '#555' : '#ccc' } },
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel,
      nameTextStyle: { color: isDark ? '#aaa' : '#666' },
      axisLabel: {
        color: isDark ? '#aaa' : '#666',
        formatter: formatTooltip || undefined,
      },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee', type: 'dashed' } },
    },
    dataZoom: showDataZoom
      ? [
          { type: 'inside', start: 0, end: 100 },
          { type: 'slider', start: 0, end: 100, bottom: 10 },
        ]
      : undefined,
    series: series.map((s) => ({
      name: s.name,
      type: 'line' as const,
      data: s.data,
      smooth: false,
      showSymbol: true,
      symbolSize: 4,
      emphasis: { focus: 'series' as const },
      connectNulls: false,
    })),
  }

  return <BaseChart option={option} height={height} loading={loading} />
}
