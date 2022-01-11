import { defineClientAppEnhance } from "@vuepress/client"
import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isBetween from "dayjs/plugin/isBetween"
import customParseFormat from "dayjs/plugin/customParseFormat"
import weekOfYear from "dayjs/plugin/weekOfYear"
import advancedFormat from "dayjs/plugin/advancedFormat"
import ganttastic from "../../src/index"

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)

export default defineClientAppEnhance(({ app, router, siteData }) => {
  dayjs.extend(isSameOrBefore)
  dayjs.extend(isSameOrAfter)
  dayjs.extend(isBetween)
  dayjs.extend(customParseFormat)
  dayjs.extend(weekOfYear)
  dayjs.extend(advancedFormat)
  app.use(ganttastic)
})