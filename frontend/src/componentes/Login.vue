<template>
  <main class="container">
    <h1>Clínica - Login</h1>
    <form @submit.prevent="login" class="card">
      <input type="email" v-model="email" placeholder="E-mail" required />
      <input type="password" v-model="senha" placeholder="Senha" required />
      <button type="submit">Entrar</button>
      <p class="erro" v-if="erro">{{ erro }}</p>
      <router-link to="/cadastro">Criar conta</router-link>
    </form>
  </main>
</template>

<script>
import { API_URL, lerResposta, mensagemDeErroDeRede } from '../servicos/api';

export default {
  data() {
    return { email: '', senha: '', erro: '' };
  },
  methods: {
    async login() {
      this.erro = '';

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, senha: this.senha })
        });

        const data = await lerResposta(response);
        if (!response.ok) throw new Error(data.message || 'Erro ao fazer login.');

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        this.$router.push('/painel');
      } catch (error) {
        this.erro = mensagemDeErroDeRede(error);
      }
    }
  }
};
</script>

<style scoped>
.container{display:grid;place-items:center;min-height:100vh}.card{display:flex;flex-direction:column;gap:12px;min-width:320px}.erro{color:#b00020}
</style>
