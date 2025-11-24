import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, registerUser, logoutUser } from '../services/api.js';
import { setToken, getToken, removeToken } from '../utils/storage.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(getToken());
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await loginUser({ email, password });
      user.value = response.user;
      token.value = response.token;
      setToken(response.token);
      error.value = null;
      return { success: true, user: response.user };
    } catch (err) {
      error.value = err.message || '登录失败';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await registerUser(userData);
      user.value = response.user;
      token.value = response.token;
      setToken(response.token);
      error.value = null;
      return { success: true, user: response.user };
    } catch (err) {
      error.value = err.message || '注册失败';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('退出登录错误:', err);
    } finally {
      user.value = null;
      token.value = null;
      removeToken();
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError
  };
});
