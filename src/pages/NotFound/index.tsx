import { Link } from 'react-router-dom'
import { Globe, ArrowLeft } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { t } from '@/utils/i18n'

export default function NotFound() {
  const lang = useUIStore((s) => s.lang)

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Globe className="h-16 w-16 text-[hsl(var(--muted-foreground))] mb-6 opacity-40" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-[hsl(var(--muted-foreground))] mb-6">
        {t('notFound.description', lang)}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity no-underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('notFound.backHome', lang)}
      </Link>
    </div>
  )
}
