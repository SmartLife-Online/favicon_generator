import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ColorPicker from './components/ColorPicker.vue'
import SwitchCheckbox from './components/SwitchCheckbox.vue'
import IconEditor from './components/FaviconGenerator/IconEditor.vue'
import FaviconGenerator from './components/FaviconGenerator/FaviconGenerator.vue'
import IconCanvas from './components/FaviconGenerator/IconCanvas.vue'
import ProjectSearchbar from './components/FaviconProjectsList/ProjectSearchbar.vue'
import ProjectsJsonModal from './components/FaviconProjectsList/ProjectsJsonModal.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('ColorPicker', ColorPicker)
app.component('IconEditor', IconEditor)
app.component('FaviconGenerator', FaviconGenerator)
app.component('IconCanvas', IconCanvas)
app.component('SwitchCheckbox', SwitchCheckbox)
app.component('ProjectSearchbar', ProjectSearchbar)
app.component('ProjectsJsonModal', ProjectsJsonModal)

app.mount('#app')
