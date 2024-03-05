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
    <span class="g-grid-current-time-text" :style="{ color: colors.markerCurrentTime }">TODAY</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import useTimePositionMapping from "../composables/useTimePositionMapping.js"
import dayjs from "dayjs"
import provideConfig from "../provider/provideConfig.js"

const { mapTimeToPosition } = useTimePositionMapping()
const DEFAULT_DATE_FORMAT = "DD.MM.YYYY HH:mm"
const currentMoment = ref(dayjs())
const { colors } = provideConfig()

const xDist = computed(() => {
  return mapTimeToPosition(
    dayjs(currentMoment.value, DEFAULT_DATE_FORMAT).format(DEFAULT_DATE_FORMAT)
  )
})
</script>

<style>
.g-grid-current-time {
  position: absolute;
  height: 100%;
  display: flex;
  z-index: 5;
  flex-direction: row;
  align-items: flex-start;
}

.g-grid-current-time-marker {
  width: 0px;
  height: 99%;
  display: flex;
}

.g-grid-current-time-text {
  font-size: x-small;
}
</style>
