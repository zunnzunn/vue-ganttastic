<template>
  <div
    class="g-grid-container"
    :style="{
      left: rowLabelWidth,
      width: `${timeCount * 30}px`,
    }"
  >
    <div
      v-for="(childPoint, index) in allChildPoints"
      :key="index"
      :class="[
        'g-grid-line',
        {
          'g-grid-line-highlighted':
            precision === 'day' && highlightedHours.includes(childPoint),
        },
      ]"
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
    rowLabelWidth: { type: String },
    highlightedHours: { type: Array, default: () => [] },
    precision: { type: String },
    timeCount: { type: Number },
  },

  computed: {
    allChildPoints() {
      let momentChartStart = moment(this.chartStart)
      let momentChartEnd = moment(this.chartEnd)
      let res = []
      while (momentChartStart.isSameOrBefore(momentChartEnd)) {
        switch (this.precision) {
          case 'day':
            res.push(momentChartStart.date())
            momentChartStart.add(1, 'hour')
            break
          case 'month':
            res.push(momentChartStart.date())
            momentChartStart.add(1, 'day')
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
  /* left: 30%; must correspond to width of row title */
  /* width: 70%; */
  height: calc(100% - 23px);
  display: flex;
  justify-content: space-between;
}

.g-grid-line {
  width: 1px;
  height: 100%;
  background: #eaeaea;
}

.g-grid-line-highlighted {
  background: #90caf9;
  box-shadow: 0px 0px 0px 1px #90caf9;
}
</style>
