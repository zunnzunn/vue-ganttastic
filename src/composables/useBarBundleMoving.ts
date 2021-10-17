import { GanttBarObject, GGanttChartPropsRefs } from "@/models/GanttBarObject"
import { ComputedRef, ref } from "vue"
import useBarDrag from "./useBarDrag"

export default function useBarBundleMoving (
  allBarsInChart : ComputedRef<GanttBarObject[]>,
  gGanttChartPropsRefs: GGanttChartPropsRefs
) {
  const movedBarsInDrag = new Set<GanttBarObject>()
  if (!allBarsInChart) {
    throw new Error("useBarBundleMoving: Provide/Inject of values from GGanttChart failed!")
  }
  /*
  const getBarsFromBundle = (bundle: string) => {
    if (bundle == null) {
      return []
    }
    return allBarsInChart.value.filter(ganttBarChild => ganttBarChild.barConfig.bundle === bundle)
  }
  */

  const initDragOfBarsFromBundle = (bundle: string, e: MouseEvent) => {
    if (bundle != null) {
      allBarsInChart.value.forEach(bar => {
        if (bar.ganttBarConfig.bundle === bundle) {
          const { initDrag } = useBarDrag(ref(bar), ref([]), gGanttChartPropsRefs)
          initDrag(e)
          movedBarsInDrag.add(bar)
        }
      })
    }
  }
  /*
  const moveBarsFromBundleOfPushedBar = (pushedBar: GanttBarObject, minuteDiff, overlapType) => {
    movedBarsInDrag.add(pushedBar)
    const bundleId = pushedBar.ganttBarConfig.bundle
    if (bundleId === undefined || bundleId === null) {
      return
    }
    this.getGanttBarChildrenList().forEach(ganttBarChild => {
      if (ganttBarChild.barConfig.bundle === bundleId && ganttBarChild.bar !== pushedBar) {
        ganttBarChild.moveBarByMinutesAndPush(minuteDiff, overlapType)
        this.movedBarsInDrag.add(ganttBarChild.bar)
      }
    })
  }
  */

  return {
    initDragOfBarsFromBundle
  }
}
