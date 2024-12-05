<template>
  <div
    :class="{ grayscale: isDevInstanz }"
    class="m-auto mt-12 transition duration-500 w-11/12 lg:w-[1024px]"
  >
    <header class="leading-6 max-h-full w-full lg:flex lg:place-items-center">
      <SwitchCheckbox
        v-model="isDevInstanz"
        label="Dev Instanz"
        class="ml-6 mr-12"
      ></SwitchCheckbox>
      <div class="lg:flex lg:place-items-start flex-wrap">
        <nav class="w-full mt-8 text-xs lg:text-base text-center lg:text-left lg:mt-4 lg:mb-4">
          <RouterLink to="/favicon/projects" class="inline-block pl-4 pr-4"
            >Eigene Projekte</RouterLink
          >
          <RouterLink to="/favicon/generator" class="inline-block pl-4 pr-4 border-l"
            >Favicon Generator</RouterLink
          >
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let isDevInstanz = ref(false)
</script>

<style scoped></style>
