<template>
  <div
    class="g-gantt-row"
    ref="g-gantt-row"
    :style="{ height: `${chartProps.rowHeight}px` }"
    v-on="$listeners"
  >
    <div class="g-gantt-row-label" :style="rowLabelStyle">
      <span :title="label">
        <slot name="label">{{ label }}</slot>
      </span>
    </div>
    <div
      class="g-gantt-row-bars-container"
      ref="barContainer"
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
    bars: { type: Array, default: () => [] },
    highlightOnHover: { type: Boolean }
  },

  inject: [
    'getChartProps',
    'getThemeColors',
    'getTimeCount',
    'getTimeUnit',
    'getTimeFormat'
  ],

  data() {
    return {
      barContainer: {},
      localBars: this.bars
    }
  },

  computed: {
    themeColors() {
      return this.getThemeColors()
    },

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
        background: this.themeColors.ternary,
        color: this.themeColors.text,
        borderTop: `1px solid ${this.themeColors.rowLabelBorder}`,
        borderBottom: `1px solid ${this.themeColors.rowLabelBorder}`
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
        this.$refs['g-gantt-row'].style.backgroundColor =
          this.themeColors.hoverHighlight
      }
    },

    onDragleave() {
      this.$refs['g-gantt-row'].style.backgroundColor = null
    },

    onDrop(e) {
      let barContainer = this.$refs.barContainer.getBoundingClientRect()
      let xPos = e.clientX - barContainer.left
      let timeDiffFromStart = (xPos / barContainer.width) * this.timeCount
      let time = moment(this.chartStart).add(timeDiffFromStart, this.timeUnit)
      let bar = this.localBars.find(bar =>
        time.isBetween(
          bar[this.chartProps.barStartKey],
          bar[this.chartProps.barEndKey]
        )
      )
      this.$emit('drop', { event: e, bar, time: time.format(this.timeFormat) })
    },

    onDoubleClick(e) {
      if (!this.chartProps.mayAdd) return
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
        this.$refs['g-gantt-row'].style.backgroundColor =
          this.themeColors.hoverHighlight
      }
    },

    onMouseleave() {
      this.$refs['g-gantt-row'].style.backgroundColor = null
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
