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
    />
    <div id="g-gantt-rows-container">
      <slot />   <!-- the g-gantt-row components go here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import colorSchemes from "./color-schemes"
import GGanttTimeaxis from "./GGanttTimeaxis.vue"
import GGanttGrid from "./GGanttGrid.vue"
import INJECTION_KEYS from "../models/symbols"
import { computed, provide, toRefs, ref, defineProps, useSlots } from "vue"
import { GanttBarObject } from "@/models/GanttBarObject"

const props = defineProps<{
  chartStart: string
  chartEnd: string
  precision: "hour" | "day" | "month"
  barStart: string
  barEnd: string
  width: string
  hideTimeaxis: boolean
  colorScheme: string
  grid: boolean
  pushOnOverlap: boolean
}>()

const { chartStart, chartEnd, barStart, barEnd, precision, width, pushOnOverlap } = toRefs(props)
const slots = useSlots()

const colors = computed(() => {
  return colorSchemes[props.colorScheme] || colorSchemes.default
})
const allBarsInChart = computed(() => {
  const defaultSlot = slots.default?.()
  const allBars: GanttBarObject[] = []
  if (defaultSlot) {
    defaultSlot.forEach(child => {
      console.log("🚀 ~ file: GGanttChart.vue ~ line 53 ~ allBarsInChart ~ child", child)
      if (child.props?.bars) {
        const bars = child.props.bars as GanttBarObject[]
        allBars.push(...bars)
      }
    })
  }
  return allBars
})

provide(INJECTION_KEYS.chartStartKey, chartStart)
provide(INJECTION_KEYS.chartEndKey, chartEnd)
provide(INJECTION_KEYS.barStartKey, barStart)
provide(INJECTION_KEYS.barEndKey, barEnd)
provide(INJECTION_KEYS.widthKey, ref(Number(width.value.replace("px", ""))))
provide(INJECTION_KEYS.precisionKey, precision)
provide(INJECTION_KEYS.pushOnOverlapKey, pushOnOverlap)
provide(INJECTION_KEYS.allBarsInChartKey, allBarsInChart)
provide(INJECTION_KEYS.gGanttChartPropsKey, toRefs(props))

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
