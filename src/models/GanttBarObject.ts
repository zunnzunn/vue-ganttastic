type GanttBarObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any,
  ganttBarConfig: {
    label?: string,
    hasHandles?: true,
    style?: {
      background?: string,
      borderRadius?: string,
    }
  }
}

export default GanttBarObject
