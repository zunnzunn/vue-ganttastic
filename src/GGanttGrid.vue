<template>
  <div
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
            precision === 'day' && highlightedHours.includes(childPoint),
        },
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
    precision: { type: String },
    timeCount: { type: Number },
    gridSize: { type: Number },
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
            res.push(start.date())
            start.add(1, 'day').hour(23)
            break
        }
      }
      return res
    },
  },
}
</script>

<style scoped>
.g-grid-container {
  position: absolute;
  top: 0;
  height: calc(100% - 23px);
  overflow: hidden;
}

.g-grid-line {
  height: 100%;
  border: 1px solid transparent;
  border-left: 1px solid #eaeaea;
  box-sizing: border-box;
  display: inline-block;
}

.g-grid-line-last {
  border-right: 1px solid #eaeaea;
}

.g-grid-line-highlighted {
  background: #dcefff;
}
</style>
