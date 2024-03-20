<template>
  <g-gantt-chart
    :chart-start="chartStart"
    :chart-end="chartEnd"
    precision="week"
    :row-height="40"
    grid
    current-time
    width="100%"
    bar-start="beginDate"
    bar-end="endDate"
    :date-format="format"
    @click-bar="onClickBar($event.bar, $event.e, $event.datetime)"
    @mousedown-bar="onMousedownBar($event.bar, $event.e, $event.datetime)"
    @dblclick-bar="onMouseupBar($event.bar, $event.e, $event.datetime)"
    @mouseenter-bar="onMouseenterBar($event.bar, $event.e)"
    @mouseleave-bar="onMouseleaveBar($event.bar, $event.e)"
    @dragstart-bar="onDragstartBar($event.bar, $event.e)"
    @drag-bar="onDragBar($event.bar, $event.e)"
    @dragend-bar="onDragendBar($event.bar, $event.e, $event.movedBars)"
    @contextmenu-bar="onContextmenuBar($event.bar, $event.e, $event.datetime)"
  >
    <g-gantt-row label="My row to test" :bars="bars1" highlight-on-hover />
    <g-gantt-row label="My another new row to test" highlight-on-hover :bars="bars2" />
    <g-gantt-row label="just another row to test gantt" highlight-on-hover :bars="bars3" />
    <g-gantt-row
      label="errors teach us, and debugging makes us stronger!"
      highlight-on-hover
      :bars="bars4"
    />
  </g-gantt-chart>

  <button type="button" @click="addBar()">Add bar</button>
  <button type="button" @click="deleteBar()">Delete bar</button>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { GanttBarObject } from "./types"
import dayjs from "dayjs"

const format = ref("DD.MM.YYYY HH:mm")
const chartStart = ref(dayjs().startOf("day").format(format.value))
const chartEnd = ref(
  dayjs(chartStart.value, format.value).add(3, "days").hour(12).format(format.value)
)

const bars1 = ref<GanttBarObject[]>([
  {
    beginDate: dayjs().hour(13).startOf("hour").format(format.value),
    endDate: dayjs().hour(19).startOf("hour").format(format.value),
    ganttBarConfig: {
      id: "8621987329",
      label: "I'm in a bundle",
      bundle: "bundle2"
    }
  }
])

const bars2 = ref([
  {
    beginDate: dayjs().hour(13).startOf("hour").format(format.value),
    endDate: dayjs().hour(19).startOf("hour").format(format.value),
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
    beginDate: dayjs().add(2, "day").hour(0).startOf("hour").format(format.value),
    endDate: dayjs().add(2, "day").hour(19).startOf("hour").format(format.value),
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
    beginDate: dayjs().add(1, "day").hour(4).startOf("hour").format(format.value),
    endDate: dayjs().add(1, "day").hour(16).startOf("hour").format(format.value),
    ganttBarConfig: {
      id: "9716981641",
      label: "Oh hey",
      style: {
        background: "#69e064",
        borderRadius: "15px",
        color: "blue",
        fontSize: "10px"
      }
    }
  }
])

const bars3 = [
  {
    beginDate: "15.01.2024 08:30",
    endDate: "20.02.2024 16:45",
    ganttBarConfig: {
      id: "9876543210",
      label: "Updated Bundle",
      bundle: "bundle3",
      style: {
        background: "cyan"
      }
    }
  },
  {
    beginDate: "20.02.2024 12:00",
    endDate: "10.03.2024 18:30",
    ganttBarConfig: {
      id: "1234567890",
      label: "New Task",
      hasHandles: true,
      style: {
        background: "#f79466"
      }
    }
  },
  {
    beginDate: "25.04.2024 09:15",
    endDate: "30.04.2024 21:00",
    ganttBarConfig: {
      id: "2468135790",
      label: "Greetings",
      style: {
        background: "#aabbcc",
        borderRadius: "8px",
        color: "white",
        fontSize: "12px"
      }
    }
  }
]

const bars4 = [
  {
    beginDate: "10.01.2024 08:00",
    endDate: "15.03.2024 16:30",
    ganttBarConfig: {
      id: "9876543210",
      label: "Novo Pacote",
      bundle: "pacote3",
      style: {
        background: "pink"
      }
    }
  },
  {
    beginDate: "05.03.2024 10:00",
    endDate: "15.04.2024 22:15",
    ganttBarConfig: {
      id: "2468135790",
      label: "hello folks",
      style: {
        background: "#ffd700",
        borderRadius: "10px",
        color: "black",
        fontSize: "14px"
      }
    }
  }
]

const addBar = () => {
  if (bars1.value.some((bar) => bar.ganttBarConfig.id === "test1")) {
    return
  }
  const bar = {
    beginDate: dayjs().add(1, "day").hour(4).startOf("hour").format(format.value),
    endDate: dayjs().add(2, "day").hour(4).startOf("hour").format(format.value),
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
  const idx = bars1.value.findIndex((b) => b.ganttBarConfig.id === "test1")
  if (idx !== -1) {
    bars1.value.splice(idx, 1)
  }
}

const onClickBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("click-bar", bar, e, datetime)
}

const onMousedownBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("mousedown-bar", bar, e, datetime)
}

const onMouseupBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("mouseup-bar", bar, e, datetime)
}

const onMouseenterBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("mouseenter-bar", bar, e)
}

const onMouseleaveBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("mouseleave-bar", bar, e)
}

const onDragstartBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("dragstart-bar", bar, e)
}

const onDragBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("drag-bar", bar, e)
}

const onDragendBar = (
  bar: GanttBarObject,
  e: MouseEvent,
  movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
) => {
  console.log("dragend-bar", bar, e, movedBars)
}

const onContextmenuBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  console.log("contextmenu-bar", bar, e, datetime)
}
</script>
