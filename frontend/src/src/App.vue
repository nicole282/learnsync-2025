<template>
  <div class="app-layout">
    <AppHeader v-if="showHeader" />
    <div class="app-body">
      <AppSidebar v-if="showSidebar" />
      <main class="main-content" :class="{ 'with-sidebar': showSidebar }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    <LoadingSpinner v-if="globalLoading" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
import AppSidebar from "@/components/common/AppSidebar.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

const route = useRoute();

// 在登录页面不显示头部和侧边栏
const showHeader = computed(() => !["Login", "Register"].includes(route.name));
const showSidebar = computed(() => !["Login", "Register"].includes(route.name));

// 全局加载状态（需要从 store 获取）
const globalLoading = computed(() => false);
</script>

<style lang="scss">
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
}

.app-body {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  transition: margin-left 0.3s ease;

  &.with-sidebar {
    margin-left: 250px;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
