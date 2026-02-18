import { Download } from 'lucide-react'

interface DataExportButtonProps {
  onClick: () => void
  label?: string
  size?: 'sm' | 'md'
}

export function DataExportButton({
  onClick,
  label = 'Export JSON',
  size = 'sm',
}: DataExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] transition-colors ${
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'
      }`}
      title={label}
    >
      <Download className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {label}
    </button>
  )
}
