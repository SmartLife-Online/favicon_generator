<template>
  <div class="mb-36">
    <div class="faviconForm">
      <label for="title">Titel</label>
      <input id="title" type="text" v-model="activeProject.title" class="input" />

      <label for="description">Beschreibung</label>
      <input id="description" type="text" v-model="activeProject.description" class="input" />

      <label for="domain">Domain</label>
      <input id="domain" type="text" v-model="activeProject.domain" class="input" />

      <label for="domain">Hintergrund-Farbe</label>
      <input type="color" v-model="activeProject.backgroundColor" />
    </div>
    <IconEditor ref="refIconEditor" :background_color="activeProject.backgroundColor" :activeProject="activeProject" />
    <div id="testen" ref="refTest"></div>
    <br />
    <button class="greenButton float-right" @click="downloadAndSaveProject">
      Herunterladen und Speichern
    </button>
    <button class="blueButton float-right" @click="saveProject">Speichern</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectsStore } from '../stores/projects'
import type { Project } from '../types/project'
import IconEditor from '../components/IconEditor.vue'

const route = useRoute()
const router = useRouter()

const projectsData = projectsStore()

const projectId = (route.params.projectId || '0') as string

//projectsData.activeProject = ref<Project>(projectsData.findProject(parseInt(projectId)))

const activeProject = ref<Project>(projectsData.findProject(parseInt(projectId)))

const refIconEditor = ref<InstanceType<typeof IconEditor> | null>(null)

function saveProject() {
  if (projectsData.saveProject(activeProject)) {
    router.push({ name: 'favicon.generator.edit', params: { projectId: activeProject.value.id } })
  }
}

function downloadAndSaveProject() {
  projectsData.saveProject(activeProject)

  refIconEditor.value?.downloadAllCanvas()
}
</script>

<style></style>
