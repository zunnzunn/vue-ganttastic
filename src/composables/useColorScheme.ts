import { colorSchemes } from "../color-schemes"
import { computed } from "vue"
import { GGanttChartPropsRefs } from "../models/models"

export default function useColorScheme (
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const { colorScheme } = gGanttChartPropsRefs
  const colors = computed(() => {
    return colorSchemes[colorScheme.value] || colorSchemes.default
  })

  return {
    colors
  }
}
