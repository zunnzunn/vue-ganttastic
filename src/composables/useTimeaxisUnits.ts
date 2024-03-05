import { computed } from "vue"
import type { ManipulateType } from "dayjs"

import useDayjsHelper from "./useDayjsHelper.js"
import provideConfig from "../provider/provideConfig.js"

export default function useTimeaxisUnits() {
  const { precision } = provideConfig()
  const { chartStartDayjs, chartEndDayjs } = useDayjsHelper()

  const upperPrecision = computed(() => {
    switch (precision?.value) {
      case "hour":
        return "day"
      case "day":
        return "month"
      case "date":
      case "week":
        return "month"
      case "month":
        return "year"
      default:
        throw new Error(
          "Precision prop incorrect. Must be one of the following: 'hour', 'day', 'date', 'week', 'month'"
        )
    }
  })

  const lowerPrecision = computed(() => {
    return precision?.value === "date" ? "day" : precision?.value
  })

  const displayFormats = {
    hour: "HH",
    date: "DD",
    day: "DD.MMM",
    week: "ww",
    month: "MMM-YY",
    year: "YYYY"
  }

  const timeaxisUnits = computed(() => {
    const upperUnits: { label: string; value?: string; date: Date; width?: string }[] = []
    const lowerUnits: { label: string; value?: string; date: Date; width?: string }[] = []
    const upperUnit = upperPrecision.value === "day" ? "date" : upperPrecision.value
    const lowerUnit = lowerPrecision.value
    let currentUnit = chartStartDayjs.value.startOf(lowerUnit)
    const totalMinutes = chartEndDayjs.value.diff(chartStartDayjs.value, "minutes", true)
    let upperUnitMinutesCount = 0
    let currentUpperUnitVal = currentUnit[upperUnit]()

    while (currentUnit.isSameOrBefore(chartEndDayjs.value)) {
      if (currentUnit[upperUnit]() !== currentUpperUnitVal) {
        // when upper unit changes:
        let width = 0
        if (upperUnits.length === 0) {
          width =
            (currentUnit.startOf(upperUnit).diff(chartStartDayjs.value, "minutes", true) /
              totalMinutes) *
            100
        } else if (currentUnit.isSameOrAfter(chartEndDayjs.value)) {
          width =
            (chartEndDayjs.value.diff(
              currentUnit.subtract(1, upperUnit as ManipulateType).startOf(upperUnit),
              "minutes",
              true
            ) /
              totalMinutes) *
            100
        } else {
          const end = currentUnit.startOf(upperUnit)
          const start = currentUnit.subtract(1, upperUnit as ManipulateType).startOf(upperUnit)
          width = (end.diff(start, "minutes", true) / totalMinutes) * 100
        }
        const resultDayjs = currentUnit.subtract(1, upperUnit as ManipulateType)
        upperUnits.push({
          label: resultDayjs.format(displayFormats[upperUnit]),
          value: String(currentUpperUnitVal),
          date: resultDayjs.toDate(),
          width: String(width) + "%"
        })
        upperUnitMinutesCount = 0
        currentUpperUnitVal = currentUnit[upperUnit]()
      }
      let width = 0
      // create and push lower unit:
      const currentLowerUnit = currentUnit.subtract(precision?.value === "week" ? 1 : 0, "week")
      if (lowerUnits.length === 0) {
        width =
          (currentLowerUnit.endOf(lowerUnit).diff(chartStartDayjs.value, "minutes", true) /
            totalMinutes) *
          100
      } else if (currentLowerUnit.add(1, lowerUnit).isSameOrAfter(chartEndDayjs.value)) {
        width =
          (chartEndDayjs.value.diff(currentLowerUnit.startOf(lowerUnit), "minutes", true) /
            totalMinutes) *
          100
      } else {
        width =
          (currentLowerUnit
            .endOf(lowerUnit)
            .diff(currentLowerUnit.startOf(lowerUnit), "minutes", true) /
            totalMinutes) *
          100
      }

      const prevUpperUnitUnit = currentUnit
      currentUnit = currentUnit.add(1, lowerUnit)
      if (currentUnit.isBefore(chartEndDayjs.value) || currentUnit.isSame(chartEndDayjs.value)) {
        upperUnitMinutesCount += currentUnit.diff(prevUpperUnitUnit, "minutes", true)
        width =
          (currentLowerUnit
            .endOf(lowerUnit)
            .diff(currentLowerUnit.startOf(lowerUnit), "minutes", true) /
            totalMinutes) *
          100
      }
      lowerUnits.push({
        label: currentLowerUnit.format(displayFormats[precision?.value]),
        value: String(currentLowerUnit[lowerUnit === "day" ? "date" : lowerUnit]()),
        date: currentLowerUnit.toDate(),
        width: String(width) + "%"
      })
    }

    // for the very last upper unit :

    upperUnitMinutesCount += chartEndDayjs.value.diff(
      currentUnit.subtract(1, lowerUnit),
      "minutes",
      true
    )
    upperUnits.push({
      label: chartEndDayjs.value.format(displayFormats[upperUnit]),
      value: String(currentUpperUnitVal),
      date: chartEndDayjs.value.toDate(),
      width: `${(upperUnitMinutesCount / totalMinutes) * 100}%`
    })
    return { upperUnits, lowerUnits }
  })

  return {
    timeaxisUnits
  }
}
