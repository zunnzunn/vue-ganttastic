<template>
  <div
    class="g-gantt-row"
    ref="g-gantt-row"
    :style="{ height: `${$parent.rowHeight}px` }"
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
    GGanttBar
  },

  props: {
    label: { type: String, default: 'Row' },
    bars: { type: Array, default: () => [] },
    highlightOnHover: { type: Boolean }
  },

  inject: [
    'getThemeColors',
    'getTimeCount',
    'getChartStart',
    'getChartEnd',
    'getDefaultBarLength',
    'getTimeUnit',
    'getTimeFormat'
  ],

  data() {
    return {
      barContainer: {},
      timeUnit: this.getTimeUnit(),
      timeFormat: this.getTimeFormat()
    }
  },

  computed: {
    rowLabelStyle() {
      return {
        width: `${this.$parent.rowLabelWidth}px`,
        // height: `${this.$parent.rowHeight}px`,
        background: this.$parent.themeColors.ternary,
        color: this.$parent.themeColors.text
      }
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
          this.getThemeColors().hoverHighlight
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
      let bar = this.bars.find(bar =>
        time.isBetween(
          bar[this.$parent.barStartKey],
          bar[this.$parent.barEndKey]
        )
      )
      this.$emit('drop', { event: e, bar, time: time.format(this.timeFormat) })
    },

    onDoubleClick(e) {
      if (!this.$parent.mayAdd) return
      let barContainer = this.$refs.barContainer.getBoundingClientRect()
      let xPos = e.clientX - barContainer.left
      let timeDiffFromStart = Math.floor(
        (xPos / barContainer.width) * this.getTimeCount()
      )
      let time = moment(this.getChartStart()).add(
        timeDiffFromStart,
        this.timeUnit
      )
      let bar = {}
      bar[this.$parent.barStartKey] = time.format()
      bar[this.$parent.barEndKey] = time
        .add(this.getDefaultBarLength(), this.timeUnit)
        .format()

      bar.ganttBarConfig = { handles: true }
      this.bars.push(bar)
      this.bars.sort((first, second) =>
        moment(first[this.$parent.barStartKey]).diff(
          second[this.$parent.barStartKey]
        )
      )
    },

    onMouseover() {
      if (this.highlightOnHover) {
        this.$refs['g-gantt-row'].style.backgroundColor =
          this.getThemeColors().hoverHighlight
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
  },

  watch: {
    '$parent.rowLabelWidth': function () {
      this.barContainer = this.$refs.barContainer.getBoundingClientRect()
    }
  }
}
</script>
