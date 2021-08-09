<template>
  <g-gantt-chart
    chart-start="2021-07-30 02:00"
    chart-end="2021-08-01 23:59"
    precision="hour"
  />
</template>

<script lang="ts">
import GGanttChart from "./components/GGanttChart.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "App",
  components: {
    GGanttChart
  }
})
</script>
