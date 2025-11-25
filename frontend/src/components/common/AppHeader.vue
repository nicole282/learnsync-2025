<template>
  <header class="app-header">
    <div class="header-left">
      <router-link to="/dashboard" class="logo">
        <h1>LearnSync</h1>
      </router-link>
    </div>

    <nav class="header-nav" v-if="isAuthenticated">
      <router-link to="/dashboard" class="nav-link">首页</router-link>
      <router-link to="/groups" class="nav-link">学习小组</router-link>
      <router-link to="/collaboration" class="nav-link">协作空间</router-link>
    </nav>

    <div class="header-right">
      <div class="user-info" v-if="isAuthenticated">
        <span class="username">欢迎，{{ user?.username || "用户" }}</span>
        <div class="dropdown">
          <button class="btn btn-outline btn-sm dropdown-toggle">
            {{ user?.username || "用户" }}
          </button>
          <div class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item"
              >个人资料</router-link
            >
            <button @click="handleLogout" class="dropdown-item">
              退出登录
            </button>
          </div>
        </div>
      </div>

      <div v-else class="auth-buttons">
        <router-link to="/login" class="btn btn-outline btn-sm"
          >登录</router-link
        >
        <router-link to="/register" class="btn btn-primary btn-sm"
          >注册</router-link
        >
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 临时模拟用户数据 - 需要成员A完成后替换
const user = computed(() => ({
  username: "测试用户",
  email: "test@example.com",
}));

const isAuthenticated = computed(() => localStorage.getItem("isAuthenticated"));

const handleLogout = () => {
  localStorage.removeItem("isAuthenticated");
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-lg);
  height: 64px;
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;

  @include mobile {
    padding: 0 var(--space-md);
  }
}

.logo {
  text-decoration: none;
  color: var(--primary-color);

  h1 {
    font-size: var(--font-size-xl);
    font-weight: 700;
  }
}

.header-nav {
  display: flex;
  gap: var(--space-xl);

  @include mobile {
    gap: var(--space-lg);
  }
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: var(--space-sm) 0;
  position: relative;
  transition: color 0.3s ease;

  &:hover,
  &.router-link-active {
    color: var(--primary-color);

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-color);
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.username {
  color: var(--text-primary);
  font-weight: 500;

  @include mobile {
    display: none;
  }
}

.dropdown {
  position: relative;

  &:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--space-sm) 0;
  min-width: 150px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: none;
  background: none;
  text-align: left;
  text-decoration: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: var(--bg-hover);
  }
}

.auth-buttons {
  display: flex;
  gap: var(--space-sm);
}
</style>
