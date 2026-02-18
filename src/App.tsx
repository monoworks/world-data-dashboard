import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CountryDetail = lazy(() => import('@/pages/CountryDetail'))
const Comparison = lazy(() => import('@/pages/Comparison'))
const Indicators = lazy(() => import('@/pages/Indicators'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))]" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/country/:code"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <CountryDetail />
              </Suspense>
            }
          />
          <Route
            path="/compare"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Comparison />
              </Suspense>
            }
          />
          <Route
            path="/indicators"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Indicators />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
