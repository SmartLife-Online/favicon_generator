<template>
  <div class="p-4 w-full">
    <input type="color" v-model="activeProject.backgroundColor" class="mb-4 w-full" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { projectsStore } from '../stores/projects'

const projectsData = projectsStore()
const activeProject = projectsData.activeProject
</script>

<style scoped></style>
