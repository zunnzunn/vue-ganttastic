<template>
  <div>
    <div
      ref="barElement"
      class="g-gantt-bar"
      :style="barStyle"
      @mousedown="onMousedown($event)"
    >
      {{ bar[barStart] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { defineProps, defineExpose, ref, computed, toRefs, inject } from "vue"
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import GanttBarObject from "../models/GanttBarObject"
import INJECTION_KEYS from "../models/symbols"

const props = defineProps<{
  bar: GanttBarObject
  barStart: string
  barEnd: string
}>()

const chartStart = inject(INJECTION_KEYS.chartStartKey)
const chartEnd = inject(INJECTION_KEYS.chartEndKey)
const chartWidth = inject(INJECTION_KEYS.widthKey)
const precision = inject(INJECTION_KEYS.precisionKey)
if (!chartStart || !chartEnd || !precision || !chartWidth) {
  throw new Error("GGanttBar: Provide/Inject of values from GGanttChart failed!")
}

const { bar, barStart, barEnd } = toRefs(props)
const barElement = ref<HTMLElement>()
const barContainer = barElement.value?.closest(".g-gantt-row-bars-container")?.getBoundingClientRect()
const { timeaxisUnits } = useTimeaxisUnits(chartStart.value, chartEnd.value, precision.value)

const barStyle = computed(() => {
  const xStart = mapTimeToPosition(bar.value.beginDate)
  const xEnd = mapTimeToPosition(bar.value.endDate)
  return {
    borderRadius: "10px",
    background: "cadetblue",
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

const initDrag = (e: MouseEvent) => {
  cursorOffsetX = e.clientX - (barElement.value?.getBoundingClientRect().left || 0)
  window.addEventListener("mousemove", drag)
  window.addEventListener("mouseup", endDrag)
}

const drag = (e: MouseEvent) => {
  if (barElement.value) {
    const barContainerOffsetLeft = 0
    const barWidth = barElement.value?.getBoundingClientRect().width
    const xStart = (e.clientX - barContainerOffsetLeft - cursorOffsetX)
    const xEnd = xStart + barWidth
    bar.value[barStart.value] = mapPositionToTime(xStart)
    bar.value[barEnd.value] = mapPositionToTime(xEnd)
  }
}

const endDrag = (e: MouseEvent) => {
  document.body.style.cursor = "auto"
  window.removeEventListener("mousemove", drag)
  window.removeEventListener("mouseup", endDrag)
}

defineExpose({
  barElement
})

</script>
