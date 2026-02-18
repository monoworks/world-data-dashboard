import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col">
      <ScrollToTop />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="container mx-auto px-4 py-6 max-w-7xl flex-1 w-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <footer className="border-t border-[hsl(var(--border))] py-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
        <div className="container mx-auto px-4">
          World Data Dashboard &middot; Data from{' '}
          <a
            href="https://data.worldbank.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[hsl(var(--foreground))]"
          >
            World Bank
          </a>
          ,{' '}
          <a
            href="https://restcountries.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[hsl(var(--foreground))]"
          >
            REST Countries
          </a>
        </div>
      </footer>
    </div>
  )
}
