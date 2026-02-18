import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Globe, GitCompareArrows, Search, Sun, Moon, Menu, Upload, Check, AlertCircle, Languages } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useFileStorage } from '@/hooks/useFileStorage'
import { t } from '@/utils/i18n'

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation()
  const { theme, setTheme, lang, setLang } = useUIStore()
  const { importData } = useFileStorage()
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const navItems = [
    { path: '/', label: t('nav.dashboard', lang), icon: Globe },
    { path: '/indicators', label: t('nav.indicators', lang), icon: Search },
    { path: '/compare', label: t('nav.compare', lang), icon: GitCompareArrows },
  ]

  const handleImport = async (file: File) => {
    try {
      const result = await importData(file)
      setImportStatus('success')
      console.log(`Imported ${result.count} ${result.type} entries`)
      setTimeout(() => setImportStatus('idle'), 3000)
    } catch (err) {
      console.error('Import failed:', err)
      setImportStatus('error')
      setTimeout(() => setImportStatus('idle'), 3000)
    }
  }

  const importLabel = importStatus === 'success'
    ? (lang === 'ja' ? '完了！' : 'Imported!')
    : importStatus === 'error'
      ? (lang === 'ja' ? 'エラー' : 'Error')
      : t('common.import', lang)

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-[hsl(var(--accent))]"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg no-underline text-[hsl(var(--foreground))]">
          <Globe className="h-6 w-6 text-[hsl(var(--primary))]" />
          <span className="hidden sm:inline">{t('app.title', lang)}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />

        {/* Data Import button */}
        <label
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
            importStatus === 'success'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : importStatus === 'error'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : 'hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]'
          }`}
          title={t('common.import', lang)}
        >
          {importStatus === 'success' ? (
            <Check className="h-4 w-4" />
          ) : importStatus === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{importLabel}</span>
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImport(file)
              e.target.value = ''
            }}
          />
        </label>

        {/* Language toggle */}
        <button
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-[hsl(var(--accent))] text-sm font-medium text-[hsl(var(--muted-foreground))]"
          onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
          aria-label="Toggle language"
          title={lang === 'en' ? '日本語に切り替え' : 'Switch to English'}
        >
          <Languages className="h-4 w-4" />
          <span className="uppercase">{lang}</span>
        </button>

        {/* Theme toggle */}
        <button
          className="p-2 rounded-md hover:bg-[hsl(var(--accent))]"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}
