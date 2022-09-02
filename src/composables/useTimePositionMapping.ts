import { computed } from "vue"
import useContext from "./useContext"

import useDayjsHelper from "./useDayjsHelper"

export default function useTimePositionMapping() {
  const { config } = useContext()
  const { dateFormat, gGanttChart } = config
  const { chartStartDayjs, chartEndDayjs, toDayjs } = useDayjsHelper()

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
