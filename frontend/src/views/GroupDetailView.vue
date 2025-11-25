<template>
  <div class="group-detail-view">
    <!-- 头部区域 -->
    <div class="group-header">
      <div class="group-cover">
        <img
          :src="group.coverImage"
          :alt="group.name"
          class="cover-image"
          v-if="group.coverImage"
        />
        <div class="cover-placeholder" v-else>
          <span>{{ group.name.charAt(0) }}</span>
        </div>
      </div>

      <div class="group-info">
        <h1 class="group-name">{{ group.name }}</h1>

        <div class="group-meta">
          <div class="meta-item">
            <UserIcon class="icon" />
            <span>{{ group.memberCount }} 成员</span>
          </div>
          <div class="meta-item">
            <PostIcon class="icon" />
            <span>{{ group.postCount }} 帖子</span>
          </div>
          <div class="meta-item" v-if="group.createdAt">
            <CalendarIcon class="icon" />
            <span>创建于 {{ formatDate(group.createdAt) }}</span>
          </div>
        </div>

        <div class="group-actions">
          <button class="btn btn-primary" v-if="!isMember" @click="joinGroup">
            加入群组
          </button>
          <button class="btn btn-secondary" v-else @click="leaveGroup">
            退出群组
          </button>
          <button class="btn btn-outline" v-if="isOwner">管理群组</button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="group-content">
      <div class="content-sidebar">
        <!-- 群组描述 -->
        <div class="info-card">
          <h3 class="card-title">群组描述</h3>
          <p class="group-description">
            {{ group.description }}
          </p>
        </div>

        <!-- 群组规则 -->
        <div class="info-card" v-if="group.rules">
          <h3 class="card-title">群组规则</h3>
          <ul class="group-rules">
            <li v-for="(rule, index) in group.rules" :key="index">
              {{ rule }}
            </li>
          </ul>
        </div>

        <!-- 群组成员 -->
        <div class="info-card">
          <h3 class="card-title">群组成员</h3>
          <div class="member-list">
            <div
              v-for="member in recentMembers"
              :key="member.id"
              class="member-item"
            >
              <img
                :src="member.avatar"
                :alt="member.name"
                class="member-avatar"
              />
              <span class="member-name">{{ member.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-main">
        <!-- 发布新帖子 -->
        <div class="create-post-card" v-if="isMember">
          <div class="post-input">
            <img
              :src="currentUser.avatar"
              :alt="currentUser.name"
              class="user-avatar"
            />
            <input
              type="text"
              placeholder="分享你的想法..."
              @click="showPostModal = true"
            />
          </div>
        </div>

        <!-- 帖子列表 -->
        <div class="posts-section">
          <div class="section-header">
            <h2 class="section-title">群组帖子</h2>
            <div class="sort-options">
              <button
                class="sort-btn"
                :class="{ active: sortBy === 'recent' }"
                @click="sortBy = 'recent'"
              >
                最新
              </button>
              <button
                class="sort-btn"
                :class="{ active: sortBy === 'popular' }"
                @click="sortBy = 'popular'"
              >
                热门
              </button>
            </div>
          </div>

          <div class="posts-list">
            <PostItem v-for="post in sortedPosts" :key="post.id" :post="post" />
          </div>

          <div class="load-more" v-if="hasMorePosts">
            <button class="btn btn-outline" @click="loadMorePosts">
              加载更多
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布帖子模态框 -->
    <PostModal
      v-if="showPostModal"
      @close="showPostModal = false"
      @submit="createPost"
    />
  </div>
</template>

<script>
import { UserIcon, PostIcon, CalendarIcon } from "@/components/icons";
import PostItem from "@/components/PostItem";
import PostModal from "@/components/PostModal";

export default {
  name: "GroupDetailView",
  components: {
    UserIcon,
    PostIcon,
    CalendarIcon,
    PostItem,
    PostModal,
  },
  data() {
    return {
      group: {
        id: 1,
        name: "前端开发交流群",
        description:
          "这是一个专注于前端开发技术交流的群组，我们分享最新的前端技术、开发经验和学习资源。欢迎所有对前端开发感兴趣的朋友加入我们，一起学习进步！",
        coverImage: "/images/group-cover.jpg",
        memberCount: 245,
        postCount: 156,
        createdAt: "2023-01-15",
        rules: [
          "禁止发布广告内容",
          "尊重他人，友好交流",
          "分享内容需与前端开发相关",
          "禁止发布不当言论",
        ],
      },
      recentMembers: [
        { id: 1, name: "张三", avatar: "/images/avatar1.jpg" },
        { id: 2, name: "李四", avatar: "/images/avatar2.jpg" },
        { id: 3, name: "王五", avatar: "/images/avatar3.jpg" },
        { id: 4, name: "赵六", avatar: "/images/avatar4.jpg" },
      ],
      posts: [],
      sortBy: "recent",
      showPostModal: false,
      hasMorePosts: true,
      currentUser: {
        id: 1,
        name: "当前用户",
        avatar: "/images/current-user.jpg",
      },
    };
  },
  computed: {
    isMember() {
      // 实际项目中这里应该检查当前用户是否为群组成员
      return true;
    },
    isOwner() {
      // 实际项目中这里应该检查当前用户是否为群组所有者
      return false;
    },
    sortedPosts() {
      // 根据排序选项对帖子进行排序
      if (this.sortBy === "recent") {
        return [...this.posts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else {
        return [...this.posts].sort((a, b) => b.likes - a.likes);
      }
    },
  },
  methods: {
    joinGroup() {
      // 加入群组的逻辑
      console.log("加入群组");
    },
    leaveGroup() {
      // 退出群组的逻辑
      console.log("退出群组");
    },
    createPost(postData) {
      // 创建新帖子的逻辑
      console.log("创建帖子:", postData);
      this.showPostModal = false;
    },
    loadMorePosts() {
      // 加载更多帖子的逻辑
      console.log("加载更多帖子");
    },
    formatDate(dateString) {
      // 格式化日期的逻辑
      return new Date(dateString).toLocaleDateString("zh-CN");
    },
  },
  mounted() {
    // 组件挂载后获取群组数据
    // 实际项目中这里应该调用API
    console.log("GroupDetailView mounted");
  },
};
</script>

<style scoped>
.group-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部样式 */
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

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
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

.icon {
  width: 16px;
  height: 16px;
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

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-outline:hover {
  background-color: var(--bg-hover);
}

/* 内容区域样式 */
.group-content {
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
  margin-bottom: var(--space-lg);
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制为3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3; /* 标准属性 */
}

.group-rules {
  padding-left: 20px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.group-rules li {
  margin-bottom: 8px;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.member-name {
  font-size: 14px;
  color: var(--text-primary);
}

/* 发布帖子区域 */
.create-post-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.post-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  background-color: var(--bg-secondary);
  cursor: pointer;
}

.post-input input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 帖子区域 */
.posts-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.sort-options {
  display: flex;
  gap: 8px;
}

.sort-btn {
  padding: 6px 12px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .group-header {
    flex-direction: column;
  }

  .group-cover {
    width: 100%;
  }

  .group-content {
    flex-direction: column;
  }

  .content-sidebar {
    width: 100%;
  }

  .group-meta {
    flex-wrap: wrap;
  }
}
</style>
