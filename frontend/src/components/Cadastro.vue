<template>
  <main class="container">
    <h1>Cadastro</h1>
    <form @submit.prevent="cadastro" class="card">
      <input v-model="nome" placeholder="Nome" required />
      <input type="email" v-model="email" placeholder="E-mail" required />
      <input type="password" v-model="senha" placeholder="Senha" required />
      <select v-model="tipo" required>
        <option value="">Tipo de usuário</option>
        <option value="paciente">Paciente</option>
        <option value="secretario">Secretário</option>
      </select>
      <button type="submit">Cadastrar</button>
      <p v-if="mensagem">{{ mensagem }}</p>
      <p class="erro" v-if="erro">{{ erro }}</p>
      <router-link to="/">Voltar para login</router-link>
    </form>
  </main>
</template>

<script>
const API_URL = 'http://localhost:3000';

export default {
  data() {
    return { nome: '', email: '', senha: '', tipo: '', mensagem: '', erro: '' };
  },
  methods: {
    async cadastro() {
      this.mensagem = '';
      this.erro = '';
      try {
        const response = await fetch(`${API_URL}/auth/cadastro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: this.nome, email: this.email, senha: this.senha, tipo: this.tipo })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar.');
        this.mensagem = data.message;
      } catch (error) {
        this.erro = error.message;
      }
    }
  }
};
</script>

<style scoped>
.container{display:grid;place-items:center;min-height:100vh}.card{display:flex;flex-direction:column;gap:12px;min-width:320px}.erro{color:#b00020}
</style>
