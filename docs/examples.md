
# Live Demos

## Simple hour chart  
- `precision`: `hour`
<g-gantt-chart chart-start="01.01.2022 12:00" chart-end="02.01.2022 12:00" precision="hour" grid width="100%" bar-start="beginDate" bar-end="endDate" date-format="DD.MM.YYYY HH:mm">
<g-gantt-row label="My row 1" :bars="hourBarList1" highlight-on-hover/>
<g-gantt-row label="Another row" :bars="hourBarList2" highlight-on-hover/>
</g-gantt-chart>

<button @click="addHourBar()" :disabled="hourBarList2.length > 0"> Add bar </button>
<button @click="deleteHourBar()" style="margin-left: 10px" :disabled="hourBarList2.length === 0"> Delete bar </button>



## Day chart with dark theme  
- `precision`: `day`
- `row-height` : `70`
- `no-overlap`
- `color-scheme` : `dark`

Used slots:
`g-gantt-row` >  `label`, `bar-label`
<g-gantt-chart chart-start="30.10.2022 12:00" chart-end="02.11.2022 13:00" precision="day" grid width="100%" :row-height="70" bar-start="beginDate" bar-end="endDate" date-format="DD.MM.YYYY HH:mm" color-scheme="dark" no-overlap>
<g-gantt-row label="Row label" :bars="dayBarList1" highlight-on-hover>
<template #bar-label="{bar}">
<img v-if="bar.imgSrc" :src="bar.imgSrc" height="30" width="30"/>
{{bar.ganttBarConfig.label}}
</template>
</g-gantt-row>
<g-gantt-row label="My row 2" :bars="[]" highlight-on-hover>
<template #label>
<img src='https://user-images.githubusercontent.com/28678851/148047714-301f07df-4101-48b8-9e47-1f272b290e80.png' height="30" width="30" style="padding-right:10px"/>
Label with image
</template>
</g-gantt-row>
</g-gantt-chart>



## Month chart pushing and bundles
- `precision`: `month`
- `push-on-overlap`
- `color-scheme` : `vue`
- `font` : `Courier`
<g-gantt-chart chart-start="01.01.2022 12:00" chart-end="15.03.2022 03:00" precision="month" grid width="100%" bar-start="beginDate" bar-end="endDate" date-format="DD.MM.YYYY HH:mm" color-scheme="vue" font="Courier" push-on-overlap>
<g-gantt-row label="My row 1" :bars="monthBarList1" highlight-on-hover/>
<g-gantt-row label="My row 2" :bars="monthBarList2" highlight-on-hover/>
<g-gantt-row label="Look at me!" :bars="monthBarList3" highlight-on-hover/>
<g-gantt-row label="Fourth row" :bars="[]" highlight-on-hover/>
</g-gantt-chart>



<script setup>
import { ref } from "vue"

const hourBarList1 = ref([
  {
    beginDate: "01.01.2022 15:00",
    endDate: "01.01.2022 19:45",
    ganttBarConfig: {
      id: "8621987329",
      label: "Drag me",
      style: {
        color: "white"
      }
    }
  },
  {
    beginDate: "01.01.2022 23:00",
    endDate: "02.01.2022 08:05",
    ganttBarConfig: {
      id: "8621987322",
      label: "Drag my handles",
      hasHandles: true,
      style: {
        background: "#d66f2a",
        color: "white"
      }
    }
  }
])

const hourBarList2 = ref([])

const dayBarList1 = ref([
  {
    beginDate: "31.10.2022 15:00",
    endDate: "01.11.2022 05:45",
    ganttBarConfig: {
      id: "a621987323",
      label: "Drag me",
      style: {
        background: "#cc2a2d",
        color: "white"
      }
    }
  },
  {
    beginDate: "01.11.2022 09:00",
    endDate: "02.11.2022 08:00",
    imgSrc: "https://user-images.githubusercontent.com/28678851/148047714-301f07df-4101-48b8-9e47-1f272b290e80.png",
    ganttBarConfig: {
      id: "x21987322",
      label: "I have an image",
      hasHandles: true,
      style: {
        background: "#e2e595",
        color: "black",
        borderRadius: "40px"
      }
    }
  }
])

const monthBarList1 = ref([
  {
    beginDate: "01.01.2022 23:00",
    endDate: "02.02.2022 08:05",
    ganttBarConfig: {
      id: "5621987352",
      label: "I'm in a bundle",
      hasHandles: true,
      bundle: "myBundle",
      style: {
        background: "#1c8745",
        color: "white",
        borderRadius: "20px"
      }
    }
  }
])

const monthBarList2 = ref([
  {
    beginDate: "01.01.2022 23:00",
    endDate: "02.02.2022 08:05",
    ganttBarConfig: {
      id: "8621987321",
      label: "I'm in a bundle",
      hasHandles: true,
      bundle: "myBundle",
      style: {
        background: "#a02353",
        color: "white",
        borderRadius: "20px"
      }
    }
  },
  {
    beginDate: "15.02.2022 00:00",
    endDate: "01.03.2022 00:05",
    ganttBarConfig: {
      id: "7721987321",
      label: "Lorem ispum dolor",
      bundle: "bundle2",
      style: {
        backgroundImage: "repeating-linear-gradient(45deg, #ccc, #ccc 30px, #8221b2 30px, #8221b2 60px)",
        borderRadius: "20px",
        color: "black"
      }
    }
  }
])
const monthBarList3 = ref([{
    beginDate: "15.02.2022 00:00",
    endDate: "01.03.2022 00:05",
    ganttBarConfig: {
      id: "7721987325",
      label: "Lorem ispum dolor",
      bundle: "bundle2",
      style: {
        backgroundImage: "repeating-linear-gradient(45deg, #ccc, #ccc 30px, #8221b2 30px, #8221b2 60px)",
        borderRadius: "20px",
        color: "black"
      }
    }
  }])

const addHourBar = () => {
  if (hourBarList2.value.some(bar => bar.ganttBarConfig.id === "test1")) {
    return
  }
  const bar = {
    beginDate: "01.01.2022 18:00",
    endDate: "02.01.2022 02:00",
    ganttBarConfig: {
      id: "test1",
      hasHandles: true,
      label: "Hello!",
      style: {
        background: "#5484b7",
        borderRadius: "20px",
        color: "white"
      }
    }
  }
  hourBarList2.value.push(bar)
}

const deleteHourBar = () => {
  const idx = hourBarList2.value.findIndex(b => b.ganttBarConfig.id === "test1")
  if (idx !== -1) {
    hourBarList2.value.splice(idx, 1)
  }
}
</script>

<style scoped>
  button {
    padding: 10px;
    background: #258A5D;
    color: white;
    border: none;
    border-radius: 5px;
  }
  button:disabled {
    opacity: 0.5;
  }
</style>
