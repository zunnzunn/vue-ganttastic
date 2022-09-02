import { defineClientConfig } from '@vuepress/client'
import ganttastic from "../../src/index"

// see: https://v2.vuepress.vuejs.org/advanced/cookbook/usage-of-client-config.html
export default defineClientConfig({
  enhance({ app, router, siteData }){
    app.use(ganttastic)
  },
})
