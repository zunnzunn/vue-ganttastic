<template>
  <div class="g-timeaxis">
    <div class="g-timeunits-container">
      <div
        v-for="({ label, value, width, date }, index) in timeaxisUnits.upperUnits"
        :key="index"
        class="g-upper-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.primary : colors.secondary,
          color: isCurrent(precision === 'month' ? 'year' : 'month', value, date) ? '#1165E4' : colors.text,
          width,
        }"
      >
        <slot name="upper-timeunit" :label="label" :value="value" :date="date">
          {{ label }}
        </slot>
      </div>
    </div>

    <div class="g-timeunits-container">
      <div
        v-for="({ label, value, width, date }, index) in timeaxisUnits.lowerUnits"
        :key="index"
        class="g-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.ternary : colors.quartenary,
          color: isCurrent(precision, value, date) ? '#1165E4' : colors.text,
          flexDirection: precision === 'hour' ? 'column' : 'row',
          alignItems: precision === 'hour' ? '' : 'center',
          width
        }"
      >
        <slot name="timeunit" :label="label" :value="value" :date="date">
          {{ label }}
        </slot>
        <div
          v-if="precision === 'hour'"
          class="g-timeaxis-hour-pin"
          :style="{ background: colors.text }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import provideConfig from "../provider/provideConfig.js"
import useTimeaxisUnits from "../composables/useTimeaxisUnits.js"
import dayjs from "dayjs"
const { precision, colors } = provideConfig()
const { timeaxisUnits } = useTimeaxisUnits()

const isCurrent = (precision, value, date) => {
  const currenDate = new Date()

  if (precision === 'year') return currenDate.getFullYear() === date.getFullYear()

  if (precision === 'month') return currenDate.getFullYear() === date.getFullYear() && currenDate.getMonth() === date.getMonth()

  if (precision === 'week') return currenDate.getFullYear() === date.getFullYear() && dayjs(currenDate).week() === dayjs(date).week()

  if (precision === 'day') return currenDate.getFullYear() === date.getFullYear() && currenDate.getMonth() === date.getMonth() && currenDate.getDate() === date.getDate()

  return false
}
</script>

<style>
.g-timeaxis {
  position: sticky;
  top: 0;
  width: 100%;
  height: 8vh;
  min-height: 75px;
  background: white;
  z-index: 4;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.g-timeunits-container {
  display: flex;
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
</style>
