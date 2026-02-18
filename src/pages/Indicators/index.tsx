import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { IndicatorCategoryTabs } from '@/components/common/IndicatorCategoryTabs'
import {
  INDICATOR_REGISTRY,
  getIndicatorsByCategory,
  INDICATOR_CATEGORIES,
} from '@/utils/constants'
import type { IndicatorCategory, IndicatorMeta } from '@/types/indicator'

export default function Indicators() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory>('economy')

  const indicators = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return Object.values(INDICATOR_REGISTRY).filter(
        (ind) =>
          ind.name.toLowerCase().includes(q) ||
          ind.nameJa.includes(q) ||
          ind.code.toLowerCase().includes(q) ||
          ind.description.toLowerCase().includes(q)
      )
    }
    return getIndicatorsByCategory(selectedCategory)
  }, [selectedCategory, searchQuery])

  const handleIndicatorClick = (ind: IndicatorMeta) => {
    navigate(`/compare?indicator=${ind.code}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-8 w-8 text-[hsl(var(--primary))]" />
        <h1 className="text-3xl font-bold">Indicators Explorer</h1>
      </div>
      <p className="text-[hsl(var(--muted-foreground))]">
        Browse and explore available World Bank indicators across{' '}
        {Object.keys(INDICATOR_REGISTRY).length} metrics.
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search indicators by name, code, or description..."
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm"
        />
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <IndicatorCategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
      )}

      {/* Indicator grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((ind) => {
          const catInfo = INDICATOR_CATEGORIES.find((c) => c.key === ind.category)
          return (
            <button
              key={ind.code}
              onClick={() => handleIndicatorClick(ind)}
              className="text-left rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 hover:border-[hsl(var(--primary))] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm">{ind.name}</h3>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">
                  {catInfo?.label || ind.category}
                </span>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{ind.nameJa}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">{ind.description}</p>
              <p className="text-xs font-mono text-[hsl(var(--muted-foreground))] mt-2 opacity-60">
                {ind.code}
              </p>
            </button>
          )
        })}
      </div>

      {indicators.length === 0 && (
        <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
          No indicators found matching your search.
        </div>
      )}
    </div>
  )
}
