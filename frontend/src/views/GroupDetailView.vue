<!-- frontend/src/views/GroupDetailView.vue -->
<template>
  <div class="group-detail">
    <div class="back-nav">
      <button @click="goBack" class="back-btn">← 返回小组列表</button>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="group" class="group-content">
      <!-- 小组头部信息 -->
      <div class="group-header">
        <h1>{{ group.name }}</h1>
        <div class="group-meta">
          <span class="course-code">{{ group.course_code }}</span>
          <span class="member-count">{{ members.length }} 成员</span>
          <span class="created-date">创建于 {{ formatDate(group.created_at) }}</span>
        </div>
        <p class="group-description">{{ group.description }}</p>
      </div>

      <!-- 成员列表 -->
      <div class="members-section">
        <h3>小组成员</h3>
        <div class="members-list">
          <div v-for="member in members" :key="member.id" class="member-item">
            <div class="member-avatar">
              {{ member.username?.charAt(0) || 'U' }}
            </div>
            <div class="member-info">
              <span class="member-name">{{ member.username || '未知用户' }}</span>
              <span class="member-role" :class="member.role">{{ member.role }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <button @click="showInviteDialog = true" class="action-btn">
          👥 邀请成员
        </button>
        <button @click="leaveGroup" class="action-btn leave-btn">
          🚪 退出小组
        </button>
      </div>
    </div>

    <!-- 邀请成员对话框 -->
    <div v-if="showInviteDialog" class="modal-overlay" @click="showInviteDialog = false">
      <div class="modal-content" @click.stop>
        <h3>邀请成员</h3>
        <p>分享此链接邀请成员加入：</p>
        <div class="invite-link">
          <input :value="inviteLink" readonly class="link-input">
          <button @click="copyInviteLink" class="copy-btn">复制</button>
        </div>
        <div class="form-actions">
          <button @click="showInviteDialog = false" class="btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const group = ref(null)
const members = ref([])
const loading = ref(true)
const showInviteDialog = ref(false)

const groupId = route.params.id

function goBack() {
  router.back()
}
// 生成邀请链接
const inviteLink = computed(() => {
  return `${window.location.origin}/groups/${groupId}/join`
})

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 加载小组详情
async function loadGroupDetail() {
  try {
    loading.value = true
    const response = await fetch(`/api/groups/${groupId}`)
    const data = await response.json()
    
    if (response.ok) {
      group.value = data.group
      loadGroupMembers()
    } else {
      alert('加载小组详情失败: ' + data.error)
    }
  } catch (error) {
    console.error('加载小组详情错误:', error)
    alert('加载小组详情失败')
  } finally {
    loading.value = false
  }
}

// 加载小组成员 - 使用真实API
async function loadGroupMembers() {
  try {
    const response = await fetch(`/api/groups/${groupId}/members`)
    const data = await response.json()
    
    if (response.ok) {
      members.value = data.members
      console.log('真实成员数据:', members.value)
    } else {
      console.error('获取成员失败:', data.error)
      members.value = [] // 失败时清空
    }
  } catch (error) {
    console.error('加载成员错误:', error)
    members.value = [] // 错误时清空
  }
}

// 复制邀请链接
async function copyInviteLink() {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    alert('链接已复制到剪贴板！')
  } catch (error) {
    console.error('复制失败:', error)
    alert('复制失败，请手动复制链接')
  }
}

// 退出小组
async function leaveGroup() {
  if (confirm('确定要退出这个小组吗？')) {
    try {
      // 这里调用退出API
      alert('退出小组功能待实现')
    } catch (error) {
      console.error('退出小组错误:', error)
      alert('退出小组失败')
    }
  }
}

onMounted(() => {
  loadGroupDetail()
})
</script>

<style scoped>
.group-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-nav {
  margin-bottom: 20px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background: #5a6268;
}

.group-header {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.group-header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.group-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.course-code, .member-count, .created-date {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.group-description {
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.members-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.members-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-name {
  font-weight: 500;
  color: #333;
}

.member-role {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: capitalize;
}

.member-role.owner {
  background: #ffeb3b;
  color: #333;
}

.member-role.admin {
  background: #4CAF50;
  color: white;
}

.member-role.member {
  background: #2196F3;
  color: white;
}

.quick-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.action-btn:first-child {
  background: #4CAF50;
  color: white;
}

.action-btn:first-child:hover {
  background: #45a049;
}

.leave-btn {
  background: #dc3545;
  color: white;
}

.leave-btn:hover {
  background: #c82333;
}

.invite-link {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.link-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
}

.copy-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #1976d2;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #5a6268;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #333;
}
</style>