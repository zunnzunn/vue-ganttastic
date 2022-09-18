<template>
  <teleport to="body">
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="modelValue"
        class="g-gantt-tooltip"
        :style="{
          top: tooltipTop,
          left: tooltipLeft,
          fontFamily: font
        }"
      >
        <div
          class="gantt-bar-tooltip-color-dot"
          :style="{background: dotColor}"
        />
        <slot>
          {{ tooltipContent }}
        </slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { GanttBarObject } from "../models/models"
import INJECTION_KEYS from "../models/symbols"
import { computed, toRefs, ref, watch, nextTick, inject } from "vue"
import useDayjsHelper from "../composables/useDayjsHelper"

const props = defineProps<{
  bar?: GanttBarObject
  modelValue: boolean
}>()

const { bar } = toRefs(props)
const gGanttChartPropsRefs = inject(INJECTION_KEYS.gGanttChartPropsKey)
if (!gGanttChartPropsRefs) {
  throw Error("GGanttBarTooltip: Failed to inject values from GGanttChart!")
}

const tooltipTop = ref("0px")
const tooltipLeft = ref("0px")
watch(bar, () => {
  nextTick(() => {
    const barId = bar?.value?.ganttBarConfig.id || ""
    if (barId) {
      const barElement = document.getElementById(barId)
      let { top, left } = barElement?.getBoundingClientRect() || { top: 0, left: 0 }
      const { rowHeight } = gGanttChartPropsRefs
      left = Math.max(left, 10)
      tooltipTop.value = `${top + rowHeight.value - 10}px`
      tooltipLeft.value = `${left}px`
    }
  })
}, { deep: true, immediate: true })

const dotColor = computed(() => bar?.value?.ganttBarConfig.style?.background || "cadetblue")

const tooltipFormats = {
  hour: "HH:mm",
  day: "DD. MMM HH:mm",
  month: "DD. MMMM YYYY"
}
const { toDayjs } = useDayjsHelper(gGanttChartPropsRefs)
const { precision, font } = gGanttChartPropsRefs
const tooltipContent = computed(() => {
  const format = tooltipFormats[precision.value]
  if (bar && bar.value) {
    const barStartFormatted = toDayjs(bar.value, "start").format(format)
    const barEndFormatted = toDayjs(bar.value, "end").format(format)
    return `${barStartFormatted} - ${barEndFormatted}`
  }
  return ""
})

</script>

<style scoped>
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
}
.g-gantt-tooltip:before {
  content: '';
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
.g-gantt-tooltip > .gantt-bar-tooltip-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  margin-right: 4px;
}
.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-in .3s reverse;
}

@keyframes fade-in {
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
}</style>
