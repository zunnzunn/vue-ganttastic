<template>
  <div
    ref="barElement"
    class="g-gantt-bar"
    :style="barStyle"
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
      :force-show="isDragging"
      :bar-style="barStyle"
    >
      {{ tooltipContent }}
    </g-gantt-bar-tooltip>
  </div>
</template>

<script setup lang="ts">
import useBarDrag from "@/composables/useBarDrag"
import useTimePositionMapping from "@/composables/useTimePositionMapping"
import GanttBarObject from "../models/GanttBarObject"
import GGanttBarTooltip from "@/components/GGanttBarTooltip.vue"
import dayjs from "dayjs"
import { defineProps, computed, ref, toRefs, defineExpose } from "vue"

const props = defineProps<{
  bar: GanttBarObject
  barStart: string
  barEnd: string
  allBarsInRow: GanttBarObject[]
}>()

const barElement = ref<HTMLElement>()
const { bar, barStart, barEnd, allBarsInRow } = toRefs(props)
const { mapTimeToPosition } = useTimePositionMapping()
const { isDragging } = useBarDrag(bar, barElement, barStart, barEnd, allBarsInRow)
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
    zIndex: isDragging.value ? 3 : 2
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
