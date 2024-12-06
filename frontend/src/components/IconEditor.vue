<template>
  <div class="lg:px-8 mt-12 mb-24">
    <SwitchCheckbox v-model="activeProject.rounded" label="Rundes Icon"></SwitchCheckbox>
    <SwitchCheckbox
      v-model="activeProject.gray"
      label="Grau einfärben"
      class="ml-6"
    ></SwitchCheckbox>
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
import canvasToSvg from 'canvas-to-svg'

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
  () => [background_color, activeProject.rounded, activeProject.gray],
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

  const canvasWidth = canvas.clientWidth
  const canvasHeight = canvas.clientHeight

  const safezone = parseFloat(canvas.dataset.safezone || '1')
  const safezoneWidth = canvas.clientWidth * safezone
  const safezoneHeight = canvas.clientHeight * safezone

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  //const ctx = canvas.dataset?.file_ending === 'svg' ? new canvasToSvg(canvasWidth, canvasHeight) : canvas.getContext('2d')
  const ctx = canvas.getContext('2d')

  if (!ctx) return false

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (activeProject.rounded) {
    ctx.beginPath()
    ctx.arc(canvasWidth / 2, canvasWidth / 2, canvasWidth / 2, 0, Math.PI * 2)
    ctx.clip()
  }

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

    if (activeProject.gray) {
      paintCanvasInGray(ctx, canvasWidth, canvasHeight)
    }
  }

  svgImage.src = url

  activeProject.imgUrl = url
}

const paintCanvasInGray = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const canvasImageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const canvasImageDataPixels = canvasImageData.data

  for (let i = 0; i < canvasImageDataPixels.length; i += 4) {
    const red = canvasImageDataPixels[i]
    const green = canvasImageDataPixels[i + 1]
    const blue = canvasImageDataPixels[i + 2]
    //canvasImageDataPixels[i + 3] (Alpha-Wert)

    canvasImageDataPixels[i + 3]

    const luminanzGray = 0.299 * red + 0.587 * green + 0.114 * blue

    canvasImageDataPixels[i] = luminanzGray
    canvasImageDataPixels[i + 1] = luminanzGray
    canvasImageDataPixels[i + 2] = luminanzGray
  }

  ctx.putImageData(canvasImageData, 0, 0)
}

const downloadAllCanvas = async () => {
  const zip = new JSZip()

  for await (const canvas of canvasArray) {
    if (!canvas?.value?.canvasRef) return

    const fileFormat = canvas.value.canvasRef.dataset.format || 'image/png'
    const fileEnding = canvas.value.canvasRef.dataset.file_ending || 'png'

    let imgBase64Data
    if (fileEnding === 'svg') {
      const context = new SVGCanvas(canvas.value.canvasRef.id)

      const downloadImage = context.toDataURL(fileFormat).replace(fileFormat, 'image/octet-stream')

      if (!downloadImage) return

      imgBase64Data = downloadImage.split(',')[1]
    } else {
      const downloadImage = canvas.value.canvasRef
        .toDataURL(fileFormat)
        .replace(fileFormat, 'image/octet-stream')

      if (!downloadImage) return

      imgBase64Data = downloadImage.split(',')[1]

      if (!imgBase64Data) return
    }

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
