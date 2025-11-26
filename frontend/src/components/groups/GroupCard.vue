<template>
  <div class="group-card" :class="viewMode" @click="$emit('view')">
    <div class="card-header">
      <div class="group-avatar">
        {{ group.name.charAt(0).toUpperCase() }}
      </div>
      <div class="group-info">
        <h3 class="group-name">{{ group.name }}</h3>
        <span class="group-category">{{ getCategoryLabel(group.category) }}</span>
      </div>
     <!-- 修改这里：添加删除按钮 -->
      <div class="group-actions" @click.stop>
        <button 
          v-if="isMember" 
          class="btn btn-danger btn-sm"
          @click="$emit('delete')"
        >
          🗑️ 删除
        </button>
        <button 
          v-else 
          class="btn btn-primary btn-sm"
          @click="$emit('join')"
        >
          加入小组
        </button>
      </div>
    </div>

    <p class="group-description">{{ group.description }}</p>

    <div class="group-meta">
      <div class="meta-item">
        <span class="meta-icon">👥</span>
        <span>{{ group.member_count }}/{{ group.max_members }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">📅</span>
        <span>{{ formatDate(group.created_at) }}</span>
      </div>
      <div class="meta-item" v-if="group.course_code">
        <span class="meta-icon">📚</span>
        <span>{{ group.course_code }}</span>
      </div>
    </div>

    <div class="group-tags">
      <span class="tag" :class="group.category || 'other'">
        {{ getCategoryLabel(group.category) }}
      </span>
      <span class="tag" v-if="group.is_public">公开</span>
      <span class="tag private" v-else>私密</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  group: Object,
  viewMode: String,
  isMember: Boolean
})

const emit = defineEmits(['join', 'view', 'delete'])

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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("zh-CN");
}
</script>

<style scoped>
.group-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
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
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
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
}

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

.group-actions {
  flex-shrink: 0;
}

.group-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-lg);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group-meta {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.meta-icon {
  font-size: var(--font-size-base);
}

.group-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.tag {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.tag.algorithm {
  background: #e3f2fd;
  color: #1976d2;
}
.tag.web {
  background: #f3e5f5;
  color: #7b1fa2;
}
.tag.database {
  background: #e8f5e8;
  color: #388e3c;
}
.tag.ai {
  background: #fff3e0;
  color: #f57c00;
}
.tag.math {
  background: #fce4ec;
  color: #c2185b;
}
.tag.other {
  background: #f5f5f5;
  color: #616161;
}

.tag.private {
  background: #ffebee;
  color: #d32f2f;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* 确保按钮样式一致 */
.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>