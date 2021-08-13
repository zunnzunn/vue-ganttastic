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

<script lang="ts">
import { defineComponent, PropType } from "vue"
import GanttBarObject from "../models/GanttBarObject"
import GGanttBar from "./GGanttBar.vue"

export default defineComponent({
  name: "GGanttRow",
  components: {
    GGanttBar
  },

  props: {
    label: {
      type: String,
      default: "Row"
    },
    bars: {
      type: Array as PropType<Array<GanttBarObject>>,
      default: () => []
    },
    barStart: { // property name of the bar objects that represents the start datetime
      type: String,
      required: true
    },
    barEnd: { // property name of the bar objects that represents the end datetime
      type: String,
      required: true
    },
    highlightOnHover: Boolean
  },

  setup () {
    const onDragover = () => console.log("foo")
    const onDragleave = () => console.log("foo")
    const onDrop = () => console.log("foo")
    const onMouseover = () => console.log("foo")
    const onMouseleave = () => console.log("foo")
    return {
      onDragover,
      onDragleave,
      onDrop,
      onMouseover,
      onMouseleave
    }
  }
})
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
