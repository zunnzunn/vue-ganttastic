import { GGanttChartPropsRefs } from "../models/models"
import dayjs from "dayjs"
import { computed } from "vue"

export default function useTimeaxisUnits (
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { chartStart, chartEnd, precision } = gGanttChartPropsRefs
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
    let currentUnit = dayjs(chartStart.value).startOf(lowerUnit)
    const totalMinutes = dayjs(chartEnd.value).diff(chartStart.value, "minutes", true)
    let upperUnitMinutesCount = 0
    let currentUpperUnitVal = currentUnit[upperUnit]()
    while (currentUnit.isBefore(chartEnd.value) || currentUnit.isSame(chartEnd.value)) {
      if (currentUnit[upperUnit]() !== currentUpperUnitVal) { // when upper unit changes:
        let width = "0%"
        if (upperUnits.length === 0) {
          width = `${currentUnit.startOf(upperUnit).diff(chartStart.value, "minutes", true) / totalMinutes * 100}%`
        } else if (currentUnit.isSameOrAfter(chartEnd.value)) {
          width = `${dayjs(chartEnd.value).diff(currentUnit.startOf(upperUnit), "minutes", true) / totalMinutes * 100}%`
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
        width = `${currentUnit.endOf(lowerUnit).diff(chartStart.value, "minutes", true) / totalMinutes * 100}%`
      } else if (currentUnit.add(1, lowerUnit).isSameOrAfter(chartEnd.value)) {
        width = `${dayjs(chartEnd.value).diff(currentUnit.startOf(lowerUnit), "minutes", true) / totalMinutes * 100}%`
      } else {
        width = `${currentUnit.endOf(lowerUnit).diff(currentUnit.startOf(lowerUnit), "minutes", true) / totalMinutes * 100}%`
      }
      lowerUnits.push({
        label: currentUnit.format(displayFormats[lowerUnit]),
        value: String(currentUnit[lowerUnit]()),
        width
      })
      const prevUpperUnitUnit = currentUnit
      currentUnit = currentUnit.add(1, lowerUnit)
      if (currentUnit.isBefore(chartEnd.value) || currentUnit.isSame(chartEnd.value)) {
        upperUnitMinutesCount += currentUnit.diff(prevUpperUnitUnit, "minutes", true)
      }
    }

    // for the very last upper unit :
    if (!upperUnits.some(un => un.value === String(currentUpperUnitVal))) {
      upperUnitMinutesCount += dayjs(chartEnd.value).diff(currentUnit.subtract(1, lowerUnit), "minutes", true)
      upperUnits.push({
        label: currentUnit.format(displayFormats[upperUnit]),
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
