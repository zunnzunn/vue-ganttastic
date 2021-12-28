import { App } from "vue"
import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)


import GGanttChart from "./components/GGanttChart.vue"
import GGanttRow from "./components/GGanttRow.vue"

const plugin = {
  install (app: App) {
    app.component("g-gantt-chart", GGanttChart)
    app.component("g-gantt-row", GGanttRow)
  }
}

export default plugin