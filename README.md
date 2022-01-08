# vue-ganttastic
<img src="https://user-images.githubusercontent.com/28678851/77186503-45358300-6ad3-11ea-9392-7f670eb1ca8c.png" width="600"/>

A simple and easy-to-use Gantt chart component for Vue.js

**Using Vue 3? Check out the [Vue-Ganttastic v2](https://github.com/InfectoOne/vue-ganttastic/tree/master) and the corresponding [npm package](https://www.npmjs.com/package/@infectoone/vue-ganttastic).**

## Homepage
[Homepage of the project](https://infectoone.github.io/vue-ganttastic-homepage/#/docs)

## Installation
You can install and use Vue-Ganttastic in your project using <kbd>npm</kbd>:
```
npm install vue-ganttastic
```

[Moment.js](https://momentjs.com/) is a peer-dependency of Vue-Ganttastic. In order for Vue-Ganttastic to work correctly, you need to install it in your project:
```
npm install moment
```

## Basic Usage
Import the components <code>GGanttChart</code> and <code>GGanttRow</code>.  
Use <code>g-gantt-chart</code> in your template, pass the desired chart start and chart end time as props (<code>chart-start</code> and <code>chart-end</code>) and add <code>g-gantt-row</code>s
to the default template slot.  
Pass an array containing your bar objects to every row using the <code>bars</code> prop, while specifying the name of the properties in your bar objects that stand for the bar start and bar end time using the props <code>bar-start</code> and <code>bar-end</code>  

For more detailed information, such as how to style the bars or additional configuration options, please refer to the [docs](https://infectoone.github.io/vue-ganttastic-homepage/#/docs) on the project's homepage (coming soon).

The following code showcases a simple usage example in a .vue SFC (Single File Component)
```html
<template>
  ...

  <g-gantt-chart
    :chart-start="myChartStart"
    :chart-end="myChartEnd"
  >
    <g-gantt-row
      v-for="row in rows"
      :key="row.label"
      :label="row.label"
      :bars="row.bars"
      bar-start="myStart"
      bar-end="myEnd"
    />
  </g-gantt-chart>

  ...
</template>

<script>

import {GGanttChart, GGanttRow} from 'vue-ganttastic'

export default {

  ...

  components:{
    GGanttChart,
    GGanttRow
  },

  data(){
    return {
      myChartStart: "2020-03-01 00:00",
      myChartEnd: "2020-03-03 00:00",
      rows: [
        {
          label: "My row #1",
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

```



## Contributing (run and build project)

  1. Clone the project
  2. Install the Vue CLI service, if you don't already have it installed:
      ```
        npm install -g @vue/cli
        npm install -g @vue/cli-service-global
      ```
  3. Install all dependencies:
      ```
      npm install
      ```
  3. <code>Playground.vue</code> is a dedicated Vue SFC where all    Vue-Ganttastic features can be
     played around with and tested out. Get it running using:
      ```
        vue serve src/Playground.vue
      ```

  4. To build the project:
      ```
        npx bili --bundle-node-modules
      ```
## Dependencies
[Moment.js](https://momentjs.com/)

## License
[MIT](https://choosealicense.com/licenses/mit/)
