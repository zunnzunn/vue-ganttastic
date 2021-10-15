<template>
  <div
    ref="g-grid-container"
    class="g-grid-container"
    :style="{
      left: `${rowLabelWidth}px`,
      width: `${timeCount * gridSize}px`,
      top,
      height,
    }"
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
            (precision === 'month' && highlightedDays.includes(childPoint)),
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
    highlightedDays: { type: Array, default: () => [] },
    precision: { type: String },
    timeCount: { type: Number },
    gridSize: { type: Number },
  },

  data: () => ({
    top: '0px',
    height: '0px',
  }),

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
    },
  },

  mounted() {
    this.$nextTick(() => this.onWindowResize())
    window.addEventListener('resize', this.onWindowResize)
  },

  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    onWindowResize() {
      let gridContainer = this.$refs['g-grid-container']
      if (!gridContainer) return
      let rowsContainer = gridContainer.nextSibling
      if (!rowsContainer) return
      this.top = `${rowsContainer.offsetTop}px`
      this.height = `${rowsContainer.offsetHeight}px`
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
