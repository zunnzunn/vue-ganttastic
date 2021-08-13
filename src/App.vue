<template>
  <g-gantt-chart
    chart-start="2021-07-30 02:00"
    chart-end="2021-08-01 23:59"
    precision="hour"
    width="900px"
  >
    <g-gantt-row
      :bars="bars"
      bar-start="beginDate"
      bar-end="endDate"
    />
  </g-gantt-chart>
</template>

<script lang="ts">
import GGanttRow from "./components/GGanttRow.vue"
import GGanttChart from "./components/GGanttChart.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "App",
  components: {
    GGanttChart,
    GGanttRow
  },

  setup () {
    const bars = [
      {
        id: "Test",
        beginDate: "2021-07-30 08:00",
        endDate: "2021-07-31 04:00",
        ganttBarConfig: {
          label: "Test"
        }
      },
      {
        id: "Test",
        beginDate: "2021-07-31 07:00",
        endDate: "2021-07-31 19:00",
        ganttBarConfig: {
          label: "Test"
        }
      }
    ]
    return {
      bars
    }
  }
})
</script>
