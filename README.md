# vue-ganttastic

![screenshot](https://user-images.githubusercontent.com/4740535/143231164-88cd538f-f4ff-4fc6-8cb0-a25f4bab465c.png)

A simple and easy-to-use Gantt chart component for Vue.js

## Homepage

[Homepage of the project](https://infectoone.github.io/vue-ganttastic-homepage/#/docs)

[DEMO](https://tenrok.github.io/vue-ganttastic/)

## Installation

You can install and use Vue-Ganttastic in your project using <kbd>npm</kbd>:

```
npm install @tenrok/vue-ganttastic
```

[Moment.js](https://momentjs.com/) is a peer-dependency of Vue-Ganttastic. In order for Vue-Ganttastic to work correctly, you need to install it in your project:

```
npm install moment
```

## Basic Usage

Import the components `GGanttChart` and `GGanttRow`.
Use `g-gantt-chart` in your template, pass the desired chart start and chart end time as props (`chart-start` and `chart-end`) and add `g-gantt-row`s
to the default template slot.
Pass an array containing your bar objects to every row using the `bars` prop, while specifying the name of the properties in your bar objects that stand for the bar start and bar end time using the props `bar-start` and `bar-end`

For more detailed information, such as how to style the bars or additional configuration options, please refer to the [docs](https://infectoone.github.io/vue-ganttastic-homepage/#/docs) on the project's homepage (coming soon).

The following code showcases a simple usage example in a .vue SFC (Single File Component)

```html
<template>
  ...

  <g-gantt-chart
    :chart-start="myChartStart"
    :chart-end="myChartEnd"
    day-format="dddd, DD. MMMM"
    precision="day"
    :is-magnetic="true"
    locale="en"
  >
    <g-gantt-row
      v-for="row in rows"
      :key="row.label"
      :label="row.label"
      :label-style="row.labelStyle"
      :bars="row.bars"
      bar-start="myStart"
      bar-end="myEnd"
    />
  </g-gantt-chart>

  ...
</template>

<script>
  import { GGanttChart, GGanttRow } from '@tenrok/vue-ganttastic'

  export default {

    ...

    components: {
      GGanttChart,
      GGanttRow
    },

    data() {
      return {
        myChartStart: "2020-03-01 00:00",
        myChartEnd: "2020-03-03 00:00",
        rows: [
          {
            label: "My row #1",
            labelStyle: {
              justifyContent: "end"
            },
            bars: [
              {
                myStart: "2020-03-01 12:10",
                myEnd: "2020-03-01 16:35"
              }
            ]
          },
          {
            label: "My row #2",
            bars: [
              {
                myStart: "2020-03-02 01:00",
                myEnd: "2020-03-02 12:00"
              },
              {
                myStart: "2020-03-02 13:00",
                myEnd: "2020-03-02 22:00"
              }
            ]
          }
        ]
      }
    }

    ...

  }
</script>

<style lang="scss">
  @import '~@tenrok/vue-ganttastic/dist/vue-ganttastic.css';

  /* Custom */
  .g-gantt-line-highlighted {
    background: #ffb0b0 !important;
  }
</style>
```

## Props

| Prop                     | Type            | Default          | Description                                                         |
| ------------------------ | --------------- | ---------------- | ------------------------------------------------------------------- |
| allow-add                | `Boolean`       | `true`           | allow to add new bar on double click                                |
| bar-config-key           | `String`        | `ganttBarConfig` |                                                                     |
| bar-start-key            | `String`        | `start`          | property name of the bar objects that represents the start datetime |
| bar-end-key              | `String`        | `end`            | property name of the bar objects that represents the end datetime   |
| chart-start (_required_) | `String`        | -                | format `YYYY-MM-DD HH:mm`                                           |
| chart-end (_required_)   | `String`        | -                | format `YYYY-MM-DD HH:mm`                                           |
| day-format               | `String`        | `ddd DD MMMM`    |                                                                     |
| grid                     | `Boolean`       | `false`          | hide/show grid                                                      |
| grid-size                | `Number`        | `30`             | horizontal cell width in pixels                                     |
| default-bar-length       | `Number`        | `1`              |                                                                     |
| height                   | `String`        | -                | the total height of the entire Vue-Ganttastic component             |
| hide-timeaxis            | `Boolean`       | `false`          | hide timeaxis                                                       |
| highlighted-days         | `Array<String>` | `[]`             | format of day `YYYY-MM-DD`                                          |
| highlighted-hours        | `Array<Number>` | `[]`             |                                                                     |
| is-magnetic              | `Boolean`       | -                | magnetic effect                                                     |
| locale                   | `String`        | `en`             | localization                                                        |
| min-gap-between-bars     | `Number`        | `0`              |                                                                     |
| month-format             | `String`        | `MMMM YYYY`      |                                                                     |
| precision                | `String`        | `month`          | day, month                                                          |
| push-on-overlap          | `Boolean`       | -                |                                                                     |
| row-height               | `Number`        | `40`             |                                                                     |
| row-label-width          | `Number`        | `200`            | label width in pixels                                               |
| snap-back-on-overlap     | `Boolean`       | -                |                                                                     |
| theme                    | `String`        | `default`        |                                                                     |
| width                    | `String`        | `100%`           | the total width of the entire Vue-Ganttastic component              |

## Contributing

Pull requests are warmly welcomed, while every major change or proposal ought to be discussed in an issue first. As the project is still new, I will gladly accept suggestions, proposals, contributions etc.

### Contributing - How to run the project

1. Clone the project
2. Install the Vue CLI service, if you don't already have it installed:
   ```
   npm install -g @vue/cli
   ```
3. `App.vue` is a dedicated Vue SFC where all Vue-Ganttastic features can be
   played around with and tested out. Get it running using:
   ```
   npm run serve
   ```

## Dependencies

[Moment.js](https://momentjs.com/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
