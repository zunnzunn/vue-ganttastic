<template>
  <div
    ref="ganttChart"
    class="g-gantt-chart"
    :style="{ width, background: colors.background, fontFamily: font }"
  >
    <g-gantt-timeaxis v-if="!hideTimeaxis">
      <template #upper-timeunit="{ label, value, date }">
        <!-- expose upper-timeunit slot of g-gantt-timeaxis-->
        <slot name="upper-timeunit" :label="label" :value="value" :date="date" />
      </template>
      <template #timeunit="{ label, value, date }">
        <!-- expose timeunit slot of g-gantt-timeaxis-->
        <slot name="timeunit" :label="label" :value="value" :date="date" />
      </template>
    </g-gantt-timeaxis>

    <g-gantt-grid v-if="grid" :highlighted-units="highlightedUnits" />

    <div class="g-gantt-rows-container">
      <slot />
      <!-- the g-gantt-row components go here -->
    </div>

    <g-gantt-bar-tooltip :model-value="showTooltip || isDragging" :bar="tooltipBar">
      <template #default>
        <slot name="bar-tooltip" :bar="tooltipBar" />
      </template>
    </g-gantt-bar-tooltip>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  provide,
  ref,
  toRefs,
  useSlots,
  type ComputedRef,
  type Ref,
  type ToRefs
} from "vue"
import GGanttTimeaxis from "./GGanttTimeaxis.vue"
import GGanttGrid from "./GGanttGrid.vue"
import GGanttBarTooltip from "./GGanttBarTooltip.vue"

import { colorSchemes, type ColorScheme } from "../color-schemes.js"
import type { ColorSchemeKey } from "../color-schemes.js"
import { CHART_ROWS_KEY, CONFIG_KEY, EMIT_BAR_EVENT_KEY } from "../provider/symbols.js"
import type { GanttBarObject } from "../types"
import { DEFAULT_DATE_FORMAT } from "../composables/useDayjsHelper"
import { useElementSize } from "@vueuse/core"

export interface GGanttChartProps {
  chartStart: string | Date
  chartEnd: string | Date
  precision?: "hour" | "day" | "month"
  barStart: string
  barEnd: string
  dateFormat?: string | false
  width?: string
  hideTimeaxis?: boolean
  colorScheme?: ColorSchemeKey | ColorScheme
  grid?: boolean
  pushOnOverlap?: boolean
  noOverlap?: boolean
  rowHeight?: number
  highlightedUnits?: number[]
  highlightSundays?: boolean
  font?: string
}

export type GGanttChartConfig = ToRefs<Required<GGanttChartProps>> & {
  colors: ComputedRef<ColorScheme>
  chartSize: {
    width: Ref<number>
    height: Ref<number>
  }
}

const props = withDefaults(defineProps<GGanttChartProps>(), {
  dateFormat: DEFAULT_DATE_FORMAT,
  precision: "day",
  width: "100%",
  hideTimeaxis: false,
  colorScheme: "default",
  grid: false,
  pushOnOverlap: false,
  noOverlap: false,
  rowHeight: 40,
  highlightedUnits: () => [],
  highlightSundays: false,
  font: "inherit"
})

const emit = defineEmits<{
  (e: "click-bar", value: { bar: GanttBarObject; e: MouseEvent; datetime?: string | Date }): void
  (
    e: "mousedown-bar",
    value: { bar: GanttBarObject; e: MouseEvent; datetime?: string | Date }
  ): void
  (e: "mouseup-bar", value: { bar: GanttBarObject; e: MouseEvent; datetime?: string | Date }): void
  (e: "dblclick-bar", value: { bar: GanttBarObject; e: MouseEvent; datetime?: string | Date }): void
  (e: "mouseenter-bar", value: { bar: GanttBarObject; e: MouseEvent }): void
  (e: "mouseleave-bar", value: { bar: GanttBarObject; e: MouseEvent }): void
  (e: "dragstart-bar", value: { bar: GanttBarObject; e: MouseEvent }): void
  (e: "drag-bar", value: { bar: GanttBarObject; e: MouseEvent }): void
  (
    e: "dragend-bar",
    value: {
      bar: GanttBarObject
      e: MouseEvent
      movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
    }
  ): void
  (
    e: "contextmenu-bar",
    value: { bar: GanttBarObject; e: MouseEvent; datetime?: string | Date }
  ): void
}>()

const { width, font, colorScheme } = toRefs(props)

const slots = useSlots()
const colors = computed(() =>
  typeof colorScheme.value !== "string"
    ? colorScheme.value
    : colorSchemes[colorScheme.value as ColorSchemeKey] || colorSchemes.default
)
const getChartRows = () => {
  const defaultSlot = slots.default?.()
  const allBars: GanttBarObject[][] = []

  if (!defaultSlot) {
    return allBars
  }
  defaultSlot.forEach((child) => {
    if (child.props?.bars) {
      const bars = child.props.bars as GanttBarObject[]
      allBars.push(bars)
      // if using v-for to generate rows, rows will be children of a single "fragment" v-node:
    } else if (Array.isArray(child.children)) {
      child.children.forEach((grandchild) => {
        const granchildNode = grandchild as {
          props?: { bars?: GanttBarObject[] }
        }
        if (granchildNode?.props?.bars) {
          const bars = granchildNode.props.bars as GanttBarObject[]
          allBars.push(bars)
        }
      })
    }
  })
  return allBars
}

const showTooltip = ref(false)
const isDragging = ref(false)
const tooltipBar = ref<GanttBarObject | undefined>(undefined)
let tooltipTimeoutId: ReturnType<typeof setTimeout>
const initTooltip = (bar: GanttBarObject) => {
  if (tooltipTimeoutId) {
    clearTimeout(tooltipTimeoutId)
  }
  tooltipTimeoutId = setTimeout(() => {
    showTooltip.value = true
  }, 800)
  tooltipBar.value = bar
}

const clearTooltip = () => {
  clearTimeout(tooltipTimeoutId)
  showTooltip.value = false
}

const emitBarEvent = (
  e: MouseEvent,
  bar: GanttBarObject,
  datetime?: string | Date,
  movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
) => {
  switch (e.type) {
    case "click":
      emit("click-bar", { bar, e, datetime })
      break
    case "mousedown":
      emit("mousedown-bar", { bar, e, datetime })
      break
    case "mouseup":
      emit("mouseup-bar", { bar, e, datetime })
      break
    case "dblclick":
      emit("dblclick-bar", { bar, e, datetime })
      break
    case "mouseenter":
      initTooltip(bar)
      emit("mouseenter-bar", { bar, e })
      break
    case "mouseleave":
      clearTooltip()
      emit("mouseleave-bar", { bar, e })
      break
    case "dragstart":
      isDragging.value = true
      emit("dragstart-bar", { bar, e })
      break
    case "drag":
      emit("drag-bar", { bar, e })
      break
    case "dragend":
      isDragging.value = false
      emit("dragend-bar", { bar, e, movedBars })
      break
    case "contextmenu":
      emit("contextmenu-bar", { bar, e, datetime })
      break
  }
}

const ganttChart = ref<HTMLElement | null>(null)
const chartSize = useElementSize(ganttChart)

provide(CHART_ROWS_KEY, getChartRows)
provide(CONFIG_KEY, {
  ...toRefs(props),
  colors,
  chartSize
})
provide(EMIT_BAR_EVENT_KEY, emitBarEvent)
</script>

<style>
.g-gantt-chart {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-touch-callout: none;
  user-select: none;
  border-radius: 5px;
  font-variant-numeric: tabular-nums;
}

.g-gantt-rows-container {
  position: relative;
}

.highlighted-day {
  color: darkred;
}
</style>
