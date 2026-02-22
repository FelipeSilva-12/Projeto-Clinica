// frontend/src/components/Login.vue

<template>
  <div>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="E-mail" required />
      <input type="password" v-model="senha" placeholder="Senha" required />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      senha: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email: this.email,
          senha: this.senha
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/painel');
      } catch (error) {
        alert('Erro ao fazer login');
      }
    }
  }
}
</script>