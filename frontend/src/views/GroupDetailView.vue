<template>
  <div class="group-detail-view">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载小组详情中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>加载失败: {{ error }}</p>
      <button class="btn btn-primary" @click="fetchGroupDetail">重试</button>
    </div>

    <!-- 正常内容 -->
    <div v-else-if="group.id" class="group-content">
      <!-- 头部区域 -->
      <div class="group-header">
        <div class="group-cover">
          <div class="cover-placeholder">
            <span>{{ group.name.charAt(0).toUpperCase() }}</span>
          </div>
        </div>

        <div class="group-info">
          <h1 class="group-name">{{ group.name }}</h1>

          <div class="group-meta">
            <div class="meta-item">
              <span class="meta-icon">👥</span>
              <span>{{ group.member_count }} 成员</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>创建于 {{ formatDate(group.created_at) }}</span>
            </div>
            <div class="meta-item" v-if="group.course_code">
              <span class="meta-icon">📚</span>
              <span>{{ group.course_code }}</span>
            </div>
          </div>

          <div class="group-actions">
            <button class="btn btn-primary" v-if="!isMember" @click="joinGroup">
              加入小组
            </button>
            <button class="btn btn-secondary" v-else-if="!isOwner" @click="leaveGroup">
              退出小组
            </button>
            
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="group-content-body">
        <div class="content-sidebar">
          <!-- 小组描述 -->
          <div class="info-card">
            <h3 class="card-title">小组描述</h3>
            <p class="group-description">
              {{ group.description || '暂无描述' }}
            </p>
          </div>

          <!-- 小组信息 -->
          <div class="info-card">
            <h3 class="card-title">小组信息</h3>
            <div class="group-info-list">
              <div class="info-item">
                <span class="info-label">创建者:</span>
                <span class="info-value">{{ group.created_by_name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">最大成员:</span>
                <span class="info-value">{{ group.max_members }} 人</span>
              </div>
              <div class="info-item">
                <span class="info-label">分类:</span>
                <span class="info-value">{{ getCategoryLabel(group.category) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">状态:</span>
                <span class="info-value">{{ group.is_public ? '公开' : '私密' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="content-main">
          <div class="info-card">
            <h3>小组功能</h3>
            <p>当前小组: <strong>{{ group.name }}</strong></p>
            <p>小组ID: {{ group.id }}</p>
            <p>更多功能开发中...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据为空状态 -->
    <div v-else class="empty-state">
      <p>未找到小组信息</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api.js'

const route = useRoute()
const group = ref({})
const loading = ref(true)
const error = ref(null)

// 计算属性
const isMember = computed(() => {
  // 简化逻辑，实际应该检查当前用户是否在小组中
  return false
})

// 方法
const getCategoryLabel = (category) => {
  const categories = {
    algorithm: "算法",
    web: "Web开发",
    database: "数据库",
    ai: "人工智能", 
    math: "数学",
    other: "其他",
  };
  return categories[category] || "其他";
}

const joinGroup = async () => {
  try {
    await api.post(`/groups/${route.params.id}/join`)
    alert('成功加入小组！')
    fetchGroupDetail() // 刷新数据
  } catch (error) {
    console.error('加入小组失败:', error)
    alert('加入失败: ' + (error.message || '未知错误'))
  }
}


const formatDate = (date) => {
  if (!date) return '未知'
  return new Date(date).toLocaleDateString('zh-CN')
}

const fetchGroupDetail = async () => {
  loading.value = true
  error.value = null
  try {
    console.log('🔄 获取小组详情，ID:', route.params.id)
    const data = await api.get(`/groups/${route.params.id}`)
    console.log('✅ 小组详情数据:', data)
    group.value = data.group || {}
  } catch (err) {
    console.error('获取小组详情失败:', err)
    error.value = err.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('📍 小组详情页加载，ID:', route.params.id)
  fetchGroupDetail()
})

// 退出小组
const leaveGroup = async () => {
  if (!confirm('确定要退出这个小组吗？')) {
    return;
  }

  try {
    console.log('🚪 正在退出小组:', route.params.id);
    await api.post(`/groups/${route.params.id}/leave`);
    
    alert('成功退出小组！');
    // 跳转回小组列表
    router.push('/groups');
  } catch (error) {
    console.error('退出小组失败:', error);
    alert('退出失败: ' + (error.message || '未知错误'));
  }
};

// 添加计算属性判断是否是创建者
const isOwner = computed(() => {
  return group.value.created_by === 1; // 假设当前用户ID是1
});

// 删除小组（在详情页）
const deleteGroup = async () => {
  if (!confirm('确定要删除这个小组吗？此操作不可恢复！')) {
    return;
  }

  try {
    await api.delete(`/groups/${route.params.id}`);
    alert('小组删除成功！');
    router.push('/groups');
  } catch (error) {
    console.error('删除小组失败:', error);
    alert('删除失败: ' + (error.message || '未知错误'));
  }
};
</script>

<style scoped>
/* 加载和错误状态样式 */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 其他样式保持不变 */
.group-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.group-header {
  display: flex;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.group-cover {
  width: 300px;
  flex-shrink: 0;
}

.cover-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
}

.group-info {
  flex: 1;
  padding: 24px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.group-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.group-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 14px;
}

.group-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--secondary-dark);
}

/* 内容区域 */
.group-content-body {
  display: flex;
  gap: 24px;
}

.content-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.content-main {
  flex: 1;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.group-description {
  color: var(--text-secondary);
  line-height: 1.5;
}

.group-info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.info-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.info-value {
  color: var(--text-primary);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .group-header {
    flex-direction: column;
  }

  .group-cover {
    width: 100%;
  }

  .group-content-body {
    flex-direction: column;
  }

  .content-sidebar {
    width: 100%;
  }
}
</style>