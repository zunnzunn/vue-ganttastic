<template>
  <div
    class="g-grid-current-time"
    :style="{
      left: `${xDist}px`
    }"
  >
    <div
      class="g-grid-current-time-marker"
      :style="{
        border: `1px dashed ${colors.markerCurrentTime}`
      }"
    />
    <span class="g-grid-current-time-text" :style="{ color: colors.markerCurrentTime }">
      <slot name="current-time-label">
        {{ currentTimeLabel }}
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import useTimePositionMapping from "../composables/useTimePositionMapping.js"
import dayjs from "dayjs"
import provideConfig from "../provider/provideConfig.js"

const { mapTimeToPosition } = useTimePositionMapping()
const currentMoment = ref(dayjs())
const { colors, dateFormat, currentTimeLabel } = provideConfig()
const xDist = computed(() => {
  const format = dateFormat.value || "YYYY-MM-DD HH:mm"
  return mapTimeToPosition(dayjs(currentMoment.value, format).format(format))
})
</script>

<style>
.g-grid-current-time {
  position: absolute;
  height: 100%;
  display: flex;
  z-index: 5;
  pointer-events: none;
}

.g-grid-current-time-marker {
  width: 0px;
  height: calc(100% - 2px);
  display: flex;
}

.g-grid-current-time-text {
  font-size: x-small;
}
</style>
