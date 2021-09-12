<template>
  <g-gantt-chart
    chart-start="2021-07-25 02:00"
    chart-end="2021-08-01 23:59"
    precision="day"
    width="900px"
  >
    <g-gantt-row
      :bars="bars"
      bar-start="beginDate"
      bar-end="endDate"
    />
    <g-gantt-row
      :bars="bars"
      bar-start="beginDate"
      bar-end="endDate"
    />
    <g-gantt-row
      :bars="bars"
      bar-start="beginDate"
      bar-end="endDate"
    />
  </g-gantt-chart>
</template>

<script setup lang="ts">
import GGanttRow from "./components/GGanttRow.vue"
import GGanttChart from "./components/GGanttChart.vue"

const bars = [
  {
    id: "Test",
    beginDate: "2021-07-30 08:00",
    endDate: "2021-07-31 04:00",
    ganttBarConfig: {
      label: "Test",
      background: "yellow"
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

</script>
