<template>
  <div
    ref="g-timeaxis"
    class="g-timeaxis"
    :style="{ width: `${timeCount * gridSize + rowLabelWidth}px` }"
  >
    <div
      class="g-timeaxis-empty-space"
      :style="{
        minWidth: `${rowLabelWidth}px`,
        background: themeColors.secondary,
      }"
    />
    <div class="g-timeaxis-days">
      <div
        v-for="(point, index) in axisPoints"
        :key="point.text"
        class="g-timeaxis-day"
        :style="{
          background:
            index % 2 === 0 ? themeColors.primary : themeColors.secondary,
          color: themeColors.text,
        }"
      >
        <div v-html="pointFormatted(point) || '&nbsp;'"></div>
        <div
          :style="{ background: themeColors.ternary, color: themeColors.text }"
        >
          <div
            v-for="(childPoint, index) in point.childPoints"
            :key="childPoint.fullDatetime"
            class="g-timeaxis-hour"
            :style="{
              width: `${gridSize}px`,
              background:
                index % 2 === 0 ? themeColors.primary : themeColors.secondary,
              color: themeColors.text,
            }"
          >
            <span :style="{ fontSize: hourFontSize }">{{
              childPoint.text
            }}</span>
            <div
              class="g-timeaxis-hour-pin"
              :style="{ background: themeColors.text }"
            />
          </div>
        </div>
      </div>
    </div>
    <div ref="g-timeaxis-marker" class="g-timeaxis-marker" />
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
  },

  data() {
    return {
      axisPoints: [],
      childPointCount: null,
      timemarker: null,
      hourFontSize: '11px',
      dayFormat: 'DD MMMM',
      monthFormat: 'MMMM YYYY',
    }
  },

  watch: {
    chartStart() {
      this.initAxis()
    },
    chartEnd() {
      this.initAxis()
    },
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
      switch (this.precision) {
        case 'day':
          this.initAxisDaysAndHours()
          break
        case 'month':
          this.initAxisMonthsAndDays()
          break
      }
    },

    initAxisMonthsAndDays() {
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      this.childPointCount = Math.floor(end.diff(start, 'days', true))
      this.axisPoints = []
      while (start.isBefore(end)) {
        let dayCountOfMonth = start.isSame(end, 'month')
          ? end.date() - 1
          : start.daysInMonth() - start.date() + 1
        let widthPercentage = (dayCountOfMonth / this.childPointCount) * 100
        let endDay =
          start.month() === end.month() ? end.date() - 1 : start.daysInMonth()
        this.axisPoints.push(
          this.getAxisMonthObject(start, widthPercentage, endDay)
        )
        start.add(1, 'month').date(1).hour(0)
      }
    },

    initAxisDaysAndHours() {
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      this.childPointCount = Math.floor(end.diff(start, 'hours', true))
      this.axisPoints = []
      while (start.isBefore(end)) {
        let hourCountOfDay = start.isSame(end, 'day')
          ? end.hour()
          : 24 - start.hour()
        let widthPercentage = (hourCountOfDay / this.childPointCount) * 100
        let endHour = start.date() === end.date() ? end.hour() - 1 : 23 // -1 because the last hour is not included e.g if chartEnd=04:00 the last interval we display is between 03 and 04
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
        childPoints: [],
      }
      let startDay = datetimeMoment.date()
      for (let i = 0; i <= endDay - startDay; i++) {
        let day = {
          text: datetimeMoment.format('D'),
          fullDatetime: datetimeMoment.format(this.timeFormat),
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
        childPoints: [],
      }
      let startHour = datetimeMoment.hour()
      for (let i = 0; i <= endHour - startHour; i++) {
        let hour = {
          text: datetimeMoment.format('HH'),
          fullDatetime: datetimeMoment.format(this.timeFormat),
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
          0.75 * (this.horizontalAxisContainer.width / this.childPointCount)
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
    },
  },
}
</script>

<style scoped>
.g-timeaxis,
.g-timeaxis-days,
.g-timeaxis-day,
.g-timeaxis-day > div {
  display: flex;
  /* overflow: hidden; */
}

.g-timeaxis {
  position: sticky;
  top: 0;
  /* width: 100%; */
  /* height: 8%; */
  /* min-height: 75px; */
  background: white;
  z-index: 4;
  box-shadow: 0px 1px 3px 2px rgba(50, 50, 50, 0.5);
}

.g-timeaxis > .g-timeaxis-empty-space {
  min-height: 100%;
  background: #f5f5f5;
  z-index: 5;
  left: 0;
  position: sticky;
}

.g-timeaxis > .g-timeaxis-days {
  position: relative;
  height: 100%;
}

.g-timeaxis-day {
  height: 100%;
  flex-direction: column;
  background: #e0e0e0;
}

.g-timeaxis-day:nth-child(odd) {
  background: #e8e8e8;
}

.g-timeaxis-day > div:nth-child(1) {
  /* day text */
  height: 50%;
  justify-content: space-around;
  font-weight: bold;
  align-items: center;
}

.g-timeaxis-day > div:nth-child(2) {
  /* hours of a day */
  align-items: flex-end;
  height: 50%;
  justify-content: space-between;
  background: #f5f5f5;
  padding-top: 2px;
  color: #212121;
}

.g-timeaxis-hour {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  opacity: 0.5;
}

.g-timeaxis-hour-pin {
  width: 1px;
  height: 8px;
}

.g-timeaxis-marker {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 3px;
  background: black;
}
</style>
