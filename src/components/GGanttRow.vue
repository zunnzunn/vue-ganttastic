<template>
  <div
    ref="g-gantt-row"
    class="g-gantt-row"
    :style="{height: `40px`}"
  >
    <div
      ref="barContainer"
      class="g-gantt-row-bars-container"
      @dragover="onDragover($event)"
      @dragleave="onDragleave($event)"
      @drop="onDrop($event)"
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

const onDragover = () => console.log("foo")
const onDragleave = () => console.log("foo")
const onDrop = () => console.log("foo")
const onMouseover = () => console.log("foo")
const onMouseleave = () => console.log("foo")
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
