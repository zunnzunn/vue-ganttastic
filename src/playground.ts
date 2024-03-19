import { createApp } from "vue"
import Playground from "./GanttPlayground.vue"
import ganttastic from "./vue-ganttastic.js"

createApp(Playground).use(ganttastic).mount("#app")
