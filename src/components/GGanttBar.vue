<template>
  <div
    ref="barElement"
    class="g-gantt-bar"
    :style="barStyle"
    @mousedown="onMousedown($event)"
  >
    {{ bar[barStart] }}
    <template v-if="bar.ganttBarConfig.hasHandles">
      <div class="g-gantt-bar-handle-left" />
      <div class="g-gantt-bar-handle-right" />
    </template>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { defineProps, defineExpose, ref, computed, toRefs, inject, onMounted } from "vue"
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import GanttBarObject from "../models/GanttBarObject"
import INJECTION_KEYS from "../models/symbols"

const props = defineProps<{
  bar: GanttBarObject
  barStart: string
  barEnd: string
  allBarsInRow: GanttBarObject[]
}>()

const chartStart = inject(INJECTION_KEYS.chartStartKey)
const chartEnd = inject(INJECTION_KEYS.chartEndKey)
const chartWidth = inject(INJECTION_KEYS.widthKey)
const precision = inject(INJECTION_KEYS.precisionKey)
const pushOnOverlap = inject(INJECTION_KEYS.pushOnOverlapKey)
if (!chartStart || !chartEnd || !precision || !chartWidth) {
  throw new Error("GGanttBar: Provide/Inject of values from GGanttChart failed!")
}

const { bar, barStart, barEnd, allBarsInRow } = toRefs(props)
const { timeaxisUnits } = useTimeaxisUnits(chartStart.value, chartEnd.value, precision.value)

const barStyle = computed(() => {
  const xStart = mapTimeToPosition(bar.value.beginDate)
  const xEnd = mapTimeToPosition(bar.value.endDate)
  return {
    ...bar.value.ganttBarConfig.style,
    position: "absolute",
    top: "5px",
    left: `${xStart}px`,
    width: `${xEnd - xStart}px`,
    height: "30px",
    zIndex: 2
  }
})

const mapTimeToPosition = (time: string) => {
  const diffFromStart = dayjs(time).diff(chartStart.value, precision.value, true)
  return Math.ceil((diffFromStart / timeaxisUnits.value.lowerUnits.length) * chartWidth.value)
}

const mapPositionToTime = (xPos: number) => {
  const diffFromStart = (xPos / chartWidth.value * timeaxisUnits.value.lowerUnits.length)
  return dayjs(chartStart.value).add(diffFromStart, precision.value).format("YYYY-MM-DD HH:mm")
}

let cursorOffsetX = 0
const barElement = ref<HTMLElement>()
let barContainer: DOMRect | undefined
onMounted(() => {
  barContainer = barElement.value?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
})

const onMousedown = (e: MouseEvent) => {
  e.preventDefault()
  window.addEventListener("mousemove", onFirstMousemove, { once: true })
  window.addEventListener("mouseup",
    () => window.removeEventListener("mousemove", onFirstMousemove),
    { once: true }
  )
}

const onFirstMousemove = (e: MouseEvent) => {
  initDrag(e)
}

let dragCallBack : (e: MouseEvent) => void

const initDrag = (e: MouseEvent) => {
  cursorOffsetX = e.clientX - (barElement.value?.getBoundingClientRect().left || 0)
  const mousedownType = (e.target as Element).className
  console.log("🚀 ~ file: GGanttBar.vue ~ line 87 ~ initDrag ~ mousedownType", mousedownType)
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
  window.addEventListener("mousemove", dragCallBack)
  window.addEventListener("mouseup", endDrag)
}

const drag = (e: MouseEvent) => {
  if (barElement.value && barContainer) {
    const barWidth = barElement.value?.getBoundingClientRect().width
    const xStart = (e.clientX - barContainer.left - cursorOffsetX)
    const xEnd = xStart + barWidth
    bar.value[barStart.value] = mapPositionToTime(xStart)
    bar.value[barEnd.value] = mapPositionToTime(xEnd)
    fixOverlaps()
  }
}

const dragByLeftHandle = (e: MouseEvent) => {
  if (barElement.value && barContainer) {
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
  if (barElement.value && barContainer) {
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
  if (!pushOnOverlap) {
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
  document.body.style.cursor = "auto"
  window.removeEventListener("mousemove", dragCallBack)
  window.removeEventListener("mouseup", endDrag)
}

defineExpose({
  barElement
})

</script>

<style scoped>

.g-gantt-bar {
  background: cadetblue;
}
.g-gantt-bar-handle-left, .g-gantt-bar-handle-right {
  position: absolute;
  width: 10px;
  height: 100%;
  background: white;
  opacity: 0.7;
  border-radius: 0px;
  cursor: w-resize;
  top: 0;
}
.g-gantt-bar-handle-left {
  left: 0;
}
.g-gantt-bar-handle-right {
  right: 0;
}
</style>
