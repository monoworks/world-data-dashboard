import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface DataCardProps {
  title: string
  value: string
  previousValue?: number
  currentValue?: number
  unit?: string
  loading?: boolean
}

export function DataCard({
  title,
  value,
  previousValue,
  currentValue,
  unit,
  loading = false,
}: DataCardProps) {
  let trend: 'up' | 'down' | 'flat' | null = null
  let changePercent: string | null = null

  if (previousValue !== undefined && currentValue !== undefined && previousValue !== 0) {
    const change = ((currentValue - previousValue) / Math.abs(previousValue)) * 100
    if (Math.abs(change) < 0.01) {
      trend = 'flat'
    } else {
      trend = change > 0 ? 'up' : 'down'
    }
    changePercent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 sm:p-6">
        <div className="h-4 w-24 bg-[hsl(var(--muted))] rounded animate-pulse mb-3" />
        <div className="h-8 w-32 bg-[hsl(var(--muted))] rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 sm:p-6">
      <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] truncate">{title}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-lg sm:text-2xl font-bold text-[hsl(var(--card-foreground))] truncate">{value}</p>
        {unit && <span className="text-sm text-[hsl(var(--muted-foreground))]">{unit}</span>}
      </div>
      {trend && changePercent && (
        <div className="flex items-center gap-1 mt-2">
          {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
          {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
          {trend === 'flat' && <Minus className="h-4 w-4 text-gray-400" />}
          <span
            className={`text-sm ${
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {changePercent}
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">vs prev year</span>
        </div>
      )}
    </div>
  )
}
