<template>
  <div v-if="visible" class="loading-spin-wrapper">
    <div class="loading-spin-container">
      <svg class="loading-spin__icon" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
      </svg>
      <span v-show="props.text" class="loading-spin__text">{{
        props.text
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
const visible = ref(false)
defineExpose({ visible })
</script>

<style lang="scss" scoped>
.loading-spin {
  &-wrapper {
    position: fixed;
    z-index: 9999;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-flow: column;
  }
  &-container {
    max-width: 45%;
    margin: 0 auto;
    border-radius: 0.12rem;
    background-color: var(--bg-color-toast);
    padding: 0.36rem 0.4rem;
    word-break: break-all;
    word-wrap: break-word;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__icon {
    margin: 0 auto;
    width: 0.64rem;
    height: 0.64rem;
    animation: CircleRotate 2s linear infinite;
    .path {
      stroke: var(--text-color-quinary, #fff);
      stroke-linecap: round;
      animation: CircleDash 1.5s ease-in-out infinite;
    }
  }
  &__text {
    color: var(--text-color-quinary, #fff);
    font-size: 0.32rem;
    line-height: 1.5;
    margin-top: 0.3rem;
    text-align: center;
    display: block;
  }
}
@keyframes CircleRotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes CircleDash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
