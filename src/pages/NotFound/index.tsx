import { Link } from 'react-router-dom'
import { Globe, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Globe className="h-16 w-16 text-[hsl(var(--muted-foreground))] mb-6 opacity-40" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-[hsl(var(--muted-foreground))] mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity no-underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
