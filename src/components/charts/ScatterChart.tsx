import { BaseChart } from './BaseChart'
import type { EChartsOption } from 'echarts'
import { useUIStore } from '@/stores/uiStore'

interface ScatterDataItem {
  name: string
  x: number
  y: number
  size?: number
}

interface ScatterChartProps {
  data: ScatterDataItem[]
  xLabel: string
  yLabel: string
  height?: string | number
  loading?: boolean
  formatX?: (value: number) => string
  formatY?: (value: number) => string
}

export function ScatterChart({
  data,
  xLabel,
  yLabel,
  height = 400,
  loading = false,
  formatX,
  formatY,
}: ScatterChartProps) {
  const theme = useUIStore((s) => s.theme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const maxSize = Math.max(...data.map((d) => d.size || 1))

  const option: EChartsOption = {
    tooltip: {
      formatter: (params: unknown) => {
        const p = params as { data: [number, number, number, string] }
        const [x, y, , name] = p.data
        const xStr = formatX ? formatX(x) : x.toString()
        const yStr = formatY ? formatY(y) : y.toString()
        return `<strong>${name}</strong><br/>${xLabel}: ${xStr}<br/>${yLabel}: ${yStr}`
      },
    },
    grid: { left: 80, right: 20, top: 20, bottom: 60 },
    xAxis: {
      name: xLabel,
      nameLocation: 'center',
      nameGap: 40,
      nameTextStyle: { color: isDark ? '#aaa' : '#666' },
      axisLabel: {
        color: isDark ? '#aaa' : '#666',
        formatter: formatX || undefined,
      },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee', type: 'dashed' } },
    },
    yAxis: {
      name: yLabel,
      nameLocation: 'center',
      nameGap: 60,
      nameTextStyle: { color: isDark ? '#aaa' : '#666' },
      axisLabel: {
        color: isDark ? '#aaa' : '#666',
        formatter: formatY || undefined,
      },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee', type: 'dashed' } },
    },
    series: [
      {
        type: 'scatter',
        data: data.map((d) => [d.x, d.y, d.size || 1, d.name]),
        symbolSize: (val: number[]) => {
          const normalized = (val[2] / maxSize) * 30 + 5
          return Math.min(normalized, 40)
        },
        emphasis: {
          focus: 'self',
          label: { show: true, formatter: (p: unknown) => (p as { data: unknown[] }).data[3] as string, position: 'top' },
        },
        itemStyle: {
          color: '#3b82f6',
          opacity: 0.7,
        },
      },
    ],
  }

  return <BaseChart option={option} height={height} loading={loading} />
}
