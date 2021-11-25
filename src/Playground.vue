<!-- use Playground.vue to play around with the gantt chart components and test out new features -->
<template>
  <div>
    <g-gantt-chart
        :chart-start="chartStart"
        :chart-end="chartEnd"
        :grid="grid"
        :hide-timeaxis="hideTimeaxis"
        :push-on-overlap="true"
        snap-back-on-overlap
        :highlighted-hours="highlightedHours"
        :row-label-width="`${rowLabelWidth}%`"
        :row-height="rowHeight"
        :theme="selectedTheme"
        @dragend-bar="onDragend($event)"
      >
        <template v-for="row in vehicules">
          <g-gantt-row 
            :key="row.label"
            :label="row.label"
            :bars="row.mouvements"
            :highlight-on-hover="highlightOnHover"
            bar-start="mouvementDebut"
            bar-end="mouvementFin"
            mouvement-type="mouvementType"
          >
            <template #bar-label="{bar}">
              <span>{{bar.label}}</span>
            </template>
          </g-gantt-row>
        </template>
      </g-gantt-chart>
  </div>
</template>

<script>
import GGanttChart from './GGanttChart.vue'
import GGanttRow from './GGanttRow.vue'
import mouvementService from "./service/mouvementService";

export default {
  components:{
    GGanttChart,
    GGanttRow
  },
  data(){
    return {
      chartStart: "2020-03-02 00:00",
      chartEnd: "2020-03-04 00:00",
      grid: true,
      rowHeight: 40,
      rowLabelWidth: 15,
      hideTimeaxis: false,
      highlightOnHover: false,
      hours: [...Array(24).keys()],
      highlightedHours: [10,12],
      showContextmenu: false,
      contextmenuTimeout: null,
      contextmenuX: 0,
      contextmenuY: 0,
      selectedTheme: "default",
      themes: [
        "default",
        "vue",
        "dark",
        "material-blue",
        "creamy",
        "slumber",
        "sky",
        "crimson",
        "grove",
        "fuchsia",
        "flare"
      ],
      vehicules:[],
    }
  },
  created : function() {
    mouvementService.updateMouvements(this.vehicules)
  },
  methods: {
    onDragend(e){
      console.log(e)
    }
  }
}
</script>

<style>

</style>