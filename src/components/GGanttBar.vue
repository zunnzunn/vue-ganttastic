<template>
  <div
    :id="bar.id"
    ref="barElement"
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
      :bar-style="barStyle"
    >
      {{ tooltipContent }}
    </g-gantt-bar-tooltip>
  </div>
</template>

<script setup lang="ts">
import useBarBundleMoving from "@/composables/useBarBundleMoving"
import useTimePositionMapping from "@/composables/useTimePositionMapping"
import { GanttBarObject } from "../models/GanttBarObject"
import GGanttBarTooltip from "@/components/GGanttBarTooltip.vue"
import dayjs from "dayjs"
import { defineProps, computed, ref, toRefs, defineExpose, inject } from "vue"
import INJECTION_KEYS from "@/models/symbols"

const props = defineProps<{
  bar: GanttBarObject
  allBarsInRow: GanttBarObject[]
}>()
const gGanttChartPropsRefs = inject(INJECTION_KEYS.gGanttChartPropsKey)
const allBarsInChart = inject(INJECTION_KEYS.allBarsInChartKey)
if (!gGanttChartPropsRefs || !allBarsInChart) {
  throw new Error("GGanttBar: Provide/Inject of values from GGanttChart failed!")
}

const barElement = ref<HTMLElement>()
const { bar } = toRefs(props)
const { mapTimeToPosition } = useTimePositionMapping(gGanttChartPropsRefs)
const { initDragOfBarsFromBundle } = useBarBundleMoving(allBarsInChart, gGanttChartPropsRefs)
const onMousedown = (e: MouseEvent) => {
  e.preventDefault()
  if (!bar.value.ganttBarConfig.immobile) {
    const firstMousemoveCallback = (e: MouseEvent) => initDragOfBarsFromBundle(bar.value.ganttBarConfig.bundle, e)
    window.addEventListener("mousemove", firstMousemoveCallback, { once: true }) // on first mousemove event
    window.addEventListener("mouseup", // in case user does not move the mouse after mousedown at all
      () => window.removeEventListener("mousemove", firstMousemoveCallback),
      { once: true }
    )
  }
}

const { barStart, barEnd } = gGanttChartPropsRefs
const tooltipContent = computed(() => {
  const barStartFormatted = dayjs(bar.value[barStart.value]).format("HH:mm")
  const barEndFormatted = dayjs(bar.value[barEnd.value]).format("HH:mm")
  return `${barStartFormatted} - ${barEndFormatted}`
})

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

defineExpose({
  barElement
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
