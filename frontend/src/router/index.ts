import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/favicon/projects',
      name: 'favicon.projects',
      component: () => import('../views/FaviconProjectsList.vue'),
    },
    {
      path: '/favicon/generator',
      name: 'favicon.generator',
      component: () => import('../views/FaviconGeneratorCreateView.vue'),
    },
    {
      path: '/favicon/generator/:projectId',
      alias: '/',
      name: 'favicon.generator.edit',
      component: () => import('../views/FaviconGeneratorEditView.vue'),
    },
  ],
})

export default router
