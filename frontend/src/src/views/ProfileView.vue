<template>
  <div class="profile-view">
    <!-- 用户资料头部 -->
    <div class="profile-header">
      <div class="cover-section">
        <div class="cover-image-container">
          <img
            :src="user.coverImage || '/images/default-cover.jpg'"
            alt="封面图片"
            class="cover-image"
          />
          <button class="edit-cover-btn" v-if="isOwnProfile" @click="editCover">
            <CameraIcon class="icon" />
            编辑封面
          </button>
        </div>
      </div>

      <div class="profile-info-section">
        <div class="avatar-container">
          <img
            :src="user.avatar || '/images/default-avatar.jpg'"
            :alt="user.name"
            class="user-avatar"
          />
          <button
            class="edit-avatar-btn"
            v-if="isOwnProfile"
            @click="editAvatar"
          >
            <CameraIcon class="icon" />
          </button>
        </div>

        <div class="user-details">
          <div class="name-section">
            <h1 class="user-name">{{ user.name }}</h1>
            <span class="user-badge" v-if="user.isVerified">
              <VerifiedIcon class="badge-icon" />
            </span>
            <button
              class="edit-profile-btn"
              v-if="isOwnProfile"
              @click="editProfile"
            >
              编辑资料
            </button>
            <div class="action-buttons" v-else>
              <button
                class="btn btn-primary"
                :class="{ 'btn-secondary': isFollowing }"
                @click="toggleFollow"
              >
                {{ isFollowing ? "已关注" : "关注" }}
              </button>
              <button class="btn btn-outline">发消息</button>
            </div>
          </div>

          <p class="user-bio" v-if="user.bio">{{ user.bio }}</p>

          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-number">{{ user.postsCount }}</span>
              <span class="stat-label">帖子</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.followersCount }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.followingCount }}</span>
              <span class="stat-label">关注</span>
            </div>
          </div>

          <div class="user-meta">
            <div class="meta-item" v-if="user.location">
              <LocationIcon class="icon" />
              <span>{{ user.location }}</span>
            </div>
            <div class="meta-item" v-if="user.website">
              <LinkIcon class="icon" />
              <a :href="user.website" target="_blank" class="website-link">
                {{ user.website }}
              </a>
            </div>
            <div class="meta-item" v-if="user.joinDate">
              <CalendarIcon class="icon" />
              <span>加入于 {{ formatDate(user.joinDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content">
      <!-- 侧边栏 -->
      <div class="profile-sidebar">
        <!-- 个人简介 -->
        <div class="info-card">
          <h3 class="card-title">个人简介</h3>
          <p class="user-description" v-if="user.description">
            {{ user.description }}
          </p>
          <p class="no-info" v-else>
            {{
              isOwnProfile ? "你还没有填写个人简介" : "该用户还没有填写个人简介"
            }}
          </p>
        </div>

        <!-- 兴趣标签 -->
        <div class="info-card" v-if="user.interests && user.interests.length">
          <h3 class="card-title">兴趣标签</h3>
          <div class="tags-container">
            <span
              v-for="interest in user.interests"
              :key="interest"
              class="tag"
            >
              {{ interest }}
            </span>
          </div>
        </div>

        <!-- 成就徽章 -->
        <div class="info-card" v-if="user.badges && user.badges.length">
          <h3 class="card-title">成就徽章</h3>
          <div class="badges-container">
            <div
              v-for="badge in user.badges"
              :key="badge.id"
              class="badge-item"
              :title="badge.name"
            >
              <img :src="badge.icon" :alt="badge.name" class="badge-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="profile-main">
        <!-- 选项卡导航 -->
        <div class="profile-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'posts' }"
            @click="activeTab = 'posts'"
          >
            <PostIcon class="icon" />
            帖子 <span class="tab-count">{{ user.postsCount }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'media' }"
            @click="activeTab = 'media'"
          >
            <ImageIcon class="icon" />
            媒体 <span class="tab-count">{{ user.mediaCount }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'likes' }"
            @click="activeTab = 'likes'"
          >
            <HeartIcon class="icon" />
            喜欢 <span class="tab-count">{{ user.likesCount }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'collections' }"
            @click="activeTab = 'collections'"
            v-if="isOwnProfile"
          >
            <BookmarkIcon class="icon" />
            收藏 <span class="tab-count">{{ user.collectionsCount }}</span>
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="tab-content">
          <!-- 帖子列表 -->
          <div v-if="activeTab === 'posts'" class="posts-container">
            <div class="create-post-card" v-if="isOwnProfile">
              <div class="post-input">
                <img
                  :src="user.avatar || '/images/default-avatar.jpg'"
                  :alt="user.name"
                  class="user-avatar"
                />
                <input
                  type="text"
                  placeholder="分享你的想法..."
                  @click="showPostModal = true"
                />
              </div>
            </div>

            <div class="posts-list">
              <PostItem v-for="post in userPosts" :key="post.id" :post="post" />
            </div>

            <div class="load-more" v-if="hasMorePosts">
              <button class="btn btn-outline" @click="loadMorePosts">
                加载更多
              </button>
            </div>
          </div>

          <!-- 媒体内容 -->
          <div v-if="activeTab === 'media'" class="media-container">
            <div class="media-grid">
              <div
                v-for="media in userMedia"
                :key="media.id"
                class="media-item"
                @click="openMediaViewer(media)"
              >
                <img
                  :src="media.url"
                  :alt="media.caption"
                  class="media-image"
                />
                <div class="media-overlay" v-if="media.type === 'video'">
                  <PlayIcon class="play-icon" />
                </div>
              </div>
            </div>
          </div>

          <!-- 喜欢的内容 -->
          <div v-if="activeTab === 'likes'" class="likes-container">
            <div class="posts-list">
              <PostItem
                v-for="post in likedPosts"
                :key="post.id"
                :post="post"
              />
            </div>
          </div>

          <!-- 收藏内容 -->
          <div v-if="activeTab === 'collections'" class="collections-container">
            <div class="collections-list">
              <div
                v-for="collection in userCollections"
                :key="collection.id"
                class="collection-item"
              >
                <div class="collection-cover">
                  <img
                    :src="collection.coverImage"
                    :alt="collection.name"
                    class="cover-image"
                  />
                </div>
                <div class="collection-info">
                  <h3 class="collection-name">{{ collection.name }}</h3>
                  <p class="collection-description">
                    {{ collection.description }}
                  </p>
                  <div class="collection-meta">
                    <span>{{ collection.itemCount }} 个项目</span>
                    <span>•</span>
                    <span>{{ formatDate(collection.updatedAt) }} 更新</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框 -->
    <PostModal
      v-if="showPostModal"
      @close="showPostModal = false"
      @submit="createPost"
    />

    <MediaViewer
      v-if="selectedMedia"
      :media="selectedMedia"
      @close="selectedMedia = null"
    />
  </div>
</template>

<script>
import {
  CameraIcon,
  VerifiedIcon,
  LocationIcon,
  LinkIcon,
  CalendarIcon,
  PostIcon,
  ImageIcon,
  HeartIcon,
  BookmarkIcon,
  PlayIcon,
} from "@/components/icons";
import PostItem from "@/components/PostItem";
import PostModal from "@/components/PostModal";
import MediaViewer from "@/components/MediaViewer";

export default {
  name: "ProfileView",
  components: {
    CameraIcon,
    VerifiedIcon,
    LocationIcon,
    LinkIcon,
    CalendarIcon,
    PostIcon,
    ImageIcon,
    HeartIcon,
    BookmarkIcon,
    PlayIcon,
    PostItem,
    PostModal,
    MediaViewer,
  },
  data() {
    return {
      activeTab: "posts",
      showPostModal: false,
      selectedMedia: null,
      user: {
        id: 1,
        name: "张三",
        bio: "前端开发者 | 技术爱好者",
        avatar: "/images/avatar1.jpg",
        coverImage: "/images/cover1.jpg",
        isVerified: true,
        location: "北京, 中国",
        website: "https://zhangsan.dev",
        joinDate: "2022-03-15",
        description:
          "我是一名专注于前端开发的工程师，热爱学习新技术和分享知识。平时喜欢阅读、旅行和摄影。希望在这里认识更多志同道合的朋友！",
        postsCount: 156,
        followersCount: 1245,
        followingCount: 89,
        mediaCount: 42,
        likesCount: 367,
        collectionsCount: 12,
        interests: [
          "前端开发",
          "JavaScript",
          "Vue.js",
          "React",
          "Node.js",
          "摄影",
          "旅行",
        ],
        badges: [
          { id: 1, name: "活跃用户", icon: "/images/badge1.png" },
          { id: 2, name: "技术达人", icon: "/images/badge2.png" },
          { id: 3, name: "内容创作者", icon: "/images/badge3.png" },
        ],
      },
      userPosts: [],
      userMedia: [],
      likedPosts: [],
      userCollections: [],
      hasMorePosts: true,
      currentUserId: 1, // 假设当前登录用户ID为1
    };
  },
  computed: {
    isOwnProfile() {
      return this.user.id === this.currentUserId;
    },
    isFollowing() {
      // 实际项目中这里应该检查关注状态
      return false;
    },
  },
  methods: {
    editCover() {
      // 编辑封面逻辑
      console.log("编辑封面");
    },
    editAvatar() {
      // 编辑头像逻辑
      console.log("编辑头像");
    },
    editProfile() {
      // 编辑资料逻辑
      console.log("编辑资料");
    },
    toggleFollow() {
      // 切换关注状态逻辑
      console.log("切换关注状态");
    },
    createPost(postData) {
      // 创建新帖子逻辑
      console.log("创建帖子:", postData);
      this.showPostModal = false;
    },
    loadMorePosts() {
      // 加载更多帖子逻辑
      console.log("加载更多帖子");
    },
    openMediaViewer(media) {
      this.selectedMedia = media;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("zh-CN");
    },
  },
  mounted() {
    // 组件挂载后获取用户数据
    // 实际项目中这里应该调用API
    console.log("ProfileView mounted");
  },
};
</script>

<style scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.profile-header {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cover-section {
  position: relative;
  height: 300px;
}

.cover-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-cover-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-cover-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.profile-info-section {
  background: white;
  padding: 0 30px 30px;
  position: relative;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-top: -60px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-details {
  max-width: 600px;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.user-badge {
  color: var(--primary-color);
}

.badge-icon {
  width: 20px;
  height: 20px;
}

.edit-profile-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.edit-profile-btn:hover {
  background: var(--bg-hover);
}

.action-buttons {
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

.user-bio {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.user-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.user-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
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

.website-link {
  color: var(--primary-color);
  text-decoration: none;
}

.website-link:hover {
  text-decoration: underline;
}

/* 内容区域样式 */
.profile-content {
  display: flex;
  gap: 24px;
}

.profile-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.profile-main {
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

.user-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.no-info {
  color: var(--text-tertiary);
  font-style: italic;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 4px;
  font-size: 14px;
}

.badges-container {
  display: flex;
  gap: 12px;
}

.badge-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.badge-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 选项卡样式 */
.profile-tabs {
  display: flex;
  background: white;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: var(--bg-hover);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-count {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
}

.tab-content {
  background: white;
  border-radius: 0 0 8px 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 帖子创建区域 */
.create-post-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.post-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-input .user-avatar {
  width: 40px;
  height: 40px;
  border: none;
  box-shadow: none;
}

.post-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  background-color: white;
  cursor: pointer;
}

.post-input input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 帖子列表 */
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

/* 媒体网格 */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.media-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.media-item:hover .media-image {
  transform: scale(1.05);
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.play-icon {
  width: 40px;
  height: 40px;
}

/* 收藏列表 */
.collections-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.collection-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.collection-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.collection-cover {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.collection-cover .cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collection-info {
  flex: 1;
}

.collection-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.collection-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.collection-meta {
  display: flex;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
  }

  .profile-info-section {
    padding: 0 20px 20px;
  }

  .name-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .user-stats {
    justify-content: space-around;
  }

  .user-meta {
    flex-direction: column;
    gap: 8px;
  }

  .profile-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1 0 50%;
  }

  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .collection-item {
    flex-direction: column;
  }

  .collection-cover {
    width: 100%;
    height: 120px;
  }
}
</style>
