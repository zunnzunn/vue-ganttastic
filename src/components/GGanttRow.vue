<template>
  <div
    class="g-gantt-row"
    :style="rowStyle"
    @dragover.prevent="isHovering = true"
    @dragleave="isHovering = false"
    @drop="onDrop($event)"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div
      v-if="!isBlank(label) && !labelColumnTitle"
      class="g-gantt-row-label"
      :style="{ background: colors.primary, color: colors.text }"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div ref="barContainer" class="g-gantt-row-bars-container" v-bind="$attrs">
      <transition-group name="bar-transition" tag="div">
        <g-gantt-bar v-for="bar in bars" :key="bar.ganttBarConfig.id" :bar="bar">
          <slot name="bar-label" :bar="bar" />
        </g-gantt-bar>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, toRefs, type Ref, type StyleValue } from "vue";

import useTimePositionMapping from "../composables/useTimePositionMapping.js";
import provideConfig from "../provider/provideConfig.js";
import { BAR_CONTAINER_KEY } from "../provider/symbols";
import type { GanttBarObject } from "../types";
import GGanttBar from "./GGanttBar.vue";

const props = defineProps<{
  label: string
  bars: GanttBarObject[]
  highlightOnHover?: boolean
}>()

const emit = defineEmits<{
  (e: "drop", value: { e: MouseEvent; datetime: string | Date }): void
}>()

const { rowHeight, colors, labelColumnTitle, multipleRows, barStart, barEnd } = provideConfig()
const { highlightOnHover } = toRefs(props)
const isHovering = ref(false)

const maxOverLaps = computed(() => {
  let maxOverlaps = 0

  // Count the number of overlaps for each bar
  for (const bar of props.bars) {
    const start = bar[barStart.value]
    const end = bar[barEnd.value]

    let overlaps = 0
    for (const otherBar of props.bars) {
      if (bar === otherBar) continue

      const otherStart = otherBar[barStart.value]
      const otherEnd = otherBar[barEnd.value]

      if (start > otherEnd || end < otherStart) continue

      if (start <= otherEnd && end >= otherStart) {
        overlaps++
      }

      maxOverlaps = Math.max(maxOverlaps, overlaps)
    }
  }

  return maxOverlaps + 1
})
console.log(maxOverLaps.value)

const rowStyle = computed(() => {
  return {
    height: multipleRows ? `${maxOverLaps.value * rowHeight.value}px` : `${rowHeight.value}px`,
    minHeight: multipleRows ? `${rowHeight.value}px` : undefined,
    background: highlightOnHover?.value && isHovering.value ? colors.value.hoverHighlight : null
  } as StyleValue
})

const { mapPositionToTime } = useTimePositionMapping()
const barContainer: Ref<HTMLElement | null> = ref(null)

provide(BAR_CONTAINER_KEY, barContainer)

const onDrop = (e: MouseEvent) => {
  const container = barContainer.value?.getBoundingClientRect()
  if (!container) {
    console.error("Vue-Ganttastic: failed to find bar container element for row.")
    return
  }
  const xPos = e.clientX - container.left
  const datetime = mapPositionToTime(xPos)
  emit("drop", { e, datetime })
}

const isBlank = (str: string) => {
  return (!str || /^\s*$/.test(str))
}
</script>

<style>
.g-gantt-row {
  width: 100%;
  transition: background 0.4s;
  position: relative;
}

.g-gantt-row > .g-gantt-row-bars-container {
  position: relative;
  border-top: 1px solid #eaeaea;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
}

.g-gantt-row-label {
  position: absolute;
  top: 0;
  left: 0px;
  padding: 0px 8px;
  display: flex;
  align-items: center;
  height: 60%;
  min-height: 20px;
  font-size: 0.8em;
  font-weight: bold;
  border-bottom-right-radius: 6px;
  background: #f2f2f2;
  z-index: 3;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.6);
}

.bar-transition-leave-active,
.bar-transition-enter-active {
  transition: all 0.2s;
}

.bar-transition-enter-from,
.bar-transition-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
