<template>
  <div class="g-timeaxis">
    <div class="g-timeunits-container">
      <div
        v-for="({ label, width }, index) in getUnits(true)"
        :key="label"
        class="g-high-timeunit"
        :style="{
          background: index%2===0 ? colors.primary : colors.secondary,
          color: colors.text,
          width
        }"
      >
        {{ label }}
      </div>
    </div>

    <div class="g-timeunits-container">
      <div
        v-for="{ label } in getUnits()"
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
    const dayjsStart = computed(() => dayjs(props.chartStart))
    const dayjsEnd = computed(() => dayjs(props.chartEnd))

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
      day: "dd, DD.MM ",
      month: "MMMM YYYY",
      year: "YYYY"
    }

    const getUnits = (upper: boolean) => {
      const units :{label: string, width?: string}[] = []
      const unit = upper ? upperPrecision.value : precision.value
      const format = displayFormats[unit]
      let start = dayjsStart.value
      const diff = dayjsEnd.value.diff(dayjsStart.value, unit, true)
      for (let i = 0; i <= diff; i++) {
        units.push({
          label: start.format(format)
        })
        // TODO: compute width for upper units
        start = start.add(1, unit)
      }
      return units
    }

    return {
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

  .g-high-timeunit, .g-timeunit{
    flex: 1;
    height: 100%;
  }

  .g-high-timeunit {
    display: flex;
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
