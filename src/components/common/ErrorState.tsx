import { AlertCircle, RefreshCw } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { t } from '@/utils/i18n'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  const lang = useUIStore((s) => s.lang)
  const displayMessage = message || t('common.errorLoadData', lang)

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50 p-6 flex flex-col items-center gap-3">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <p className="text-sm text-red-700 dark:text-red-400 text-center">{displayMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {t('common.retry', lang)}
        </button>
      )}
    </div>
  )
}
