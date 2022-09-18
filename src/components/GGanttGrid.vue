<template>
  <div class="g-grid-container">
    <div
      v-for="{label, value, width} in timeaxisUnits.lowerUnits"
      :key="label"
      class="g-grid-line"
      :style="{
        width,
        background: highlightedUnits.includes(Number(value)) ? colors.hoverHighlight : null
      }"
    />
  </div>
</template>

<script setup lang="ts">
import useColorScheme from "../composables/useColorScheme"
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import { inject, toRefs } from "vue"
import INJECTION_KEYS from "../models/symbols"

const props = defineProps<{
  highlightedUnits?: number[]
}>()

const { highlightedUnits } = toRefs(props)
const gGanttChartPropsRefs = inject(INJECTION_KEYS.gGanttChartPropsKey)
if (!gGanttChartPropsRefs) {
  throw new Error("GGanttBar: Provide/Inject of values from GGanttChart failed!")
}
const { colors } = useColorScheme(gGanttChartPropsRefs)
const { timeaxisUnits } = useTimeaxisUnits(gGanttChartPropsRefs)
</script>

<style scoped>
  .g-grid-container {
    position: absolute;
    top: 0;
    left: 0%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  .g-grid-line {
    width: 1px;
    height: 100%;
    border-left: 1px solid #eaeaea;
  }
</style>
