// frontend/src/components/Painel.vue

<template>
  <div>
    <h1>Painel Administrativo</h1>
    <button @click="logout">Sair</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
    }
  }
}
</script>