<template>
  <teleport to="body">
    <transition name="g-fade" mode="out-in">
      <div
        v-if="modelValue"
        class="g-gantt-tooltip"
        :style="{
          top: tooltipTop,
          left: tooltipLeft,
          fontFamily: font
        }"
      >
        <div class="g-gantt-tooltip-color-dot" :style="{ background: dotColor }" />
        <slot :bar="bar" :bar-start="barStartRaw" :bar-end="barEndRaw">
          {{ tooltipContent }}
        </slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, watch, nextTick } from "vue"

import type { GanttBarObject } from "../types"
import useDayjsHelper from "../composables/useDayjsHelper.js"
import provideConfig from "../provider/provideConfig.js"

const TOOLTIP_FORMATS = {
  hour: "HH:mm",
  day: "DD. MMM HH:mm",
  month: "DD. MMMM YYYY"
} as const

const DEFAULT_DOT_COLOR = "cadetblue"

const props = defineProps<{
  bar: GanttBarObject | undefined
  modelValue: boolean
}>()

const { bar } = toRefs(props)
const { precision, font, barStart, barEnd, rowHeight } = provideConfig()

const tooltipTop = ref("0px")
const tooltipLeft = ref("0px")
watch(
  () => props.bar,
  async () => {
    await nextTick()

    const barId = bar?.value?.ganttBarConfig.id || ""
    if (!barId) {
      return
    }

    const barElement = document.getElementById(barId)
    const { top, left } = barElement?.getBoundingClientRect() || {
      top: 0,
      left: 0
    }
    const leftValue = Math.max(left, 10)
    tooltipTop.value = `${top + rowHeight.value - 10}px`
    tooltipLeft.value = `${leftValue}px`
  },
  { deep: true, immediate: true }
)

const dotColor = computed(() => bar?.value?.ganttBarConfig.style?.background || DEFAULT_DOT_COLOR)

const { toDayjs } = useDayjsHelper()

const barStartRaw = computed(() => bar.value?.[barStart.value])
const barEndRaw = computed(() => bar.value?.[barEnd.value])

const tooltipContent = computed(() => {
  if (!bar?.value) {
    return ""
  }
  const format = TOOLTIP_FORMATS[precision.value]
  const barStartFormatted = toDayjs(barStartRaw.value).format(format)
  const barEndFormatted = toDayjs(barEndRaw.value).format(format)
  return `${barStartFormatted} \u2013 ${barEndFormatted}`
})
</script>

<style>
.g-gantt-tooltip {
  position: fixed;
  background: black;
  color: white;
  z-index: 4;
  font-size: 0.85em;
  padding: 5px;
  border-radius: 3px;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  font-variant-numeric: tabular-nums;
}

.g-gantt-tooltip:before {
  content: "";
  position: absolute;
  top: 0;
  left: 10%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-bottom-color: black;
  border-top: 0;
  margin-left: -5px;
  margin-top: -5px;
}

.g-gantt-tooltip-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  margin-right: 4px;
}

.g-fade-enter-active,
.g-fade-leave-active {
  transition: opacity 0.3s ease;
}

.g-fade-enter-from,
.g-fade-leave-to {
  opacity: 0;
}
</style>
