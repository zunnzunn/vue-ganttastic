import INJECTION_KEYS from "@/models/symbols"
import dayjs from "dayjs"
import { inject } from "vue"
import useTimeaxisUnits from "./useTimeaxisUnits"

export default function useTimePositionMapping () {
  const chartStart = inject(INJECTION_KEYS.chartStartKey)
  const chartWidth = inject(INJECTION_KEYS.widthKey)
  const precision = inject(INJECTION_KEYS.precisionKey)
  const { timeaxisUnits } = useTimeaxisUnits()
  if (!chartStart || !precision || !chartWidth) {
    throw new Error("GGanttBar: Provide/Inject of values from GGanttChart failed!")
  }

  const mapTimeToPosition = (time: string) => {
    const diffFromStart = dayjs(time).diff(chartStart.value, precision.value, true)
    return Math.ceil((diffFromStart / timeaxisUnits.value.lowerUnits.length) * chartWidth.value)
  }

  const mapPositionToTime = (xPos: number) => {
    const diffFromStart = (xPos / chartWidth.value * timeaxisUnits.value.lowerUnits.length)
    return dayjs(chartStart.value).add(diffFromStart, precision.value).format("YYYY-MM-DD HH:mm")
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
