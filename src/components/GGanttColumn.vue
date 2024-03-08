<template>
  <div class="g-gantt-column" :style="{ fontFamily: font }">
    <span class="g-gantt-header" :style="{ background: colors.primary }">{{ columnTitle }}</span>
    <div class="g-gantt-labels">
      <div
        v-for="(label, index) in labels"
        :key="index"
        class="g-gantt-label"
        :style="{
          background: index % 2 === 0 ? colors.ternary : colors.quartenary
        }"
      >
        <span>{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import provideConfig from "../provider/provideConfig.js"

const { font, colors, labels, columnTitle } = provideConfig()
</script>

<style>
.g-gantt-column {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: rgb(64, 64, 64);
  justify-content: flex-start;
  font-variant-numeric: tabular-nums;
}

.g-gantt-header {
  width: 100%;
  height: 8vh;
  display: flex;
  overflow: hidden;
  min-height: 75px;
  padding: 0.2rem 0.7rem;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-top-left-radius: 5px;
}

.g-gantt-labels {
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  border-bottom-left-radius: 5px;
}

.g-gantt-label {
  width: 100%;
  height: 100%;
  display: flex;
  max-height: 3em;
  padding: 0.1rem 0.3rem;
  overflow: hidden;
  white-space: normal;
  border: 2px solid #eaeaea;
  border-bottom: none !important;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: center;
}

.g-gantt-label:last-child {
  border-bottom-left-radius: 5px;
}
</style>
