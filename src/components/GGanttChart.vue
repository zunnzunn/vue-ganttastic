<template>
  <div
    id="g-gantt-chart"
    :style="{width: width, background: activeTheme.background}"
  >
  <!--
    <g-gantt-timeaxis
      v-if="!hideTimeaxis"
      :chart-start="chartStart"
      :chart-end="chartEnd"
      :row-label-width="rowLabelWidth"
      :timemarker-offset="timemarkerOffset"
      :theme-colors="themeColors"
      :locale="locale"
    />

    <g-gantt-grid
      v-if="grid"
      :chart-start="chartStart"
      :chart-end="chartEnd"
      :row-label-width="rowLabelWidth"
      :highlighted-hours="highlightedHours"
    />

    <div id="g-gantt-rows-container">
      <slot/>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import themeColors from "../theme-colors"
import { defineComponent, computed } from "vue"

export default defineComponent({
  name: "GGanttChart",
  props: {
    width: {
      type: String,
      default: "800px"
    },
    theme: {
      type: String,
      default: "default"
    }
  },

  setup (props) {
    const activeTheme = computed(() => {
      return themeColors[props.theme] || themeColors.default
    })
    return {
      activeTheme
    }
  }

})
</script>

<style scoped>
  #g-gantt-chart{
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-bottom: 23px;
  }
</style>
