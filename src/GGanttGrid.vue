<template>
  <div 
    class="g-grid-container"
    :style="{
      left: rowLabelWidth,
      width: `${100-(this.rowLabelWidth).replace('%','')}%`
    }"
  >
    <div 
      v-for="(hour,index) in allHours"
      :key="index"
      :class="{
        'g-grid-line': true,
        'g-grid-line-highlighted': highlightedHours.includes(hour)
      }"
    />
  </div>
</template>

<script>
import moment from 'moment'

export default {

  name: "GGanttGrid",
  
  props: {
    chartStart: {type: String},
    chartEnd: {type: String},
    rowLabelWidth: String,
    highlightedHours: {type: Array, default: () => []}
  },

  computed: {
    allHours(){
      let momentChartStart = moment(this.chartStart)
      let momentChartEnd = moment(this.chartEnd)
      let res = []
      while(momentChartStart.isSameOrBefore(momentChartEnd)){
        res.push(momentChartStart.hour())
        momentChartStart.add(1,"hour")
      }
      return res
    }

  }
  
}
</script>

<style scoped>
  .g-grid-container{
    position: absolute;
    top: 0;
    left: 30%; /* must correspond to width of row title */
    width: 70%;
    height: calc(100% - 23px);
    display: flex;
    justify-content: space-between;
  }

  .g-grid-line{
    width: 1px;
    height: 100%;
    background: #eaeaea;
  }

  .g-grid-line-highlighted{
    background: #90CAF9;
    box-shadow: 0px 0px 0px 1px #90CAF9;
  }
</style>
