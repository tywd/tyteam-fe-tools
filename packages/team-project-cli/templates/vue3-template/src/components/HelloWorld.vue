<template>
  <div class="hello">
    <h2><%= projectName %></h2>
    <p>欢迎使用 Tyteam 项目脚手架工具！</p>
    <ul>
      <li>Vue 3 + Vite</li>
      <li>ESLint + Prettier + Stylelint</li>
      <li>Vue Router</li>
    </ul>
  </div>
</template>

<script setup>
// 在这里可以添加组件级别的逻辑
</script>

<style scoped>
.hello {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  color: #42b983;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>