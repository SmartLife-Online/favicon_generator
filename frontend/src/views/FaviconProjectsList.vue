<template>
  <div class="mt-36 mb-36">
    <table class="listTable">
      <thead>
        <tr>
          <th>ID</th>
          <th>Titel</th>
          <th>Beschreibung</th>
          <th>Optionen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>
            {{ project.id }}
          </td>
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

const projectsData = projectsStore()
const projects = projectsData.projects as Project[]
</script>

<style></style>
