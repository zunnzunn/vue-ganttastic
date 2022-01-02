import { GGanttChartPropsRefs } from "../models/models"
import useDayjsHelper from "./useDayjsHelper"
import { ref, computed } from "vue"

export default function useTimePositionMapping (
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { chartStart, width, dateFormat } = gGanttChartPropsRefs
  const { chartStartDayjs, chartEndDayjs, toDayjs } = useDayjsHelper(gGanttChartPropsRefs)

  const totalNumOfMinutes = computed(() => {
    return chartEndDayjs.value.diff(chartStartDayjs.value, "minutes")
  })

  const widthInPx = ref(Number(width.value.replace("px", "")))
  if (!chartStart || !width) {
    throw new Error("useTimePositionMapping: Provide/Inject of values from GGanttChart failed!")
  }

  const mapTimeToPosition = (time: string) => {
    const diffFromStart = toDayjs(time).diff(chartStartDayjs.value, "minutes", true)
    return Math.ceil((diffFromStart / totalNumOfMinutes.value) * widthInPx.value)
  }

  const mapPositionToTime = (xPos: number) => {
    const diffFromStart = (xPos / widthInPx.value * totalNumOfMinutes.value)
    return chartStartDayjs.value.add(diffFromStart, "minutes").format(dateFormat.value)
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
