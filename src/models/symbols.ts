import { InjectionKey } from "vue"
import { GanttBarObject, GGanttChartPropsRefs } from "./models"

const INJECTION_KEYS = {
  getChartRowsKey: Symbol("getChartRowsKey") as InjectionKey<() => GanttBarObject[][]>,
  gGanttChartPropsKey: Symbol("gGanttChartPropsKey") as InjectionKey<GGanttChartPropsRefs>,
  emitBarEventKey: Symbol("emitBarEventKey") as InjectionKey<
    (e: MouseEvent, bar: GanttBarObject, datetime?: string) => void
  >
}

export default INJECTION_KEYS
