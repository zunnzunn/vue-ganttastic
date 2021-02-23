<template>
  <div
    class="g-gantt-row"
    ref="g-gantt-row"
    :style="{ height: `${$parent.rowHeight}px` }"
    v-on="$listeners"
  >
    <div class="g-gantt-row-label" :style="rowLabelStyle">
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div
      class="g-gantt-row-bars-container"
      ref="barContainer"
      :style="barsContainerStyle"
      @dragover="onDragover($event)"
      @dragleave="onDragleave($event)"
      @drop="onDrop($event)"
      @dblclick.self="onDoubleClick($event)"
      @mouseover="onMouseover()"
      @mouseleave="onMouseleave()"
    >
      <g-gantt-bar
        v-for="(bar, index) in bars"
        :key="`ganttastic_bar_${index}`"
        :bar="bar"
        ref="ganttBar"
        :bar-container="barContainer"
        :all-bars-in-row="bars"
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
    GGanttBar,
  },

  props: {
    label: { type: String, default: 'Row' },
    bars: { type: Array, default: () => [] },
    highlightOnHover: Boolean,
  },

  inject: [
    'ganttChartProps',
    'getThemeColors',
    'getTimeCount',
    'getChartStart',
    'getChartEnd',
    'getDefaultBarLength',
    'getTimeUnit',
    'getTimeFormat',
  ],

  data() {
    return {
      barContainer: {},
      timeUnit: this.getTimeUnit(),
      timeFormat: this.getTimeFormat(),
    }
  },

  computed: {
    rowLabelStyle() {
      return {
        width: this.ganttChartProps.rowLabelWidth,
        height: this.ganttChartProps.rowHeight,
        background: this.$parent.themeColors.ternary,
        color: this.$parent.themeColors.text,
      }
    },

    barsContainerStyle() {
      return {
        width: `${100 - this.ganttChartProps.rowLabelWidth.replace('%', '')}%`,
      }
    },
  },

  mounted() {
    this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    window.addEventListener('resize', this.onWindowResize)
  },

  methods: {
    onDragover(e) {
      e.preventDefault() // enables dropping content on row
      if (this.highlightOnHover) {
        this.$refs[
          'g-gantt-row'
        ].style.backgroundColor = this.getThemeColors().hoverHighlight
      }
    },

    onDragleave() {
      this.$refs['g-gantt-row'].style.backgroundColor = null
    },

    onDrop(e) {
      let barContainer = this.$refs.barContainer.getBoundingClientRect()
      let xPos = e.clientX - barContainer.left
      let timeDiffFromStart = (xPos / barContainer.width) * this.getTimeCount()
      let time = moment(this.getChartStart()).add(
        timeDiffFromStart,
        this.timeUnit
      )
      let bar = this.bars.find((bar) =>
        time.isBetween(bar[this.barStart], bar[this.barEnd])
      )
      this.$emit('drop', { event: e, bar, time: time.format(this.timeFormat) })
    },

    onDoubleClick(e) {
      let barContainer = this.$refs.barContainer.getBoundingClientRect()
      let xPos = e.clientX - barContainer.left
      let timeDiffFromStart =
        Math.round(xPos / barContainer.width * this.getTimeCount())
      let time = moment(this.getChartStart()).add(
        timeDiffFromStart,
        this.timeUnit
      )
      let bar = {}
      bar[this.ganttChartProps.barStartKey] = time.format()
      bar[this.ganttChartProps.barEndKey] = time.add(this.getDefaultBarLength(), this.timeUnit).format()

      bar.ganttBarConfig = { handles: true }
      this.bars.push(bar)
    },

    onMouseover() {
      if (this.highlightOnHover) {
        this.$refs[
          'g-gantt-row'
        ].style.backgroundColor = this.getThemeColors().hoverHighlight
      }
    },

    onMouseleave() {
      this.$refs['g-gantt-row'].style.backgroundColor = null
    },

    onWindowResize() {
      // re-initialize the barContainer DOMRect variable, which will trigger re-rendering in the gantt bars
      this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    },
  },

  watch: {
    'ganttChartProps.rowLabelWidth': function () {
      this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    },
  },
}
</script>

<style scoped>
.g-gantt-row {
  display: flex;
  width: 100%;
  height: 40px;
  transition: background-color 0.2s;
}

.g-gantt-row > .g-gantt-row-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  background: #e8e8e8;
  color: #424242;
  font-size: 0.9em;
  z-index: 3;
  overflow: hidden;
  font-weight: bold;
}

.g-gantt-row > .g-gantt-row-bars-container {
  position: relative;
  border-top: 1px solid #eaeaea;
  width: 70%;
  border-bottom: 1px solid #eaeaea;
}
</style>