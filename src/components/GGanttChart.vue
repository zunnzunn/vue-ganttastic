<template>
  <div
    id="g-gantt-chart"
    :style="{width, background: colors.background}"
  >
    <g-gantt-timeaxis
      v-if="!hideTimeaxis"
      :chart-start="chartStart"
      :chart-end="chartEnd"
      :precision="precision"
      :colors="colors"
    >
      <template #upper-timeunit="{label, value}">
        <slot
          name="upper-timeunit"
          :label="label"
          :value="value"
        />
      </template>
      <template #timeunit="{label, value}">
        <slot
          name="timeunit"
          :label="label"
          :value="value"
        />
      </template>
    </g-gantt-timeaxis>

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
import { computed, provide, toRefs, defineProps, withDefaults, useSlots } from "vue"
import { GanttBarObject } from "@/models/models"

interface GGanttChartProps {
  chartStart: string
  chartEnd: string
  precision?: "hour" | "day" | "month"
  barStart: string
  barEnd: string
  width?: string
  hideTimeaxis?: boolean
  colorScheme?: string
  grid?: boolean
  pushOnOverlap?: boolean
  rowHeight?: number
}

const props = withDefaults(defineProps<GGanttChartProps>(), {
  precision: "day",
  width: "1200px",
  hideTimeaxis: false,
  colorScheme: "default",
  grid: false,
  pushOnOverlap: false,
  rowHeight: 40
})
const { chartStart, chartEnd, precision, width } = toRefs(props)
const slots = useSlots()
const colors = computed(() => {
  return colorSchemes[props.colorScheme] || colorSchemes.default
})
const allBarsInChartByRow = computed(() => {
  const defaultSlot = slots.default?.()
  const allBars: GanttBarObject[][] = []
  if (defaultSlot) {
    defaultSlot.forEach(child => {
      if (child.props?.bars) {
        const bars = child.props.bars as GanttBarObject[]
        allBars.push(bars)
      }
    })
  }
  return allBars
})
provide(INJECTION_KEYS.allBarsInChartKey, allBarsInChartByRow)
provide(INJECTION_KEYS.gGanttChartPropsKey, toRefs(props))

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

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
    font-family: Rubik;
    border-radius: 5px;
  }

  #g-gantt-rows-container{
    position: relative;
  }
</style>
