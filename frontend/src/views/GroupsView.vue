<!-- frontend/src/views/GroupsView.vue -->
<template>
  <div class="groups-view">
    <div class="page-header">
      <h2>学习小组</h2>
      <button class="create-btn" @click="showCreateForm = true">
        + 创建新小组
      </button>
    </div>

    <!-- 小组列表 -->
    <div class="groups-container">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="groups.length === 0" class="empty-state">
        <p>还没有学习小组</p>
        <button @click="showCreateForm = true" class="btn-primary">
          创建第一个小组
        </button>
      </div>

      <div v-else class="groups-grid">
        <div 
          v-for="group in groups" 
          :key="group.id"
          class="group-card"
          @click="viewGroupDetail(group.id)"  
        >
          <div class="group-header">
            <h3>{{ group.name }}</h3>
            <span class="member-count">{{ group.member_count }} 成员</span>
          </div>
          <p class="group-description">{{ group.description }}</p>
          <div class="group-footer">
            <span class="course-code">{{ group.course_code }}</span>
            <button class="join-btn" @click="joinGroup(group.id)">
              加入小组
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建小组表单 -->
    <div v-if="showCreateForm" class="modal-overlay" @click="showCreateForm = false">
      <div class="modal-content" @click.stop>
        <h3>创建新小组</h3>
        <form @submit.prevent="createGroup">
          <div class="form-group">
            <label>小组名称</label>
            <input 
              v-model="newGroup.name" 
              type="text" 
              required 
              placeholder="输入小组名称"
            >
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea 
              v-model="newGroup.description" 
              placeholder="小组描述..."
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label>课程代码</label>
            <input 
              v-model="newGroup.course_code" 
              type="text" 
              placeholder="如: IEMS5731"
            >
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateForm = false">取消</button>
            <button type="submit" class="btn-primary">创建小组</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function viewGroupDetail(groupId) {
  router.push(`/groups/${groupId}`)
}
// 响应式数据
const groups = ref([])
const loading = ref(true)
const showCreateForm = ref(false)
const newGroup = ref({
  name: '',
  description: '',
  course_code: ''
})

// 加载小组列表
async function loadGroups() {
  try {
    loading.value = true
    const response = await fetch('/api/groups')
    const data = await response.json()
    groups.value = data.groups
  } catch (error) {
    console.error('加载小组失败:', error)
    alert('加载小组列表失败')
  } finally {
    loading.value = false
  }
}

// 创建新小组
async function createGroup() {
  try {
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGroup.value)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      showCreateForm.value = false
      newGroup.value = { name: '', description: '', course_code: '' }
      loadGroups() // 重新加载列表
      alert('小组创建成功！')
    } else {
      alert('创建失败: ' + data.error)
    }
  } catch (error) {
    console.error('创建小组失败:', error)
    alert('创建小组失败')
  }
}

// 加入小组
async function joinGroup(groupId) {
  try {
    const response = await fetch(`/api/groups/${groupId}/join`, {
      method: 'POST'
    })
    
    const data = await response.json()
    
    if (response.ok) {
      alert('成功加入小组！')
      loadGroups() // 重新加载列表
    } else {
      alert('加入失败: ' + data.error)
    }
  } catch (error) {
    console.error('加入小组失败:', error)
    alert('加入小组失败')
  }
}

// 页面加载时获取小组列表
onMounted(() => {
  loadGroups()
})
</script>

<style scoped>
.groups-view {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  color: #333;
  font-size: 24px;
}

.create-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.create-btn:hover {
  background: #45a049;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.group-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
}

.group-header h3 {
  color: #333;
  font-size: 18px;
  margin: 0;
}

.member-count {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.group-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.4;
}

.group-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-code {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.join-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.join-btn:hover {
  background: #1976d2;
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
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.form-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}
</style>