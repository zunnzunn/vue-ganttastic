<template>
  <div class="g-timeaxis">
    <div class="g-timeunits-container">
      <div
        v-for="({ label, width }, index) in upperUnits"
        :key="label"
        class="g-high-timeunit"
        :style="{
          background: index % 2 === 0 ? colors.primary : colors.secondary,
          color: colors.text,
          width
        }"
      >
        {{ label }}
      </div>
    </div>

    <div class="g-timeunits-container">
      <div
        v-for="{ label } in lowerUnits"
        :key="label"
        class="g-timeunit"
        :style="{
          background: colors.ternary,
          color: colors.text
        }"
      >
        {{ label }}
        <div
          v-if="precision === 'hour'"
          class="g-timeaxis-hour-pin"
          :style="{background: colors.text}"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs"
import { ColorScheme } from "./color-schemes"
import { defineComponent, computed, PropType, toRefs } from "vue"

export default defineComponent({
  name: "GGanttTimeaxis",

  props: {
    chartStart: {
      type: String,
      required: true
    },
    chartEnd: {
      type: String,
      required: true
    },
    precision: {
      type: String as PropType<"hour" | "day" | "month">,
      required: true
    },
    rowLabelWidth: {
      type: String,
      required: true
    },
    colors: {
      type: Object as PropType<ColorScheme>,
      required: true
    }
  },

  setup (props) {
    const { precision } = toRefs(props)
    const upperPrecision = computed(() => {
      switch (precision.value) {
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

    const getUnits = () => {
      const upperUnits :{label: string, value?: string, width?: string}[] = []
      const lowerUnits :{label: string, width?: string}[] = []
      const upperUnit = upperPrecision.value === "day" ? "date" : upperPrecision.value
      const lowerUnit = precision.value
      let unitDayjs = dayjs(props.chartStart).startOf(lowerUnit)
      const diff = -unitDayjs.diff(props.chartEnd, lowerUnit, true)
      let lowerUnitCount = 0
      let currentUpperUnitVal = unitDayjs[upperUnit]()
      while (unitDayjs.isBefore(props.chartEnd) || unitDayjs.isSame(props.chartEnd)) {
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
          label: unitDayjs.format(displayFormats[lowerUnit])
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
    }

    const { upperUnits, lowerUnits } = getUnits()

    return {
      upperUnits,
      lowerUnits,
      getUnits,
      dayjs
    }
  }
})

</script>

<style scoped>
  .g-timeaxis {
    position: sticky;
    top:0;
    width: 100%;
    height: 8vh;
    min-height: 75px;
    background: white;
    z-index: 4;
    box-shadow: 0px 1px 3px 2px rgba(50,50,50, 0.5);
    display: flex;
    flex-direction: column;
  }

  .g-timeunits-container {
    display:flex;
    background: salmon;
    width: 100%;
    height: 50%;
  }

  .g-timeunit{
    flex: 1;
    height: 100%;
    font-size: 0.4em;
  }

  .g-high-timeunit {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .g-timeaxis-hour-pin {
    width: 1px;
    height: 8px;
  }
  #g-timeaxis-marker {
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 3px;
    background: black;
  }
</style>
