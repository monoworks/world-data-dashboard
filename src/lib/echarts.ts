import * as echarts from 'echarts/core'
import { LineChart, BarChart, ScatterChart, MapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  ScatterChart,
  MapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  CanvasRenderer,
])

export { echarts }

// Register world map — start loading immediately, not lazily
let mapRegistered = false
let mapLoadingPromise: Promise<void> | null = null

export function preloadWorldMap(): void {
  if (mapRegistered || mapLoadingPromise) return
  mapLoadingPromise = import('@/assets/world.json').then((worldJson) => {
    echarts.registerMap('world', worldJson.default as unknown as Parameters<typeof echarts.registerMap>[1])
    mapRegistered = true
  })
}

export async function ensureWorldMapRegistered(): Promise<void> {
  if (mapRegistered) return
  if (!mapLoadingPromise) preloadWorldMap()
  await mapLoadingPromise
}

// Start preloading immediately when this module is imported
preloadWorldMap()
