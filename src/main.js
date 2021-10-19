import Vue from 'vue'
import App from './App.vue'
import { GGanttChart, GGanttRow } from '../lib'

Vue.component('GGanttChart', GGanttChart)
Vue.component('GGanttRow', GGanttRow)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
