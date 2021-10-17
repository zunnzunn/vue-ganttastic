import dayjs from "dayjs"
import INJECTION_KEYS from "../models/symbols"
import { GanttBarObject, GGanttChartPropsRefs } from "@/models/GanttBarObject"
import useTimePositionMapping from "./useTimePositionMapping"
import { Ref, ref, inject } from "vue"

export default function useBarDrag (
  bar: Ref<GanttBarObject>,
  allBarsInRow: Ref<GanttBarObject[]>,
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { barStart, barEnd } = gGanttChartPropsRefs

  const isDragging = ref(false)
  let cursorOffsetX = 0
  let dragCallBack : (e: MouseEvent) => void
  const { mapPositionToTime } = useTimePositionMapping(gGanttChartPropsRefs)
  const pushOnOverlap = inject(INJECTION_KEYS.pushOnOverlapKey)

  const initDrag = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.id)
    if (barElement) {
      cursorOffsetX = e.clientX - (barElement.getBoundingClientRect().left || 0)
      const mousedownType = (e.target as Element).className
      switch (mousedownType) {
        case "g-gantt-bar-handle-left":
          document.body.style.cursor = "w-resize"
          dragCallBack = dragByLeftHandle
          break
        case "g-gantt-bar-handle-right":
          document.body.style.cursor = "w-resize"
          dragCallBack = dragByRightHandle
          break
        default: dragCallBack = drag
      }
      isDragging.value = true
      window.addEventListener("mousemove", dragCallBack)
      window.addEventListener("mouseup", endDrag)
    }
  }

  const drag = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.id)
    const barContainer = barElement?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
    if (barElement && barContainer) {
      const barWidth = barElement.getBoundingClientRect().width
      const xStart = (e.clientX - barContainer.left - cursorOffsetX)
      const xEnd = xStart + barWidth
      bar.value[barStart.value] = mapPositionToTime(xStart)
      bar.value[barEnd.value] = mapPositionToTime(xEnd)
      fixOverlaps()
    }
  }

  const dragByLeftHandle = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.id)
    const barContainer = barElement?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
    if (barElement && barContainer) {
      const xStart = e.clientX - barContainer.left
      const newBarStart = mapPositionToTime(xStart)
      if (dayjs(newBarStart).isSameOrAfter(bar.value[barEnd.value])) {
        return
      }
      bar.value[barStart.value] = newBarStart
      fixOverlaps()
    }
  }

  const dragByRightHandle = (e: MouseEvent) => {
    const barElement = document.getElementById(bar.value.id)
    const barContainer = barElement?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
    if (barElement && barContainer) {
      const xEnd = e.clientX - barContainer.left
      const newBarEnd = mapPositionToTime(xEnd)
      if (dayjs(newBarEnd).isSameOrBefore(bar.value[barStart.value])) {
        return
      }
      bar.value[barEnd.value] = newBarEnd
      fixOverlaps()
    }
  }

  const fixOverlaps = () => {
    if (!pushOnOverlap?.value) {
      return
    }
    let currentBar = bar.value
    let { overlapBar, overlapType } = getOverlapBarAndType(currentBar)
    while (overlapBar) {
      const currentBarStart = dayjs(currentBar[barStart.value])
      const currentBarEnd = dayjs(currentBar[barEnd.value])
      const overlapBarStart = dayjs(overlapBar[barStart.value])
      const overlapBarEnd = dayjs(overlapBar[barEnd.value])
      let minuteDiff : number
      switch (overlapType) {
        case "left":
          minuteDiff = overlapBarEnd.diff(currentBarStart, "minutes", true)
          overlapBar[barEnd.value] = currentBarStart.format("YYYY-MM-DD HH:mm:ss")
          overlapBar[barStart.value] = overlapBarStart.subtract(minuteDiff, "minutes").format("YYYY-MM-DD HH:mm:ss")
          break
        case "right":
          minuteDiff = currentBarEnd.diff(overlapBarStart, "minutes", true)
          overlapBar[barStart.value] = currentBarEnd.format("YYYY-MM-DD HH:mm:ss")
          overlapBar[barEnd.value] = overlapBarEnd.add(minuteDiff, "minutes").format("YYYY-MM-DD HH:mm:ss")
          break
        default:
          console.warn("Vue-Ganttastic: One bar is inside of the other one! This should never occur while push-on-overlap is active!")
          return
      }
      currentBar = overlapBar;
      ({ overlapBar, overlapType } = getOverlapBarAndType(overlapBar))
    }
  }

  const getOverlapBarAndType = (ganttBar: GanttBarObject) => {
    let overlapLeft, overlapRight, overlapInBetween
    const overlapBar = allBarsInRow.value.find(otherBar => {
      if (otherBar === ganttBar) {
        return false
      }
      overlapLeft = dayjs(ganttBar[barStart.value]).isBetween(otherBar[barStart.value], otherBar[barEnd.value])
      overlapRight = dayjs(ganttBar[barEnd.value]).isBetween(otherBar[barStart.value], otherBar[barEnd.value])
      overlapInBetween = dayjs(otherBar[barStart.value]).isBetween(ganttBar[barStart.value], ganttBar[barEnd.value]) ||
                        dayjs(otherBar[barEnd.value]).isBetween(ganttBar[barStart.value], ganttBar[barEnd.value])
      return overlapLeft || overlapRight || overlapInBetween
    })
    const overlapType = overlapLeft ? "left" : (overlapRight ? "right" : (overlapInBetween ? "between" : null))
    return { overlapBar, overlapType }
  }

  const endDrag = (e: MouseEvent) => {
    isDragging.value = false
    document.body.style.cursor = "auto"
    window.removeEventListener("mousemove", dragCallBack)
    window.removeEventListener("mouseup", endDrag)
  }

  return {
    isDragging,
    initDrag
  }
}
