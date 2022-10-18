<template>
  <div class="g-grid-container">
    <div
      v-for="{ key, label, value, width } in timeaxisUnits.lowerUnits"
      :key="key"
      class="g-grid-line"
      :style="{
        width,
        background: highlightedUnits?.includes(Number(value)) ? colors.hoverHighlight : undefined
      }"
    />
  </div>
</template>

<script setup lang="ts">
import provideConfig from "../provider/provideConfig"
import useTimeaxisUnits from "../composables/useTimeaxisUnits"

defineProps<{
  highlightedUnits?: number[]
}>()

const { colors } = provideConfig()
const { timeaxisUnits } = useTimeaxisUnits()
</script>

<style>
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
