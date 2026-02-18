import { useRef, useEffect, useCallback } from 'react'
import { echarts } from '@/lib/echarts'
import { useUIStore } from '@/stores/uiStore'
import type { EChartsOption } from 'echarts'

type EChartsInstance = ReturnType<typeof echarts.init>

interface BaseChartProps {
  option: EChartsOption
  height?: string | number
  loading?: boolean
  onEvents?: Record<string, (params: unknown) => void>
  className?: string
}

export function BaseChart({
  option,
  height = 400,
  loading = false,
  onEvents,
  className = '',
}: BaseChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsInstance | null>(null)
  const theme = useUIStore((s) => s.theme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return
    const chart = echarts.init(containerRef.current)
    chartRef.current = chart

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  // Update option
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const mergedOption: EChartsOption = {
      backgroundColor: 'transparent',
      textStyle: {
        color: isDark ? '#ccc' : '#333',
      },
      ...option,
    }
    chart.setOption(mergedOption, true)
  }, [option, isDark])

  // Loading state
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    if (loading) {
      chart.showLoading({
        text: 'Loading...',
        color: isDark ? '#60a5fa' : '#3b82f6',
        textColor: isDark ? '#ccc' : '#333',
        maskColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)',
      })
    } else {
      chart.hideLoading()
    }
  }, [loading, isDark])

  // Event handlers
  const prevEventsRef = useRef<Record<string, (params: unknown) => void>>({})
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    // Remove previous event listeners
    for (const eventName of Object.keys(prevEventsRef.current)) {
      chart.off(eventName)
    }

    // Add new event listeners
    if (onEvents) {
      for (const [eventName, handler] of Object.entries(onEvents)) {
        chart.on(eventName, handler)
      }
    }
    prevEventsRef.current = onEvents || {}
  }, [onEvents])

  // Resize on theme/height change
  const handleResizeChart = useCallback(() => {
    chartRef.current?.resize()
  }, [])

  useEffect(() => {
    handleResizeChart()
  }, [height, handleResizeChart])

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%' }}
      className={className}
    />
  )
}
