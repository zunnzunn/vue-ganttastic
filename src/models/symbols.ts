import { InjectionKey, Ref, ComputedRef } from "vue"
import { GanttBarObject } from "./models"

const INJECTION_KEYS = {
  allBarsInChartKey: Symbol("allbarsInChartKey") as InjectionKey<ComputedRef<GanttBarObject[][]>>,
  gGanttChartPropsKey: Symbol("gGanttChartPropsKey") as InjectionKey<{
    chartStart: Ref<string>
    chartEnd: Ref<string>
    precision: Ref<"hour" | "day" | "month">
    barStart: Ref<string>
    barEnd: Ref<string>
    width: Ref<string>
    rowHeight: Ref<number>
    hideTimeaxis: Ref<boolean>
    colorScheme: Ref<string>
    grid: Ref<boolean>
    pushOnOverlap: Ref<boolean>
    snapBackOnOverlap: Ref<boolean>
  }>,
  emitBarEventKey: Symbol("emitBarEventKey") as InjectionKey<
    (e: MouseEvent, bar: GanttBarObject, datetime?: string) => void
  >
}

export default INJECTION_KEYS
