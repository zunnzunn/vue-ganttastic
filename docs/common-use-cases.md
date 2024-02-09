# Common use cases
 The following section provides a non-exhausting list of common use cases and special features of Vue Ganttastic with corresponding code snippets.

## Adding new bars
For each row of the chart, you will render a `g-gantt-row` component, which accepts a `bars` prop, which is an array of bar objects. Since the prop is reactive, all you need to do to add a new bar is to push a new bar-object into that array. Just make sure that the new bar-object has a nested `ganttBarConfig` object with a unique `id`, and don't forget to specify the property values for the start and end date of the bar (the properties' names must be the ones you passed to the `bar-start` and `bar-end` props of `g-gantt-chart`):
```vue 
<template>
  <g-gantt-chart
    chart-start="2021-07-11 12:00"
    chart-end="2021-07-15 12:00"
    precision="hour"
    width="100%"
    bar-start="myBeginDate"
    bar-end="myEndDate"
  >
    <g-gantt-row
      label="My row 1"
      :bars="myBarList"
    />
  </g-gantt-chart>
</template>

<script setup>

import { ref } from "vue"

const myBarList = ref([])
const addNewBar = () => {
  const bar = {
    myBeginDate: "2021-07-11 17:00",
    myEndDate: "2021-07-12 03:00",
    ganttBarConfig : {
      id: "some-id-blabla" // make sure this is unique!
    }
  }
  myBarList.push(bar)
}
</script>

```
## Configuring and styling bars
Your bar objects can be of any type and contain any properties you want. The only requirements are:
- a datetime-string property for the bar start date
- a datetime-string property for the bar end date
- a nested object `ganttBarConfig` with a unique string property `id`

For further configuration, you can add some optional properties to the nested `ganttBarConfig` object:

| Property name         | Type    | Description           |
|-----------------------|---------|-----------------------|
| `id` | `string` | A unique string identifier for the bar.  (**mandatory**) 
| `label` | `string?`  | Text displayed on the bar.
| `label` | `string?`  | Optional HTML Code that will be rendered after the label (e.g. for tags). Please sanitize user input to avoid cross site scripting, if applicable.
| `hasHandles` | `boolean?`  | Used to toggle handles on the left and right side of the bar that can be dragged to change the width of the bar. |
| `immobile` | `boolean?`  | Used to toggle whether bar can be moved (dragged).
| `bundle` | `string?`  | A string identifier for a bundle. A bundle is a collection of bars that are dragged simultaneously.
| `style` | `CSSStyleSheet?`  | CSS-based styling for your bar (e.g `background`, `fontSize`, `borderRadius` etc.).

## Extending the width of a bar
Simply add `hasHandles: true` to the `ganttBarConfig` to make the bar extendable by dragging the handles on its left or right side.  

## Push bars when dragging
By default, bars can overlap with other bars while being dragged. If you would like to prevent this and have the bars "push" one another while dragging, use the `push-on-overlap` prop:
```vue 
  <g-gantt-chart
    ...
    push-on-overlap
    ...
  >
    ...
  </g-gantt-chart>
```

## Bundling bars together
If you want to bind a group of bars one to another so that when you drag one bar, all the others move together with it, specify a `bundle` string in the `ganttBarConfig` of each affected bar.

## Custom behavior on clicking/dragging a bar
It is completely up to you to specify which kind of behavior you would like e.g. when a bar is clicked on or when a bar-drag is ended. For this, you may use special events emitted by `g-gantt-chart`:
```vue
<g-gantt-chart
  ...
  @mousedown-bar="onMousedownBar($event.bar, $event.e, $event.datetime)"
  @dblclick-bar="onMouseupBar($event.bar, $event.e, $event.datetime)"
  @mouseenter-bar="onMouseenterBar($event.bar, $event.e)"
  @mouseleave-bar="onMouseleaveBar($event.bar, $event.e)"
  @dragstart-bar="onDragstartBar($event.bar, $event.e)"
  @drag-bar="onDragBar($event.bar, $event.e)"
  @dragend-bar="onDragendBar($event.bar, $event.e, $event.movedBars)"
  @contextmenu-bar="onContextmenuBar($event.bar, $event.e, $event.datetime)"
>
  ...
</g-gantt-chart>

<script setup lang="ts">
...
const onMousedownBar = (bar: GanttBarObject, e: MouseEvent, datetime?: string) => {
  // do something
}
...
</script>
```
## Drag and drop  
The `g-gantt-row` component comes with a special `drop` event, that you can use to implement custom drag-and-drop behavior. The event data also includes the `datetime` position on which the drop occured.
```vue
<g-gantt-chart
   ...
>
  <g-gantt-row
    label="This is my row"
    :bars="bars1"
    @drop="onDrop($event.e, $event.datetime)"
  />
</g-gantt-chart>

<script setup lang="ts">
...
const onDrop = (e: MouseEvent, datetime?: string) => {
  // do something
}
...
</script>
```

## Time axis precision
If the time-range (`chart-start` to `chart-end`) of your chart is very large, the displayed time units in the time axis might be too dense if the chart is not wide enough. You might want to specify the precision of the time axis accordingly. Use the `precision` prop of `g-gantt-chart` for this. Possible values are `hour`, `day` and `month`.

## Chart themes
Vue Ganttastic ships with several pre-made color schemes that you may specify using the `color-scheme` prop of `g-gantt-chart`. [List of available color-schemes](https://infectoone.github.io/vue-ganttastic/GGanttChart.html#color-schemes)

## Locale
Since Vue Ganttastic uses Day.js for all datetime manipulations, you can change the locale of Vue Ganttastic by [changing the global locale of Day.js](https://day.js.org/docs/en/i18n/changing-locale). You will usually do this in your `src/main.js` before you initialize the Ganttastic plugin.

