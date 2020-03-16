<template>
  <div id="g-timeaxis">

    <div
      class="g-timeaxis-empty-space"
      :style="{width: rowLabelWidth, background: themeColors.secondary}"
    />
    <div 
      class="g-timeaxis-days"
      :style="{width: `${100-rowLabelWidth.replace('%','')}%`}"
    >
      <div 
        v-for="(day, index) in axisDays"
        :key="day.text"
        class="g-timeaxis-day"
        :style="{
          width: day.widthPercentage+'%', 
          background: index%2===0 ? themeColors.primary : themeColors.secondary,
          color: themeColors.text
        }"
      >
        <div> {{dayFormatted(day)}} </div>
        <div :style="{background: themeColors.ternary, color: themeColors.text}">
          <div 
            v-for="hour in day.ganttHours"
            :key="hour.fullDatetime"
            class="g-timeaxis-hour" 
          >
            <span :style="{fontSize: hourFontSize}">{{hour.text}}</span>
            <div 
              class="g-timeaxis-hour-pin"
              :style="{background: themeColors.text}"
            />
          </div>
        </div>
      </div>

    </div>
    <div id="g-timeaxis-marker"/>
    
  </div>
</template>

<script>
import moment from 'moment'

export default {

  name:"GGanttTimeaxis",

  props: {
    chartStart: String,
    chartEnd: String,
    rowLabelWidth: String,
    timemarkerOffset: {type: Number, default: 0},
    locale: String,
    themeColors: Object
  },

  data(){
    return {
      axisDays: [],
      hourCount: null,
      timemarker: null,
      hourFontSize: "11px",
      dayFormat: "dddd, DD. MMMM"
    }
  },

  mounted(){
    this.timemarker = document.querySelector("#g-timeaxis-marker")
    this.initAxisDaysAndHours()
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener("mousemove", (event) => this.moveTimemarker(event))
    window.addEventListener("dragover", (event) => this.moveTimemarker(event))
  },

  methods: {

    initAxisDaysAndHours(){
      this.axisDays = []
      let start = moment(this.chartStart)
      let end = moment(this.chartEnd)
      this.hourCount = Math.floor(end.diff(start, "hour", true))
      while(start.isBefore(end)){
        let hourCountOfDay = start.format("DD.MM.YYYY")==end.format("DD.MM.YYYY") ? end.hour() : 24-start.hour()
        let widthPercentage = hourCountOfDay/this.hourCount*100
        let endHour = start.day()===end.day() ? end.hour()-1 : 23   // -1 because the last hour is not included e.g if chartEnd=04:00 the last interval we display is between 03 and 04
        this.axisDays.push(this.getAxisDayObject(start, widthPercentage, endHour))
        start.add(1,"day").hour(0)
      }
    },

    getAxisDayObject(datetime, widthPercentage, endHour){
      let datetimeMoment = moment(datetime)
      let axisDayObject = {
        widthPercentage : widthPercentage,
        value : datetime.format("YYYY-MM-DD"),
        ganttHours : []
      }
      let startHour = datetimeMoment.hour()
      for(let i=0; i <=(endHour-startHour); i++) {
        let hour ={
          text: datetimeMoment.format("HH"),
          fullDatetime: datetimeMoment.format("DD.MM.YYYY HH:mm")
        }
        axisDayObject.ganttHours.push(hour)
        datetimeMoment.add(1,"hour")
      }
      return axisDayObject
    },

    moveTimemarker(event){
      this.timemarker.style.left = (event.clientX - this.timemarkerOffset - this.horizontalAxisContainer.left)+"px"
    },

    onWindowResize(){
      this.horizontalAxisContainer = document.querySelector("#g-timeaxis").getBoundingClientRect()
      this.hourFontSize = Math.min(9.5, 0.75*(this.horizontalAxisContainer.width/this.hourCount))+"px"
    },

    dayFormatted(day){  // do not display day text if the day is smaller than 12%
      return day.widthPercentage>=12 ? moment(day.value).locale(this.locale).format(this.dayFormat) : ""
    }

  },

  watch: {
    chartStart(){
      this.initAxisDaysAndHours()
    },
    chartEnd(){
      this.initAxisDaysAndHours()
    }
  }
}
</script>

<style scoped>
  #g-timeaxis, .g-timeaxis-days, .g-timeaxis-day, .g-timeaxis-day > div {
    display: flex;
    overflow: hidden;
  }

  #g-timeaxis {
    position: sticky;
    top:0;
    width: 100%;
    height: 8%;
    min-height: 75px;
    background: white;
    z-index: 4;
    box-shadow: 0px 1px 3px 2px rgba(50,50,50, 0.5);
  }

  #g-timeaxis > .g-timeaxis-empty-space {
    width: 20%;    /* this has to be as wide as .ganttRowTitle in VGanttastic.css */
    height: 100%;
    background: #F5F5F5;
  }

  #g-timeaxis > .g-timeaxis-days {
    position: relative;
    width: 80%;
    height: 100%,
  }

  .g-timeaxis-day {
    height: 100%;
    flex-direction: column;
    background: #E0E0E0;
  }

  .g-timeaxis-day:nth-child(odd) {
    background: #E8E8E8;
  }

  .g-timeaxis-day > div:nth-child(1) { /* day text */
    height: 50%;
    justify-content: space-around;
    font-weight: bold;
    align-items: center;
  }

  .g-timeaxis-day > div:nth-child(2) { /* hours of a day */
    align-items: flex-end;
    height: 50%;
    justify-content: space-between;
    background:#F5F5F5;
    padding-top:2px;
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
    top:0;
    left:0;
    height: 100%;
    width: 3px;
    background: black;
  }
</style>

