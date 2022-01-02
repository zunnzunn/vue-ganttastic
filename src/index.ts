import { Plugin } from "vue"
import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isBetween from "dayjs/plugin/isBetween"

import GGanttChart from "./components/GGanttChart.vue"
import GGanttRow from "./components/GGanttRow.vue"

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)

const ganttastic: Plugin = {
  install (app, options?) {
    app.component("GGanttChart", GGanttChart)
    app.component("GGanttRow", GGanttRow)
  }
}

export default ganttastic
