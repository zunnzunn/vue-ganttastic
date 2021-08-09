<template>
  <div class="g-grid-container">
    <div
      v-for="(unit, index) in timeaxisUnits.lowerUnits"
      :key="index"
      :class="{
        'g-grid-line': true,
        'g-grid-line-highlighted': highlightedUnits.includes(unit.value)
      }"
    />
  </div>
</template>

<script lang="ts">
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import { defineComponent, toRefs, PropType } from "vue"

export default defineComponent({
  name: "GGanttGrid",
  props: {
    chartStart: {
      type: String,
      required: true
    },
    chartEnd: {
      type: String,
      required: true
    },
    precision: {
      type: String as PropType<"hour" | "day" | "month">,
      required: true
    },
    highlightedUnits: {
      type: Array as PropType<number[]>,
      default: () => []
    }
  },

  setup (props) {
    const { chartStart, chartEnd, precision } = toRefs(props)
    const { timeaxisUnits } = useTimeaxisUnits(chartStart.value, chartEnd.value, precision.value)
    return {
      timeaxisUnits
    }
  }
})
</script>

<style scoped>
  .g-grid-container {
    position: absolute;
    top: 0;
    left: 0%; /* must correspond to width of row title */
    width: 100%;
    height: calc(100% - 23px);
    display: flex;
    justify-content: space-between;
  }
  .g-grid-line {
    width: 1px;
    height: 100%;
    background: #eaeaea;
  }
  .g-grid-line-highlighted {
    background: #90CAF9;
    box-shadow: 0px 0px 0px 1px #90CAF9;
  }
</style>
