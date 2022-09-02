import type { InjectionKey } from "vue"

import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import type { GanttBarObject } from "../types"

export type Context = {
  getChartRows: () => GanttBarObject[][]
  config: GGanttChartConfig
  emitBarEvent: (
    e: MouseEvent,
    bar: GanttBarObject,
    datetime?: string,
    movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
  ) => void
}

export const CONTEXT = Symbol("CONTEXT") as InjectionKey<Context>
