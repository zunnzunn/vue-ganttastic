import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import { computed } from "vue"

import useDayjsHelper from "./useDayjsHelper"
import provideConfig from "../provider/provideConfig"

export default function useTimePositionMapping(
  config: GGanttChartConfig = provideConfig()
) {
  const { dateFormat, gGanttChart } = config
  const { chartStartDayjs, chartEndDayjs, toDayjs } = useDayjsHelper(config)

  const totalNumOfMinutes = computed(() => {
    return chartEndDayjs.value.diff(chartStartDayjs.value, "minutes")
  })

  const mapTimeToPosition = (time: string) => {
    const width = gGanttChart.value?.getBoundingClientRect().width || 0
    const diffFromStart = toDayjs(time).diff(
      chartStartDayjs.value,
      "minutes",
      true
    )
    return Math.ceil((diffFromStart / totalNumOfMinutes.value) * width)
  }

  const mapPositionToTime = (xPos: number) => {
    const width = gGanttChart.value?.getBoundingClientRect().width || 0
    const diffFromStart = (xPos / width) * totalNumOfMinutes.value
    return chartStartDayjs.value
      .add(diffFromStart, "minutes")
      .format(dateFormat.value)
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
