export interface ExportData {
  version: 1
  exportedAt: string
  type: 'indicators' | 'countries' | 'full-snapshot'
  metadata: {
    countries?: string[]
    indicators?: string[]
    dateRange?: { start: number; end: number }
  }
  data: unknown
}

export function downloadAsJson(data: ExportData, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importFromJson(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string)
        // Basic validation
        if (!raw.version || !raw.type || !raw.data) {
          reject(new Error('Invalid file format: missing required fields (version, type, data)'))
          return
        }
        if (raw.version !== 1) {
          reject(new Error(`Unsupported file version: ${raw.version}`))
          return
        }
        resolve(raw as ExportData)
      } catch (err) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function generateFilename(
  type: ExportData['type'],
  metadata?: ExportData['metadata']
): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const parts = ['world-data']

  switch (type) {
    case 'indicators':
      if (metadata?.indicators?.[0]) {
        const shortCode = metadata.indicators[0].split('.').pop() || 'data'
        parts.push(shortCode)
      }
      if (metadata?.countries && metadata.countries.length <= 5) {
        parts.push(metadata.countries.join('-'))
      } else {
        parts.push('ALL')
      }
      if (metadata?.dateRange) {
        parts.push(`${metadata.dateRange.start}-${metadata.dateRange.end}`)
      }
      break
    case 'countries':
      parts.push('countries')
      break
    case 'full-snapshot':
      parts.push('full-snapshot')
      break
  }

  parts.push(date)
  return `${parts.join('_')}.json`
}
