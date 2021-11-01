<template>
  <teleport to="body">
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="showTooltip || forceShow"
        class="g-gantt-tooltip"
        :style="{
          top: tooltipY,
          left:tooltipX
        }"
      >
        <div
          class="gantt-bar-tooltip-color-dot"
          :style="{background: dotColor}"
        />
        <slot>
          {{ tooltipX }}
        </slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, defineProps, watch, onMounted } from "vue"

const props = defineProps<{
  barId: string,
  barStyle: {top: string, left: string, background: string}
  forceShow: boolean
}>()

const showTooltip = ref(false)
let tooltipTimeoutId : number
const { barId } = toRefs(props)
onMounted(() => {
  const barElement = document.getElementById(barId.value)
  if (!barElement) {
    console.warn("GGanttBarTooltip: No bar element with id " + barId.value)
  }
  barElement?.addEventListener("mouseenter", onMouseenter)
  barElement?.addEventListener("mouseleave", onMouseleave)
  setTooltipPosition()
})

const onMouseenter = () => {
  if (tooltipTimeoutId) {
    clearTimeout(tooltipTimeoutId)
  }
  tooltipTimeoutId = setTimeout(() => { showTooltip.value = true }, 800)
}

const onMouseleave = () => {
  clearTimeout(tooltipTimeoutId)
  showTooltip.value = false
}

const { barStyle } = toRefs(props)
const dotColor = computed(() => barStyle.value.background || "cadetblue")
const tooltipX = ref("0px")
const tooltipY = ref("0px")

const setTooltipPosition = () => {
  const barElement = document.getElementById(barId.value)
  const { top, left } = barElement?.getBoundingClientRect() || { top: 0, left: 0 }
  tooltipX.value = `${left}px`
  tooltipY.value = `${top + 30}px`
}

watch(barStyle, () => setTooltipPosition(), { deep: true })
</script>

<style>
.g-gantt-tooltip {
  position: fixed;
  background: black;
  color: white;
  z-index: 4;
  font-size: 0.75em;
  padding: 5px;
  border-radius: 3px;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}
.g-gantt-tooltip:before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-bottom-color: black;
  border-top: 0;
  margin-left: -5px;
  margin-top: -5px;
}
.g-gantt-tooltip > .gantt-bar-tooltip-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  margin-right: 4px;
}
.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-in .3s reverse;
}

@keyframes fade-in {
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
}</style>
