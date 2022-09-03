<template>
  <div
    :id="bar.ganttBarConfig.id"
    class="g-gantt-bar"
    :style="barStyle"
    @mousedown="onMouseEvent"
    @click="onMouseEvent"
    @dblclick="onMouseEvent"
    @mouseenter="onMouseEvent"
    @mouseleave="onMouseEvent"
    @contextmenu="onMouseEvent"
  >
    <div class="g-gantt-bar-label">
      <slot :bar="bar">
        <div>
          {{ bar.ganttBarConfig.label || "" }}
        </div>
      </slot>
    </div>
    <template v-if="bar.ganttBarConfig.hasHandles">
      <div class="g-gantt-bar-handle-left" />
      <div class="g-gantt-bar-handle-right" />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  toRefs,
  watch,
  nextTick,
  type CSSProperties,
  onUnmounted
} from "vue"

import useBarDragManagement from "../composables/useBarDragManagement"
import useTimePositionMapping from "../composables/useTimePositionMapping"
import useBarDragLimit from "../composables/useBarDragLimit"
import type { GanttBarObject } from "../types"
import useContext from "../composables/useContext"
import useConfig from "../composables/useConfig"

const props = defineProps<{
  bar: GanttBarObject
}>()
const { emitBarEvent } = useContext()
const config = useConfig()
const { rowHeight } = useConfig()

const { bar } = toRefs(props)
const { mapTimeToPosition, mapPositionToTime } = useTimePositionMapping()
const { initDragOfBar, initDragOfBundle } = useBarDragManagement()
const { setDragLimitsOfGanttBar } = useBarDragLimit()

const isDragging = ref(false)

const prepareForDrag = () => {
  setDragLimitsOfGanttBar(bar.value)
  if (bar.value.ganttBarConfig.immobile) {
    return
  }
  const firstMousemoveCallback = (e: MouseEvent) => {
    bar.value.ganttBarConfig.bundle != null
      ? initDragOfBundle(bar.value, e)
      : initDragOfBar(bar.value, e)
    isDragging.value = true
  }
  window.addEventListener("mousemove", firstMousemoveCallback, {
    once: true
  }) // on first mousemove event
  window.addEventListener(
    "mouseup",
    () => {
      // in case user does not move the mouse after mousedown at all
      window.removeEventListener("mousemove", firstMousemoveCallback)
      isDragging.value = false
    },
    { once: true }
  )
}
const onMouseEvent = (e: MouseEvent) => {
  e.preventDefault()
  if (e.type === "mousedown") {
    prepareForDrag()
  }
  const barElement = document.getElementById(bar.value.ganttBarConfig.id)
  const barContainer = barElement
    ?.closest(".g-gantt-row-bars-container")
    ?.getBoundingClientRect()
  let datetime
  if (barContainer) {
    datetime = mapPositionToTime(e.clientX - barContainer.left)
  }
  emitBarEvent(e, bar.value, datetime)
}

const { barStart, barEnd, width, chartStart, chartEnd } = config

const xStart = ref(0)
const xEnd = ref(0)

function calculateSize() {
  xStart.value = mapTimeToPosition(bar.value[barStart.value])
  xEnd.value = mapTimeToPosition(bar.value[barEnd.value])
}

watch(
  [bar, width, chartStart, chartEnd],
  async () => {
    await nextTick()
    calculateSize()
  },
  { deep: true, immediate: true }
)

window.addEventListener("resize", calculateSize)
onUnmounted(() => window.removeEventListener("resize", calculateSize))

const barStyle = computed(() => {
  return {
    ...bar.value.ganttBarConfig.style,
    position: "absolute",
    top: `${rowHeight.value * 0.1}px`,
    left: `${xStart.value}px`,
    width: `${xEnd.value - xStart.value}px`,
    height: `${rowHeight.value * 0.8}px`,
    zIndex: isDragging.value ? 3 : 2
  } as CSSProperties
})
</script>

<style>
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
  padding: 0 14px 0 14px; /* 14px is the width of the handle */
  display: flex;
  justify-content: center;
  align-items: center;
}
.g-gantt-bar-label > * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.g-gantt-bar-handle-left,
.g-gantt-bar-handle-right {
  position: absolute;
  width: 10px;
  height: 100%;
  background: white;
  opacity: 0.7;
  border-radius: 0px;
  cursor: ew-resize;
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
