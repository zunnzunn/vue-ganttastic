<template>
  <div
    ref="g-gantt-row"
    class="g-gantt-row"
    :style="{height: `40px`}"
  >
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
        :bar-start="barStart"
        :bar-end="barEnd"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue"
import GanttBarObject from "../models/GanttBarObject"
import GGanttBar from "./GGanttBar.vue"

const props = defineProps<{
  label: string
  bars: GanttBarObject[]
  barStart: string,
  barEnd: string,
  highlightOnHover: boolean
}>()

const onDragover = () => 0
const onDragleave = () => 0
const onDrop = () => 0
const onMouseover = () => 0
const onMouseleave = () => 0
</script>

<style scoped>
  .g-gantt-row {
    display: flex;
    width: 100%;
    height: 40px;
    transition: background-color 0.2s;
  }

  .g-gantt-row > .g-gantt-row-bars-container{
    position: relative;
    border-top: 1px solid #eaeaea;
    width: 100%;
    border-bottom: 1px solid #eaeaea;
  }
</style>
