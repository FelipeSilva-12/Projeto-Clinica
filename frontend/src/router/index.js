import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Painel from '../components/Painel.vue'
// NOTA: Se já tiver o ficheiro Cadastro.vue criado na pasta components, remova as duas barras (//) da linha abaixo:
// import Cadastro from '../components/Cadastro.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Login },
    { path: '/painel', component: Painel },
    // { path: '/cadastro', component: Cadastro } // Descomente esta linha também se o ficheiro existir
  ]
})

export default router