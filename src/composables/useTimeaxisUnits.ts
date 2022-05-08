import { GGanttChartPropsRefs } from "../models/models"
import useDayjsHelper from "./useDayjsHelper"
import { computed } from "vue"

export default function useTimeaxisUnits (
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { precision } = gGanttChartPropsRefs
  const { chartStartDayjs, chartEndDayjs } = useDayjsHelper(gGanttChartPropsRefs)

  const upperPrecision = computed(() => {
    switch (precision?.value) {
      case "hour":
        return "day"
      case "day":
        return "month"
      case "month":
        return "year"
      default:
        throw new Error("Precision prop incorrect. Must be one of the following: 'hour', 'day', 'month'")
    }
  })

  const displayFormats = {
    hour: "HH",
    date: "DD.MMM ",
    day: "DD.MMM ",
    month: "MMMM YYYY",
    year: "YYYY"
  }

  const timeaxisUnits = computed(() => {
    const upperUnits :{label: string, value?: string, width?: string}[] = []
    const lowerUnits :{label: string, value?: string, width?: string}[] = []
    const upperUnit = upperPrecision.value === "day" ? "date" : upperPrecision.value
    const lowerUnit = precision.value
    let currentUnit = chartStartDayjs.value.startOf(lowerUnit)
    const totalMinutes = chartEndDayjs.value.diff(chartStartDayjs.value, "minutes", true)
    let upperUnitMinutesCount = 0
    let currentUpperUnitVal = currentUnit[upperUnit]()
    while (currentUnit.isBefore(chartEndDayjs.value) || currentUnit.isSame(chartEndDayjs.value)) {
      if (currentUnit[upperUnit]() !== currentUpperUnitVal) { // when upper unit changes:
        let width = "0%"
        if (upperUnits.length === 0) {
          width = `${currentUnit.startOf(upperUnit).diff(chartStartDayjs.value, "minutes", true) / totalMinutes * 100}%`
        } else if (currentUnit.isSameOrAfter(chartEndDayjs.value)) {
          width = `${chartEndDayjs.value.diff(currentUnit.subtract(1, upperUnit).startOf(upperUnit), "minutes", true) / totalMinutes * 100}%`
        } else {
          const end = currentUnit.startOf(upperUnit)
          const start = currentUnit.subtract(1, upperUnit).startOf(upperUnit)
          width = `${end.diff(start, "minutes", true) / totalMinutes * 100}%`
        }
        upperUnits.push({
          label: currentUnit.subtract(1, upperUnit).format(displayFormats[upperUnit]),
          value: String(currentUpperUnitVal),
          width
        })
        upperUnitMinutesCount = 0
        currentUpperUnitVal = currentUnit[upperUnit]()
      }
      let width = "0%"
      // create and push lower unit:
      if (lowerUnits.length === 0) {
        width = `${currentUnit.endOf(lowerUnit).diff(chartStartDayjs.value, "minutes", true) / totalMinutes * 100}%`
      } else if (currentUnit.add(1, lowerUnit).isSameOrAfter(chartEndDayjs.value)) {
        width = `${chartEndDayjs.value.diff(currentUnit.startOf(lowerUnit), "minutes", true) / totalMinutes * 100}%`
      } else {
        width = `${currentUnit.endOf(lowerUnit).diff(currentUnit.startOf(lowerUnit), "minutes", true) / totalMinutes * 100}%`
      }
      lowerUnits.push({
        label: currentUnit.format(displayFormats[lowerUnit]),
        value: String(currentUnit[lowerUnit === "day" ? "date" : lowerUnit]()),
        width
      })
      const prevUpperUnitUnit = currentUnit
      currentUnit = currentUnit.add(1, lowerUnit)
      if (currentUnit.isBefore(chartEndDayjs.value) || currentUnit.isSame(chartEndDayjs.value)) {
        upperUnitMinutesCount += currentUnit.diff(prevUpperUnitUnit, "minutes", true)
      }
    }

    // for the very last upper unit :
    const lastUpperUnit = chartEndDayjs.value.isSame(chartEndDayjs.value.startOf(upperUnit)) ? chartEndDayjs.value[upperUnit]() - 1 : chartEndDayjs.value[upperUnit]()
    const isLastUnitAdded = upperUnits.some(un => un.value === String(lastUpperUnit))
    if (!isLastUnitAdded) {
      upperUnitMinutesCount += chartEndDayjs.value.diff(currentUnit.subtract(1, lowerUnit), "minutes", true)
      upperUnits.push({
        label: chartEndDayjs.value.format(displayFormats[upperUnit]),
        value: String(currentUpperUnitVal),
        width: `${(upperUnitMinutesCount / totalMinutes) * 100}%`
      })
    }

    return { upperUnits, lowerUnits }
  })

  return {
    timeaxisUnits
  }
}
