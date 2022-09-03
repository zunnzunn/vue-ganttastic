import { CHART_ROWS_KEY } from "./symbols"
import { inject } from "vue"

export default function provideGetChartRows() {
  const getChartRows = inject(CHART_ROWS_KEY)
  if (!getChartRows) {
    throw Error("Failed to inject getChartRows!")
  }
  return getChartRows
}
