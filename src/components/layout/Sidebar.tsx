import { Link, useLocation } from 'react-router-dom'
import { Globe, GitCompareArrows, Search, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { t } from '@/utils/i18n'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const lang = useUIStore((s) => s.lang)

  const navItems = [
    { path: '/', label: t('nav.dashboard', lang), icon: Globe },
    { path: '/indicators', label: t('nav.indicators', lang), icon: Search },
    { path: '/compare', label: t('nav.compare', lang), icon: GitCompareArrows },
  ]

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--background))] border-r border-[hsl(var(--border))] transform transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <span className="font-bold text-lg">{t('nav.menu', lang)}</span>
          <button
            className="p-2 rounded-md hover:bg-[hsl(var(--accent))]"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
