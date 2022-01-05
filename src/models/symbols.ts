import { InjectionKey, ComputedRef } from "vue"
import { GanttBarObject, GGanttChartPropsRefs } from "./models"

const INJECTION_KEYS = {
  allBarsInChartKey: Symbol("allbarsInChartKey") as InjectionKey<ComputedRef<GanttBarObject[][]>>,
  gGanttChartPropsKey: Symbol("gGanttChartPropsKey") as InjectionKey<GGanttChartPropsRefs>,
  emitBarEventKey: Symbol("emitBarEventKey") as InjectionKey<
    (e: MouseEvent, bar: GanttBarObject, datetime?: string) => void
  >
}

export default INJECTION_KEYS
