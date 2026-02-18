interface LoadingSkeletonProps {
  type?: 'chart' | 'card' | 'table' | 'map'
  height?: string | number
}

export function LoadingSkeleton({ type = 'chart', height }: LoadingSkeletonProps) {
  const h = height || (type === 'map' ? 500 : type === 'chart' ? 400 : type === 'card' ? 120 : 300)

  return (
    <div
      className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] animate-pulse flex items-center justify-center"
      style={{ height: h }}
    >
      <div className="text-[hsl(var(--muted-foreground))] text-sm">Loading...</div>
    </div>
  )
}
