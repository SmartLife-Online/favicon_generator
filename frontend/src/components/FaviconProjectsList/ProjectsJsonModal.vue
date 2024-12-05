<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-gray-800 rounded-lg shadow-lg w-[1024px] p-6 relative">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="text-white text-lg font-bold">Projekte als JSON importieren</h3>
        <button @click="closeModal" class="text-white hover:text-gray-800">&times;</button>
      </div>

      <div class="my-4">
        <textarea
          v-model="jsonString"
          class="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 bg-gray-500 text-white"
          placeholder="Bitte fügen Sie Ihr JSON hier ein"
          rows="4"
        >
        </textarea>
      </div>

      <div class="flex justify-end space-x-4">
        <button @click="closeModal" class="redButton">Schließen</button>
        <button @click="handleSaveJsonString" class="blueButton">Speichern</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const jsonString = ref('')

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

const handleSaveJsonString = () => {
  emit('save', jsonString.value)
}
</script>
