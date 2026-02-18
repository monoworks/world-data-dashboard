import { INDICATOR_REGISTRY } from './constants'

export function formatNumber(value: number, options?: { compact?: boolean; decimals?: number }): string {
  const { compact = false, decimals } = options ?? {}

  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: decimals ?? 1,
    }).format(value)
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals ?? 0,
  }).format(value)
}

export function formatCurrency(value: number, currencyCode = 'USD'): string {
  if (Math.abs(value) >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  }
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatYear(year: number): string {
  return year.toString()
}

export function formatPopulation(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`
  return value.toString()
}

export type ValueFormatter = (value: number) => string

export function getIndicatorFormatter(indicatorCode: string): ValueFormatter {
  const meta = INDICATOR_REGISTRY[indicatorCode]
  if (!meta) return (v) => formatNumber(v, { compact: true })

  switch (meta.unit) {
    case 'currency':
      return (v) => formatCurrency(v)
    case 'percent':
      return (v) => formatPercent(v)
    case 'number':
      return (v) => formatNumber(v, { compact: true })
    case 'years':
      return (v) => `${v.toFixed(1)} yrs`
    case 'per1000':
      return (v) => `${v.toFixed(1)}/1K`
    case 'index':
      return (v) => v.toFixed(2)
    default:
      return (v) => formatNumber(v, { compact: true })
  }
}
