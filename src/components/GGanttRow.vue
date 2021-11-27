<template>
  <div
    ref="g-gantt-row"
    class="g-gantt-row"
    :style="{height: `${rowHeight}px`, background: colors.background}"
  >
    <div
      class="g-gantt-row-label"
      :style="{background: colors.primary, color: colors.text}"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div
      ref="barContainer"
      class="g-gantt-row-bars-container"
      @dragover="onDragover()"
      @dragleave="onDragleave()"
      @drop="onDrop()"
      @mouseover="onMouseover()"
      @mouseleave="onMouseleave()"
    >
      <g-gantt-bar
        v-for="(bar, index) in bars"
        :key="`ganttastic_bar_${index}`"
        ref="ganttBar"
        :bar="bar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useColorScheme from "@/composables/useColorScheme"
import INJECTION_KEYS from "@/models/symbols"
import { defineProps, inject } from "vue"
import { GanttBarObject } from "../models/GanttBarObject"
import GGanttBar from "./GGanttBar.vue"

defineProps<{
  label: string
  bars: GanttBarObject[]
  highlightOnHover: boolean
}>()

const gGanttChartPropsRefs = inject(INJECTION_KEYS.gGanttChartPropsKey)
if (!gGanttChartPropsRefs) {
  throw Error("GGanttRow: Failed to inject GGanttChart props!")
}
const { colors } = useColorScheme(gGanttChartPropsRefs)
const { rowHeight } = gGanttChartPropsRefs
const onDragover = () => 0
const onDragleave = () => 0
const onDrop = () => 0
const onMouseover = () => 0
const onMouseleave = () => 0
</script>

<style scoped>
  .g-gantt-row {
    width: 100%;
    transition: background-color 0.2s;
    position: relative;
  }

  .g-gantt-row > .g-gantt-row-bars-container{
    position: relative;
    border-top: 1px solid #eaeaea;
    width: 100%;
    border-bottom: 1px solid #eaeaea;
  }

  .g-gantt-row-label {
    position: absolute;
    top:0;
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
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.6);
  }
</style>
