import { defineClientAppEnhance } from "@vuepress/client"
import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isBetween from "dayjs/plugin/isBetween"
import customParseFormat from "dayjs/plugin/customParseFormat"
import ganttastic from "../../src/index"

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

export default defineClientAppEnhance(({ app, router, siteData }) => {
  dayjs.extend(isSameOrBefore)
  dayjs.extend(isSameOrAfter)
  dayjs.extend(isBetween)
  dayjs.extend(customParseFormat)
  app.use(ganttastic)
})
