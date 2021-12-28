# vue-ganttastic

![screenshot](https://user-images.githubusercontent.com/28678851/146654694-bd004ba5-80b3-4e4c-b7b4-e08c8a29853d.png)

A simple and easy-to-use Gantt chart component for Vue 3


## Installation
**This is the branch for Vue-Ganttastic v2 (Vue 3 + TypeScript support). Vue-Ganttastic v2 is still in alpha. For the v1 (Vue 2) version, read the README provided in [this branch](https://github.com/InfectoOne/vue-ganttastic/tree/master).**

You can install and use Vue-Ganttastic in your project using <kbd>npm</kbd>:

```
npm install @infectoone/vue-ganttastic
```  
This will install `vue-ganttastic` as a Vue plugin, which automatically globally registers the components you will need (`g-gantt-chart` and `g-gantt-row`).

## Basic Usage

1. Initalize the plugin in the starting point of your app (most likely `src/main.js`):
```javascript
import plugin from '@infectoone/vue-ganttastic'
...
createApp(App)
  .use(plugin)
  .mount('#app')
```

2. Use `g-gantt-chart` in your template, pass the desired chart start and chart end time as props (`chart-start` and `chart-end`). 
3. For each bar you would like to render, you will need an object. Any plain JavaScript/TypeScript object will work, as long as these requirements are fulfilled:  
  - the object must contain two `string` properties which stand for the
  bar begin time and bar end time respectively
  - a `ganttBarConfig` nested object with an unique `id` string property. You can use this nested object to configure the appearance and other features of your bar
4. Add `g-gantt-row`s to the default template slot of `g-gantt-chart`.
Pass an array containing your bar objects to every row using the `bars` prop.

The following code showcases a simple usage example in a .vue SFC (Single File Component)

```html
<template>
  ...

   <g-gantt-chart
    chart-start="2021-07-11 12:00"
    chart-end="2021-07-15 12:00"
    precision="hour"
    width="1400px"
    bar-start="beginDate"
    bar-end="endDate"
    push-on-overlap
  >
    <g-gantt-row
      label="My row 1"
      :bars="bars1"
    />
    <g-gantt-row
      label="My row 2"
      :bars="bars2"
    />
  </g-gantt-chart>

  ...
</template>

<script setup lang="ts">

import { ref } from "vue"

const bars1 = ref([
  {
    beginDate: "2021-04-27 13:00",
    endDate: "2021-05-27 19:00",
    ganttBarConfig: {
      id: "test2",
      label: "Lorem ipsum dolor",
    }
  }
])
const bars2 = ref([
  {
    beginDate: "2021-01-26 00:00",
    endDate: "2021-04-27 02:00",
    ganttBarConfig: {
      id: "test3",
      hasHandles: true,
      label: "Hey",
      style: {
        background: "#e09b69",
        borderRadius: "20px"
      }
    }
  },
  {
    beginDate: "2021-05-27 13:00",
    endDate: "2021-07-27 19:00",
    ganttBarConfig: {
      id: "test4",
      label: "Lorem ipsum dolor",
      style: {
        background: "cyan",
        borderRadius: "20px"
      }
    }
  }
])
</script>
```

## Props
 **(Incomplete) Full documentation page coming soon ...**
| Prop                     | Type            | Default                               | Description                                                         |
| ------------------------ | --------------- | ------------------------------------- | ------------------------------------------------------------------- |
| bar-start                | `string`        | `start`                               | Property name of the bar objects that represents the start datetime |
| bar-end                  | `string`        | `end`                                 | Property name of the bar objects that represents the end datetime   |
| chart-start (_required_) | `string`        | -                                     | Starting datetime of the chart format `YYYY-MM-DD HH:mm`|           |
| chart-end (_required_)   | `string`        | -                                     | Ending datetime of the chart format `YYYY-MM-DD HH:mm`|             |
| grid                     | `boolean`       | `false`                               | Hide/show grid in background                                        |
| row-height                   | `number`        | -                                 | Height of the chart's rows                                          |
| hide-timeaxis            | `Boolean`       | `false`                               | Toggles visibility of the upper time-axis                           |
| highlighted-units        | `Array<number>` | `[]`                                  | Specifies which time units will be highlighted with a half-transparent backround color in the chart |
| precision                | `string`        | `day`                               | Specified the precision of the time-units displayed in the upper time-axis. Possible values: `hour`, `day`, `month`                                                         |
| push-on-overlap          | `Boolean`       | -                                     |   Specifies whether the bars should push each other if they overlap while being dragged                                                                  |
| row-height               | `Number`        | `40`                                  | Height of the chart's rows                                          |
| color-scheme             | `string`        | `default`                             | Theme colors of the chart. Possible values: see `components/color-schemes.ts`                                                                    |
| width                    | `string`        | `1200px`                                | The total width of the entire Vue-Ganttastic component              |

## Contributing
  Instructions coming soon ...

## Dependencies

[day.js](https://day.js.org/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
