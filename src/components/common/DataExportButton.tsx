import { Download } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { t } from '@/utils/i18n'

interface DataExportButtonProps {
  onClick: () => void
  label?: string
  size?: 'sm' | 'md'
}

export function DataExportButton({
  onClick,
  label,
  size = 'sm',
}: DataExportButtonProps) {
  const lang = useUIStore((s) => s.lang)
  const displayLabel = label || t('common.exportJSON', lang)

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] transition-colors ${
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'
      }`}
      title={displayLabel}
    >
      <Download className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {displayLabel}
    </button>
  )
}
