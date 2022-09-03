import type { InjectionKey } from "vue"

import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import type { GanttBarObject } from "../types"

export type GetChartRows = () => GanttBarObject[][]
export type EmitBarEvent = (
  e: MouseEvent,
  bar: GanttBarObject,
  datetime?: string,
  movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
) => void

export type Context = {
  getChartRows: GetChartRows
  config: GGanttChartConfig
  emitBarEvent: EmitBarEvent
}

export const CONTEXT = Symbol("CONTEXT") as InjectionKey<Context>

export const CHART_ROWS_KEY = Symbol(
  "CHART_ROWS_KEY"
) as InjectionKey<GetChartRows>
export const CONFIG_KEY = Symbol(
  "CONFIG_KEY"
) as InjectionKey<GGanttChartConfig>
export const EMIT_BAR_EVENT_KEY = Symbol(
  "EMIT_BAR_EVENT_KEY"
) as InjectionKey<EmitBarEvent>
