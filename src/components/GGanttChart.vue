<template>
  <div
    id="g-gantt-chart"
    :style="{width: width, background: colors.background}"
  >
    <g-gantt-timeaxis
      v-if="!hideTimeaxis"
      :chart-start="chartStart"
      :chart-end="chartEnd"
      :precision="precision"
      :colors="colors"
    />

    <g-gantt-grid
      v-if="grid"
      :chart-start="chartStart"
      :chart-end="chartEnd"
      :precision="precision"
    />
    <div id="g-gantt-rows-container">
      <slot />   <!-- the g-gantt-row components go here -->
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs"
import colorSchemes from "./color-schemes"
import GGanttTimeaxis from "./GGanttTimeaxis.vue"
import GGanttGrid from "./GGanttGrid.vue"
import INJECTION_KEYS from "../models/symbols"
import { defineComponent, computed, PropType, provide, toRefs, ref } from "vue"

export default defineComponent({
  name: "GGanttChart",

  components: {
    GGanttTimeaxis,
    GGanttGrid
  },

  props: {
    chartStart: {
      type: String,
      default: dayjs().format("YYYY-MM-DD HH:mm")
    },
    chartEnd: {
      type: String,
      default: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm")
    },
    precision: {
      type: String as PropType<"hour" | "day" | "month">,
      default: "hour"
    },
    width: {
      type: String,
      default: "800px"
    },
    hideTimeaxis: {
      type: Boolean
    },
    colorScheme: {
      type: String,
      default: "default"
    },
    grid: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    const { chartStart, chartEnd, precision, width } = toRefs(props)
    const colors = computed(() => {
      return colorSchemes[props.colorScheme] || colorSchemes.default
    })
    provide(INJECTION_KEYS.chartStartKey, chartStart)
    provide(INJECTION_KEYS.chartEndKey, chartEnd)
    provide(INJECTION_KEYS.widthKey, ref(Number(width.value.replace("px", ""))))
    provide(INJECTION_KEYS.precisionKey, precision)
    return {
      colors
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
    font-family: Helvetica;
  }
   #g-gantt-rows-container{
    position: relative;
  }
</style>
