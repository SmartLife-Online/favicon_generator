import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Project } from '../types/project'

export const projectsStore = defineStore('projects', () => {
  const findProject = (projectId: number): Project => {
    if (!projects.value) return getNewProject()

    const foundProject = projects.value.find((project) => {
      return project.id == projectId
    }) as Project

    if (!foundProject) return getNewProject()

    return foundProject
  }

  const saveProject = (activeProject: Project): boolean => {
    if (!activeProject.id) {
      highestId++

      activeProject.id = highestId

      projects.value.push(activeProject)

      localStorage.setItem('highestId', highestId.toString())
    }

    localStorage.setItem('projects', JSON.stringify(projects.value))

    return true
  }

  const importProjects = (JsonString: string) => {
    localStorage.setItem('projects', JsonString)
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
      gray: false,
    }
  }

  const localStorageProjects = localStorage.getItem('projects')

  const projects = ref<Project[]>(localStorageProjects ? JSON.parse(localStorageProjects) : [])

  let highestId = parseInt(localStorage.getItem('highestId') || '0')

  return { projects, highestId, findProject, importProjects, saveProject }
})
