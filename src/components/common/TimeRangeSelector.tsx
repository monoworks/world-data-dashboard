import { useState, useEffect } from 'react'

interface TimeRangeSelectorProps {
  startYear: number
  endYear: number
  onChangeStart: (year: number) => void
  onChangeEnd: (year: number) => void
  minYear?: number
  maxYear?: number
}

export function TimeRangeSelector({
  startYear,
  endYear,
  onChangeStart,
  onChangeEnd,
  minYear = 1960,
  maxYear = new Date().getFullYear(),
}: TimeRangeSelectorProps) {
  const [startInput, setStartInput] = useState(String(startYear))
  const [endInput, setEndInput] = useState(String(endYear))

  useEffect(() => {
    setStartInput(String(startYear))
  }, [startYear])

  useEffect(() => {
    setEndInput(String(endYear))
  }, [endYear])

  const handleStartBlur = () => {
    const val = Math.max(minYear, Math.min(Number(startInput) || minYear, endYear))
    setStartInput(String(val))
    if (val !== startYear) onChangeStart(val)
  }

  const handleEndBlur = () => {
    const val = Math.max(startYear, Math.min(Number(endInput) || maxYear, maxYear))
    setEndInput(String(val))
    if (val !== endYear) onChangeEnd(val)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-[hsl(var(--muted-foreground))]">From</label>
      <input
        type="number"
        value={startInput}
        onChange={(e) => setStartInput(e.target.value)}
        onBlur={handleStartBlur}
        onKeyDown={(e) => { if (e.key === 'Enter') handleStartBlur() }}
        min={minYear}
        max={endYear}
        className="w-20 px-2 py-1.5 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm"
      />
      <label className="text-sm text-[hsl(var(--muted-foreground))]">To</label>
      <input
        type="number"
        value={endInput}
        onChange={(e) => setEndInput(e.target.value)}
        onBlur={handleEndBlur}
        onKeyDown={(e) => { if (e.key === 'Enter') handleEndBlur() }}
        min={startYear}
        max={maxYear}
        className="w-20 px-2 py-1.5 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm"
      />
    </div>
  )
}
