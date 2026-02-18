import { BaseChart } from './BaseChart'
import type { EChartsOption } from 'echarts'
import { useUIStore } from '@/stores/uiStore'

interface BarChartItem {
  name: string
  value: number
}

interface BarChartProps {
  data: BarChartItem[]
  horizontal?: boolean
  color?: string
  height?: string | number
  loading?: boolean
  formatValue?: (value: number) => string
}

export function BarChart({
  data,
  horizontal = false,
  color = '#3b82f6',
  height = 400,
  loading = false,
  formatValue,
}: BarChartProps) {
  const theme = useUIStore((s) => s.theme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const categoryAxis = {
    type: 'category' as const,
    data: data.map((d) => d.name),
    axisLabel: {
      color: isDark ? '#aaa' : '#666',
      rotate: horizontal ? 0 : 30,
      interval: 0,
    },
    axisLine: { lineStyle: { color: isDark ? '#555' : '#ccc' } },
  }

  const valueAxis = {
    type: 'value' as const,
    axisLabel: {
      color: isDark ? '#aaa' : '#666',
      formatter: formatValue || undefined,
    },
    splitLine: { lineStyle: { color: isDark ? '#333' : '#eee', type: 'dashed' as const } },
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: formatValue
        ? (params: unknown) => {
            const arr = params as Array<{ name: string; value: number; marker: string }>
            if (!Array.isArray(arr) || arr.length === 0) return ''
            const p = arr[0]
            return `${p.name}<br/>${p.marker} ${formatValue(p.value)}`
          }
        : undefined,
    },
    grid: {
      left: horizontal ? 100 : 60,
      right: 20,
      top: 10,
      bottom: horizontal ? 20 : 60,
    },
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        itemStyle: { color },
        barMaxWidth: 40,
      },
    ],
  }

  return <BaseChart option={option} height={height} loading={loading} />
}
