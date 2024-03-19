import DefaultTheme from 'vitepress/theme'
import './custom.css'
import {ganttastic} from "../../../src/vue-ganttastic"

export default {
    extends: DefaultTheme,
    enhanceApp(ctx) {
        ctx.app.use(ganttastic)

    }
}