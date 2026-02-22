import { createRouter, createWebHistory } from 'vue-router';
import Login from '../componentes/Login.vue';
import Cadastro from '../componentes/Cadastro.vue';
import Painel from '../componentes/Painel.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Login },
    { path: '/cadastro', component: Cadastro },
    { path: '/painel', component: Painel }
  ]
});

export default router;
