<template>
  <g-gantt-chart />
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
