<template>
  <div>
    <div 
      class="g-gantt-bar" 
      ref="g-gantt-bar"
      :style="barStyle"
      @mouseenter.stop="onMouseenter($event)"
      @mouseleave.stop ="onMouseleave($event)"
      @mousedown.stop="onMousedown($event)"
      @click.stop="onClick($event)"
      @dblclick="onDblclick($event)"
      @contextmenu="onContextmenu($event)"
    >
      <div class="g-gantt-bar-label">
        <slot 
          name="bar-label"
          :bar="bar"
        >
          {{barConfig.label || ""}}
        </slot>
      </div>
      <template v-if="barConfig.handles">
        <div class="g-gantt-bar-handle-left"/>
        <div class="g-gantt-bar-handle-right"/>
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
          :style="{background: this.barStyle.background || this.barStyle.backgroundColor}"
        />
        {{bar[barStart] | TimeFilter}}
        - 
        {{bar[barEnd] | TimeFilter}}
      </div>
    </transition>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "GGanttBar",

  props:{
    bar: {type: Object},
    barStart: {type: String}, // property name of the bar objects that represents the start datetime
    barEnd: {type: String}, // property name of the bar objects that represents the end datetime,
    barContainer: [Object, DOMRect],
    allBarsInRow: {type: Array}
  },

  inject: [
    "getHourCount",
    "ganttChartProps",
    "initDragOfBarsFromBundle",
    "moveBarsFromBundleOfPushedBar",
    "setDragLimitsOfGanttBar",
    "onBarEvent",
    "onDragendBar",
    "getMinGapBetweenBars",
  ],

  data(){
    return {
      showTooltip: false,
      tooltipTimeout: null,
      dragLimitLeft: null,
      dragLimitRight: null,
      isDragging: false,
      isMainBarOfDrag: false, // is this the bar that was clicked on when starting to drag
                              // or is it dragged along some other bar from the same bundle
      cursorOffsetX: 0,
      mousemoveCallback: null,  // gets initialized when starting to drag
                                // possible values: drag, dragByHandleLeft, dragByHandleRight,
      barStartBeforeDrag: null,
      barEndBeforeDrag: null,
    }
  },

  computed:{
    // use these computed moment objects to work with the bar's start/end dates:
    // instead of directly mutating them:
    barStartMoment:{
      get(){
        return moment(this.bar[this.barStart])
      },
      set(value){
        this.bar[this.barStart] = moment(value).format("YYYY-MM-DD HH:mm:ss")
      }
    },

    barEndMoment: {
      get(){
        return moment(this.bar[this.barEnd])
      },
      set(value){
        this.bar[this.barEnd] = moment(value).format("YYYY-MM-DD HH:mm:ss")
      }
    },

    barConfig(){
      if(this.bar.ganttBarConfig) {
        return {
          ...this.bar.ganttBarConfig,
          background: this.bar.ganttBarConfig.isShadow ? "grey" : this.bar.ganttBarConfig.background || this.bar.ganttBarConfig.backgroundColor,
          opacity: this.bar.ganttBarConfig.isShadow ? "0.3" : this.bar.ganttBarConfig.opacity
        }
      }
      return {}
    },

    barStyle(){ 
      let xStart = this.mapTimeToPosition(this.barStartMoment)
      let xEnd = this.mapTimeToPosition(this.barEndMoment)
      return {
        ...(this.barConfig || {}),
        left: `${xStart}px`,
        width: `${xEnd - xStart}px`,
        height: `${this.ganttChartProps.rowHeight - 6}px`,
        zIndex: this.barConfig.zIndex || (this.isDragging ? 2 : 1)
      }
    },

    tooltipStyle(){
      return{
        left: this.barStyle.left,
        top:`${this.ganttChartProps.rowHeight}px`,
      }
    },

    chartStartMoment(){
      return moment(this.ganttChartProps.chartStart)
    },

    chartEndMoment(){
      return moment(this.ganttChartProps.chartEnd)
    }
  },

  methods:{

    onMouseenter(e){
      if(this.tooltipTimeout){
        clearTimeout(this.tooltipTimeout)
      }
      this.tooltipTimeout = setTimeout(() => this.showTooltip = true, 800)
      this.onBarEvent({event: e, type: e.type}, this)
    },

    onMouseleave(e){
      clearTimeout(this.tooltipTimeout)
      this.showTooltip = false
      this.onBarEvent({event: e, type: e.type}, this)
    },

    onContextmenu(e){
      const time = this.mapPositionToTime(e.clientX - this.barContainer.left).format("YYYY-MM-DD HH:mm:ss")
      this.onBarEvent({event: e, type: e.type, time}, this)
    },

    onClick(e){
      const time = this.mapPositionToTime(e.clientX - this.barContainer.left).format("YYYY-MM-DD HH:mm:ss")
      this.onBarEvent({event: e, type: e.type, time}, this)
    },

    onDblclick(e) {
      const time = this.mapPositionToTime(e.clientX - this.barContainer.left).format("YYYY-MM-DD HH:mm:ss")
      this.onBarEvent({event: e, type: e.type, time}, this)
    },

    onMousedown(e){
      e.preventDefault()
      if(e.button === 2){
        return
      }
      if(!this.barConfig.immobile && !this.barConfig.isShadow) {
        this.setDragLimitsOfGanttBar(this)
        // initialize the dragging on next mousemove event:
        window.addEventListener("mousemove", this.onFirstMousemove, {once: true})
        // if next mousemove happens after mouse up (if user just presses mouse button down, then up, without moving):
        window.addEventListener("mouseup",
          () => window.removeEventListener("mousemove", this.onFirstMousemove), 
          {once: true}
        )
      }
      const time = this.mapPositionToTime(e.clientX - this.barContainer.left).format("YYYY-MM-DD HH:mm:ss")
      this.onBarEvent({event: e, type: e.type, time}, this)
    },

    onFirstMousemove(e){
      this.isMainBarOfDrag = true
      // this method is injected here by GGanttChart.vue, and calls initDrag()
      // for all GGanttBars that belong to the same bundle as this bar:
      this.initDragOfBarsFromBundle(this, e)
    },

    /* --------------------------------------------------------- */
    /* ------------- METHODS FOR DRAGGING THE BAR -------------- */
    /* --------------------------------------------------------- */
    initDrag(e){  // "e" must be the mousedown event
      this.isDragging = true
      this.barStartBeforeDrag = this.bar[this.barStart]
      this.barEndBeforeDrag = this.bar[this.barEnd]
      let barX = this.$refs["g-gantt-bar"].getBoundingClientRect().left
      this.cursorOffsetX = e.clientX - barX
      let mousedownType = e.target.className
      switch(mousedownType){
        case "g-gantt-bar-handle-left":
          document.body.style.cursor = "w-resize"
          this.mousemoveCallback = this.dragByHandleLeft
          break
        case "g-gantt-bar-handle-right":
          document.body.style.cursor = "w-resize"
          this.mousemoveCallback = this.dragByHandleRight
          break
        default: this.mousemoveCallback = this.drag
      }
      window.addEventListener("mousemove", this.mousemoveCallback)
      window.addEventListener("mouseup", this.endDrag)
    },

    drag(e){
      let barWidth = this.$refs["g-gantt-bar"].getBoundingClientRect().width
      let newXStart = (e.clientX-this.barContainer.left) - this.cursorOffsetX
      let newXEnd = newXStart + barWidth
      if(this.isPosOutOfDragRange(newXStart, newXEnd)){
        return
      }
      this.barStartMoment = this.mapPositionToTime(newXStart)
      this.barEndMoment = this.mapPositionToTime(newXEnd)
      this.manageOverlapping()
      this.onBarEvent({event: e, type: "drag"}, this)
    },

    dragByHandleLeft(e){
      let newXStart = e.clientX - this.barContainer.left
      let newStartMoment = this.mapPositionToTime(newXStart)
      if(newStartMoment.isSameOrAfter(this.barEndMoment) || this.isPosOutOfDragRange(newXStart, null)){
        return
      }
      this.barStartMoment = newStartMoment
      this.manageOverlapping()
    },

    dragByHandleRight(e){
      let newXEnd = e.clientX - this.barContainer.left
      let newEndMoment = this.mapPositionToTime(newXEnd)
      if(newEndMoment.isSameOrBefore(this.barStartMoment) || this.isPosOutOfDragRange(null, newXEnd)){
        return
      }
      this.barEndMoment = newEndMoment
      this.manageOverlapping()
    },

    isPosOutOfDragRange(xStart, xEnd){
      if(!this.ganttChartProps.pushOnOverlap) {
        return false
      }
      if(xStart && this.dragLimitLeft !== null && xStart < this.dragLimitLeft + this.getMinGapBetweenBars()){
        return true
      }
      if(xEnd && this.dragLimitRight !== null && xEnd > this.dragLimitRight - this.getMinGapBetweenBars()){
        return true
      }
      return false
    },

    endDrag(e){
      this.isDragging = false
      this.dragLimitLeft = null
      this.dragLimitRight = null
      document.body.style.cursor = "auto"
      window.removeEventListener("mousemove", this.mousemoveCallback)
      window.removeEventListener("mouseup", this.endDrag)
      if(this.isMainBarOfDrag){
        this.onDragendBar(e, this)
        this.isMainBarOfDrag = false
      }
    },

    snapBack(){
      this.barStartMoment = this.barStartBeforeDrag
      this.barEndMoment = this.barEndBeforeDrag
    },

    manageOverlapping(){
      if(!this.ganttChartProps.pushOnOverlap || this.barConfig.pushOnOverlap === false){
        return
      }
      let currentBar = this.bar
      let {overlapBar, overlapType} = this.getOverlapBarAndType(currentBar)
      while(overlapBar){
        let minuteDiff
        let currentStartMoment = moment(currentBar[this.barStart])
        let currentEndMoment = moment(currentBar[this.barEnd])
        let overlapStartMoment = moment(overlapBar[this.barStart])
        let overlapEndMoment  = moment(overlapBar[this.barEnd])
        switch(overlapType){
          case "left":
            minuteDiff = overlapEndMoment.diff(currentStartMoment, "minutes", true) + this.getMinGapBetweenBars()
            overlapBar[this.barEnd] = currentStartMoment.subtract(this.getMinGapBetweenBars(), "minutes", true).format("YYYY-MM-DD HH:mm:ss")
            overlapBar[this.barStart] = overlapStartMoment.subtract(minuteDiff, "minutes", true).format("YYYY-MM-DD HH:mm:ss")
            break
          case "right":
            minuteDiff = currentEndMoment.diff(overlapStartMoment, "minutes", true) + this.getMinGapBetweenBars()
            overlapBar[this.barStart] = currentEndMoment.add(this.getMinGapBetweenBars(), "minutes", true).format("YYYY-MM-DD HH:mm:ss")
            overlapBar[this.barEnd] = overlapEndMoment.add(minuteDiff, "minutes", true).format("YYYY-MM-DD HH:mm:ss")
            break
          default:
            // eslint-disable-next-line
            console.warn("One bar is inside of the other one! This should never occur while push-on-overlap is active!")
            return
        }
        this.moveBarsFromBundleOfPushedBar(overlapBar, minuteDiff, overlapType)
        currentBar = overlapBar;
        ({overlapBar, overlapType} = this.getOverlapBarAndType(overlapBar))
      }
    },

    getOverlapBarAndType(bar){
      let barStartMoment = moment(bar[this.barStart])
      let barEndMoment = moment(bar[this.barEnd])
      let overlapLeft, overlapRight, overlapInBetween
      let overlapBar = this.allBarsInRow.find(otherBar => {
        if(otherBar === bar || otherBar.ganttBarConfig.pushOnOverlap === false){
          return false
        }
        let otherBarStart = moment(otherBar[this.barStart])
        let otherBarEnd = moment(otherBar[this.barEnd])
        overlapLeft = barStartMoment.isBetween(otherBarStart, otherBarEnd) 
        overlapRight = barEndMoment.isBetween(otherBarStart, otherBarEnd)
        overlapInBetween = otherBarStart.isBetween(barStartMoment, barEndMoment)
                          || otherBarEnd.isBetween(barStartMoment, barEndMoment)
        return overlapLeft || overlapRight || overlapInBetween
      })
      let overlapType = overlapLeft ? "left" : (overlapRight ? "right" : (overlapInBetween ? "between" : null))
      return {overlapBar, overlapType}
    },

    // this is used in GGanttChart, when a bar from a bundle is pushed
    // so that bars from its bundle also get pushed
    moveBarByMinutesAndPush(minuteCount, direction){
      switch(direction){
        case "left":
          this.barStartMoment = moment(this.barStartMoment).subtract(minuteCount, "minutes", true)
          this.barEndMoment = moment(this.barEndMoment).subtract(minuteCount, "minutes", true)
          break
        case "right":
          this.barStartMoment = moment(this.barStartMoment).add(minuteCount, "minutes", true)
          this.barEndMoment = moment(this.barEndMoment).add(minuteCount, "minutes", true)
          break
        default:
          // eslint-disable-next-line
          console.warn("wrong direction in moveBarByMinutesAndPush")
          return
      }
      this.manageOverlapping()
    },

    /* --------------------------------------------------------- */
    /* ------- MAPPING POSITION TO TIME (AND VICE VERSA) ------- */
    /* --------------------------------------------------------- */
    mapTimeToPosition(time){
      let hourDiffFromStart = moment(time).diff(this.chartStartMoment, "hour", true)
      return (hourDiffFromStart / this.getHourCount()) * this.barContainer.width
    },

    mapPositionToTime(xPos){
      let hourDiffFromStart = (xPos/this.barContainer.width)*this.getHourCount()
      return this.chartStartMoment.clone().add(hourDiffFromStart, "hours")
    },
  },

  filters:{
    TimeFilter(value){
      return moment(value).format("HH:mm")
    }
  }

}
</script>

<style scoped>
  .g-gantt-bar {
    position: absolute;
    top: 2px;
    left: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    width: 300px;
    height: 34px;
    border-radius: 15px;
    background: #79869c;
    overflow: hidden;
  }

  .g-gantt-bar-label {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 14px 0 14px;   /* 14px is the width of the handle */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .g-gantt-bar-label > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .g-gantt-bar > .g-gantt-bar-handle-left, .g-gantt-bar > .g-gantt-bar-handle-right {
    position: absolute;
    width: 10px;
    height: 100%;
    background: white;
    opacity: 0.7;
    border-radius: 40px;
    cursor: w-resize;
  }

  .g-gantt-bar-handle-left {
    left: 0;
  }

  .g-gantt-bar-handle-right {
    right: 0;
  }

  .g-gantt-bar-label img {
    pointer-events: none;
  }

  .g-gantt-tooltip{
    position: absolute;
    background: black;
    color: white;
    z-index: 3;
    font-size: 0.70em;
    padding: 3px;
    border-radius: 3px;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
  }

  .g-gantt-tooltip:before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom-color: black;
    border-top: 0;
    margin-left: -5px;
    margin-top: -5px;
  }

  .g-gantt-tooltip > .color-indicator {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    margin-right: 4px;
  }

  .fade-enter-active {
    animation: fade-in .3s;
  }

  .fade-leave-active {
    animation: fade-in .3s reverse;
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
    } to {
      opacity: 1;
    }
  }
</style>