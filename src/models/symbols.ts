import { InjectionKey, Ref, ComputedRef } from "vue"
import { GanttBarObject } from "./GanttBarObject"

const INJECTION_KEYS = {
  chartStartKey: Symbol("chartStartKey") as InjectionKey<Ref<string>>,
  chartEndKey: Symbol("chartEndKey") as InjectionKey<Ref<string>>,
  barStartKey: Symbol("barStartKey") as InjectionKey<Ref<string>>,
  barEndKey: Symbol("barEndKey") as InjectionKey<Ref<string>>,
  widthKey: Symbol("widthKey") as InjectionKey<Ref<number>>,
  precisionKey: Symbol("precisionKey") as InjectionKey<Ref<"hour" | "day" | "month">>,
  pushOnOverlapKey: Symbol("pushOnOverlapKey") as InjectionKey<Ref<boolean>>,
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
  }>
}

export default INJECTION_KEYS
