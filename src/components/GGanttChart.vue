<template>
  <div>
    <div :class="[{ 'labels-in-column': !!labelColumnTitle }]">
      <g-gantt-label-column
        v-if="labelColumnTitle"
        :style="{
          width: labelColumnWidth
        }"
      >
        <template #label-column-title>
          <slot name="label-column-title" />
        </template>
        <template #label-column-row="{ label }">
          <slot name="label-column-row" :label="label" />
        </template>
      </g-gantt-label-column>
      <div
        ref="ganttChart"
        :class="['g-gantt-chart', { 'with-column': labelColumnTitle }]"
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
        <g-gantt-current-time v-if="currentTime">
          <template #current-time-label>
            <slot name="current-time-label" />
          </template>
        </g-gantt-current-time>
        <div class="g-gantt-rows-container">
          <slot />
          <!-- the g-gantt-row components go here -->
        </div>
      </div>
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

import GGanttGrid from "./GGanttGrid.vue"
import GGanttLabelColumn from "./GGanttLabelColumn.vue"
import GGanttTimeaxis from "./GGanttTimeaxis.vue"
import GGanttBarTooltip from "./GGanttBarTooltip.vue"
import GGanttCurrentTime from "./GGanttCurrentTime.vue"

import type { GanttBarObject } from "../types"
import type { ColorSchemeKey } from "../color-schemes.js"

import { useElementSize } from "@vueuse/core"
import { DEFAULT_DATE_FORMAT } from "../composables/useDayjsHelper"
import { colorSchemes, type ColorScheme } from "../color-schemes.js"
import {
  CHART_ROWS_KEY,
  CONFIG_KEY,
  EMIT_BAR_EVENT_KEY,
  type ChartRow
} from "../provider/symbols.js"

export interface GGanttChartProps {
  chartStart: string | Date
  chartEnd: string | Date
  precision?: "hour" | "day" | "date" | "week" | "month"
  barStart: string
  barEnd: string
  currentTime?: boolean
  currentTimeLabel?: string
  dateFormat?: string | false
  width?: string
  hideTimeaxis?: boolean
  colorScheme?: ColorSchemeKey | ColorScheme
  grid?: boolean
  pushOnOverlap?: boolean
  noOverlap?: boolean
  rowHeight?: number
  highlightedUnits?: number[]
  font?: string
  labelColumnTitle?: string
  labelColumnWidth?: string
}

export type GGanttChartConfig = ToRefs<Required<GGanttChartProps>> & {
  colors: ComputedRef<ColorScheme>
  chartSize: {
    width: Ref<number>
    height: Ref<number>
  }
}

const props = withDefaults(defineProps<GGanttChartProps>(), {
  currentTimeLabel: "",
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
  font: "inherit",
  labelColumnTitle: "",
  labelColumnWidth: "150px"
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
  const allBars: ChartRow[] = []

  if (!defaultSlot) {
    return allBars
  }
  defaultSlot.forEach((child) => {
    if (child.props?.bars) {
      const { label, bars } = child.props
      allBars.push({ label, bars })
      // if using v-for to generate rows, rows will be children of a single "fragment" v-node:
    } else if (Array.isArray(child.children)) {
      child.children.forEach((grandchild) => {
        const granchildNode = grandchild as {
          props?: ChartRow
        }
        if (granchildNode?.props?.bars) {
          const { label, bars } = granchildNode.props
          allBars.push({ label, bars })
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
  font-variant-numeric: tabular-nums;
  border-radius: 5px;
}

.with-column {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.g-gantt-rows-container {
  position: relative;
}

.labels-in-column {
  display: flex;
  flex-direction: row;
}
</style>
