<template>
  <div class="lg:px-8 mb-24">
    <h1 class="text-xl font-bold mb-4">Icon Editor</h1>
    <input type="file" accept=".svg" @change="onFileChange" class="mb-4" />
    <div class="relative">
      <div>
        <canvas ref="canvasIco" name="favicon" width="32" height="32" />
        <label>favicon.ico</label>
        <canvas ref="canvasSafari" name="favicon_safari" width="32" height="32" />
        <label>Safari Pinned Tab SVG</label>
        <canvas
          ref="canvasApple"
          name="favicon_apple"
          data-safezone="0.8"
          width="180"
          height="180"
        />
        <label>Apple-Touch PNG-Icon</label>
        <canvas
          ref="canvasMicrosoft"
          name="favicon_microsoft"
          data-safezone="0.8"
          width="150"
          height="150"
        />
        <label>Microsoft PNG-Icon</label>
      </div>
      <br />
      <div>
        <canvas
          ref="canvasWebpngKlein"
          name="favicon_webpng_klein"
          data-safezone="0.8"
          data-format="image/webp"
          data-file_ending="webp"
          width="192"
          height="192"
        />
        <label>Web-PNG Icon</label>
        <canvas
          ref="canvasWebpngGroß"
          name="favicon_webpng_gross"
          data-safezone="0.8"
          data-format="image/webp"
          data-file_ending="webp"
          width="512"
          height="512"
        />
        <label>Web-PNG Icon (Groß)</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { projectsStore } from '../stores/projects'
import { Canvg } from 'canvg'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const canvasIco = ref<HTMLCanvasElement | null>(null)
const canvasWebpngKlein = ref<HTMLCanvasElement | null>(null)
const canvasWebpngGroß = ref<HTMLCanvasElement | null>(null)
const canvasApple = ref<HTMLCanvasElement | null>(null)
const canvasMicrosoft = ref<HTMLCanvasElement | null>(null)
const canvasSafari = ref<HTMLCanvasElement | null>(null)

const canvasArray = [
  canvasIco,
  canvasWebpngKlein,
  canvasWebpngGroß,
  canvasApple,
  canvasMicrosoft,
  canvasSafari,
]

const projectsData = projectsStore()
const activeProject = projectsData.activeProject

const { background_color } = defineProps(['background_color'])

watch(
  () => background_color,
  (newValue, oldValue) => {
    drawSvgOnAllCanvas()
  },
)

const onFileChange = (event: Event) => {
  const svgFileInput = event.target as HTMLInputElement

  if (!svgFileInput.files || svgFileInput.files.length === 0) return

  const svgFile = svgFileInput.files[0] as File

  if (svgFile.type !== 'image/svg+xml') {
    alert('Die Datei muss eine gültige SVG-Datei sein.')

    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    activeProject.svgContent = reader.result as string

    drawSvgOnAllCanvas()
  }

  reader.readAsText(svgFile)
}

const drawSvgOnAllCanvas = async () => {
  const zip = new JSZip()

  canvasArray.forEach((canvas) => {
    const imgBase64Data = drawSvgOnCanvas(canvas.value)
  })
}

const downloadAllCanvas = async () => {
  const zip = new JSZip()

  for await (const canvas of canvasArray) {
    if (!canvas.value) return

    const fileFormat = canvas.value.dataset.format || 'image/png'
    const fileEnding = canvas.value.dataset.file_ending || 'png'

    const downloadImage = canvas.value
      .toDataURL(fileFormat)
      .replace(fileFormat, 'image/octet-stream')

    if (!downloadImage) return false

    const imgBase64Data = downloadImage.split(',')[1]

    if (!imgBase64Data) return

    zip.file(canvas.value.getAttribute('name') + '.' + fileEnding, imgBase64Data, { base64: true })
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })

  saveAs(zipBlob, 'favicons.zip')
}

const drawSvgOnCanvas = async (canvas: HTMLCanvasElement | null) => {
  if (!canvas || !activeProject.svgContent) return false

  const ctx = canvas.getContext('2d')

  if (!ctx) return false

  const canvasWidth = canvas.clientWidth
  const canvasHeight = canvas.clientHeight

  const safezone = parseFloat(canvas.dataset.safezone || '1')
  const safezoneWidth = canvas.clientWidth * safezone
  const safezoneHeight = canvas.clientHeight * safezone

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  ctx.fillStyle = background_color
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  const svgImage = new Image()

  const svgBlob = new Blob([activeProject.svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(svgBlob)

  svgImage.onload = () => {
    const svgAspectRatio = svgImage.width / svgImage.height
    const canvasAspectRatio = safezoneWidth / safezoneHeight

    let drawWidth = safezoneWidth
    let drawHeight = safezoneHeight
    if (svgAspectRatio > canvasAspectRatio) {
      drawHeight = drawWidth / svgAspectRatio
    } else {
      drawWidth = drawHeight * svgAspectRatio
    }

    const svgOffsetX = (canvasWidth - drawWidth) / 2
    const svgOffsetY = (canvasHeight - drawHeight) / 2

    ctx.drawImage(svgImage, svgOffsetX, svgOffsetY, drawWidth, drawHeight)

    URL.revokeObjectURL(url)
  }

  svgImage.src = url

  activeProject.imgUrl = url
}

onMounted(() => {
  drawSvgOnAllCanvas()
})

defineExpose({
  downloadAllCanvas,
})
</script>

<style scoped>
canvas {
  display: inline-block;
  background-color: #ffffff;
}
</style>
