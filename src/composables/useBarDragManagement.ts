import type { GanttBarObject } from "../types"

import createBarDrag from "./createBarDrag.js"
import useDayjsHelper from "./useDayjsHelper.js"
import provideConfig from "../provider/provideConfig.js"
import provideGetChartRows from "../provider/provideGetChartRows.js"
import provideEmitBarEvent from "../provider/provideEmitBarEvent.js"

export default function useBarDragManagement() {
  const config = provideConfig()
  const getChartRows = provideGetChartRows()
  const emitBarEvent = provideEmitBarEvent()
  const { pushOnOverlap, barStart, barEnd, noOverlap, dateFormat } = config

  const movedBarsInDrag = new Map<GanttBarObject, { oldStart: string; oldEnd: string }>()

  const { toDayjs, format } = useDayjsHelper()

  const initDragOfBar = (bar: GanttBarObject, e: MouseEvent) => {
    const { initDrag } = createBarDrag(bar, onDrag, onEndDrag, config)
    emitBarEvent({ ...e, type: "dragstart" }, bar)
    initDrag(e)
    addBarToMovedBars(bar)
  }

  const initDragOfBundle = (mainBar: GanttBarObject, e: MouseEvent) => {
    const bundle = mainBar.ganttBarConfig.bundle
    if (bundle == null) {
      return
    }
    getChartRows().forEach((row) => {
      row.forEach((bar) => {
        if (bar.ganttBarConfig.bundle === bundle) {
          const dragEndHandler = bar === mainBar ? onEndDrag : () => null
          const { initDrag } = createBarDrag(bar, onDrag, dragEndHandler, config)
          initDrag(e)
          addBarToMovedBars(bar)
        }
      })
    })
    emitBarEvent({ ...e, type: "dragstart" }, mainBar)
  }

  const onDrag = (e: MouseEvent, bar: GanttBarObject) => {
    emitBarEvent({ ...e, type: "drag" }, bar)
    fixOverlaps(bar)
  }

  const fixOverlaps = (ganttBar: GanttBarObject) => {
    if (!pushOnOverlap?.value) {
      return
    }
    let currentBar = ganttBar
    let { overlapBar, overlapType } = getOverlapBarAndType(currentBar)
    while (overlapBar) {
      addBarToMovedBars(overlapBar)
      const currentBarStart = toDayjs(currentBar[barStart.value])
      const currentBarEnd = toDayjs(currentBar[barEnd.value])
      const overlapBarStart = toDayjs(overlapBar[barStart.value])
      const overlapBarEnd = toDayjs(overlapBar[barEnd.value])
      let minuteDiff: number
      switch (overlapType) {
        case "left":
          minuteDiff = overlapBarEnd.diff(currentBarStart, "minutes", true)
          overlapBar[barEnd.value] = format(currentBar[barStart.value], dateFormat.value)
          overlapBar[barStart.value] = format(
            overlapBarStart.subtract(minuteDiff, "minutes"),
            dateFormat.value
          )
          break
        case "right":
          minuteDiff = currentBarEnd.diff(overlapBarStart, "minutes", true)
          overlapBar[barStart.value] = format(currentBarEnd, dateFormat.value)
          overlapBar[barEnd.value] = format(
            overlapBarEnd.add(minuteDiff, "minutes"),
            dateFormat.value
          )
          break
        default:
          console.warn(
            "Vue-Ganttastic: One bar is inside of the other one! This should never occur while push-on-overlap is active!"
          )
          return
      }
      if (overlapBar && (overlapType === "left" || overlapType === "right")) {
        moveBundleOfPushedBarByMinutes(overlapBar, minuteDiff, overlapType)
      }
      currentBar = overlapBar
      ;({ overlapBar, overlapType } = getOverlapBarAndType(overlapBar))
    }
  }

  const getOverlapBarAndType = (ganttBar: GanttBarObject) => {
    let overlapLeft, overlapRight, overlapInBetween
    const allBarsInRow = getChartRows().find((row) => row.includes(ganttBar)) || []
    const ganttBarStart = toDayjs(ganttBar[barStart.value])
    const ganttBarEnd = toDayjs(ganttBar[barEnd.value])
    const overlapBar = allBarsInRow.find((otherBar) => {
      if (otherBar === ganttBar) {
        return false
      }
      const otherBarStart = toDayjs(otherBar[barStart.value])
      const otherBarEnd = toDayjs(otherBar[barEnd.value])
      overlapLeft = ganttBarStart.isBetween(otherBarStart, otherBarEnd)
      overlapRight = ganttBarEnd.isBetween(otherBarStart, otherBarEnd)
      overlapInBetween =
        otherBarStart.isBetween(ganttBarStart, ganttBarEnd) ||
        otherBarEnd.isBetween(ganttBarStart, ganttBarEnd)
      return overlapLeft || overlapRight || overlapInBetween
    })
    const overlapType = overlapLeft
      ? "left"
      : overlapRight
      ? "right"
      : overlapInBetween
      ? "between"
      : null
    return { overlapBar, overlapType }
  }

  const moveBundleOfPushedBarByMinutes = (
    pushedBar: GanttBarObject,
    minutes: number,
    direction: "left" | "right"
  ) => {
    addBarToMovedBars(pushedBar)
    if (!pushedBar.ganttBarConfig.bundle) {
      return
    }
    getChartRows().forEach((row) => {
      row.forEach((bar) => {
        if (bar.ganttBarConfig.bundle === pushedBar.ganttBarConfig.bundle && bar !== pushedBar) {
          addBarToMovedBars(bar)
          moveBarByMinutes(bar, minutes, direction)
        }
      })
    })
  }

  const moveBarByMinutes = (bar: GanttBarObject, minutes: number, direction: "left" | "right") => {
    switch (direction) {
      case "left":
        bar[barStart.value] = format(
          toDayjs(bar, "start").subtract(minutes, "minutes"),
          dateFormat.value
        )
        bar[barEnd.value] = format(
          toDayjs(bar, "end").subtract(minutes, "minutes"),
          dateFormat.value
        )
        break
      case "right":
        bar[barStart.value] = format(
          toDayjs(bar, "start").add(minutes, "minutes"),
          dateFormat.value
        )
        bar[barEnd.value] = format(toDayjs(bar, "end").add(minutes, "minutes"), dateFormat.value)
    }
    fixOverlaps(bar)
  }

  const onEndDrag = (e: MouseEvent, bar: GanttBarObject) => {
    snapBackAllMovedBarsIfNeeded()
    const ev = {
      ...e,
      type: "dragend"
    }
    emitBarEvent(ev, bar, undefined, new Map(movedBarsInDrag))
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
    if (pushOnOverlap.value || !noOverlap.value) {
      return
    }

    let isAnyOverlap = false
    movedBarsInDrag.forEach((_, bar) => {
      const { overlapBar } = getOverlapBarAndType(bar)
      if (overlapBar != null) {
        isAnyOverlap = true
      }
    })
    if (!isAnyOverlap) {
      return
    }
    movedBarsInDrag.forEach(({ oldStart, oldEnd }, bar) => {
      bar[barStart.value] = oldStart
      bar[barEnd.value] = oldEnd
    })
  }

  return {
    initDragOfBar,
    initDragOfBundle
  }
}
