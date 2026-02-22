// frontend/src/router/index.js

import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Cadastro from '../components/Cadastro.vue'
import Painel from '../components/Painel.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Login },
    { path: '/cadastro', component: Cadastro },
    { path: '/painel', component: Painel, meta: { requiresAuth: true } }
  ]
})