<template>
  <div
    ref="g-gantt-row"
    class="g-gantt-row"
    :style="{height: `40px`}"
  >
    <div class="g-gantt-row-label">
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
import { defineProps } from "vue"
import { GanttBarObject } from "../models/GanttBarObject"
import GGanttBar from "./GGanttBar.vue"

const props = defineProps<{
  label: string
  bars: GanttBarObject[]
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
    width: 100%;
    height: 40px;
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
