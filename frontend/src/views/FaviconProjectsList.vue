<template>
  <div class="mt-36 mb-36">
    <button class="blueButton mb-12" @click="downloadLocalStorageAsJSON()">
      Als JSON Herunterladen
    </button>
    <Searchbar></Searchbar>
    <table class="listTable mt-4">
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
              <button class="greenButton">Projekt Öffnen</button>
            </RouterLink>
            <button class="blueButton" @click="downloadAsJSON(project)">
              Als JSON Herunterladen
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { projectsStore } from '../stores/projects'
import type { Project } from '../types/project'
import { saveAs } from 'file-saver'

const projectsData = projectsStore()
const projects = projectsData.projects as Project[]

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
