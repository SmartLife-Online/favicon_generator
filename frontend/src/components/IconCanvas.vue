<template>
  <div class="inline-block">
    <canvas
      ref="canvasRef"
      :name="name"
      class="inline-block bg-white"
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
import { projectsStore } from '../stores/projects'

// Props-Typen mit einem Interface definieren
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
