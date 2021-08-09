import dayjs from "dayjs"
import { computed } from "vue"

export default function useTimeaxisUnits (
  chartStart: string,
  chartEnd: string,
  precision: "hour" | "day" | "month"
) {
  const upperPrecision = computed(() => {
    switch (precision) {
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
    date: "DD.MM ",
    day: "DD.MM ",
    month: "MMMM YYYY",
    year: "YYYY"
  }

  const timeaxisUnits = computed(() => {
    const upperUnits :{label: string, value?: string, width?: string}[] = []
    const lowerUnits :{label: string, value?: string}[] = []
    const upperUnit = upperPrecision.value === "day" ? "date" : upperPrecision.value
    const lowerUnit = precision
    let unitDayjs = dayjs(chartStart).startOf(lowerUnit)
    const diff = -unitDayjs.diff(chartEnd, lowerUnit, true)
    let lowerUnitCount = 0
    let currentUpperUnitVal = unitDayjs[upperUnit]()
    while (unitDayjs.isBefore(chartEnd) || unitDayjs.isSame(chartEnd)) {
      if (unitDayjs[upperUnit]() !== currentUpperUnitVal) {
        upperUnits.push({
          label: unitDayjs.subtract(1, upperUnit).format(displayFormats[upperUnit]),
          value: String(currentUpperUnitVal),
          width: `${(lowerUnitCount / diff) * 100}%`
        })
        lowerUnitCount = 0
        currentUpperUnitVal = unitDayjs[upperUnit]()
      }
      lowerUnits.push({
        label: unitDayjs.format(displayFormats[lowerUnit]),
        value: String(unitDayjs[lowerUnit]())
      })
      unitDayjs = unitDayjs.add(1, lowerUnit)
      ++lowerUnitCount
    }
    if (!upperUnits.some(un => un.value === String(currentUpperUnitVal))) {
      upperUnits.push({
        label: unitDayjs.subtract(1, upperUnit).format(displayFormats[upperUnit]),
        value: String(currentUpperUnitVal),
        width: `${(lowerUnitCount / diff) * 100}%`
      })
    }
    return { upperUnits, lowerUnits }
  })

  return {
    timeaxisUnits
  }
}
