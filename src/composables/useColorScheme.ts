import { colorSchemes } from "@/components/color-schemes"
import { computed } from "vue"
import { GGanttChartPropsRefs } from "./../models/GanttBarObject"

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
