<template>
  <div
    ref="g-timeaxis"
    class="g-gantt-timeaxis"
    :style="{ width: `${timeCount * gridSize + rowLabelWidth}px` }"
  >
    <div
      class="g-gantt-timeaxis__empty-space"
      :style="{
        minWidth: `${rowLabelWidth}px`,
        background: themeColors.secondary
      }"
    />
    <div class="g-gantt-timeaxis__days">
      <div
        v-for="(point, index) in axisPoints"
        :key="point.text"
        class="g-gantt-timeaxis__day"
        :style="{
          background:
            index % 2 === 0 ? themeColors.primary : themeColors.secondary,
          color: themeColors.text
        }"
      >
        <div v-html="pointFormatted(point) || '&nbsp;'"></div>
        <div
          :style="{ background: themeColors.ternary, color: themeColors.text }"
        >
          <div
            v-for="(childPoint, index) in point.childPoints"
            :key="childPoint.fullDatetime"
            class="g-gantt-timeaxis__hour"
            :style="{
              width: `${gridSize}px`,
              background:
                index % 2 === 0 ? themeColors.primary : themeColors.secondary,
              color: themeColors.text
            }"
          >
            <span :style="{ fontSize: hourFontSize }">{{
              childPoint.text
            }}</span>
            <div
              class="g-gantt-timeaxis__hour-pin"
              :style="{ background: themeColors.text }"
            />
          </div>
        </div>
      </div>
    </div>
    <div ref="g-timeaxis-marker" class="g-gantt-timeaxis__marker" />
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GGanttTimeaxis',

  props: {
    chartStart: { type: String },
    chartEnd: { type: String },
    rowLabelWidth: { type: Number },
    timemarkerOffset: { type: Number, default: 0 },
    locale: { type: String },
    themeColors: { type: Object },
    precision: { type: String },
    timeFormat: { type: String },
    timeCount: { type: Number },
    gridSize: { type: Number },
    dayFormat: { type: String },
    monthFormat: { type: String }
  },

  data() {
    return {
      axisPoints: [],
      timemarker: null,
      hourFontSize: '11px'
    }
  },

  watch: {
    chartStart() {
      this.initAxis()
    },
    chartEnd() {
      this.initAxis()
    },
    gridSize() {
      this.onWindowResize()
    }
  },

  mounted() {
    this.timemarker = this.$refs['g-timeaxis-marker']
    this.initAxis()
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('mousemove', this.moveTimemarker)
    window.addEventListener('dragover', this.moveTimemarker)
  },

  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('mousemove', this.moveTimemarker)
    window.removeEventListener('dragover', this.moveTimemarker)
  },

  methods: {
    initAxis() {
      this.precision === 'day'
        ? this.initAxisDaysAndHours()
        : this.initAxisMonthsAndDays()
    },

    initAxisMonthsAndDays() {
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      this.axisPoints = []
      while (start.isBefore(end)) {
        let dayCountOfMonth = start.isSame(end, 'month')
          ? end.date() - 1
          : start.daysInMonth() - start.date() + 1
        let widthPercentage = (dayCountOfMonth / this.timeCount) * 100
        let endDay = start.isSame(end, 'month')
          ? end.date() - 1
          : start.daysInMonth()
        this.axisPoints.push(
          this.getAxisMonthObject(start, widthPercentage, endDay)
        )
        start.add(1, 'month').date(1).hour(0)
      }
    },

    initAxisDaysAndHours() {
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      this.axisPoints = []
      while (start.isBefore(end)) {
        let hourCountOfDay = start.isSame(end, 'day')
          ? end.hour()
          : 24 - start.hour()
        let widthPercentage = (hourCountOfDay / this.timeCount) * 100
        let endHour = start.isSame(end, 'day') ? end.hour() - 1 : 23 // -1 because the last hour is not included e.g if chartEnd=04:00 the last interval we display is between 03 and 04
        this.axisPoints.push(
          this.getAxisDayObject(start, widthPercentage, endHour)
        )
        start.add(1, 'day').hour(0)
      }
    },

    getAxisMonthObject(datetime, widthPercentage, endDay) {
      let datetimeMoment = moment(datetime)
      let axisMonthObject = {
        widthPercentage: widthPercentage,
        value: moment(datetime, 'YYYY-MM'),
        childPoints: []
      }
      let startDay = datetimeMoment.date()
      for (let i = 0; i <= endDay - startDay; i++) {
        let day = {
          text: datetimeMoment.format('D'),
          fullDatetime: datetimeMoment.format(this.timeFormat)
        }
        axisMonthObject.childPoints.push(day)
        datetimeMoment.add(1, 'day')
      }
      return axisMonthObject
    },

    getAxisDayObject(datetime, widthPercentage, endHour) {
      let datetimeMoment = moment(datetime)
      let axisDayObject = {
        widthPercentage: widthPercentage,
        value: moment(datetime, 'YYYY-MM-DD'), // ISO 8601
        childPoints: []
      }
      let startHour = datetimeMoment.hour()
      for (let i = 0; i <= endHour - startHour; i++) {
        let hour = {
          text: datetimeMoment.format('HH'),
          fullDatetime: datetimeMoment.format(this.timeFormat)
        }
        axisDayObject.childPoints.push(hour)
        datetimeMoment.add(1, 'hour')
      }
      return axisDayObject
    },

    moveTimemarker(event) {
      const chart = this.timemarker.closest('.g-gantt-chart')
      if (!chart) return
      let pos =
        chart.scrollLeft +
        event.clientX -
        this.timemarkerOffset -
        this.horizontalAxisContainer.left
      if (pos > this.horizontalAxisContainer.width)
        pos = this.horizontalAxisContainer.width
      this.timemarker.style.left = `${pos}px`
    },

    onWindowResize() {
      if (!this.$refs['g-timeaxis']) return
      this.horizontalAxisContainer =
        this.$refs['g-timeaxis'].getBoundingClientRect()
      this.hourFontSize =
        Math.min(
          9.5,
          0.75 * (this.horizontalAxisContainer.width / this.timeCount)
        ) + 'px'
    },

    pointFormatted(point) {
      switch (this.precision) {
        case 'day':
          return this.dayFormatted(point)
        case 'month':
          return this.monthFormatted(point)
      }
    },

    monthFormatted(point) {
      // do not display month text if the month is smaller than x%
      return point.widthPercentage >= (3 / 32) * 100
        ? moment(point.value).locale(this.locale).format(this.monthFormat)
        : ''
    },

    dayFormatted(point) {
      // do not display day text if the day is smaller than 12%
      // return point.widthPercentage >= 12
      //   ? moment(point.value).locale(this.locale).format(this.dayFormat)
      //   : ''
      return moment(point.value).locale(this.locale).format(this.dayFormat)
    }
  }
}
</script>
