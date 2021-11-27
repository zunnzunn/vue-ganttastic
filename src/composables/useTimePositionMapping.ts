import { GGanttChartPropsRefs } from "./../models/GanttBarObject"
import dayjs from "dayjs"
import { ref, computed } from "vue"

export default function useTimePositionMapping (
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { chartStart, chartEnd, width } = gGanttChartPropsRefs
  const totalNumOfMinutes = computed(() => {
    return dayjs(chartEnd.value).diff(chartStart.value, "minutes")
  })
  const widthInPx = ref(Number(width.value.replace("px", "")))
  if (!chartStart || !width) {
    throw new Error("useTimePositionMapping: Provide/Inject of values from GGanttChart failed!")
  }

  const mapTimeToPosition = (time: string) => {
    const diffFromStart = dayjs(time).diff(chartStart.value, "minutes", true)
    return Math.ceil((diffFromStart / totalNumOfMinutes.value) * widthInPx.value)
  }

  const mapPositionToTime = (xPos: number) => {
    const diffFromStart = (xPos / widthInPx.value * totalNumOfMinutes.value)
    return dayjs(chartStart.value).add(diffFromStart, "minutes").format("YYYY-MM-DD HH:mm")
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
