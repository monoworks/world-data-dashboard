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

// Register world map lazily
let mapRegistered = false

export async function ensureWorldMapRegistered(): Promise<void> {
  if (mapRegistered) return
  const worldJson = await import('@/assets/world.json')
  echarts.registerMap('world', worldJson.default as unknown as Parameters<typeof echarts.registerMap>[1])
  mapRegistered = true
}
