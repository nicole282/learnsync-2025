<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>创建账户</h1>
          <p>加入 LearnSync 开始你的学习之旅</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-control"
              :class="{ error: errors.username }"
              placeholder="请输入用户名"
              required
            />
            <div v-if="errors.username" class="error-message">
              {{ errors.username }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">邮箱地址</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              :class="{ error: errors.email }"
              placeholder="请输入邮箱地址"
              required
            />
            <div v-if="errors.email" class="error-message">
              {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-control"
              :class="{ error: errors.password }"
              placeholder="请输入密码（至少6位）"
              required
            />
            <div v-if="errors.password" class="error-message">
              {{ errors.password }}
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="form-control"
              :class="{ error: errors.confirmPassword }"
              placeholder="请再次输入密码"
              required
            />
            <div v-if="errors.confirmPassword" class="error-message">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="form.agreeTerms"
                type="checkbox"
                class="checkbox"
                required
              />
              <span class="checkbox-text">
                我已阅读并同意
                <a href="#" class="link">服务条款</a>
                和
                <a href="#" class="link">隐私政策</a>
              </span>
            </label>
            <div v-if="errors.agreeTerms" class="error-message">
              {{ errors.agreeTerms }}
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            <span v-if="loading">
              <span class="spinner"></span>
              注册中...
            </span>
            <span v-else>创建账户</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>或使用以下方式注册</span>
        </div>

        <button
          class="btn btn-outline w-100 google-btn"
          @click="handleGoogleRegister"
        >
          <span class="google-icon">🔍</span>
          使用 Google 注册
        </button>

        <div class="auth-footer">
          <p>已有账户？ <router-link to="/login">立即登录</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: "",
});

// 验证函数
const validateForm = () => {
  let isValid = true;

  // 重置错误信息
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  // 用户名验证
  if (!form.username.trim()) {
    errors.username = "用户名不能为空";
    isValid = false;
  } else if (form.username.length < 2) {
    errors.username = "用户名至少2个字符";
    isValid = false;
  }

  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = "邮箱不能为空";
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = "请输入有效的邮箱地址";
    isValid = false;
  }

  // 密码验证
  if (!form.password) {
    errors.password = "密码不能为空";
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = "密码至少6位字符";
    isValid = false;
  }

  // 确认密码验证
  if (!form.confirmPassword) {
    errors.confirmPassword = "请确认密码";
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "两次输入的密码不一致";
    isValid = false;
  }

  // 条款同意验证
  if (!form.agreeTerms) {
    errors.agreeTerms = "请同意服务条款和隐私政策";
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    // 模拟注册请求 - 需要成员A完成后替换为真实API调用
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 模拟成功注册
    console.log("注册信息:", {
      username: form.username,
      email: form.email,
      password: form.password, // 实际中密码应该在发送前加密
    });

    // 显示成功消息
    alert("注册成功！请登录您的账户。");

    // 跳转到登录页面
    router.push("/login");
  } catch (error) {
    console.error("注册失败:", error);
    alert("注册失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const handleGoogleRegister = () => {
  // 模拟 Google OAuth 注册 - 需要成员A完成后替换
  alert("Google OAuth 注册功能待实现");
};
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  padding: var(--space-md);
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-xl);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-xl);

  h1 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
  }

  p {
    color: var(--text-secondary);
    margin: 0;
  }
}

.auth-form {
  margin-bottom: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-lg);

  label {
    display: block;
    margin-bottom: var(--space-sm);
    font-weight: 500;
    color: var(--text-primary);
  }
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  cursor: pointer;
  font-weight: normal;
  margin-bottom: 0;
}

.checkbox {
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

.link {
  color: var(--primary-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.form-control {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &.error {
    border-color: var(--danger-color);

    &:focus {
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
  }
}

.error-message {
  color: var(--danger-color);
  font-size: var(--font-size-sm);
  margin-top: var(--space-xs);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  gap: var(--space-sm);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &-primary {
    background: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }
  }

  &-outline {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-primary);

    &:hover:not(:disabled) {
      background: var(--bg-hover);
    }
  }
}

.w-100 {
  width: 100%;
}

.google-btn {
  margin-bottom: var(--space-lg);

  .google-icon {
    font-size: var(--font-size-lg);
  }
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: var(--space-lg) 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid var(--border-color);
  }

  span {
    padding: 0 var(--space-md);
  }
}

.auth-footer {
  text-align: center;

  p {
    color: var(--text-secondary);
    margin: 0;

    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: var(--space-sm);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 480px) {
  .auth-card {
    padding: var(--space-lg);
  }

  .auth-header h1 {
    font-size: var(--font-size-xl);
  }
}
</style>
