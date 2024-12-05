<template>
  <div class="mt-36 mb-36">
    <button class="blueButton mb-12" @click="downloadLocalStorageAsJSON()">
      Alle Projekte als JSON Herunterladen
    </button>
    <button @click="showModal = true" class="blueButton">Projekte als JSON importieren</button>
    <ProjectsJsonModal
      v-if="showModal"
      :isOpen="showModal"
      @close="showModal = false"
      @save="handleSaveJsonString"
    />
    <ProjectSearchbar />
    <table v-if="projects.length" class="listTable mt-4">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Beschreibung</th>
          <th>Optionen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>
            {{ project.title }}
          </td>
          <td>
            {{ project.description }}
          </td>
          <td>
            <RouterLink :to="'/favicon/generator/' + project.id">
              <button class="greenButton mb-5 lg:mb-0">Projekt Öffnen</button>
            </RouterLink>
            <button class="blueButton mb-3 lg:mb-0" @click="downloadAsJSON(project)">
              JSON Herunterladen
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { projectsStore } from '../stores/projects'
import type { Project } from '../types/project'
import { saveAs } from 'file-saver'

const projectsData = projectsStore()
const projects = ref(projectsData.projects)

const showModal = ref(false)

const handleSaveJsonString = (JsonString: string) => {
  projectsData.importProjects(JsonString)

  location.reload()
}

function downloadAsJSON(project: Project) {
  if (!project) return

  const projectsJSON = JSON.stringify(project)

  const jsonBlob = new Blob([projectsJSON], { type: 'application/json' })

  saveAs(jsonBlob, 'favicons_project_' + project.id + '.json')
}

function downloadLocalStorageAsJSON() {
  const projectsJSON = localStorage.getItem('projects')

  if (!projectsJSON) return

  const jsonBlob = new Blob([projectsJSON], { type: 'application/json' })

  saveAs(jsonBlob, 'favicons.json')
}
</script>

<style></style>
