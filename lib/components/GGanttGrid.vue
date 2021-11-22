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
        { 'g-grid-line-highlighted': isHighlighted(childPoint) }
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
      const start = moment(this.chartStart)
      const end = moment(this.chartEnd)
      const res = []
      while (start.isBefore(end)) {
        switch (this.precision) {
          case 'day':
            res.push(start.format('YYYY-MM-DD H'))
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
  },

  methods: {
    isHighlighted(point) {
      switch (this.precision) {
        case 'day':
          if (
            this.highlightedDays.includes(
              moment(point, 'YYYY-MM-DD').format('YYYY-MM-DD')
            )
          ) {
            return true
          } else {
            return this.highlightedHours.includes(
              moment(point, 'YYYY-MM-DD H').get('hour')
            )
          }
        case 'month':
          return this.highlightedDays.includes(point)
      }
    }
  }
}
</script>
