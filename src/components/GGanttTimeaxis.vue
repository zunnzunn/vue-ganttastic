<template>
  <div class="g-timeaxis">
    <div class="g-timeunits-container">
      <div
        v-for="({ label, value, width }, index) in timeaxisUnits.upperUnits"
        :key="label"
        class="g-upper-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.primary : colors.secondary,
          color: colors.text,
          width
        }"
      >
        <slot
          name="upper-timeunit"
          :label="label"
          :value="value"
        >
          {{ label }}
        </slot>
      </div>
    </div>

    <div class="g-timeunits-container">
      <div
        v-for="({ label, value, width }, index) in timeaxisUnits.lowerUnits"
        :key="label"
        class="g-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.ternary : colors.quartenary,
          color: colors.text,
          flexDirection: precision === 'hour' ? 'column' : 'row',
          alignItems: precision === 'hour' ? '' : 'center',
          width
        }"
      >
        <slot
          name="timeunit"
          :label="label"
          :value="value"
        >
          {{ label }}
        </slot>
        <div
          v-if="precision === 'hour'"
          class="g-timeaxis-hour-pin"
          :style="{background: colors.text}"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorScheme } from "../color-schemes"
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import { inject } from "vue"
import INJECTION_KEYS from "../models/symbols"

defineProps<{
  chartStart: string
  chartEnd: string
  precision: "hour" | "day" | "month"
  colors: ColorScheme
}>()
const gGanttChartPropsRefs = inject(INJECTION_KEYS.gGanttChartPropsKey)
if (!gGanttChartPropsRefs) {
  throw new Error("GGanttBar: Provide/Inject of values from GGanttChart failed!")
}
const { precision } = gGanttChartPropsRefs
const { timeaxisUnits } = useTimeaxisUnits(gGanttChartPropsRefs)
</script>

<style scoped>
  .g-timeaxis {
    position: sticky;
    top:0;
    width: 100%;
    height: 8vh;
    min-height: 75px;
    background: white;
    z-index: 4;
    box-shadow: 0px 1px 3px 2px rgba(50,50,50, 0.5);
    display: flex;
    flex-direction: column;
  }

  .g-timeunits-container {
    display:flex;
    width: 100%;
    height: 50%;
  }

  .g-timeunit {
    height: 100%;
    font-size: 65%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .g-upper-timeunit {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .g-timeaxis-hour-pin {
    width: 1px;
    height: 10px;
  }
  #g-timeaxis-marker {
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 3px;
    background: black;
  }
</style>
