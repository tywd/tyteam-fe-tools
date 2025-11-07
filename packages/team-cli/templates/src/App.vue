<template>
  <div class="app">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      title: 'Vue App',
      message: 'Welcome to your Vue.js application'
    }
  }
}
</script>

<style scoped>
.app {
  text-align: center;
  margin-top: 60px;
}

h1 {
  color: #42b983;
}
</style>