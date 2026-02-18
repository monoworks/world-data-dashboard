import { useState, useMemo } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'

interface CountryItem {
  iso3: string
  name: string
  flag: string
  region: string
}

interface CountrySelectorProps {
  countries: CountryItem[]
  selected: string | string[]
  onSelect: (codes: string | string[]) => void
  multiple?: boolean
  maxSelections?: number
  placeholder?: string
}

export function CountrySelector({
  countries,
  selected,
  onSelect,
  multiple = false,
  maxSelections = 5,
  placeholder = 'Select a country...',
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedArray = Array.isArray(selected) ? selected : selected ? [selected] : []

  const filtered = useMemo(() => {
    if (!search.trim()) return countries.slice(0, 50)
    const q = search.toLowerCase()
    return countries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [countries, search])

  const selectedCountries = useMemo(
    () => countries.filter((c) => selectedArray.includes(c.iso3)),
    [countries, selectedArray]
  )

  const handleSelect = (iso3: string) => {
    if (multiple) {
      if (selectedArray.includes(iso3)) {
        onSelect(selectedArray.filter((c) => c !== iso3))
      } else if (selectedArray.length < maxSelections) {
        onSelect([...selectedArray, iso3])
      }
    } else {
      onSelect(iso3)
      setOpen(false)
      setSearch('')
    }
  }

  const handleRemove = (iso3: string) => {
    if (multiple) {
      onSelect(selectedArray.filter((c) => c !== iso3))
    } else {
      onSelect('')
    }
  }

  return (
    <div className="relative">
      {/* Selected tags (multiple mode) */}
      {multiple && selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedCountries.map((c) => (
            <span
              key={c.iso3}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
            >
              <img src={c.flag} alt="" className="w-4 h-3 object-cover rounded-sm" />
              {c.name}
              <button
                onClick={() => handleRemove(c.iso3)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger button */}
      <button
        className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm hover:bg-[hsl(var(--accent))]"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          {!multiple && selectedCountries.length > 0 ? (
            <>
              <img src={selectedCountries[0].flag} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
              {selectedCountries[0].name}
            </>
          ) : (
            <span className="text-[hsl(var(--muted-foreground))]">{placeholder}</span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch('') }} />
          <div className="absolute z-50 mt-1 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-lg">
            {/* Search input */}
            <div className="flex items-center gap-2 p-2 border-b border-[hsl(var(--border))]">
              <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
                autoFocus
              />
            </div>

            {/* Country list */}
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]">No countries found</p>
              ) : (
                filtered.map((country) => {
                  const isSelected = selectedArray.includes(country.iso3)
                  return (
                    <button
                      key={country.iso3}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[hsl(var(--accent))] ${
                        isSelected ? 'bg-[hsl(var(--accent))]' : ''
                      }`}
                      onClick={() => handleSelect(country.iso3)}
                    >
                      <img src={country.flag} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
                      <span className="flex-1">{country.name}</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {country.iso3}
                      </span>
                      {isSelected && (
                        <span className="text-[hsl(var(--primary))] text-xs font-bold">✓</span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
