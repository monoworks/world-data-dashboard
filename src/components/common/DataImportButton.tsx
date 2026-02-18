import { Upload } from 'lucide-react'

interface DataImportButtonProps {
  onImport: (file: File) => void
  label?: string
  size?: 'sm' | 'md'
}

export function DataImportButton({
  onImport,
  label = 'Import JSON',
  size = 'sm',
}: DataImportButtonProps) {
  return (
    <label
      className={`inline-flex items-center gap-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] transition-colors cursor-pointer ${
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'
      }`}
      title={label}
    >
      <Upload className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {label}
      <input
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onImport(file)
          e.target.value = ''
        }}
      />
    </label>
  )
}
