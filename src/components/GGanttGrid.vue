<template>
  <div class="g-grid-container">
    <div
      v-for="(unit, index) in timeaxisUnits.lowerUnits"
      :key="index"
      :class="{
        'g-grid-line': true,
        'g-grid-line-highlighted': highlightedUnits.includes(Number(unit.value))
      }"
    />
  </div>
</template>

<script setup lang="ts">
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import { defineProps, toRefs } from "vue"

const props = defineProps<{
    chartStart: string
    chartEnd: string
    precision: "hour" | "day" | "month"
    highlightedUnits: number[]
  }>()
const { chartStart, chartEnd, precision } = toRefs(props)
const { timeaxisUnits } = useTimeaxisUnits(chartStart.value, chartEnd.value, precision.value)
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
