<template>
  <g-gantt-chart
    chart-start="2021-07-25 02:00"
    chart-end="2021-07-27 23:59"
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

<script setup lang="ts">
import { ref } from "vue"
import GGanttRow from "./components/GGanttRow.vue"
import GGanttChart from "./components/GGanttChart.vue"

const bars = ref([
  {
    id: "Test",
    beginDate: "2021-07-26 00:00",
    endDate: "2021-07-27 12:00",
    ganttBarConfig: {
      style: {
        background: "yellow"
      }
    }
  }
])

</script>
