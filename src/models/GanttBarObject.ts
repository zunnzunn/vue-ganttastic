import { Ref } from "vue"
export type GanttBarObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any,
  ganttBarConfig: {
    id: string,
    label?: string
    hasHandles?: boolean
    immobile?: boolean
    bundle: string
    style?: {
      background?: string
      borderRadius?: string
    }
  }
}

export type GGanttChartProps = {
  chartStart: string
  chartEnd: string
  precision: "hour" | "day" | "month"
  barStart: string
  barEnd: string
  width: string
  hideTimeaxis: boolean
  colorScheme: string
  grid: boolean
  pushOnOverlap: boolean
}

export type GGanttChartPropsRefs = {
  chartStart: Ref<string>
  chartEnd: Ref<string>
  precision: Ref<"hour" | "day" | "month">
  barStart: Ref<string>
  barEnd: Ref<string>
  width: Ref<string>
  hideTimeaxis: Ref<boolean>
  colorScheme: Ref<string>
  grid: Ref<boolean>
  pushOnOverlap: Ref<boolean>
}
