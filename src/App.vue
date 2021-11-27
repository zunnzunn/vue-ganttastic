<template>
  <g-gantt-chart
    chart-start="2021-07-13 02:00"
    chart-end="2021-07-27 23:59"
    precision="day"
    color-scheme="vue"
    :row-height="40"
    width="1200px"
    bar-start="beginDate"
    bar-end="endDate"
    push-on-overlap
  >
    <g-gantt-row
      label="My row 1"
      :bars="bars1"
    />
    <g-gantt-row
      label="My row 2"
      :bars="bars2"
    />
  </g-gantt-chart>
</template>

<script setup lang="ts">
import { ref } from "vue"
import GGanttRow from "./components/GGanttRow.vue"
import GGanttChart from "./components/GGanttChart.vue"

const bars1 = ref([
  {
    beginDate: "2021-07-26 00:00",
    endDate: "2021-07-27 02:00",
    ganttBarConfig: {
      id: "test1",
      hasHandles: true,
      label: "I'm in a bundle",
      bundle: "bundle1",
      style: {
        background: "#5484b7",
        borderRadius: "20px"
      }
    }
  },
  {
    beginDate: "2021-07-27 13:00",
    endDate: "2021-07-27 19:00",
    ganttBarConfig: {
      id: "test2",
      label: "Lorem ipsum dolor",
      bundle: "bundle2"
    }
  }
])

const bars2 = ref([
  {
    beginDate: "2021-07-26 00:00",
    endDate: "2021-07-27 02:00",
    ganttBarConfig: {
      id: "test3",
      hasHandles: true,
      label: "I am in a bundle",
      bundle: "bundle1",
      style: {
        background: "#e09b69",
        borderRadius: "20px"
      }
    }
  },
  {
    beginDate: "2021-07-27 13:00",
    endDate: "2021-07-27 19:00",
    ganttBarConfig: {
      id: "test4",
      label: "Lorem ipsum dolor",
      bundle: "bundle2",
      style: {
        background: "cyan",
        borderRadius: "20px"
      }
    }
  },
  {
    beginDate: "2021-07-27 20:00",
    endDate: "2021-07-27 23:00",
    ganttBarConfig: {
      id: "immobile",
      label: "Immobile",
      immobile: true,
      style: {
        background: "gray",
        borderRadius: "10px"
      }
    }
  }
])

</script>
