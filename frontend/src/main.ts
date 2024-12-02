import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ColorPicker from './components/ColorPicker.vue'
import IconEditor from './components/IconEditor.vue'
import FaviconGenerator from './components/FaviconGenerator.vue'
import IconCanvas from './components/IconCanvas.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('ColorPicker', ColorPicker)
app.component('IconEditor', IconEditor)
app.component('FaviconGenerator', FaviconGenerator)
app.component('IconCanvas', IconCanvas)

app.mount('#app')
