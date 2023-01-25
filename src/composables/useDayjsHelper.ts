import dayjs, { type Dayjs } from "dayjs"
import { computed } from "vue"

import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import type { GanttBarObject } from "../types"
import provideConfig from "../provider/provideConfig.js"

export const DEFAULT_DATE_FORMAT = "YYYY-MM-DD HH:mm"

export default function useDayjsHelper(config: GGanttChartConfig = provideConfig()) {
  const { chartStart, chartEnd, barStart, barEnd, dateFormat } = config

  const chartStartDayjs = computed(() => toDayjs(chartStart.value))
  const chartEndDayjs = computed(() => toDayjs(chartEnd.value))

  const toDayjs = (input: string | Date | GanttBarObject, startOrEnd?: "start" | "end") => {
    let value
    if (startOrEnd !== undefined && typeof input !== "string" && !(input instanceof Date)) {
      value = startOrEnd === "start" ? input[barStart.value] : input[barEnd.value]
    }
    if (typeof input === "string") {
      value = input
    } else if (input instanceof Date) {
      return dayjs(input)
    }
    const format = dateFormat.value || DEFAULT_DATE_FORMAT
    return dayjs(value, format, true)
  }

  const format = (input: string | Date | Dayjs, pattern?: string | false) => {
    if (pattern === false) {
      return input instanceof Date ? input : dayjs(input).toDate()
    }
    const inputDayjs = typeof input === "string" || input instanceof Date ? toDayjs(input) : input

    return inputDayjs.format(pattern)
  }

  return {
    chartStartDayjs,
    chartEndDayjs,
    toDayjs,
    format
  }
}
