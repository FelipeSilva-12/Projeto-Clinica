import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Vai importar o nosso router corrigido

const app = createApp(App)

app.use(router) // Avisa o Vue que vamos usar rotas
app.mount('#app') // Liga o motor à div com id "app"