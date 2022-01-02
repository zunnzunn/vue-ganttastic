<template>
  <g-gantt-chart
    chart-start="2020-12-11 12:00"
    chart-end="2021-07-15 12:00"
    precision="month"
    :row-height="40"
    grid
    width="1400px"
    bar-start="beginDate"
    bar-end="endDate"
    snap-back-on-overlap
    @mousedown-bar="onMousedownBar($event.bar, $event.e, $event.datetime)"
    @dblclick-bar="onMouseupBar($event.bar, $event.e, $event.datetime)"
    @mouseenter-bar="onMouseenterBar($event.bar, $event.e)"
    @mouseleave-bar="onMouseleaveBar($event.bar, $event.e)"
    @dragstart-bar="onDragstartBar($event.bar, $event.e)"
    @drag-bar="onDragBar($event.bar, $event.e)"
    @dragend-bar="onDragendBar($event.bar, $event.e, $event.movedBars)"
    @contextmenu-bar="onContextmenuBar($event.bar, $event.e, $event.datetime)"
  >
    <g-gantt-row
      label="My row 1"
      :bars="bars1"
      highlight-on-hover
    />
    <g-gantt-row
      label="My row 2"
      highlight-on-hover
      :bars="bars2"
    />
  </g-gantt-chart>
  <button @click="addBar()">
    Add bar
  </button>
  <button @click="deleteBar()">
    Delete bar
  </button>
</template>
<script setup lang="ts">
import { ref } from "vue"
import GGanttRow from "./components/GGanttRow.vue"
import GGanttChart from "./components/GGanttChart.vue"
import { GanttBarObject } from "./models/models"

const bars1 = ref([
  {
    beginDate: "2021-04-27 13:00",
    endDate: "2021-05-27 19:00",
    ganttBarConfig: {
      id: "8621987329",
      label: "I'm in a bundle",
      bundle: "bundle2"
    }
  }
])

const bars2 = ref([
  {
    beginDate: "2021-04-27 13:00",
    endDate: "2021-05-27 19:00",
    ganttBarConfig: {
      id: "1592311887",
      label: "I'm in a bundle",
      bundle: "bundle2",
      style: {
        background: "magenta"
      }
    }
  },
  {
    beginDate: "2021-01-01 00:00",
    endDate: "2021-03-01 00:00",
    ganttBarConfig: {
      id: "7716981641",
      label: "Lorem ipsum dolor",
      hasHandles: true,
      style: {
        background: "#b74b52"
      }
    }
  },
  {
    beginDate: "2021-06-15 00:00",
    endDate: "2021-07-10 00:00",
    ganttBarConfig: {
      id: "9716981641",
      label: "Oh hey",
      style: {
        background: "#69e064",
        borderRadius: "15px"
      }
    }
  }
])
const addBar = () => {
  if (bars1.value.some(bar => bar.ganttBarConfig.id === "test1")) {
    return
  }
  const bar = {
    beginDate: "2021-02-26 00:00",
    endDate: "2021-03-27 02:00",
    ganttBarConfig: {
      id: "test1",
      hasHandles: true,
      label: "Hello!",
      style: {
        background: "#5484b7",
        borderRadius: "20px"
      }
    }
  }
  bars1.value.push(bar)
}

const deleteBar = () => {
  const idx = bars1.value.findIndex(b => b.ganttBarConfig.id === "test1")
  bars1.value.splice(idx, 1)
}

const onMousedownBar = (bar: GanttBarObject, e:MouseEvent, datetime?: string) => {
  console.log("mousedown-bar", bar, e, datetime)
}

const onMouseupBar = (bar: GanttBarObject, e:MouseEvent, datetime?: string) => {
  console.log("mouseup-bar", bar, e, datetime)
}

const onMouseenterBar = (bar: GanttBarObject, e:MouseEvent) => {
  console.log("mouseenter-bar", bar, e)
}

const onMouseleaveBar = (bar: GanttBarObject, e:MouseEvent) => {
  console.log("mouseleave-bar", bar, e)
}

const onDragstartBar = (bar: GanttBarObject, e:MouseEvent) => {
  console.log("dragstart-bar", bar, e)
}

const onDragBar = (bar: GanttBarObject, e:MouseEvent) => {
  console.log("drag-bar", bar, e)
}

const onDragendBar = (bar: GanttBarObject, e:MouseEvent, movedBars?: Set<GanttBarObject>) => {
  console.log("dragend-bar", bar, e, movedBars)
}

const onContextmenuBar = (bar: GanttBarObject, e:MouseEvent, datetime?: string) => {
  console.log("contextmenu-bar", bar, e, datetime)
}
</script>
