<template>
  <div class="groups-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>学习小组</h1>
        <p>加入小组与同学一起学习，或创建自己的学习小组</p>
      </div>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <span class="btn-icon">➕</span>
        创建新小组
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters-section">
      <div class="search-box">
        <div class="search-icon">🔍</div>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索小组名称、课程或描述..."
        />
        <button
          v-if="searchQuery"
          class="clear-search"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>

      <div class="filter-controls">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">所有分类</option>
          <option value="algorithm">算法</option>
          <option value="web">Web开发</option>
          <option value="database">数据库</option>
          <option value="ai">人工智能</option>
          <option value="math">数学</option>
        </select>

        <select v-model="sortBy" class="filter-select">
          <option value="newest">最新创建</option>
          <option value="popular">最受欢迎</option>
          <option value="members">成员最多</option>
        </select>

        <div class="view-toggle">
          <button
            class="view-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            ▦ 网格
          </button>
          <button
            class="view-btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            ☰ 列表
          </button>
        </div>
      </div>
    </div>

    <!-- 小组列表 -->
    <div class="groups-container">
      <!-- 我的小组 -->
      <section class="groups-section" v-if="myGroups.length > 0">
        <div class="section-header">
          <h2>我的小组</h2>
          <span class="section-count">{{ myGroups.length }} 个小组</span>
        </div>

        <div class="groups-grid" :class="viewMode">
          <GroupCard
            v-for="group in myGroups"
            :key="group.id"
            :group="group"
            :view-mode="viewMode"
            :is-member="true"
            @click="viewGroupDetail(group.id)"
          />
        </div>
      </section>

      <!-- 推荐小组 -->
      <section class="groups-section">
        <div class="section-header">
          <h2>推荐小组</h2>
          <span class="section-count">{{ filteredGroups.length }} 个小组</span>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载小组中...</p>
        </div>

        <div v-else-if="filteredGroups.length === 0" class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>没有找到匹配的小组</h3>
          <p>尝试调整搜索条件或创建新的小组</p>
          <button class="btn btn-primary" @click="showCreateModal = true">
            创建第一个小组
          </button>
        </div>

        <div v-else class="groups-grid" :class="viewMode">
          <GroupCard
            v-for="group in filteredGroups"
            :key="group.id"
            :group="group"
            :view-mode="viewMode"
            :is-member="false"
            @join="handleJoinGroup(group.id)"
            @view="viewGroupDetail(group.id)"
          />
        </div>
      </section>
    </div>

    <!-- 创建小组模态框 -->
    <ModalDialog v-model:visible="showCreateModal" title="创建新小组" size="md">
      <form @submit.prevent="handleCreateGroup" class="create-group-form">
        <div class="form-group">
          <label for="groupName">小组名称 *</label>
          <input
            id="groupName"
            v-model="newGroup.name"
            type="text"
            class="form-control"
            placeholder="例如：算法学习小组"
            required
            maxlength="50"
          />
          <div class="char-count">{{ newGroup.name.length }}/50</div>
        </div>

        <div class="form-group">
          <label for="groupDescription">小组描述</label>
          <textarea
            id="groupDescription"
            v-model="newGroup.description"
            class="form-control"
            placeholder="描述小组的学习目标和主题..."
            rows="3"
            maxlength="200"
          ></textarea>
          <div class="char-count">{{ newGroup.description.length }}/200</div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="groupCategory">分类</label>
            <select
              id="groupCategory"
              v-model="newGroup.category"
              class="form-control"
            >
              <option value="algorithm">算法</option>
              <option value="web">Web开发</option>
              <option value="database">数据库</option>
              <option value="ai">人工智能</option>
              <option value="math">数学</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div class="form-group">
            <label for="maxMembers">最大成员数</label>
            <select
              id="maxMembers"
              v-model="newGroup.maxMembers"
              class="form-control"
            >
              <option value="10">10人</option>
              <option value="20">20人</option>
              <option value="50">50人</option>
              <option value="100">100人</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="courseCode">关联课程代码（可选）</label>
          <input
            id="courseCode"
            v-model="newGroup.courseCode"
            type="text"
            class="form-control"
            placeholder="例如：IEMS5731"
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="newGroup.isPublic"
              type="checkbox"
              class="checkbox"
            />
            <span class="checkbox-text">公开小组（任何人都可以加入）</span>
          </label>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-outline"
            @click="showCreateModal = false"
          >
            取消
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!newGroup.name.trim() || creatingGroup"
          >
            <span v-if="creatingGroup">
              <span class="spinner"></span>
              创建中...
            </span>
            <span v-else>创建小组</span>
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- 加入小组确认模态框 -->
    <ModalDialog v-model:visible="showJoinModal" title="加入小组" size="sm">
      <div class="join-group-modal">
        <p>
          确定要加入 <strong>{{ selectedGroup?.name }}</strong> 小组吗？
        </p>

        <div class="modal-actions">
          <button class="btn btn-outline" @click="showJoinModal = false">
            取消
          </button>
          <button
            class="btn btn-primary"
            @click="confirmJoinGroup"
            :disabled="joiningGroup"
          >
            <span v-if="joiningGroup">
              <span class="spinner"></span>
              加入中...
            </span>
            <span v-else>确认加入</span>
          </button>
        </div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ModalDialog from "@/components/common/ModalDialog.vue";

// 临时导入 GroupCard 组件（需要创建）
const GroupCard = {
  props: ["group", "viewMode", "isMember"],
  emits: ["join", "view"],
  template: `
    <div class="group-card" :class="viewMode" @click="$emit('view')">
      <div class="card-header">
        <div class="group-avatar">
          {{ group.name.charAt(0).toUpperCase() }}
        </div>
        <div class="group-info">
          <h3 class="group-name">{{ group.name }}</h3>
          <span class="group-category">{{ getCategoryLabel(group.category) }}</span>
        </div>
        <div class="group-actions" v-if="!isMember" @click.stop>
          <button class="btn btn-primary btn-sm" @click="$emit('join')">
            加入小组
          </button>
        </div>
      </div>

      <p class="group-description">{{ group.description }}</p>

      <div class="group-meta">
        <div class="meta-item">
          <span class="meta-icon">👥</span>
          <span>{{ group.memberCount }}/{{ group.maxMembers }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">📅</span>
          <span>{{ formatDate(group.createdAt) }}</span>
        </div>
        <div class="meta-item" v-if="group.courseCode">
          <span class="meta-icon">📚</span>
          <span>{{ group.courseCode }}</span>
        </div>
      </div>

      <div class="group-tags">
        <span class="tag" :class="group.category">
          {{ getCategoryLabel(group.category) }}
        </span>
        <span class="tag" v-if="group.isPublic">公开</span>
        <span class="tag private" v-else>私密</span>
      </div>
    </div>
  `,
  methods: {
    getCategoryLabel(category) {
      const categories = {
        algorithm: "算法",
        web: "Web开发",
        database: "数据库",
        ai: "人工智能",
        math: "数学",
        other: "其他",
      };
      return categories[category] || "其他";
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("zh-CN");
    },
  },
};

const router = useRouter();

// 响应式数据
const searchQuery = ref("");
const selectedCategory = ref("");
const sortBy = ref("newest");
const viewMode = ref("grid");
const showCreateModal = ref(false);
const showJoinModal = ref(false);
const loading = ref(false);
const creatingGroup = ref(false);
const joiningGroup = ref(false);

const selectedGroup = ref(null);

// 模拟小组数据
const myGroups = ref([
  {
    id: 1,
    name: "算法学习小组",
    description: "共同学习数据结构与算法，准备面试和竞赛",
    category: "algorithm",
    memberCount: 8,
    maxMembers: 20,
    courseCode: "IEMS5731",
    isPublic: true,
    createdAt: "2024-01-15",
    createdBy: "我",
  },
  {
    id: 2,
    name: "Web全栈开发",
    description: "学习前后端开发技术，构建完整的Web应用",
    category: "web",
    memberCount: 5,
    maxMembers: 15,
    courseCode: "IEMS5731",
    isPublic: true,
    createdAt: "2024-01-20",
    createdBy: "我",
  },
]);

const allGroups = ref([
  {
    id: 3,
    name: "数据库设计与优化",
    description: "深入学习数据库原理、SQL优化和NoSQL技术",
    category: "database",
    memberCount: 12,
    maxMembers: 30,
    courseCode: "IEMS5731",
    isPublic: true,
    createdAt: "2024-01-10",
    createdBy: "张三",
  },
  {
    id: 4,
    name: "机器学习入门",
    description: "从零开始学习机器学习算法和Python实现",
    category: "ai",
    memberCount: 25,
    maxMembers: 50,
    courseCode: "IEMS5731",
    isPublic: true,
    createdAt: "2024-01-08",
    createdBy: "李四",
  },
  {
    id: 5,
    name: "高等数学研讨",
    description: "讨论高等数学难题，共同准备期末考试",
    category: "math",
    memberCount: 6,
    maxMembers: 10,
    courseCode: "MATH101",
    isPublic: false,
    createdAt: "2024-01-18",
    createdBy: "王五",
  },
  {
    id: 6,
    name: "Vue.js进阶学习",
    description: "深入学习Vue 3组合式API和生态系统",
    category: "web",
    memberCount: 18,
    maxMembers: 25,
    courseCode: "IEMS5731",
    isPublic: true,
    createdAt: "2024-01-12",
    createdBy: "赵六",
  },
]);

const newGroup = reactive({
  name: "",
  description: "",
  category: "algorithm",
  maxMembers: 20,
  courseCode: "",
  isPublic: true,
});

// 计算属性
const filteredGroups = computed(() => {
  let groups = allGroups.value.filter(
    (group) => !myGroups.value.some((myGroup) => myGroup.id === group.id)
  );

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    groups = groups.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        (group.courseCode && group.courseCode.toLowerCase().includes(query))
    );
  }

  // 分类过滤
  if (selectedCategory.value) {
    groups = groups.filter(
      (group) => group.category === selectedCategory.value
    );
  }

  // 排序
  switch (sortBy.value) {
    case "newest":
      groups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "popular":
      groups.sort((a, b) => b.memberCount - a.memberCount);
      break;
    case "members":
      groups.sort((a, b) => b.memberCount - a.memberCount);
      break;
  }

  return groups;
});

// 方法
const handleCreateGroup = async () => {
  if (!newGroup.name.trim()) return;

  creatingGroup.value = true;

  try {
    // 模拟API调用 - 需要成员B完成后替换
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newGroupData = {
      id: Date.now(),
      ...newGroup,
      memberCount: 1,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "我",
    };

    myGroups.value.unshift(newGroupData);

    // 重置表单
    Object.assign(newGroup, {
      name: "",
      description: "",
      category: "algorithm",
      maxMembers: 20,
      courseCode: "",
      isPublic: true,
    });

    showCreateModal.value = false;

    // 显示成功消息
    alert("小组创建成功！");
  } catch (error) {
    console.error("创建小组失败:", error);
    alert("创建失败，请稍后重试");
  } finally {
    creatingGroup.value = false;
  }
};

const handleJoinGroup = (groupId) => {
  const group = allGroups.value.find((g) => g.id === groupId);
  if (group) {
    selectedGroup.value = group;
    showJoinModal.value = true;
  }
};

const confirmJoinGroup = async () => {
  if (!selectedGroup.value) return;

  joiningGroup.value = true;

  try {
    // 模拟API调用 - 需要成员B完成后替换
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 更新小组数据
    const groupIndex = allGroups.value.findIndex(
      (g) => g.id === selectedGroup.value.id
    );
    if (groupIndex !== -1) {
      allGroups.value[groupIndex].memberCount++;
    }

    // 添加到我的小组
    myGroups.value.unshift({
      ...selectedGroup.value,
      memberCount: selectedGroup.value.memberCount + 1,
    });

    showJoinModal.value = false;
    selectedGroup.value = null;

    // 显示成功消息
    alert("成功加入小组！");
  } catch (error) {
    console.error("加入小组失败:", error);
    alert("加入失败，请稍后重试");
  } finally {
    joiningGroup.value = false;
  }
};

const viewGroupDetail = (groupId) => {
  router.push(`/groups/${groupId}`);
};

// 生命周期
onMounted(() => {
  // 模拟加载数据
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style lang="scss" scoped>
.groups-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);

  .header-content {
    h1 {
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
      font-size: var(--font-size-base);
    }
  }

  .btn {
    .btn-icon {
      margin-right: var(--space-sm);
    }
  }
}

.filters-section {
  background: var(--bg-card);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
  border: 1px solid var(--border-color);
}

.search-box {
  position: relative;
  margin-bottom: var(--space-lg);

  .search-icon {
    position: absolute;
    left: var(--space-md);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }

  .search-input {
    width: 100%;
    padding: var(--space-md) var(--space-md) var(--space-md)
      calc(var(--space-md) * 2 + 16px);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
  }

  .clear-search {
    position: absolute;
    right: var(--space-md);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--space-xs);

    &:hover {
      color: var(--text-primary);
    }
  }
}

.filter-controls {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
  font-size: var(--font-size-sm);
}

.view-toggle {
  display: flex;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
  padding: 2px;
  margin-left: auto;
}

.view-btn {
  padding: var(--space-sm) var(--space-md);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all 0.3s ease;

  &.active {
    background: white;
    box-shadow: var(--shadow-sm);
  }
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.groups-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);

    h2 {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .section-count {
      color: var(--text-muted);
      font-size: var(--font-size-sm);
    }
  }
}

.groups-grid {
  display: grid;
  gap: var(--space-lg);

  &.grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  &.list {
    grid-template-columns: 1fr;
  }
}

// GroupCard 样式
.group-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  &.list {
    display: flex;
    align-items: flex-start;
    gap: var(--space-lg);

    .card-header {
      flex: 1;
    }

    .group-description {
      flex: 2;
      margin-bottom: 0;
    }

    .group-meta {
      flex: 1;
    }
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.group-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: 700;
  flex-shrink: 0;
}

.group-info {
  flex: 1;

  .group-name {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--space-xs) 0;
  }

  .group-category {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    background: var(--bg-hover);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
  }
}

.group-actions {
  flex-shrink: 0;
}

.group-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-lg);
  display: -webkit-box;
  -webkit-line-clamp: 3; // 限制为3行
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3; // 添加标准属性
}

.group-meta {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);

  .meta-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--font-size-sm);
    color: var(--text-muted);

    .meta-icon {
      font-size: var(--font-size-base);
    }
  }
}

.group-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;

  .tag {
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    font-weight: 500;

    &.algorithm {
      background: #e3f2fd;
      color: #1976d2;
    }
    &.web {
      background: #f3e5f5;
      color: #7b1fa2;
    }
    &.database {
      background: #e8f5e8;
      color: #388e3c;
    }
    &.ai {
      background: #fff3e0;
      color: #f57c00;
    }
    &.math {
      background: #fce4ec;
      color: #c2185b;
    }
    &.other {
      background: #f5f5f5;
      color: #616161;
    }

    &.private {
      background: #ffebee;
      color: #d32f2f;
    }
  }
}

// 表单样式
.create-group-form {
  .form-group {
    margin-bottom: var(--space-lg);

    label {
      display: block;
      margin-bottom: var(--space-sm);
      font-weight: 500;
      color: var(--text-primary);
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
  }
}

.char-count {
  text-align: right;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-top: var(--space-xs);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  cursor: pointer;
  font-weight: normal;
}

.checkbox {
  margin-top: 0.2rem;
}

.checkbox-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  margin-top: var(--space-xl);
}

// 状态样式
.loading-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-muted);

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--space-md);
  }
}

.empty-state {
  text-align: center;
  padding: var(--space-xl);

  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--space-lg);
  }

  h3 {
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: var(--space-lg);
  }
}

.join-group-modal {
  text-align: center;

  p {
    margin-bottom: var(--space-xl);
    color: var(--text-primary);
  }
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
@media (max-width: 1024px) {
  .groups-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .groups-page {
    padding: var(--space-md);
  }

  .page-header {
    flex-direction: column;
    gap: var(--space-md);

    .btn {
      align-self: stretch;
    }
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;

    .view-toggle {
      margin-left: 0;
      align-self: center;
    }
  }

  .form-row {
    grid-template-columns: 1fr !important;
  }

  .groups-grid.grid {
    grid-template-columns: 1fr;
  }

  .group-card.list {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .group-meta {
    flex-direction: column;
    gap: var(--space-sm);
  }
}
</style>
