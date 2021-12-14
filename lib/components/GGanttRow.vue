<template>
  <div
    ref="g-row"
    class="g-gantt-row"
    :style="{ height: `${chartProps.rowHeight}px` }"
    v-on="$listeners"
  >
    <div class="g-gantt-row__label" :style="rowLabelStyle">
      <span :title="label">
        <slot name="label">{{ label }}</slot>
      </span>
    </div>
    <div
      class="g-gantt-row__bars-container"
      ref="barContainer"
      :style="rowStyle"
      @dragover="onDragover($event)"
      @dragleave="onDragleave($event)"
      @drop="onDrop($event)"
      @dblclick.self="onDoubleClick($event)"
      @mouseover="onMouseover()"
      @mouseleave="onMouseleave()"
    >
      <g-gantt-bar
        v-for="(bar, index) in localBars"
        :key="`ganttastic_bar_${index}`"
        ref="ganttBar"
        :bar="bar"
        :bar-container="barContainer"
        :all-bars-in-row="localBars"
      >
        <template #bar-label="{ bar }">
          <slot name="bar-label" :bar="bar" />
        </template>
      </g-gantt-bar>
    </div>
  </div>
</template>

<script>
import GGanttBar from './GGanttBar.vue'
import moment from 'moment'

export default {
  name: 'GGanttRow',

  components: {
    GGanttBar
  },

  props: {
    label: { type: String, default: 'Row' },
    labelStyle: { type: Object },
    rowStyle: { type: Object },
    bars: { type: Array, default: () => [] },
    highlightOnHover: { type: Boolean }
  },

  inject: ['getChartProps', 'getTimeCount', 'getTimeUnit', 'getTimeFormat'],

  data() {
    return {
      barContainer: {},
      localBars: this.bars
    }
  },

  computed: {
    defaultBarLength() {
      return this.chartProps.defaultBarLength
    },

    chartProps() {
      return this.getChartProps()
    },

    chartStart() {
      return this.chartProps.chartStart
    },

    barConfigKey() {
      return this.chartProps.barConfigKey
    },

    timeUnit() {
      return this.getTimeUnit()
    },

    timeFormat() {
      return this.getTimeFormat()
    },

    timeCount() {
      return this.getTimeCount()
    },

    rowLabelStyle() {
      return {
        width: `${this.chartProps.rowLabelWidth}px`,
        ...this.labelStyle
      }
    }
  },

  watch: {
    'chartProps.chartStart'() {
      this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    },

    'chartProps.chartEnd'() {
      this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    },

    'chartProps.rowLabelWidth'() {
      this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    },

    'chartProps.gridSize'() {
      this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    },

    bars(value) {
      this.localBars = value
    }
  },

  mounted() {
    this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    window.addEventListener('resize', this.onWindowResize)
  },

  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    onDragover(e) {
      e.preventDefault() // enables dropping content on row
      if (this.highlightOnHover) {
        this.$refs['g-row'].classList.add('g-gantt-row-highlighted')
      }
    },

    onDragleave() {
      this.$refs['g-row'].classList.remove('g-gantt-row-highlighted')
    },

    onDrop(e) {
      const barContainer = this.$refs.barContainer.getBoundingClientRect()
      const xPos = e.clientX - barContainer.left
      const timeDiffFromStart = (xPos / barContainer.width) * this.timeCount
      const time = moment(this.chartStart).add(timeDiffFromStart, this.timeUnit)
      const bar = this.localBars.find(bar =>
        time.isBetween(
          bar[this.chartProps.barStartKey],
          bar[this.chartProps.barEndKey]
        )
      )
      this.$emit('drop', { event: e, bar, time: time.format(this.timeFormat) })
    },

    onDoubleClick(e) {
      if (!this.chartProps.allowAdd) return
      let barContainer = this.$refs.barContainer.getBoundingClientRect()
      let xPos = e.clientX - barContainer.left
      let timeDiffFromStart = Math.floor(
        (xPos / barContainer.width) * this.timeCount
      )
      let time = moment(this.chartStart).add(timeDiffFromStart, this.timeUnit)
      let bar = {}
      bar[this.chartProps.barStartKey] = time.format()
      bar[this.chartProps.barEndKey] = time
        .add(this.defaultBarLength, this.timeUnit)
        .format()

      bar[this.barConfigKey] = { handles: true }
      this.localBars.push(bar)
      this.localBars.sort((first, second) =>
        moment(first[this.chartProps.barStartKey]).diff(
          second[this.chartProps.barStartKey]
        )
      )
    },

    onMouseover() {
      if (this.highlightOnHover) {
        this.$refs['g-row'].classList.add('g-gantt-row-highlighted')
      }
    },

    onMouseleave() {
      this.$refs['g-row'].classList.remove('g-gantt-row-highlighted')
    },

    onWindowResize() {
      // re-initialize the barContainer DOMRect variable, which will trigger re-rendering in the gantt bars
      if (this.$refs.barContainer) {
        this.barContainer = this.$refs.barContainer.getBoundingClientRect()
      }
    }
  }
}
</script>
