<template>
  <div class="g-timeaxis">
    <div class="g-timeunits-container">
      <div
        v-for="({ label, width }, index) in timeaxisUnits.upperUnits"
        :key="label"
        class="g-high-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.primary : colors.secondary,
          color: colors.text,
          width
        }"
      >
        {{ label }}
      </div>
    </div>

    <div class="g-timeunits-container">
      <div
        v-for="{ label } in timeaxisUnits.lowerUnits"
        :key="label"
        class="g-timeunit"
        :style="{
          background: colors.ternary,
          color: colors.text
        }"
      >
        {{ label }}
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
import { ColorScheme } from "./color-schemes"
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import { defineProps } from "vue"

defineProps<{
  chartStart: string
  chartEnd: string
  precision: "hour" | "day" | "month"
  colors: ColorScheme
}>()

const { timeaxisUnits } = useTimeaxisUnits()
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
    background: salmon;
    width: 100%;
    height: 50%;
  }

  .g-timeunit{
    flex: 1;
    height: 100%;
    font-size: 0.4em;
  }

  .g-high-timeunit {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .g-timeaxis-hour-pin {
    width: 1px;
    height: 8px;
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
