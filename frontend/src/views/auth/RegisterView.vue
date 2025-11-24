<template>
  <AuthLayout 
    title="创建账户" 
    description="加入LearnSync，开启高效学习之旅"
  >
    <RegisterForm />
    
    <template #footer>
      <div class="auth-footer-links">
        <p>已有账户？ <router-link to="/login" class="auth-link">立即登录</router-link></p>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../../components/auth/AuthLayout.vue';
import RegisterForm from '../../components/auth/RegisterForm.vue';
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
