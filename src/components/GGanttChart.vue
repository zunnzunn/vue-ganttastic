<template>
  <div
    id="g-gantt-chart"
    :style="{width: width, background: colors.background}"
  >
    <g-gantt-timeaxis
      v-if="!hideTimeaxis"
      :chart-start="chartStart"
      :chart-end="chartEnd"
      :precision="precision"
      row-label-width="10%"
      :colors="colors"
    />
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs"
import colorSchemes from "./color-schemes"
import GGanttTimeaxis from "./GGanttTimeaxis.vue"
import { defineComponent, computed, PropType } from "vue"

export default defineComponent({
  name: "GGanttChart",

  components: {
    GGanttTimeaxis
  },

  props: {
    chartStart: {
      type: String,
      default: dayjs().format("YYYY-MM-DD HH:mm")
    },
    chartEnd: {
      type: String,
      default: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm")
    },
    precision: {
      type: String as PropType<"hour" | "day" | "month">,
      default: "hour"
    },
    width: {
      type: String,
      default: "800px"
    },
    hideTimeaxis: {
      type: Boolean
    },
    colorScheme: {
      type: String,
      default: "default"
    }
  },

  setup (props) {
    const colors = computed(() => {
      return colorSchemes[props.colorScheme] || colorSchemes.default
    })
    return {
      colors
    }
  }

})
</script>

<style scoped>
  #g-gantt-chart{
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-bottom: 23px;
    font-family: Helvetica;
  }
</style>
