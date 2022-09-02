import { createApp } from "vue"
import Playground from "./GanttPlayground.vue"
import ganttastic from "./index"

createApp(Playground).use(ganttastic).mount("#app")
