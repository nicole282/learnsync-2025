<template>
  <aside class="app-sidebar">
    <div class="sidebar-content">
      <div class="sidebar-section">
        <h3 class="sidebar-title">学习空间</h3>
        <nav class="sidebar-nav">
          <router-link to="/dashboard" class="sidebar-link">
            <span class="icon">📊</span>
            <span class="text">学习仪表盘</span>
          </router-link>
          <router-link to="/groups" class="sidebar-link">
            <span class="icon">👥</span>
            <span class="text">我的小组</span>
          </router-link>
          <router-link to="/collaboration" class="sidebar-link">
            <span class="icon">💬</span>
            <span class="text">协作空间</span>
          </router-link>
        </nav>
      </div>

      <div class="sidebar-section" v-if="recentGroups.length">
        <h3 class="sidebar-title">最近访问</h3>
        <div class="recent-groups">
          <router-link
            v-for="group in recentGroups"
            :key="group.id"
            :to="`/groups/${group.id}`"
            class="recent-group-item"
          >
            <span class="group-avatar">{{ group.name.charAt(0) }}</span>
            <span class="group-name">{{ group.name }}</span>
          </router-link>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="online-status">
          <div class="status-dot"></div>
          <span>在线学习</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

// 临时模拟数据 - 需要成员B完成后替换
const recentGroups = ref([
  { id: 1, name: "算法学习小组" },
  { id: 2, name: "Web开发进阶" },
  { id: 3, name: "数据库设计" },
]);
</script>

<style lang="scss" scoped>
.app-sidebar {
  width: 250px;
  height: 100vh;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  position: fixed;
  left: 0;
  top: 64px;
  overflow-y: auto;

  @include mobile {
    transform: translateX(-100%);
    z-index: 90;
  }
}

.sidebar-content {
  padding: var(--space-lg);
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}

.sidebar-section {
  margin-bottom: var(--space-xl);
}

.sidebar-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-md);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  &.router-link-active {
    background: var(--primary-color);
    color: white;

    .icon {
      transform: scale(1.1);
    }
  }

  .icon {
    font-size: var(--font-size-lg);
    transition: transform 0.3s ease;
  }

  .text {
    font-weight: 500;
  }
}

.recent-groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.recent-group-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .group-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    font-weight: 600;
  }

  .group-name {
    font-size: var(--font-size-sm);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.sidebar-footer {
  margin-top: auto;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-color);
}

.online-status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-muted);
  font-size: var(--font-size-sm);

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--secondary-color);
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
