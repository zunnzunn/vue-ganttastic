import { GGanttChartPropsRefs } from "../models/models"
import useDayjsHelper from "./useDayjsHelper"
import { computed } from "vue"

export default function useTimePositionMapping (
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { chartStart, width, dateFormat, gGanttChart } = gGanttChartPropsRefs
  const { chartStartDayjs, chartEndDayjs, toDayjs } = useDayjsHelper(gGanttChartPropsRefs)

  const totalNumOfMinutes = computed(() => {
    return chartEndDayjs.value.diff(chartStartDayjs.value, "minutes")
  })

  if (!chartStart || !width) {
    throw new Error("useTimePositionMapping: Provide/Inject of values from GGanttChart failed!")
  }

  const mapTimeToPosition = (time: string) => {
    const width = gGanttChart.value?.getBoundingClientRect().width || 0
    const diffFromStart = toDayjs(time).diff(chartStartDayjs.value, "minutes", true)
    return Math.ceil((diffFromStart / totalNumOfMinutes.value) * width)
  }

  const mapPositionToTime = (xPos: number) => {
    const width = gGanttChart.value?.getBoundingClientRect().width || 0
    const diffFromStart = (xPos / width * totalNumOfMinutes.value)
    return chartStartDayjs.value.add(diffFromStart, "minutes").format(dateFormat.value)
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
