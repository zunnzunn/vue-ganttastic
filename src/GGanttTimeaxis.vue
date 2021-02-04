<template>
  <div id="g-timeaxis">
    <div
      class="g-timeaxis-empty-space"
      :style="{ width: rowLabelWidth, background: themeColors.secondary }"
    />
    <div
      class="g-timeaxis-days"
      :style="{ width: `${100 - rowLabelWidth.replace('%', '')}%` }"
    >
      <div
        v-for="(point, index) in axisPoints"
        :key="point.text"
        class="g-timeaxis-day"
        :style="{
          width: point.widthPercentage + '%',
          background:
            index % 2 === 0 ? themeColors.primary : themeColors.secondary,
          color: themeColors.text,
        }"
      >
        <div>{{ pointFormatted(point) }}</div>
        <div
          :style="{ background: themeColors.ternary, color: themeColors.text }"
        >
          <div
            v-for="(childPoint, index) in point.childPoints"
            :key="childPoint.fullDatetime"
            class="g-timeaxis-hour"
            :style="{
              width: childPoint.widthPercentage + '%',
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
    <div id="g-timeaxis-marker" />
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GGanttTimeaxis',

  inject: ['getTimeaxisMode', 'getTimeUnit', 'getTimeFormat'],

  props: {
    chartStart: String,
    chartEnd: String,
    rowLabelWidth: String,
    timemarkerOffset: { type: Number, default: 0 },
    locale: String,
    themeColors: Object,
  },

  data() {
    return {
      axisPoints: [],
      childPointCount: null,
      timemarker: null,
      hourFontSize: '11px',
      dayFormat: 'MM-DD', // ISO 8601
      mode: this.getTimeaxisMode(),
      timeUnit: this.getTimeUnit(),
      timeFormat: this.getTimeFormat()
    }
  },

  mounted() {
    this.timemarker = document.querySelector('#g-timeaxis-marker')
    this.initAxis()
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('mousemove', (event) => this.moveTimemarker(event))
    window.addEventListener('dragover', (event) => this.moveTimemarker(event))
  },

  methods: {
    initAxis() {
      if (this.mode === 'month_days') {
        this.initAxisMonthsAndDays()
      } else if (this.mode === 'day_hours') {
        this.initAxisDaysAndHours()
      }
    },

    initAxisMonthsAndDays() {
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      this.childPointCount = Math.floor(end.diff(start, 'day', true))
      while (start.isBefore(end)) {
        let dayCountOfMonth = start.isSame(end, 'month')
          ? end.date()
          : start.daysInMonth() - start.date() + 1
        let widthPercentage = (dayCountOfMonth / this.childPointCount) * 100
        let endDay =
          start.month() === end.month() ? end.date() : start.daysInMonth()
        this.axisPoints.push(
          this.getAxisMonthObject(start, widthPercentage, endDay)
        )
        start.add(1, 'month').date(1).hour(0)
      }
    },

    initAxisDaysAndHours() {
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      this.childPointCount = Math.floor(end.diff(start, 'hour', true))
      while (start.isBefore(end)) {
        let hourCountOfDay = start.isSame(end, 'day')
          ? end.hour()
          : 24 - start.hour()

        let widthPercentage = (hourCountOfDay / this.childPointCount) * 100
        let endHour = start.day() === end.day() ? end.hour() - 1 : 23 // -1 because the last hour is not included e.g if chartEnd=04:00 the last interval we display is between 03 and 04
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
      this.timemarker.style.left =
        event.clientX -
        this.timemarkerOffset -
        this.horizontalAxisContainer.left +
        'px'
    },

    onWindowResize() {
      this.horizontalAxisContainer = document
        .querySelector('#g-timeaxis')
        .getBoundingClientRect()
      this.hourFontSize =
        Math.min(
          9.5,
          0.75 * (this.horizontalAxisContainer.width / this.childPointCount)
        ) + 'px'
    },

    pointFormatted(point) {
      if (this.mode === 'month_days') {
        return this.monthFormatted(point)
      } else if (this.mode === 'day_hours') {
        return this.dayFormatted(point)
      }
    },

    monthFormatted(month) {
      // do not display month text if the month is smaller than x%
      return month.widthPercentage >= (1 / 32) * 100
        ? moment().locale(this.locale).localeData().months(month.value)
        : ''
    },

    dayFormatted(day) {
      // do not display day text if the day is smaller than 12%
      return day.widthPercentage >= 12
        ? moment(day.value).locale(this.locale).format(this.dayFormat)
        : ''
    },
  },

  watch: {
    chartStart() {
      this.initAxis()
    },
    chartEnd() {
      this.initAxis()
    },
  },
}
</script>

<style scoped>
#g-timeaxis,
.g-timeaxis-days,
.g-timeaxis-day,
.g-timeaxis-day > div {
  display: flex;
  overflow: hidden;
}

#g-timeaxis {
  position: sticky;
  top: 0;
  width: 100%;
  height: 8%;
  min-height: 75px;
  background: white;
  z-index: 4;
  box-shadow: 0px 1px 3px 2px rgba(50, 50, 50, 0.5);
}

#g-timeaxis > .g-timeaxis-empty-space {
  width: 20%; /* this has to be as wide as .ganttRowTitle in VGanttastic.css */
  height: 100%;
  background: #f5f5f5;
}

#g-timeaxis > .g-timeaxis-days {
  position: relative;
  width: 80%;
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
  width: 100%;
}

.g-timeaxis-hour-pin {
  width: 1px;
  height: 8px;
}

#g-timeaxis-marker {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 3px;
  background: black;
}
</style>

