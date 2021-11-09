<template>
  <div>
    <div
      ref="g-gantt-bar"
      :class="['g-gantt-bar', { 'g-gantt-bar-immobile': barConfig.immobile }]"
      :style="barStyle"
      @mouseenter.stop="onMouseenter($event)"
      @mouseleave.stop="onMouseleave($event)"
      @mousedown.stop="onMousedown($event)"
      @click.stop="onClick($event)"
      @dblclick="onDblclick($event)"
      @contextmenu="onContextmenu($event)"
    >
      <div class="g-gantt-bar-label">
        <slot name="bar-label" :bar="localBar">
          {{ barConfig.label || '' }}
        </slot>
      </div>
      <template v-if="barConfig.handles">
        <div class="g-gantt-bar-handle-left" />
        <div class="g-gantt-bar-handle-right" />
      </template>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="!barConfig.noTooltip && (showTooltip || isDragging)"
        class="g-gantt-tooltip"
        :style="tooltipStyle"
      >
        <div
          class="color-indicator"
          :style="{
            background:
              this.barStyle.background || this.barStyle.backgroundColor
          }"
        />
        <div>
          <div>{{ localBar.tooltip }}</div>
          <div>{{ barStartText }} - {{ barEndText }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GGanttBar',

  props: {
    bar: { type: Object },
    barContainer: [Object, DOMRect],
    allBarsInRow: { type: Array }
  },

  inject: [
    'getTimeCount',
    'getChartProps',
    'initDragOfBarsFromBundle',
    'moveBarsFromBundleOfPushedBar',
    'setDragLimitsOfGanttBar',
    'onBarEvent',
    'onDragendBar',
    'getTimeUnit',
    'getTimeFormat'
  ],

  data() {
    return {
      showTooltip: false,
      tooltipTimeout: null,
      dragLimitLeft: null,
      dragLimitRight: null,
      isDragging: false,
      isMainBarOfDrag: false, // is this the bar that was clicked on when starting to drag or is it dragged along some other bar from the same bundle
      cursorOffsetX: 0,
      mousemoveCallback: null, // gets initialized when starting to drag, possible values: drag, dragByHandleLeft, dragByHandleRight,
      barStartBeforeDrag: null,
      barEndBeforeDrag: null,
      localBar: this.bar
    }
  },

  computed: {
    chartProps() {
      return this.getChartProps()
    },

    minGapBetweenBars() {
      return this.chartProps.minGapBetweenBars
    },

    timeChildKey() {
      return this.chartProps.precision === 'month' ? 'hours' : 'minutes'
    },

    timeChildFormat() {
      return this.chartProps.precision === 'month'
        ? 'DD.MM.YYYY'
        : 'DD.MM.YYYY HH:mm'
    },

    barConfigKey() {
      return this.chartProps.barConfigKey
    },

    barStartKey() {
      return this.chartProps.barStartKey
    },

    barEndKey() {
      return this.chartProps.barEndKey
    },

    timeCount() {
      return this.getTimeCount()
    },

    timeUnit() {
      return this.getTimeUnit()
    },

    timeFormat() {
      return this.getTimeFormat()
    },

    barStartMoment: {
      get() {
        return moment(this.localBar[this.barStartKey], this.timeFormat)
      },
      set(value) {
        this.localBar[this.barStartKey] = value.format(this.timeFormat)
      }
    },

    barEndMoment: {
      get() {
        return moment(this.localBar[this.barEndKey])
      },
      set(value) {
        this.localBar[this.barEndKey] = value.format(this.timeFormat)
      }
    },

    barStartText: {
      get() {
        return moment(this.barStartMoment).format(this.timeChildFormat)
      }
    },

    barEndText: {
      get() {
        let endMoment = moment(this.barEndMoment)
        return endMoment.format(this.timeChildFormat)
      }
    },

    barConfig() {
      if (this.localBar[this.barConfigKey]) {
        return {
          ...this.localBar[this.barConfigKey],
          background: this.localBar[this.barConfigKey].isShadow
            ? 'grey'
            : this.localBar[this.barConfigKey].background ||
              this.localBar[this.barConfigKey].backgroundColor,
          opacity: this.localBar[this.barConfigKey].isShadow
            ? '0.3'
            : this.localBar[this.barConfigKey].opacity
        }
      }
      return {}
    },

    barStyle() {
      if (!this.barContainer.width) return

      let xStart = this.mapTimeToPosition(this.barStartMoment)
      let xEnd = this.mapTimeToPosition(this.barEndMoment)
      return {
        ...(this.barConfig || {}),
        left: `${xStart}px`,
        width: `${xEnd - xStart}px`,
        height: `${this.chartProps.rowHeight - 6}px`,
        zIndex: this.barConfig.zIndex || (this.isDragging ? 2 : 1)
      }
    },

    tooltipStyle() {
      return {
        left: this.barStyle.left,
        top: `${this.chartProps.rowHeight}px`
      }
    },

    chartStartMoment() {
      return moment(this.chartProps.chartStart)
    },

    chartEndMoment() {
      return moment(this.chartProps.chartEnd)
    }
  },

  watch: {
    bar(value) {
      this.localBar = value
    }
  },

  methods: {
    onMouseenter(e) {
      if (this.tooltipTimeout) {
        clearTimeout(this.tooltipTimeout)
      }
      this.tooltipTimeout = setTimeout(() => (this.showTooltip = true), 800)
      this.onBarEvent({ event: e, type: e.type }, this)
    },

    onMouseleave(e) {
      clearTimeout(this.tooltipTimeout)
      this.showTooltip = false
      this.onBarEvent({ event: e, type: e.type }, this)
    },

    onContextmenu(e) {
      const time = this.mapPositionToTime(
        e.clientX - this.barContainer.left
      ).format(this.timeFormat)
      this.onBarEvent({ event: e, type: e.type, time }, this)
    },

    onClick(e) {
      const time = this.mapPositionToTime(
        e.clientX - this.barContainer.left
      ).format(this.timeFormat)
      this.onBarEvent({ event: e, type: e.type, time }, this)
    },

    onDblclick(e) {
      const time = this.mapPositionToTime(
        e.clientX - this.barContainer.left
      ).format(this.timeFormat)
      this.onBarEvent({ event: e, type: e.type, time }, this)
    },

    onMousedown(e) {
      e.preventDefault()
      if (e.button === 2) {
        return
      }

      if (!this.barConfig.immobile && !this.barConfig.isShadow) {
        this.setDragLimitsOfGanttBar(this)
        // initialize the dragging on next mousemove event:
        window.addEventListener('mousemove', this.onFirstMousemove, {
          once: true
        })
        // if next mousemove happens after mouse up (if user just presses mouse button down, then up, without moving):
        window.addEventListener(
          'mouseup',
          () => window.removeEventListener('mousemove', this.onFirstMousemove),
          { once: true }
        )
      }
      const time = this.mapPositionToTime(
        e.clientX - this.barContainer.left
      ).format(this.timeFormat)
      this.onBarEvent({ event: e, type: e.type, time }, this)
    },

    onFirstMousemove(e) {
      this.isMainBarOfDrag = true
      // this method is injected here by GGanttChart.vue, and calls initDrag()
      // for all GGanttBars that belong to the same bundle as this bar:
      this.initDragOfBarsFromBundle(this, e)
    },

    /* --------------------------------------------------------- */
    /* ------------- METHODS FOR DRAGGING THE BAR -------------- */
    /* --------------------------------------------------------- */
    initDrag(e) {
      // "e" must be the mousedown event
      this.isDragging = true
      this.barStartBeforeDrag = this.localBar[this.barStartKey]
      this.barEndBeforeDrag = this.localBar[this.barEndKey]

      let barX = this.$refs['g-gantt-bar'].getBoundingClientRect().left
      this.cursorOffsetX = e.clientX - barX
      let mousedownType = e.target.className
      switch (mousedownType) {
        case 'g-gantt-bar-handle-left':
          document.body.style.cursor = 'w-resize'
          this.mousemoveCallback = this.dragByHandleLeft
          break
        case 'g-gantt-bar-handle-right':
          document.body.style.cursor = 'e-resize'
          this.mousemoveCallback = this.dragByHandleRight
          break
        default:
          this.mousemoveCallback = this.drag
      }
      window.addEventListener('mousemove', this.mousemoveCallback)
      window.addEventListener('mouseup', this.endDrag)
    },

    getBarWidth(bar) {
      let xStart = this.mapTimeToPosition(moment(bar[this.barStartKey]))
      let xEnd = this.mapTimeToPosition(moment(bar[this.barEndKey]))
      return xEnd - xStart
    },

    drag(e) {
      const chart = e.target.closest('.g-gantt-chart')
      if (!chart) return
      let barWidth = this.$refs['g-gantt-bar'].getBoundingClientRect().width
      let newXStart =
        chart.scrollLeft +
        e.clientX -
        this.barContainer.left -
        this.cursorOffsetX
      let newXEnd = newXStart + barWidth
      if (this.isPosOutOfDragRange(newXStart, newXEnd)) {
        return
      }
      this.barStartMoment = this.mapPositionToTime(newXStart)
      this.barEndMoment = this.mapPositionToTime(newXEnd)
      this.manageOverlapping()
      this.onBarEvent({ event: e, type: 'drag' }, this)
    },

    dragByHandleLeft(e) {
      const chart = e.target.closest('.g-gantt-chart')
      if (!chart) return
      let newXStart = chart.scrollLeft + e.clientX - this.barContainer.left
      let newStartMoment = this.mapPositionToTime(newXStart)
      if (
        this.barEndMoment.diff(newStartMoment, this.timeUnit) < 1 ||
        this.isPosOutOfDragRange(newXStart, null)
      ) {
        return
      }
      this.barStartMoment = newStartMoment
      this.manageOverlapping()
    },

    dragByHandleRight(e) {
      const chart = e.target.closest('.g-gantt-chart')
      if (!chart) return
      let newXEnd = chart.scrollLeft + e.clientX - this.barContainer.left
      let newEndMoment = this.mapPositionToTime(newXEnd)
      if (
        newEndMoment.isSameOrBefore(this.barStartMoment, this.timeUnit) ||
        this.isPosOutOfDragRange(null, newXEnd)
      ) {
        return
      }
      this.barEndMoment = newEndMoment
      this.manageOverlapping()
    },

    isPosOutOfDragRange(newXStart, newXEnd) {
      if (newXStart && newXStart < 0) {
        return true
      }
      if (newXEnd > this.barContainer.width) {
        return true
      }
      if (
        newXStart &&
        this.dragLimitLeft !== null &&
        newXStart < this.dragLimitLeft + this.minGapBetweenBars
      ) {
        return true
      }
      if (
        newXEnd &&
        this.dragLimitRight !== null &&
        newXEnd > this.dragLimitRight - this.minGapBetweenBars
      ) {
        return true
      }

      // if (
      //   moment(this.localBar[this.barStartKey]).isAfter(this.barStartBeforeDrag) &&
      //   moment(this.localBar[this.barStartKey])
      //     .add(1, this.timeUnit)
      //     .isAfter(this.localBar[this.barEndBeforeDrag])
      // ) {
      //   return true
      // }

      if (
        !this.chartProps.pushOnOverlap ||
        this.barConfig.pushOnOverlap === false
      ) {
        return false
      }

      const isSqueezeToLeft =
        newXStart &&
        moment(this.localBar[this.barStartKey]).isBefore(
          this.barStartBeforeDrag
        )
      const isSqueezeToRight =
        newXEnd &&
        moment(this.localBar[this.barEndKey]).isAfter(this.barEndBeforeDrag)

      const currentIndex = this.allBarsInRow.findIndex(
        bar => bar == this.localBar
      )

      let otherBars = []
      if (isSqueezeToRight) {
        otherBars = this.allBarsInRow.slice(currentIndex + 1)
        if (otherBars.length) {
          let otherBarTotalWidth = otherBars
            .map(bar => this.getBarWidth(bar))
            .reduce((accumulator, currentValue) => accumulator + currentValue)
          if (newXEnd > this.barContainer.width - otherBarTotalWidth) {
            return true
          }
        }
      } else if (isSqueezeToLeft) {
        otherBars = this.allBarsInRow.slice(0, currentIndex)
        if (otherBars.length) {
          let otherBarTotalWidth = otherBars
            .map(bar => this.getBarWidth(bar))
            .reduce((accumulator, currentValue) => accumulator + currentValue)
          if (newXStart < otherBarTotalWidth) {
            return true
          }
        }
      }

      return false
    },

    endDrag(e) {
      let left = false,
        right = false,
        move = false
      switch (document.body.style.cursor) {
        case 'e-resize':
          right = true
          break
        case 'w-resize':
          left = true
          break
        default:
          move = true
          break
      }
      // console.log('endDrag', { left, right, move })
      this.isDragging = false
      this.dragLimitLeft = null
      this.dragLimitRight = null
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', this.mousemoveCallback)
      window.removeEventListener('mouseup', this.endDrag)
      if (this.isMainBarOfDrag) {
        this.onDragendBar(e, this, { left, right, move })
        this.isMainBarOfDrag = false
      }
    },

    snapBack() {
      this.barStartMoment = moment(this.barStartBeforeDrag)
      this.barEndMoment = moment(this.barEndBeforeDrag)
    },

    manageOverlapping() {
      if (
        !this.chartProps.pushOnOverlap ||
        this.barConfig.pushOnOverlap === false
      ) {
        return
      }
      let currentBar = this.localBar
      let { overlapBar, overlapType } = this.getOverlapBarAndType(currentBar)
      while (overlapBar) {
        let minuteDiff
        let currentStartMoment = moment(currentBar[this.barStartKey])
        let currentEndMoment = moment(currentBar[this.barEndKey])
        let overlapStartMoment = moment(overlapBar[this.barStartKey])
        let overlapEndMoment = moment(overlapBar[this.barEndKey])
        switch (overlapType) {
          case 'left':
            minuteDiff =
              overlapEndMoment.diff(
                currentStartMoment,
                this.timeChildKey,
                true
              ) + this.minGapBetweenBars
            overlapBar[this.barEndKey] = currentStartMoment
              .subtract(this.minGapBetweenBars, this.timeChildKey, true)
              .format(this.timeFormat)
            overlapBar[this.barStartKey] = overlapStartMoment
              .subtract(minuteDiff, this.timeChildKey, true)
              .format(this.timeFormat)
            break
          case 'right':
            minuteDiff =
              currentEndMoment.diff(
                overlapStartMoment,
                this.timeChildKey,
                true
              ) + this.minGapBetweenBars
            overlapBar[this.barStartKey] = currentEndMoment
              .add(this.minGapBetweenBars, this.timeChildKey, true)
              .format(this.timeFormat)
            overlapBar[this.barEndKey] = overlapEndMoment
              .add(minuteDiff, this.timeChildKey, true)
              .format(this.timeFormat)
            break
          default:
            // eslint-disable-next-line
            console.warn(
              'One bar is inside of the other one! This should never occur while push-on-overlap is active!'
            )
            return
        }
        this.moveBarsFromBundleOfPushedBar(overlapBar, minuteDiff, overlapType)
        currentBar = overlapBar
        ;({ overlapBar, overlapType } = this.getOverlapBarAndType(overlapBar))
      }
    },

    getOverlapBarAndType(bar) {
      let barStartMoment = moment(bar[this.barStartKey])
      let barEndMoment = moment(bar[this.barEndKey])
      let overlapLeft, overlapRight, overlapInBetween
      let overlapBar = this.allBarsInRow.find(otherBar => {
        if (
          otherBar === bar ||
          (otherBar[this.barConfigKey] &&
            otherBar[this.barConfigKey].pushOnOverlap === false)
        ) {
          return false
        }
        let otherBarStartMoment = moment(otherBar[this.barStartKey])
        let otherBarEndMoment = moment(otherBar[this.barEndKey])

        overlapLeft = barStartMoment.isBetween(
          otherBarStartMoment,
          otherBarEndMoment
        )
        overlapRight = barEndMoment.isBetween(
          otherBarStartMoment,
          otherBarEndMoment
        )
        overlapInBetween =
          otherBarStartMoment.isBetween(barStartMoment, barEndMoment) ||
          otherBarEndMoment.isBetween(barStartMoment, barEndMoment)
        return overlapLeft || overlapRight || overlapInBetween
      })
      let overlapType = overlapLeft
        ? 'left'
        : overlapRight
        ? 'right'
        : overlapInBetween
        ? 'between'
        : null
      return { overlapBar, overlapType }
    },

    // this is used in GGanttChart, when a bar from a bundle is pushed
    // so that bars from its bundle also get pushed
    moveBarByChildPointsAndPush(childPointCount, direction) {
      switch (direction) {
        case 'left':
          this.barStartMoment = moment(this.barStartMoment).subtract(
            childPointCount,
            this.timeChildKey,
            true
          )
          this.barEndMoment = moment(this.barEndMoment).subtract(
            childPointCount,
            this.timeChildKey,
            true
          )
          break
        case 'right':
          this.barStartMoment = moment(this.barStartMoment).add(
            childPointCount,
            this.timeChildKey,
            true
          )
          this.barEndMoment = moment(this.barEndMoment).add(
            childPointCount,
            this.timeChildKey,
            true
          )
          break
        default:
          // eslint-disable-next-line
          console.warn('wrong direction in moveBarByChildPointsAndPush')
          return
      }
      this.manageOverlapping()
    },

    /* --------------------------------------------------------- */
    /* ------- MAPPING POSITION TO TIME (AND VICE VERSA) ------- */
    /* --------------------------------------------------------- */
    mapTimeToPosition(time) {
      let timeDiffFromStart = moment(time).diff(
        this.chartStartMoment,
        this.timeUnit,
        true
      )
      let pos = (timeDiffFromStart / this.timeCount) * this.barContainer.width
      return pos
    },

    mapPositionToTime(xPos) {
      let timeDiffFromStart = (xPos / this.barContainer.width) * this.timeCount
      if (this.timeUnit === 'days') {
        let duration = moment.duration(timeDiffFromStart, 'days')
        timeDiffFromStart = duration.asHours()
      }
      return moment(this.chartStartMoment).add(timeDiffFromStart, 'hours')
    }
  }
}
</script>
