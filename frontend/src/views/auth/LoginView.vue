<template>
  <AuthLayout 
    title="欢迎回来" 
    description="登录您的账户继续使用LearnSync"
  >
    <LoginForm />
    
    <template #footer>
      <div class="auth-footer-links">
        <p>还没有账户？ <router-link to="/register" class="auth-link">立即注册</router-link></p>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../../components/auth/AuthLayout.vue';
import LoginForm from '../../components/auth/LoginForm.vue';
</script>

<style scoped>
.auth-footer-links {
  text-align: center;
}

.auth-footer-links p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
