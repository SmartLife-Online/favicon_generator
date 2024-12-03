<template>
  <div class="p-4 faviconForm">
    <input v-model="searchQuery" type="text" placeholder="Suche nach Projekten..." class="mb-3" />
    <p v-if="searchQuery && filteredProjects.length === 0">
      Es konnte keine Projekte gefunden werden
    </p>
    <ul>
      <li
        v-for="project in filteredProjects"
        :key="project.id"
        class="mb-2 p-4 border rounded hover:border-green-400 hover:cursor-pointer transform transition duration-300 hover:scale-105"
      >
        <h2 class="text-lg font-bold" v-html="highlightText(project.title, searchQuery)"></h2>
        <p
          class="text-sm text-gray-600"
          v-html="highlightText(project.description, searchQuery)"
        ></p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { projectsStore } from '../stores/projects'
import type { Project } from '../types/project'

const projectsData = projectsStore()
const projects = projectsData.projects

const searchQuery = ref('')

const filteredProjects = computed(() => {
  if (!searchQuery.value) return []

  return projects.filter((project: Project) => {
    return (
      project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const highlightText = (text: string, query: string) => {
  if (!query) return text

  const regex = new RegExp('(' + query + ')', 'gi')

  return text.replace(regex, '<mark>$1</mark>')
}
// no-repeat 15px center
</script>

<style scoped></style>
