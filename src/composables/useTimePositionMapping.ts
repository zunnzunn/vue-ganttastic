import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import { computed } from "vue"

import useDayjsHelper from "./useDayjsHelper.js"
import provideConfig from "../provider/provideConfig.js"

export default function useTimePositionMapping(config: GGanttChartConfig = provideConfig()) {
  const { dateFormat, chartSize } = config
  const { chartStartDayjs, chartEndDayjs, toDayjs, format } = useDayjsHelper(config)

  const totalNumOfMinutes = computed(() => {
    return chartEndDayjs.value.diff(chartStartDayjs.value, "minutes")
  })

  const mapTimeToPosition = (time: string) => {
    const width = chartSize.width.value || 0
    const diffFromStart = toDayjs(time).diff(chartStartDayjs.value, "minutes", true)
    return Math.ceil((diffFromStart / totalNumOfMinutes.value) * width)
  }

  const mapPositionToTime = (xPos: number) => {
    const width = chartSize.width.value || 0
    const diffFromStart = (xPos / width) * totalNumOfMinutes.value
    return format(chartStartDayjs.value.add(diffFromStart, "minutes"), dateFormat.value)
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
