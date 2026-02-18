import { INDICATOR_CATEGORIES } from '@/utils/constants'
import type { IndicatorCategory } from '@/types/indicator'

interface IndicatorCategoryTabsProps {
  selected: IndicatorCategory
  onSelect: (category: IndicatorCategory) => void
}

export function IndicatorCategoryTabs({ selected, onSelect }: IndicatorCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {INDICATOR_CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            selected === cat.key
              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
              : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--accent))]'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
