<template>
  <form @submit.prevent="handleRegister" class="register-form">
    <div class="form-row">
      <div class="form-group">
        <label for="username" class="form-label">用户名</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="form-input"
          :class="{ 'error': errors.username }"
          placeholder="请输入用户名"
          required
        />
        <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
      </div>

      <div class="form-group">
        <label for="email" class="form-label">邮箱地址</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-input"
          :class="{ 'error': errors.email }"
          placeholder="请输入邮箱地址"
          required
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="password" class="form-label">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-input"
          :class="{ 'error': errors.password }"
          placeholder="请输入密码"
          required
        />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="form-label">确认密码</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="form-input"
          :class="{ 'error': errors.confirmPassword }"
          placeholder="请再次输入密码"
          required
        />
        <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
      </div>
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.agreeTerms" />
        <span class="checkmark"></span>
        我同意 <a href="#" class="terms-link">服务条款</a> 和 <a href="#" class="terms-link">隐私政策</a>
      </label>
      <div v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</div>
    </div>

    <button 
      type="submit" 
      class="submit-button"
      :disabled="loading"
      :class="{ 'loading': loading }"
    >
      <span v-if="!loading">注册</span>
      <span v-else class="loading-text">注册中...</span>
    </button>

    <div v-if="authStore.error" class="alert alert-error">
      {{ authStore.error }}
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
});

const loading = ref(false);

// 表单验证
const validateForm = () => {
  let isValid = true;
  
  // 清空错误信息
  Object.keys(errors).forEach(key => errors[key] = '');
  
  // 用户名验证
  if (!form.username) {
    errors.username = '请输入用户名';
    isValid = false;
  } else if (form.username.length < 3) {
    errors.username = '用户名至少3个字符';
    isValid = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = '用户名只能包含字母、数字和下划线';
    isValid = false;
  }
  
  // 邮箱验证
  if (!form.email) {
    errors.email = '请输入邮箱地址';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = '请输入有效的邮箱地址';
    isValid = false;
  }
  
  // 密码验证
  if (!form.password) {
    errors.password = '请输入密码';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少6位';
    isValid = false;
  }
  
  // 确认密码验证
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }
  
  // 条款同意验证
  if (!form.agreeTerms) {
    errors.agreeTerms = '请同意服务条款和隐私政策';
    isValid = false;
  }
  
  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  
  const userData = {
    username: form.username,
    email: form.email,
    password: form.password
  };
  
  const result = await authStore.register(userData);
  
  if (result.success) {
    // 注册成功，跳转到首页
    router.push('/');
  }
  
  loading.value = false;
};

// 组件挂载时清空错误信息
onMounted(() => {
  authStore.clearError();
});
</script>

<style scoped>
.register-form {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 5px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 2px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input:checked + .checkmark {
  background-color: #667eea;
  border-color: #667eea;
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.terms-link {
  color: #667eea;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.submit-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-button.loading {
  background: #a0aec0;
}

.loading-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-text::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 0.9rem;
}

.alert-error {
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
