<template>
  <div
    ref="g-grid-container"
    class="g-grid-container"
    :style="{ left: `${rowLabelWidth}px`, width: `${timeCount * gridSize}px` }"
  >
    <div
      v-for="(childPoint, index) in allChildPoints"
      :key="index"
      :class="[
        'g-grid-line',
        { 'g-grid-line-last': index === allChildPoints.length - 1 },
        {
          'g-grid-line-highlighted':
            (precision === 'day' && highlightedHours.includes(childPoint)) ||
            (precision === 'month' && highlightedDays.includes(childPoint))
        }
      ]"
      :style="{ width: `${gridSize}px` }"
    />
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GGanttGrid',

  props: {
    chartStart: { type: String },
    chartEnd: { type: String },
    rowLabelWidth: { type: Number },
    highlightedHours: { type: Array, default: () => [] },
    highlightedDays: { type: Array, default: () => [] },
    precision: { type: String },
    timeCount: { type: Number },
    gridSize: { type: Number }
  },

  computed: {
    allChildPoints() {
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      let res = []
      while (start.isBefore(end)) {
        switch (this.precision) {
          case 'day':
            res.push(start.hour())
            start.add(1, 'hour')
            break
          case 'month':
            res.push(start.format('YYYY-MM-DD'))
            start.add(1, 'day').hour(23)
            break
        }
      }
      return res
    }
  }
}
</script>
