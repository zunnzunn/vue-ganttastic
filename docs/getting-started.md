# Getting started

## Install

You can add Vue Ganttastic to your project using <kbd>npm</kbd>:

```
npm install @infectoone/vue-ganttastic
```

Then, initalize the plugin in the starting point of your app (most likely `src/main.js`):

```javascript
import { createApp } from "vue"
import App from "./App.vue"
...
import ganttastic from '@infectoone/vue-ganttastic'
...
createApp(App)
  .use(ganttastic)
  .mount('#app')
```

This will globally register the components `g-gantt-chart` and `g-gantt-row` and you will be able to use those two components right away.

## Basic usage

```vue
<template>
  <g-gantt-chart
    chart-start="2021-07-12 12:00"
    chart-end="2021-07-14 12:00"
    precision="hour"
    bar-start="myBeginDate"
    bar-end="myEndDate"
  >
    <g-gantt-row label="My row 1" :bars="row1BarList" />
    <g-gantt-row label="My row 2" :bars="row2BarList" />
  </g-gantt-chart>
</template>

<script setup>
import { ref } from "vue"

const row1BarList = ref([
  {
    myBeginDate: "2021-07-13 13:00",
    myEndDate: "2021-07-13 19:00",
    ganttBarConfig: {
      // each bar must have a nested ganttBarConfig object ...
      id: "unique-id-1", // ... and a unique "id" property
      label: "Lorem ipsum dolor"
    }
  }
])
const row2BarList = ref([
  {
    myBeginDate: "2021-07-13 00:00",
    myEndDate: "2021-07-14 02:00",
    ganttBarConfig: {
      id: "another-unique-id-2",
      hasHandles: true,
      label: "Hey, look at me",
      style: {
        // arbitrary CSS styling for your bar
        background: "#e09b69",
        borderRadius: "20px",
        color: "black"
      }
    }
  }
])
</script>
```

The result shoud look like this:  
<g-gantt-chart chart-start="2021-07-12 12:00" chart-end="2021-07-14 12:00" precision="hour" width="100%" bar-start="myBeginDate" bar-end="myEndDate"> <g-gantt-row label="My row 1" :bars="row1BarList"/>
<g-gantt-row label="My row 2" :bars="row2BarList"/>
</g-gantt-chart>

<script setup>

import { ref } from "vue"

const row1BarList = ref([
  {
    myBeginDate: "2021-07-13 13:00",
    myEndDate: "2021-07-13 19:00",
    ganttBarConfig: {    // each bar must have a nested ganttBarConfig object ...
      id: "unique-id-1", // ... and a unique "id" property
      label: "Lorem ipsum dolor"
    }
  }
])
const row2BarList = ref([
  {
    myBeginDate: "2021-07-13 00:00",
    myEndDate: "2021-07-14 02:00",
    ganttBarConfig: {
      id: "another-unique-id-2",
      hasHandles: true,
      label: "Hey, look at me",
      style: {     
        // arbitrary CSS styling for your bar
        background: "#e09b69",
        borderRadius: "20px",
        color: "#000000"
      },
      class: "foo" // you can also add CSS classes to your bars!
    }
  }
])
</script>
