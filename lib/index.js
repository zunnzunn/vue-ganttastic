import GGanttChart from './components/GGanttChart.vue'
import GGanttRow from './components/GGanttRow.vue'
import './scss/index.scss'

const VueGanttastic = { GGanttChart, GGanttRow }

const install = Vue => {
  Object.keys(VueGanttastic).forEach(name => {
    Vue.component(name, VueGanttastic[name])
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default VueGanttastic

export { GGanttChart, GGanttRow }
