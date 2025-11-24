<template>
  <div class="auth-layout">
    <div class="auth-container">
      <header class="auth-header">
        <h1 class="auth-title">
          <span class="logo">📚</span>
          LearnSync
        </h1>
        <p class="auth-subtitle">智能学习管理系统</p>
      </header>
      
      <main class="auth-main">
        <div class="auth-card">
          <div class="auth-card-header">
            <h2>{{ title }}</h2>
            <p class="auth-description">{{ description }}</p>
          </div>
          
          <div class="auth-card-body">
            <slot></slot>
          </div>
          
          <div class="auth-card-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </main>
      
      <footer class="auth-footer">
        <p>&copy; 2025 LearnSync - IEMS5731 Group Project</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.auth-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo {
  font-size: 2.8rem;
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
}

.auth-main {
  margin-bottom: 30px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.auth-card-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-card-header h2 {
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.auth-description {
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

.auth-card-body {
  margin-bottom: 20px;
}

.auth-card-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }
  
  .auth-title {
    font-size: 2rem;
  }
}
</style>
