<div style="display: flex; flex-direction: column; align-items:center;">
  <img 
    src="https://user-images.githubusercontent.com/28678851/148047714-301f07df-4101-48b8-9e47-1f272b290e80.png" 
    style="max-width: 130px; margin: 10px;"
    alt="Vue Ganttastic logo"
  />  
  <span><b>Vue Ganttastic</b> is a simple, interactive and highly customizable Gantt chart component for Vue 3. </span>
  <button class="get-started-btn" @click="router.push('getting-started')"> 
    Get started 
  </button>  
</div>



### Try it out: 
## 
<g-gantt-chart chart-start="14.01.2022 12:00" chart-end="15.01.2022 12:00" precision="hour" grid width="100%" bar-start="beginDate" bar-end="endDate" date-format="DD.MM.YYYY HH:mm" color-scheme="vue">
<g-gantt-row label="Row #1" :bars="hourBarList1" highlight-on-hover/>
<g-gantt-row label="Row #2" :bars="hourBarList2" highlight-on-hover/>
</g-gantt-chart>

<button @click="addHourBar()" :disabled="hourBarList2.some(bar => bar.ganttBarConfig.id==='test1')"> Add bar </button>
<button @click="deleteHourBar()" style="margin-left: 10px" :disabled="!hourBarList2.some(bar => bar.ganttBarConfig.id==='test1')"> Delete bar </button>

## Support the project
Vue Ganttastic is a free open-source project I work on in my spare time. Buy me a beer and let's give a toast to open-source development! :beers:

<form action="https://www.paypal.com/donate" method="post" target="_top">
<input type="hidden" name="hosted_button_id" value="M63C8DAMV5YDJ" />
<input type="image" src="https://pics.paypal.com/00/s/MTdhMWZmNTUtOWQ1Yi00YmRjLWJjMjgtY2Y0NTNhODM0OTJl/file.PNG" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" style="max-width:200px"/>
<img alt="" border="0" src="https://www.paypal.com/en_AT/i/scr/pixel.gif" width="1" height="1" />
</form>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()

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
    background: #258A5D;
    padding: 10px;
    font-size: 1.1em;
    border-radius: 5px;
    color: white;
    margin: 20px;
    width: 40%;
    transition: background 0.2s;
  }
  .get-started-btn:hover {
    cursor: pointer;
    background: #34495E;
  }
</style>