<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <header class="app-header">
      <h1 @click="$router.push('/')" class="app-title">📚 LearnSync 学习小组管理系统</h1>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
}

.app-header {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.app-title:hover {
  opacity: 0.9;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 80px);
}
</style>