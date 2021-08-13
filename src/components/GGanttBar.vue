<template>
  <div>
    <div
      ref="g-gantt-bar"
      class="g-gantt-bar"
      :style="barStyle"
    />
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs"
import { defineComponent, PropType, computed, toRefs, inject } from "vue"
import useTimeaxisUnits from "../composables/useTimeaxisUnits"
import GanttBarObject from "../models/GanttBarObject"
import INJECTION_KEYS from "../models/symbols"

export default defineComponent({
  name: "GGanttBar",
  props: {
    bar: {
      type: Object as PropType<GanttBarObject>,
      required: true
    },
    barStart: { // property name of the bar objects that represents the start datetime
      type: String,
      required: true
    },
    barEnd: { // property name of the bar objects that represents the end datetime,
      type: String,
      required: true
    }
  },

  setup (props) {
    const { bar, barStart, barEnd } = toRefs(props)
    const chartStart = inject(INJECTION_KEYS.chartStartKey)
    const chartEnd = inject(INJECTION_KEYS.chartEndKey)
    const chartWidth = inject(INJECTION_KEYS.widthKey)
    const precision = inject(INJECTION_KEYS.precisionKey)
    if (!chartStart || !chartEnd || !precision || !chartWidth) {
      throw new Error("GGanttBar: Provide/Inject if vakzes frin GGanttChart failed!")
    }
    const { timeaxisUnits } = useTimeaxisUnits(chartStart.value, chartEnd.value, precision.value)

    const mapTimeToPosition = (time: string) => {
      const diffFromStart = dayjs(time).diff(chartStart.value, precision.value, true)
      return Math.ceil((diffFromStart / timeaxisUnits.value.lowerUnits.length) * chartWidth.value)
    }

    const mapPositionToTime = (xPos: number) => {
      const diffFromStart = (xPos / chartWidth.value * timeaxisUnits.value.lowerUnits.length)
      return dayjs(chartStart.value).add(diffFromStart, precision.value)
    }

    const barStyle = computed(() => {
      const xStart = mapTimeToPosition(bar.value[barStart.value])
      const xEnd = mapTimeToPosition(bar.value[barEnd.value])
      return {
        position: "absolute",
        top: "5px",
        left: `${xStart}px`,
        width: `${xEnd - xStart}px`,
        height: "30px",
        zIndex: 2,
        background: "cadetblue",
        borderRadius: "10px"
      }
    })
    return {
      barStyle
    }
  }
})
</script>

<style>

</style>
