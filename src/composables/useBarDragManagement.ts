import { GanttBarObject, GGanttChartPropsRefs } from "../models/models"
import { ComputedRef, ref } from "vue"
import dayjs from "dayjs"
import useBarDrag from "./useBarDrag"

export default function useBarDragManagement (
  allRowsInChart : ComputedRef<GanttBarObject[][]>,
  gGanttChartPropsRefs: GGanttChartPropsRefs,
  emitBarEvent: (
    e: MouseEvent,
    bar: GanttBarObject,
    datetime?: string,
    movedBars?: Map<GanttBarObject, {oldStart: string, oldEnd: string}>
  ) => void
) {
  const movedBarsInDrag = new Map<GanttBarObject, {oldStart: string, oldEnd: string}>()

  const { pushOnOverlap, barStart, barEnd, snapBackOnOverlap } = gGanttChartPropsRefs

  const initDragOfBar = (bar: GanttBarObject, e: MouseEvent) => {
    const { initDrag } = useBarDrag(ref(bar), gGanttChartPropsRefs, onDrag, onEndDrag)
    const ev = {
      ...e,
      type: "dragstart"
    }
    emitBarEvent(ev, bar)
    initDrag(e)
    addBarToMovedBars(bar)
  }

  const initDragOfBundle = (mainBar: GanttBarObject, e: MouseEvent) => {
    const bundle = mainBar.ganttBarConfig.bundle
    if (bundle != null) {
      allRowsInChart.value.forEach(row => {
        row.forEach(bar => {
          if (bar.ganttBarConfig.bundle === bundle) {
            const dragEndHandler = bar === mainBar ? onEndDrag : () => null
            const { initDrag } = useBarDrag(ref(bar), gGanttChartPropsRefs, onDrag, dragEndHandler)
            initDrag(e)
            addBarToMovedBars(bar)
          }
        })
      })
      const ev = {
        ...e,
        type: "dragstart"
      }
      emitBarEvent(ev, mainBar)
    }
  }

  const onDrag = (e: MouseEvent, bar: GanttBarObject) => {
    const ev = {
      ...e,
      type: "drag"
    }
    emitBarEvent(ev, bar)
    fixOverlaps(bar)
  }

  const fixOverlaps = (ganttBar: GanttBarObject) => {
    if (!pushOnOverlap.value) {
      return
    }
    let currentBar = ganttBar
    let { overlapBar, overlapType } = getOverlapBarAndType(currentBar)
    while (overlapBar) {
      addBarToMovedBars(overlapBar)
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
      if (overlapBar && (overlapType === "left" || overlapType === "right")) {
        moveBundleOfPushedBarByMinutes(overlapBar, minuteDiff, overlapType)
      }
      currentBar = overlapBar;
      ({ overlapBar, overlapType } = getOverlapBarAndType(overlapBar))
    }
  }

  const getOverlapBarAndType = (ganttBar: GanttBarObject) => {
    let overlapLeft, overlapRight, overlapInBetween
    const allBarsInRow = allRowsInChart.value.find(row => row.includes(ganttBar)) || []
    const overlapBar = allBarsInRow.find(otherBar => {
      if (otherBar === ganttBar) {
        return false
      }
      overlapLeft = dayjs(ganttBar[barStart.value]).isBetween(otherBar[barStart.value], otherBar[barEnd.value])
      overlapRight = dayjs(ganttBar[barEnd.value]).isBetween(otherBar[barStart.value], otherBar[barEnd.value])
      overlapInBetween = dayjs(otherBar[barStart.value]).isBetween(ganttBar[barStart.value], ganttBar[barEnd.value]) ||
                        dayjs(otherBar[barEnd.value]).isBetween(ganttBar[barStart.value], ganttBar[barEnd.value])
      return overlapLeft || overlapRight || overlapInBetween
    })
    let overlapType : "left" | "right" | "between" | null = null
    overlapType = overlapLeft ? "left" : (overlapRight ? "right" : (overlapInBetween ? "between" : null))
    return { overlapBar, overlapType }
  }

  const moveBundleOfPushedBarByMinutes = (pushedBar: GanttBarObject, minutes: number, direction: "left" | "right") => {
    addBarToMovedBars(pushedBar)
    if (pushedBar.ganttBarConfig.bundle) {
      allRowsInChart.value.forEach(row => {
        row.forEach(bar => {
          if (bar.ganttBarConfig.bundle === pushedBar.ganttBarConfig.bundle && bar !== pushedBar) {
            addBarToMovedBars(bar)
            moveBarByMinutes(bar, minutes, direction)
          }
        })
      })
    }
  }

  const moveBarByMinutes = (bar: GanttBarObject, minutes: number, direction: "left" | "right") => {
    switch (direction) {
      case "left":
        bar[barStart.value] = dayjs(bar[barStart.value]).subtract(minutes, "minutes").format("YYYY-MM-DD HH:mm:ss")
        bar[barEnd.value] = dayjs(bar[barEnd.value]).subtract(minutes, "minutes").format("YYYY-MM-DD HH:mm:ss")
        break
      case "right":
        bar[barStart.value] = dayjs(bar[barStart.value]).add(minutes, "minutes").format("YYYY-MM-DD HH:mm:ss")
        bar[barEnd.value] = dayjs(bar[barEnd.value]).add(minutes, "minutes").format("YYYY-MM-DD HH:mm:ss")
    }
    fixOverlaps(bar)
  }

  const onEndDrag = (e: MouseEvent, bar: GanttBarObject) => {
    snapBackAllMovedBarsIfNeeded()
    const ev = {
      ...e,
      type: "dragend"
    }
    emitBarEvent(ev, bar, undefined, movedBarsInDrag)
    movedBarsInDrag.clear()
  }

  const addBarToMovedBars = (bar: GanttBarObject) => {
    if (!movedBarsInDrag.has(bar)) {
      const oldStart = bar[barStart.value]
      const oldEnd = bar[barEnd.value]
      movedBarsInDrag.set(bar, { oldStart, oldEnd })
    }
  }

  const snapBackAllMovedBarsIfNeeded = () => {
    if (!pushOnOverlap.value && snapBackOnOverlap.value) {
      let isAnyOverlap = false
      movedBarsInDrag.forEach((_, bar) => {
        const { overlapBar } = getOverlapBarAndType(bar)
        if (overlapBar != null) {
          isAnyOverlap = true
        }
      })
      if (isAnyOverlap) {
        movedBarsInDrag.forEach(({ oldStart, oldEnd }, bar) => {
          bar[barStart.value] = oldStart
          bar[barEnd.value] = oldEnd
        })
      }
    }
  }

  return {
    initDragOfBar,
    initDragOfBundle
  }
}
