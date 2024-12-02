<template>
  <div class="lg:px-8 mt-12 mb-24">
    <label class="inline-flex items-center cursor-pointer">
      <input type="checkbox" v-model="activeProject.rounded" class="sr-only peer" />
      <div
        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
      ></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Rundes Icon</span>
    </label>
    <br />
    <br />
    <input type="file" accept=".svg" @change="onFileChange" class="mb-4" />
    <div class="relative">
      <div>
        <IconCanvas
          ref="canvasIco"
          name="favicon"
          :width="32"
          :height="32"
          label="favicon.ico"
          :rounded-canvas="activeProject.rounded"
        ></IconCanvas>
        <IconCanvas
          ref="canvasSafari"
          name="favicon_safari"
          :width="32"
          :height="32"
          label="Safari Pinned Tab SVG"
          :rounded-canvas="activeProject.rounded"
        ></IconCanvas>
        <IconCanvas
          ref="canvasApple"
          name="favicon_apple"
          :safezone="0.8"
          :width="180"
          :height="180"
          label="Apple-Touch PNG-Icon"
          :rounded-canvas="activeProject.rounded"
        ></IconCanvas>
        <IconCanvas
          ref="canvasMicrosoft"
          name="favicon_microsoft"
          :safezone="0.8"
          :width="150"
          :height="150"
          label="Microsoft PNG-Icon"
          :rounded-canvas="activeProject.rounded"
        ></IconCanvas>
      </div>
      <br />
      <div>
        <IconCanvas
          ref="canvasWebpngKlein"
          name="favicon_webpng_klein"
          :safezone="0.8"
          :width="192"
          :height="192"
          format="image/webp"
          file_ending="webp"
          label="Web-PNG Icon"
          :rounded-canvas="activeProject.rounded"
        ></IconCanvas>
        <IconCanvas
          ref="canvasWebpngGroß"
          name="favicon_webpng_gross"
          :safezone="0.8"
          :width="512"
          :height="512"
          format="image/webp"
          file_ending="webp"
          label="Web-PNG Icon (Groß)"
          :rounded-canvas="activeProject.rounded"
        ></IconCanvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { projectsStore } from '../stores/projects'
import IconCanvas from '../components/IconCanvas.vue'
import { Canvg } from 'canvg'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const canvasIco = ref<InstanceType<typeof IconCanvas> | null>(null)
const canvasWebpngKlein = ref<InstanceType<typeof IconCanvas> | null>(null)
const canvasWebpngGroß = ref<InstanceType<typeof IconCanvas> | null>(null)
const canvasApple = ref<InstanceType<typeof IconCanvas> | null>(null)
const canvasMicrosoft = ref<InstanceType<typeof IconCanvas> | null>(null)
const canvasSafari = ref<InstanceType<typeof IconCanvas> | null>(null)

const canvasArray = [
  canvasIco,
  canvasWebpngKlein,
  canvasWebpngGroß,
  canvasApple,
  canvasMicrosoft,
  canvasSafari,
]

const { background_color, activeProject } = defineProps(['background_color', 'activeProject'])

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
  canvasArray.forEach((canvas) => {
    if (!canvas?.value?.canvasRef) return
    const imgBase64Data = drawSvgOnCanvas(canvas.value.canvasRef)
  })
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

const downloadAllCanvas = async () => {
  const zip = new JSZip()

  for await (const canvas of canvasArray) {
    if (!canvas?.value?.canvasRef) return

    const fileFormat = canvas.value.canvasRef.dataset.format || 'image/png'
    const fileEnding = canvas.value.canvasRef.dataset.file_ending || 'png'

    const downloadImage = canvas.value.canvasRef
      .toDataURL(fileFormat)
      .replace(fileFormat, 'image/octet-stream')

    if (!downloadImage) return false

    const imgBase64Data = downloadImage.split(',')[1]

    if (!imgBase64Data) return

    zip.file(canvas.value.canvasRef.getAttribute('name') + '.' + fileEnding, imgBase64Data, {
      base64: true,
    })
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })

  saveAs(zipBlob, 'favicons.zip')
}

onMounted(() => {
  drawSvgOnAllCanvas()
})

defineExpose({
  downloadAllCanvas,
})
</script>

<style scoped></style>
