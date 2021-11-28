<template>
  <div
    :id="bar.ganttBarConfig.id"
    class="g-gantt-bar"
    :style="barStyle"
    @mousedown="onMousedown"
  >
    <div class="g-gantt-bar-label">
      <slot :bar="bar">
        <div>
          {{ bar.ganttBarConfig.label|| "" }}
        </div>
      </slot>
    </div>
    <template v-if="bar.ganttBarConfig.hasHandles">
      <div class="g-gantt-bar-handle-left" />
      <div class="g-gantt-bar-handle-right" />
    </template>

    <g-gantt-bar-tooltip
      :bar-id="bar.ganttBarConfig.id"
      :bar-style="barStyle"
      :force-show="isDragging"
    >
      {{ tooltipContent }}
    </g-gantt-bar-tooltip>
  </div>
</template>

<script setup lang="ts">
import useBarDragManagement from "@/composables/useBarDragManagement"
import useTimePositionMapping from "@/composables/useTimePositionMapping"
import useBarDragLimit from "@/composables/useBarDragLimit"
import { GanttBarObject } from "../models/models"
import GGanttBarTooltip from "@/components/GGanttBarTooltip.vue"
import dayjs from "dayjs"
import { defineProps, computed, ref, toRefs, inject } from "vue"
import INJECTION_KEYS from "@/models/symbols"

const props = defineProps<{
  bar: GanttBarObject
}>()

const allRowsInChart = inject(INJECTION_KEYS.allBarsInChartKey)
const gGanttChartPropsRefs = inject(INJECTION_KEYS.gGanttChartPropsKey)
if (!allRowsInChart || !gGanttChartPropsRefs) {
  throw Error("GGanttBar: Failed to inject GGanttChart props!")
}

const { bar } = toRefs(props)
const { precision, rowHeight } = gGanttChartPropsRefs
const { mapTimeToPosition } = useTimePositionMapping(gGanttChartPropsRefs)
const { initDragOfBar, initDragOfBundle } = useBarDragManagement(allRowsInChart, gGanttChartPropsRefs)
const { setDragLimitsOfGanttBar } = useBarDragLimit(allRowsInChart, gGanttChartPropsRefs)

const isDragging = ref(false)

let firstMousemoveCallback : (e: MouseEvent) => void
if (bar.value.ganttBarConfig.bundle) {
  firstMousemoveCallback = (e: MouseEvent) => {
    initDragOfBundle(bar.value.ganttBarConfig.bundle, e)
    isDragging.value = true
  }
} else {
  firstMousemoveCallback = (e: MouseEvent) => {
    initDragOfBar(bar.value, e)
    isDragging.value = true
  }
}

const onMousedown = (e: MouseEvent) => {
  e.preventDefault()
  setDragLimitsOfGanttBar(bar.value)
  if (!bar.value.ganttBarConfig.immobile) {
    window.addEventListener("mousemove", firstMousemoveCallback, { once: true }) // on first mousemove event
    window.addEventListener("mouseup", // in case user does not move the mouse after mousedown at all
      () => {
        window.removeEventListener("mousemove", firstMousemoveCallback)
        isDragging.value = false
      },
      { once: true }
    )
  }
}

const { barStart, barEnd } = gGanttChartPropsRefs
const tooltipFormats = {
  hour: "HH:mm",
  day: "DD. MMM HH:mm",
  month: "DD. MMMM YYYY"
}
const tooltipContent = computed(() => {
  const format = tooltipFormats[precision.value]
  const barStartFormatted = dayjs(bar.value[barStart.value]).format(format)
  const barEndFormatted = dayjs(bar.value[barEnd.value]).format(format)
  return `${barStartFormatted} - ${barEndFormatted}`
})

const barStyle = computed(() => {
  const xStart = mapTimeToPosition(bar.value.beginDate)
  const xEnd = mapTimeToPosition(bar.value.endDate)
  return {
    ...bar.value.ganttBarConfig.style,
    position: "absolute",
    top: `${rowHeight.value * 0.1}px`,
    left: `${xStart}px`,
    width: `${xEnd - xStart}px`,
    height: `${rowHeight.value * 0.8}px`,
    zIndex: 2
  }
})

</script>

<style scoped>
.g-gantt-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: cadetblue;
  overflow: hidden;
}

.g-gantt-bar-label {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 14px 0 14px;   /* 14px is the width of the handle */
  display: flex;
  justify-content: center;
  align-items: center;
}
.g-gantt-bar-label > * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.g-gantt-bar-label img {
  pointer-events: none;
}

</style>
