import Vue from 'vue'
import GGanttChart from './GGanttChart.vue'
import GGanttRow from './GGanttRow.vue'
import Playground from './Playground.vue'

let uniqId = '#vue-ganttastic-825301a1'

if (document.querySelector(uniqId)) {
  Vue.component('GGanttChart', GGanttChart)
  Vue.component('GGanttRow', GGanttRow)

  new Vue({
    el: uniqId,
    render: (h) => h(Playground),
  })
}

export { GGanttRow, GGanttChart }
