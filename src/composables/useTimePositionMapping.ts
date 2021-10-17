import { GGanttChartPropsRefs } from "./../models/GanttBarObject"
import dayjs from "dayjs"
import useTimeaxisUnits from "./useTimeaxisUnits"
import { ref } from "vue"

export default function useTimePositionMapping (
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { chartStart, width, precision } = gGanttChartPropsRefs
  const widthInPx = ref(Number(width.value.replace("px", "")))
  const { timeaxisUnits } = useTimeaxisUnits(gGanttChartPropsRefs)
  if (!chartStart || !precision || !width) {
    throw new Error("useTimePositionMapping: Provide/Inject of values from GGanttChart failed!")
  }

  const mapTimeToPosition = (time: string) => {
    const diffFromStart = dayjs(time).diff(chartStart.value, precision.value, true)
    return Math.ceil((diffFromStart / timeaxisUnits.value.lowerUnits.length) * widthInPx.value)
  }

  const mapPositionToTime = (xPos: number) => {
    const diffFromStart = (xPos / widthInPx.value * timeaxisUnits.value.lowerUnits.length)
    return dayjs(chartStart.value).add(diffFromStart, precision.value).format("YYYY-MM-DD HH:mm")
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
