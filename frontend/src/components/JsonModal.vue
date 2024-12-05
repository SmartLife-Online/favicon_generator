<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="text-lg font-bold">JSON importieren</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>

      <div class="my-4">
        <textarea
          class="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          placeholder="Bitte fügen Sie Ihr JSON hier ein"
          rows="4"
        >
        </textarea>
      </div>

      <div class="flex justify-end space-x-4">
        <button @click="closeModal" class="blueButton">
          Schließen
        </button>
        <button
          @click="handleSave"
          class="blueButton"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpen: Boolean,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', JsonText: string): void
}>()

const closeModal = () => {
  emit('close')
}

const handleSave = () => {
  const JsonText = ''
  emit('save', JsonText)
}
</script>
