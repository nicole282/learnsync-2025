<template>
  <div class="collaboration-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>协作学习空间</h1>
        <p v-if="currentGroup">
          {{ currentGroup.name }} · {{ onlineMembers.length }} 人在线
        </p>
        <p v-else>选择一个小组开始协作</p>
      </div>
      <div class="header-right">
        <button class="btn btn-outline" @click="toggleSidebar">
          {{ sidebarVisible ? "隐藏侧边栏" : "显示侧边栏" }}
        </button>
        <button
          class="btn btn-primary"
          @click="startVideoCall"
          v-if="!inVideoCall"
        >
          🎥 开始视频会议
        </button>
        <button class="btn btn-danger" @click="endVideoCall" v-else>
          📞 结束会议
        </button>
      </div>
    </div>

    <div
      class="collaboration-layout"
      :class="{ 'sidebar-hidden': !sidebarVisible }"
    >
      <!-- 主协作区域 -->
      <div class="main-collaboration-area">
        <!-- 协作工具标签页 -->
        <div class="collaboration-tabs">
          <button
            v-for="tab in collaborationTabs"
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            {{ tab.name }}
          </button>
        </div>

        <!-- 协作内容区域 -->
        <div class="collaboration-content">
          <!-- 共享白板 -->
          <div v-if="activeTab === 'whiteboard'" class="whiteboard-container">
            <div class="whiteboard-header">
              <h3>共享白板</h3>
              <div class="whiteboard-tools">
                <button class="tool-btn" @click="changeBrushColor('#000000')">
                  ⚫
                </button>
                <button class="tool-btn" @click="changeBrushColor('#ff0000')">
                  🔴
                </button>
                <button class="tool-btn" @click="changeBrushColor('#0000ff')">
                  🔵
                </button>
                <button class="tool-btn" @click="clearWhiteboard">
                  🗑️ 清空
                </button>
              </div>
            </div>
            <div class="whiteboard-placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">🎨</div>
                <h4>共享白板</h4>
                <p>与团队成员实时绘制和分享想法</p>
                <button class="btn btn-primary" @click="initializeWhiteboard">
                  启动白板
                </button>
              </div>
            </div>
          </div>

          <!-- 代码编辑器 -->
          <div v-if="activeTab === 'code'" class="code-editor-container">
            <div class="editor-header">
              <h3>协作代码编辑器</h3>
              <div class="editor-actions">
                <select v-model="selectedLanguage" class="language-select">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
                <button class="btn btn-outline">💾 保存</button>
                <button class="btn btn-primary">▶️ 运行</button>
              </div>
            </div>
            <div class="editor-placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">💻</div>
                <h4>实时代码编辑器</h4>
                <p>与团队成员共同编写和调试代码</p>
                <textarea
                  v-model="codeContent"
                  class="code-textarea"
                  placeholder="开始编写代码..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 文档协作 -->
          <div v-if="activeTab === 'document'" class="document-container">
            <div class="document-header">
              <h3>协作文档</h3>
              <div class="document-actions">
                <button class="btn btn-outline">📄 新建文档</button>
                <button class="btn btn-primary">💾 保存</button>
              </div>
            </div>
            <div class="document-placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">📝</div>
                <h4>协作文档编辑</h4>
                <p>与团队成员实时编辑文档</p>
                <textarea
                  v-model="documentContent"
                  class="document-textarea"
                  placeholder="开始编写文档内容..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏 - 聊天和成员 -->
      <div class="collaboration-sidebar" v-if="sidebarVisible">
        <!-- 在线成员列表 -->
        <div class="members-section">
          <div class="section-header">
            <h3>在线成员 ({{ onlineMembers.length }})</h3>
            <span class="online-indicator">🟢</span>
          </div>
          <div class="members-list">
            <div
              v-for="member in onlineMembers"
              :key="member.id"
              class="member-item"
            >
              <div class="member-avatar">
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div class="member-info">
                <span class="member-name">{{ member.name }}</span>
                <span class="member-status">{{ member.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 聊天区域 -->
        <div class="chat-section">
          <div class="section-header">
            <h3>小组聊天</h3>
            <button class="btn btn-sm btn-outline" @click="clearChat">
              清空
            </button>
          </div>

          <div class="chat-messages" ref="chatMessages">
            <div
              v-for="message in messages"
              :key="message.id"
              class="message"
              :class="{ 'own-message': message.isOwn }"
            >
              <div class="message-avatar">
                {{ message.sender.charAt(0).toUpperCase() }}
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">{{ message.sender }}</span>
                  <span class="message-time">{{
                    formatTime(message.timestamp)
                  }}</span>
                </div>
                <div class="message-text">{{ message.text }}</div>
              </div>
            </div>
          </div>

          <div class="chat-input-container">
            <div class="input-actions">
              <button class="action-btn" @click="toggleEmojiPicker">😊</button>
              <button class="action-btn" @click="attachFile">📎</button>
            </div>
            <textarea
              v-model="newMessage"
              @keypress.enter.prevent="sendMessage"
              class="chat-input"
              placeholder="输入消息... (按 Enter 发送)"
              rows="3"
            ></textarea>
            <button
              class="send-button"
              @click="sendMessage"
              :disabled="!newMessage.trim()"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Emoji 选择器 -->
    <div v-if="showEmojiPicker" class="emoji-picker">
      <div class="emoji-grid">
        <span
          v-for="emoji in commonEmojis"
          :key="emoji"
          class="emoji"
          @click="addEmoji(emoji)"
        >
          {{ emoji }}
        </span>
      </div>
    </div>

    <!-- 视频会议模态框 -->
    <ModalDialog v-model:visible="videoCallModal" title="视频会议" size="lg">
      <div class="video-call-container">
        <div class="video-grid">
          <div class="video-item local-video">
            <div class="video-placeholder">📹 本地视频</div>
            <div class="video-info">你</div>
          </div>
          <div
            v-for="member in videoParticipants"
            :key="member.id"
            class="video-item"
          >
            <div class="video-placeholder">📹 {{ member.name }} 的视频</div>
            <div class="video-info">{{ member.name }}</div>
          </div>
        </div>
        <div class="video-controls">
          <button
            class="control-btn"
            :class="{ active: isMuted }"
            @click="toggleMute"
          >
            {{ isMuted ? "🔇" : "🎤" }}
          </button>
          <button
            class="control-btn"
            :class="{ active: !isVideoOn }"
            @click="toggleVideo"
          >
            {{ isVideoOn ? "📹" : "📷" }}
          </button>
          <button class="control-btn end-call" @click="endVideoCall">
            📞 结束通话
          </button>
        </div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import ModalDialog from "@/components/common/ModalDialog.vue";

const route = useRoute();

// 响应式数据
const sidebarVisible = ref(true);
const activeTab = ref("whiteboard");
const newMessage = ref("");
const messages = ref([]);
const onlineMembers = ref([]);
const showEmojiPicker = ref(false);
const videoCallModal = ref(false);
const inVideoCall = ref(false);
const isMuted = ref(false);
const isVideoOn = ref(true);
const chatMessages = ref(null);

const currentGroup = ref({
  id: route.params.groupId || "1",
  name: "算法学习小组",
});

const collaborationTabs = [
  { id: "whiteboard", name: "共享白板", icon: "🎨" },
  { id: "code", name: "代码编辑", icon: "💻" },
  { id: "document", name: "文档协作", icon: "📝" },
];

const codeContent = ref(
  '// 在这里编写代码...\nconsole.log("Hello, LearnSync!")'
);
const documentContent = ref("在这里编写文档内容...");
const selectedLanguage = ref("javascript");

const videoParticipants = ref([
  { id: 2, name: "张三" },
  { id: 3, name: "李四" },
]);

const commonEmojis = [
  "😀",
  "😂",
  "🤔",
  "👍",
  "❤️",
  "🎉",
  "🚀",
  "💡",
  "📚",
  "👏",
];

// 模拟数据初始化
const initializeData = () => {
  // 模拟在线成员
  onlineMembers.value = [
    { id: 1, name: "我", status: "在线" },
    { id: 2, name: "张三", status: "正在编辑" },
    { id: 3, name: "李四", status: "在线" },
    { id: 4, name: "王五", status: "离开" },
  ];

  // 模拟聊天消息
  messages.value = [
    {
      id: 1,
      sender: "张三",
      text: "大家好！我们今天讨论什么算法问题？",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: 2,
      sender: "我",
      text: "我们可以讨论一下动态规划的问题",
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
    },
    {
      id: 3,
      sender: "李四",
      text: "好的，我最近在学背包问题",
      timestamp: new Date(Date.now() - 3400000),
      isOwn: false,
    },
  ];
};

// 方法
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const message = {
    id: Date.now(),
    sender: "我",
    text: newMessage.value,
    timestamp: new Date(),
    isOwn: true,
  };

  messages.value.push(message);
  newMessage.value = "";

  // 滚动到底部
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });

  // 模拟回复（需要成员C完成后移除）
  setTimeout(() => {
    const reply = {
      id: Date.now() + 1,
      sender: "张三",
      text: "收到了你的消息！",
      timestamp: new Date(),
      isOwn: false,
    };
    messages.value.push(reply);
  }, 1000);
};

const clearChat = () => {
  if (confirm("确定要清空聊天记录吗？")) {
    messages.value = [];
  }
};

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const addEmoji = (emoji) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
};

const attachFile = () => {
  alert("文件上传功能待实现");
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const startVideoCall = () => {
  videoCallModal.value = true;
  inVideoCall.value = true;
};

const endVideoCall = () => {
  videoCallModal.value = false;
  inVideoCall.value = false;
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

const toggleVideo = () => {
  isVideoOn.value = !isVideoOn.value;
};

const initializeWhiteboard = () => {
  alert("白板功能需要集成专门的绘图库");
};

const changeBrushColor = (color) => {
  console.log("切换画笔颜色:", color);
};

const clearWhiteboard = () => {
  if (confirm("确定要清空白板吗？")) {
    console.log("清空白板");
  }
};

// 生命周期
onMounted(() => {
  initializeData();

  // 模拟 Socket.io 连接（需要成员C完成后替换）
  console.log("连接到协作空间:", currentGroup.value.id);
});

onUnmounted(() => {
  // 清理资源
  console.log("离开协作空间");
});
</script>

<style lang="scss" scoped>
.collaboration-page {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);

  .header-left {
    h1 {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-xs);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
      font-size: var(--font-size-sm);
    }
  }

  .header-right {
    display: flex;
    gap: var(--space-md);
  }
}

.collaboration-layout {
  display: flex;
  flex: 1;
  overflow: hidden;

  &.sidebar-hidden {
    .collaboration-sidebar {
      display: none;
    }

    .main-collaboration-area {
      width: 100%;
    }
  }
}

.main-collaboration-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  margin: var(--space-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.collaboration-tabs {
  display: flex;
  background: var(--bg-hover);
  border-bottom: 1px solid var(--border-color);

  .tab-button {
    flex: 1;
    padding: var(--space-md) var(--space-lg);
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;

    &.active {
      background: var(--bg-card);
      border-bottom-color: var(--primary-color);
      color: var(--primary-color);
    }

    &:hover:not(.active) {
      background: rgba(0, 0, 0, 0.05);
    }

    .tab-icon {
      margin-right: var(--space-sm);
    }
  }
}

.collaboration-content {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
}

// 白板样式
.whiteboard-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.whiteboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);

  h3 {
    margin: 0;
    color: var(--text-primary);
  }
}

.whiteboard-tools {
  display: flex;
  gap: var(--space-sm);

  .tool-btn {
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border-color);
    background: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--bg-hover);
    }
  }
}

.whiteboard-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);

  .placeholder-content {
    text-align: center;

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: var(--space-md);
    }

    h4 {
      margin-bottom: var(--space-sm);
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      margin-bottom: var(--space-lg);
    }
  }
}

// 代码编辑器样式
.code-editor-container,
.document-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header,
.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);

  h3 {
    margin: 0;
    color: var(--text-primary);
  }
}

.editor-actions,
.document-actions {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.language-select {
  padding: var(--space-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
}

.editor-placeholder,
.document-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);

  .placeholder-content {
    width: 80%;
    text-align: center;

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: var(--space-md);
    }

    h4 {
      margin-bottom: var(--space-sm);
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      margin-bottom: var(--space-lg);
    }
  }
}

.code-textarea,
.document-textarea {
  width: 100%;
  height: 300px;
  padding: var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: var(--font-size-sm);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

// 侧边栏样式
.collaboration-sidebar {
  width: 350px;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  margin: var(--space-md);
  margin-left: 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.members-section {
  border-bottom: 1px solid var(--border-color);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md) var(--space-lg);
    background: var(--bg-hover);

    h3 {
      margin: 0;
      font-size: var(--font-size-base);
      color: var(--text-primary);
    }
  }
}

.members-list {
  max-height: 200px;
  overflow-y: auto;
  padding: var(--space-sm);
}

.member-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: background-color 0.3s ease;

  &:hover {
    background: var(--bg-hover);
  }

  .member-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: var(--space-md);
  }

  .member-info {
    flex: 1;

    .member-name {
      display: block;
      font-weight: 500;
      color: var(--text-primary);
    }

    .member-status {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }
  }
}

.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md) var(--space-lg);
    background: var(--bg-hover);

    h3 {
      margin: 0;
      font-size: var(--font-size-base);
      color: var(--text-primary);
    }
  }
}

.chat-messages {
  flex: 1;
  padding: var(--space-md);
  overflow-y: auto;
  max-height: 400px;
}

.message {
  display: flex;
  margin-bottom: var(--space-md);

  &.own-message {
    flex-direction: row-reverse;

    .message-content {
      background: var(--primary-color);
      color: white;

      .message-header {
        .sender-name {
          color: rgba(255, 255, 255, 0.9);
        }

        .message-time {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }

  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--secondary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin: 0 var(--space-sm);
    flex-shrink: 0;
  }

  .message-content {
    max-width: 70%;
    background: var(--bg-hover);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-lg);

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-xs);

      .sender-name {
        font-weight: 500;
        font-size: var(--font-size-sm);
        color: var(--text-primary);
      }

      .message-time {
        font-size: var(--font-size-sm);
        color: var(--text-muted);
      }
    }

    .message-text {
      word-wrap: break-word;
    }
  }
}

.chat-input-container {
  padding: var(--space-md);
  border-top: 1px solid var(--border-color);
  position: relative;
}

.input-actions {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: var(--radius-sm);

    &:hover {
      background: var(--bg-hover);
    }
  }
}

.chat-input {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  resize: none;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.send-button {
  position: absolute;
  right: var(--space-lg);
  bottom: var(--space-lg);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Emoji 选择器
.emoji-picker {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-md);
  z-index: 1000;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);

  .emoji {
    cursor: pointer;
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    text-align: center;

    &:hover {
      background: var(--bg-hover);
    }
  }
}

// 视频会议样式
.video-call-container {
  padding: var(--space-md);
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.video-item {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  text-align: center;

  &.local-video {
    border: 2px solid var(--primary-color);
  }

  .video-placeholder {
    font-size: 3rem;
    margin-bottom: var(--space-md);
  }

  .video-info {
    color: var(--text-primary);
    font-weight: 500;
  }
}

.video-controls {
  display: flex;
  justify-content: center;
  gap: var(--space-md);

  .control-btn {
    padding: var(--space-md) var(--space-lg);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: var(--danger-color);
      color: white;
    }

    &.end-call {
      background: var(--danger-color);
      color: white;

      &:hover {
        background: darken(var(--danger-color), 10%);
      }
    }

    &:not(.end-call):not(.active) {
      background: var(--primary-color);
      color: white;

      &:hover {
        background: var(--primary-dark);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .collaboration-sidebar {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .collaboration-layout {
    flex-direction: column;

    .collaboration-sidebar {
      width: 100%;
      margin: var(--space-md) 0;
    }
  }

  .page-header {
    flex-direction: column;
    gap: var(--space-md);
    align-items: flex-start;

    .header-right {
      width: 100%;
      justify-content: space-between;
    }
  }

  .collaboration-tabs {
    .tab-button {
      padding: var(--space-sm) var(--space-md);
      font-size: var(--font-size-sm);
    }
  }
}
</style>
