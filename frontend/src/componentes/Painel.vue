<template>
  <main class="container">
    <section class="topo">
      <h1>Painel de Agendamentos</h1>
      <p>{{ usuario?.nome }} ({{ usuario?.tipo }})</p>
      <button @click="logout">Sair</button>
    </section>

    <form class="card" @submit.prevent="agendar">
      <h2>Novo agendamento</h2>
      <input type="date" v-model="form.data" required />
      <input type="time" v-model="form.hora" required />
      <input v-model="form.cep" placeholder="CEP" maxlength="9" @input="formatarCep" required />
      <button type="submit">Agendar</button>
      <p v-if="mensagem">{{ mensagem }}</p>
      <p class="erro" v-if="erro">{{ erro }}</p>
    </form>

    <section class="card">
      <h2>Lista de agendamentos</h2>
      <button @click="buscarAgendamentos">Atualizar lista</button>
      <ul>
        <li v-for="item in agendamentos" :key="item._id">
          {{ item.data }} {{ item.hora }} - {{ item.enderecoFull }} - {{ item.clima }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import { API_URL, lerResposta, mensagemDeErroDeRede } from '../servicos/api';

export default {
  data() {
    return {
      usuario: null,
      form: { data: '', hora: '', cep: '' },
      agendamentos: [],
      mensagem: '',
      erro: ''
    };
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/');
      return;
    }

    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.buscarAgendamentos();
  },
  methods: {
    formatarCep() {
      const apenasDigitos = (this.form.cep || '').replace(/\D/g, '').slice(0, 8);
      this.form.cep = apenasDigitos.length > 5
        ? `${apenasDigitos.slice(0, 5)}-${apenasDigitos.slice(5)}`
        : apenasDigitos;
    },
    getHeaders(json = false) {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      if (json) headers['Content-Type'] = 'application/json';
      return headers;
    },
    async buscarAgendamentos() {
      try {
        const response = await fetch(`${API_URL}/agendamentos`, { headers: this.getHeaders() });
        const data = await lerResposta(response);
        if (!response.ok) throw new Error(data.erro || 'Erro ao carregar agendamentos.');
        this.agendamentos = data;
      } catch (error) {
        this.erro = mensagemDeErroDeRede(error);
      }
    },
    async agendar() {
      this.mensagem = '';
      this.erro = '';
      try {
        const response = await fetch(`${API_URL}/agendamentos`, {
          method: 'POST',
          headers: this.getHeaders(true),
          body: JSON.stringify(this.form)
        });
        const data = await lerResposta(response);
        if (!response.ok) throw new Error(data.erro || 'Erro ao agendar.');
        this.mensagem = data.mensagem;
        this.form = { data: '', hora: '', cep: '' };
        this.buscarAgendamentos();
      } catch (error) {
        this.erro = mensagemDeErroDeRede(error);
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.container{max-width:900px;margin:20px auto;display:grid;gap:16px}.card{display:flex;flex-direction:column;gap:10px;border:1px solid #ccc;padding:16px;border-radius:8px}.topo{display:flex;gap:12px;align-items:center;justify-content:space-between}.erro{color:#b00020}
</style>
