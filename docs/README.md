<img class="centered"
    src="https://user-images.githubusercontent.com/28678851/148047166-db201d39-eac0-4908-a44c-7d3fc29f8d18.png" 
    alt="Vue Ganttastic logo"/>  

Vue Ganttastic is a simple, interactive and highly customizable Gantt chart component for Vue 3.   
<a class="centered get-started-btn" href="/introduction/introduction.html"> Get Started </a>  


### Try it out: 
## 
<g-gantt-chart chart-start="14.01.2022 12:00" chart-end="15.01.2022 12:00" precision="hour" grid width="100%" bar-start="beginDate" bar-end="endDate" date-format="DD.MM.YYYY HH:mm" color-scheme="vue"> <g-gantt-row label="Row #1" :bars="hourBarList1" highlight-on-hover/><g-gantt-row label="Row #2" :bars="hourBarList2" highlight-on-hover/></g-gantt-chart>

<button @click="addHourBar()" :disabled="hourBarList2.some(bar => bar.ganttBarConfig.id==='test1')"> Add bar </button>
<button @click="deleteHourBar()" style="margin-left: 10px" :disabled="!hourBarList2.some(bar => bar.ganttBarConfig.id==='test1')"> Delete bar </button>

<script setup>
import { ref } from "vue"

const hourBarList1 = ref([
  {
    beginDate: "14.01.2022 15:00",
    endDate: "14.01.2022 19:45",
    ganttBarConfig: {
      id: "8621987329",
      label: "Drag me",
      style: {
        background: "#5dc94c",
        color: "white",
        borderRadius: "20px"
      }
    }
  }
])

const hourBarList2 = ref([
    {
    beginDate: "14.01.2022 23:00",
    endDate: "15.01.2022 08:05",
    ganttBarConfig: {
      id: "8621987322",
      label: "Drag my handles",
      hasHandles: true,
      style: {
        background: "#2c2e4c",
        color: "white"
      }
    }
  }
])

const addHourBar = () => {
  if (hourBarList2.value.some(bar => bar.ganttBarConfig.id === "test1")) {
    return
  }
  const bar = {
    beginDate: "14.01.2022 15:00",
    endDate: "14.01.2022 20:00",
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
  .centered {
    display: block; 
    margin-left: auto;
    margin-right: auto;
  }
  .get-started-btn {
    text-align: center;
    text-decoration: none;
    background: #258A5D;
    padding: 10px;
    font-size: 1.1em;
    border-radius: 5px;
    color: white;
    margin-top: 8px;
    transition: background 0.2s;
  }
  .get-started-btn:hover {
    cursor: pointer;
    background: #34495E;
  }
</style>