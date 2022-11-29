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
    <div class="g-gantt-row-label" :style="{ background: colors.primary, color: colors.text }">
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
import { ref, type Ref, toRefs, computed, type StyleValue, provide } from "vue"

import useTimePositionMapping from "../composables/useTimePositionMapping.js"
import provideConfig from "../provider/provideConfig.js"
import type { GanttBarObject } from "../types"
import GGanttBar from "./GGanttBar.vue"
import { BAR_CONTAINER_KEY } from "../provider/symbols"

const props = defineProps<{
  label: string
  bars: GanttBarObject[]
  highlightOnHover?: boolean
}>()

const emit = defineEmits<{
  (e: "drop", value: { e: MouseEvent; datetime: string | Date }): void
}>()

const { rowHeight, colors } = provideConfig()
const { highlightOnHover } = toRefs(props)
const isHovering = ref(false)

const rowStyle = computed(() => {
  return {
    height: `${rowHeight.value}px`,
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
