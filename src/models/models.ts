import { Ref } from "vue"

export type GanttBarObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any,
  ganttBarConfig: {
    id: string,
    label?: string
    hasHandles?: boolean
    immobile?: boolean
    bundle?: string
    pushOnOverlap?: boolean
    dragLimitLeft?: number
    dragLimitRight?: number
    style?: CSSStyleSheet
  }
}

export type GGanttChartPropsRefs = {
  chartStart: Ref<string>
  chartEnd: Ref<string>
  precision: Ref<"hour" | "day" | "month">
  barStart: Ref<string>
  barEnd: Ref<string>
  rowHeight: Ref<number>
  dateFormat: Ref<string>
  width: Ref<string>
  hideTimeaxis: Ref<boolean>
  colorScheme: Ref<string>
  grid: Ref<boolean>
  pushOnOverlap: Ref<boolean>
  noOverlap: Ref<boolean>
  gGanttChart: Ref<HTMLElement | null>
  font: Ref<string>
}
