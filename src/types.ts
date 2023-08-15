import type { CSSProperties } from "vue"

export type GanttBarObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  ganttBarConfig: {
    id: string
    label?: string
    hasHandles?: boolean
    immobile?: boolean
    bundle?: string
    pushOnOverlap?: boolean
    dragLimitLeft?: number
    dragLimitRight?: number
    style?: CSSProperties
    class?: string
  }
}
