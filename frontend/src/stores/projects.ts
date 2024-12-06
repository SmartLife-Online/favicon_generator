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
      activeProject.id = getHighestId() + 1

      projects.value.push(activeProject)
    }

    localStorage.setItem('projects', JSON.stringify(projects.value))

    return true
  }

  const importProjects = (jsonString: string) => {
    localStorage.setItem('projects', jsonString)
  }

  const importOneProject = (jsonString: string) => {
    const newProject = JSON.parse(jsonString)

    newProject.id = null

    saveProject(newProject)
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

  function getHighestId(): number {
    if (!projects.value || !projects.value.length) return 0

    let highestId = 0

    projects.value.forEach((project) => {
      if (project.id > highestId) highestId = project.id
    })

    return highestId
  }

  const localStorageProjects = localStorage.getItem('projects')

  const projects = ref<Project[]>(localStorageProjects ? JSON.parse(localStorageProjects) : [])

  return { projects, findProject, importProjects, importOneProject, saveProject }
})
