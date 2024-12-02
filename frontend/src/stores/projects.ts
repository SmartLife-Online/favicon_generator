import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Project } from '../types/project'

export const projectsStore = defineStore('projects', () => {
  const findProject = (projectId: number): Project => {
    const foundProject = projects.value.find((project) => {
      return project.id == projectId
    }) as Project

    if (!foundProject) {
      return getNewProject()
    }

    return foundProject
  }

  const saveProject = (activeProject): boolean => {
    if (!activeProject.value.id) {
      highestId++

      activeProject.value.id = highestId

      projects.value.push(activeProject.value)

      localStorage.setItem('highestId', highestId.toString())
    }

    console.log(projects.value)

    localStorage.setItem('projects', JSON.stringify(projects.value))

    return true
  }

  const getNewProject = (): Project => {
    return {
      id: 0,
      title: '',
      description: '',
      domain: '',
      imgUrl: '',
      svgContent: '',
      backgroundColor: '#ffffff',
      rounded: false,
    }
  }

  const localStorageProjects = localStorage.getItem('projects')

  const projects = ref<Project[]>(
    localStorageProjects ? JSON.parse(localStorageProjects) : [getNewProject()],
  )

  let activeProject = ref<Project>(getNewProject())

  let highestId = parseInt(localStorage.getItem('highestId') || '0')

  return { projects, activeProject, highestId, findProject, saveProject }
})
