<template>
  <div class="mb-36">
    <div class="faviconForm">
      <div class="relative mb-8">
        <label for="title">Titel</label>
        <input id="title" type="text" v-model="activeProject.title" class="input" />
        <span v-if="formError && !activeProject.title" class="text-red-600 absolute bottom--1">Bitte geben Sie einen Titel ein</span>
      </div>

      <div class="relative mb-8">
        <label for="description">Beschreibung</label>
        <input id="description" type="text" v-model="activeProject.description" class="input" />
        <span v-if="formError && !activeProject.description" class="text-red-600 absolute bottom--1">Bitte geben Sie eine Beschreibung ein</span>
      </div>

      <div class="relative mb-8">
        <label for="domain">Domain</label>
        <input id="domain" type="text" v-model="activeProject.domain" class="input" />
        <span v-if="formError && !activeProject.domain" class="text-red-600 absolute bottom--1">Bitte geben Sie eine Domain ein</span>
      </div>

      <label for="domain">Hintergrund-Farbe</label>
      <input type="color" v-model="activeProject.backgroundColor" />
    </div>
    <IconEditor
      ref="refIconEditor"
      :background_color="activeProject.backgroundColor"
      :activeProject="activeProject"
    />
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

const activeProject = ref<Project>(projectsData.findProject(parseInt(projectId)))

const refIconEditor = ref<InstanceType<typeof IconEditor> | null>(null)

const formError = ref(false)

function validateProjectForm() {
  if(activeProject.value.title && activeProject.value.description && activeProject.value.domain) return true

  formError.value = true

  return false
}

function saveProject() {
  if(!validateProjectForm()) return

  if (projectsData.saveProject(activeProject.value)) {
    router.push({ name: 'favicon.generator.edit', params: { projectId: activeProject.value.id } })
  }
}

function downloadAndSaveProject() {
  projectsData.saveProject(activeProject.value)

  refIconEditor.value?.downloadAllCanvas()
}
</script>

<style></style>
