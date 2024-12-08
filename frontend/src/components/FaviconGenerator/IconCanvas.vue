<template>
  <div class="mb-6 lg-mb:0 lg:inline-block lg:mr-6">
    <canvas
      ref="canvasRef"
      :id="name"
      :name="name"
      class="lg:inline-block bg-white lg:mr-2"
      :class="{ 'rounded-full': roundedCanvas }"
      :data-safezone="safezone"
      :data-format="format"
      :data-file_ending="file_ending"
      :width="width"
      :height="height"
    />
    <label>{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CanvasProps {
  name: string
  safezone?: number
  width: number
  height: number
  label: string
  roundedCanvas?: boolean
  format?: string
  file_ending?: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

const props = defineProps<CanvasProps>()

const safezone = props.safezone ?? 1
const format = props.format ?? 'image/png'
const file_ending = props.file_ending ?? 'png'

defineExpose({
  canvasRef,
})
</script>

<style scoped></style>
