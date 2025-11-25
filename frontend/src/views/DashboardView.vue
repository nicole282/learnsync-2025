<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1>学习仪表盘</h1>
      <p>欢迎回到 LearnSync，继续你的学习之旅</p>
    </div>

    <div class="dashboard-grid">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-value">3</div>
            <div class="stat-label">学习小组</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-value">12</div>
            <div class="stat-label">学习资源</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-value">8.5</div>
            <div class="stat-label">学习时长(小时)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-value">75%</div>
            <div class="stat-label">任务完成率</div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="dashboard-section">
        <h2>最近活动</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">💬</div>
            <div class="activity-content">
              <p>在 <strong>算法学习小组</strong> 中发布了新消息</p>
              <span class="activity-time">2分钟前</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">📝</div>
            <div class="activity-content">
              <p>完成了 <strong>Vue.js 项目作业</strong></p>
              <span class="activity-time">1小时前</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">👥</div>
            <div class="activity-content">
              <p>加入了 <strong>Web开发进阶</strong> 小组</p>
              <span class="activity-time">3小时前</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="dashboard-section">
        <h2>快速操作</h2>
        <div class="quick-actions">
          <router-link to="/groups" class="quick-action">
            <div class="action-icon">➕</div>
            <span>创建小组</span>
          </router-link>
          <router-link to="/collaboration" class="quick-action">
            <div class="action-icon">💬</div>
            <span>开始协作</span>
          </router-link>
          <router-link to="/profile" class="quick-action">
            <div class="action-icon">👤</div>
            <span>个人资料</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加数据获取逻辑
</script>

<style lang="scss" scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
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

.dashboard-grid {
  display: grid;
  gap: var(--space-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.stat-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--space-xs);
}

.dashboard-section {
  h2 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-lg);
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.activity-icon {
  font-size: var(--font-size-lg);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.activity-content {
  flex: 1;

  p {
    margin: 0 0 var(--space-xs) 0;
    color: var(--text-primary);
  }
}

.activity-time {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.action-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
