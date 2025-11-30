<template>
  <div class="dashboard-page">
    <div class="welcome-container">
      <!-- Logo 和标题区域 -->
      <div class="brand-section">
        <div class="logo">
          <span class="logo-icon">📚</span>
          <h1 class="app-name">LearnSync</h1>
        </div>
        <p class="welcome-message">欢迎回到 LearnSync，继续你的学习之旅</p>
      </div>

      <!-- 快速操作区域 -->
      <div class="quick-actions">
        <router-link to="/groups" class="action-card">
          <div class="action-icon">👥</div>
          <h3>学习小组</h3>
          <p>加入或创建学习小组</p>
        </router-link>

        <router-link to="/chat" class="action-card">
          <div class="action-icon">💬</div>
          <h3>聊天室</h3>
          <p>与同学实时交流</p>
        </router-link>

        <router-link to="/profile" class="action-card">
          <div class="action-icon">👤</div>
          <h3>个人资料</h3>
          <p>查看和编辑个人信息</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 不需要复杂的逻辑，保持简单
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  padding: var(--space-xl);
}

.welcome-container {
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.brand-section {
  margin-bottom: var(--space-xl);

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);

    .logo-icon {
      font-size: 4rem;
      background: white;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
    }

    .app-name {
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  .welcome-message {
    font-size: var(--font-size-xl);
    color: white;
    margin: 0;
    opacity: 0.9;
    line-height: 1.5;
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-xl);
}

.action-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
  }

  .action-icon {
    font-size: 3rem;
    margin-bottom: var(--space-md);
  }

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--space-sm);
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-page {
    padding: var(--space-lg);
  }

  .brand-section {
    .logo {
      flex-direction: column;
      gap: var(--space-md);

      .logo-icon {
        width: 60px;
        height: 60px;
        font-size: 2.5rem;
      }

      .app-name {
        font-size: 2.5rem;
      }
    }

    .welcome-message {
      font-size: var(--font-size-lg);
    }
  }

  .quick-actions {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .action-card {
    padding: var(--space-lg);
  }
}

@media (max-width: 480px) {
  .brand-section {
    .logo {
      .logo-icon {
        width: 50px;
        height: 50px;
        font-size: 2rem;
      }

      .app-name {
        font-size: 2rem;
      }
    }

    .welcome-message {
      font-size: var(--font-size-base);
    }
  }
}
</style>
