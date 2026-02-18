interface LoadingSkeletonProps {
  type?: 'chart' | 'card' | 'table' | 'map'
  height?: string | number
}

export function LoadingSkeleton({ type = 'chart', height }: LoadingSkeletonProps) {
  const h = height || (type === 'map' ? 500 : type === 'chart' ? 400 : type === 'card' ? 120 : 300)

  if (type === 'card') {
    return (
      <div
        className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 sm:p-6 space-y-3"
        style={{ height: h }}
      >
        <div className="h-3 w-24 rounded bg-[hsl(var(--muted))] animate-pulse" />
        <div className="h-7 w-32 rounded bg-[hsl(var(--muted))] animate-pulse" />
        <div className="h-3 w-16 rounded bg-[hsl(var(--muted))] animate-pulse" />
      </div>
    )
  }

  if (type === 'map') {
    return (
      <div
        className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center justify-center gap-3"
        style={{ height: h }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))]" />
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading world map...</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] animate-pulse flex items-center justify-center"
      style={{ height: h }}
    >
      <div className="text-[hsl(var(--muted-foreground))] text-sm">Loading...</div>
    </div>
  )
}
