import dayjs from "dayjs"
import { computed } from "vue"

import type { GanttBarObject } from "../types"
import useContext from "./useContext"

export default function useDayjsHelper() {
  const { config } = useContext()
  const { chartStart, chartEnd, barStart, barEnd, dateFormat } = config

  const chartStartDayjs = computed(() => toDayjs(chartStart.value))
  const chartEndDayjs = computed(() => toDayjs(chartEnd.value))

  const toDayjs = (
    value: string | GanttBarObject,
    startOrEnd?: "start" | "end"
  ) => {
    if (typeof value === "string") {
      return dayjs(value, dateFormat.value, true)
    }
    if (startOrEnd == null) {
      throw Error(
        "VueGanttastic - toDayjs: passed a GanttBarObject as value, but did not provide start|end parameter."
      )
    }
    const property =
      startOrEnd === "start" ? value[barStart.value] : value[barEnd.value]
    return dayjs(property, dateFormat.value, true)
  }

  return {
    chartStartDayjs,
    chartEndDayjs,
    toDayjs
  }
}
