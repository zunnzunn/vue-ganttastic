<template>
  <div class="g-label-column" :style="{ fontFamily: font, color: colors.text }">
    <slot name="label-column-title">
      <div class="g-label-column-header" :style="{ background: colors.primary }">
        {{ labelColumnTitle }}
      </div>
    </slot>
    <div class="g-label-column-rows">
      <div
        v-for="({ label }, index) in getChartRows()"
        :key="`${label}_${index}`"
        class="g-label-column-row"
        :style="{
          background: index % 2 === 0 ? colors.ternary : colors.quartenary,
          height: `${rowHeight}px`
        }"
      >
        <slot name="label-column-row" :label="label">
          <span>{{ label }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import provideGetChartRows from "../provider/provideGetChartRows"
import provideConfig from "../provider/provideConfig.js"

const { font, colors, labelColumnTitle, rowHeight } = provideConfig()
const getChartRows = provideGetChartRows()
</script>

<style>
.g-label-column {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: rgb(64, 64, 64);
  font-variant-numeric: tabular-nums;
  font-size: 0.9em;
}

.g-label-column-header {
  width: 100%;
  height: 80px;
  min-height: 80px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
}

.g-label-column-rows {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 5px;
}

.g-label-column-row {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0.1rem 0.3rem;
  overflow: hidden;
  white-space: normal;
  box-sizing: border-box;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.g-label-column-row:last-child {
  border-bottom-left-radius: 5px;
}
</style>
