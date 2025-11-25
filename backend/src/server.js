import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 3000;

// 创建HTTP服务器（Socket.io需要）
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 存储在线用户和聊天记录
const onlineUsers = new Map(); // {socketId: {username, userId}}
const chatMessages = []; // 存储所有聊天消息

console.log('🔧 Socket.io 实时聊天功能配置完成');

// === Socket.io 实时聊天功能 ===
io.on('connection', (socket) => {
  console.log('🎉 新用户连接:', socket.id);
  
  // 用户加入聊天
  socket.on('join-chat', (userData) => {
    const userInfo = {
      username: userData.username || '匿名用户',
      userId: userData.userId || socket.id,
      socketId: socket.id,
      joinTime: new Date().toLocaleTimeString()
    };
    
    onlineUsers.set(socket.id, userInfo);
    console.log(`👋 ${userInfo.username} 加入聊天`);
    
    // 通知所有人更新在线列表
    io.emit('online-users-update', Array.from(onlineUsers.values()));
    
    // 发送欢迎消息
    const welcomeMessage = {
      id: Date.now(),
      content: `欢迎 ${userInfo.username} 加入聊天！`,
      sender: '系统',
      time: new Date().toLocaleTimeString(),
      type: 'system'
    };
    chatMessages.push(welcomeMessage);
    io.emit('new-message', welcomeMessage);
  });
  
  // 接收用户发送的消息
  socket.on('send-message', (messageData) => {
    const user = onlineUsers.get(socket.id);
    
    if (user && messageData.content.trim()) {
      const message = {
        id: Date.now(),
        content: messageData.content.trim(),
        sender: user.username,
        time: new Date().toLocaleTimeString(),
        type: 'user'
      };
      
      console.log(`💬 ${user.username} 发送消息: ${message.content}`);
      chatMessages.push(message);
      
      // 广播给所有在线用户
      io.emit('new-message', message);
    }
  });
  
  // 用户断开连接
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      console.log(`👋 ${user.username} 离开聊天`);
      
      // 通知所有人更新在线列表
      io.emit('online-users-update', Array.from(onlineUsers.values()));
      
      // 发送离开消息
      const leaveMessage = {
        id: Date.now(),
        content: `${user.username} 离开了聊天`,
        sender: '系统',
        time: new Date().toLocaleTimeString(),
        type: 'system'
      };
      chatMessages.push(leaveMessage);
      io.emit('new-message', leaveMessage);
    }
  });
});

// === 添加聊天相关的 REST API 路由到主应用 ===

// 健康检查（增强版）
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LearnSync 服务器运行正常',
    onlineUsers: onlineUsers.size,
    totalMessages: chatMessages.length,
    timestamp: new Date().toISOString()
  });
});

// 获取聊天记录
app.get('/api/messages', (req, res) => {
  res.json({
    success: true,
    messages: chatMessages,
    total: chatMessages.length
  });
});

// 获取在线用户列表
app.get('/api/online-users', (req, res) => {
  res.json({
    success: true,
    users: Array.from(onlineUsers.values()),
    total: onlineUsers.size
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n收到 ${signal} 信号，正在优雅关闭服务器...`);
  
  // Close server
  server.close((err) => {
    if (err) {
      console.error('关闭服务器时发生错误:', err);
      process.exit(1);
    }
    
    console.log('服务器已成功关闭');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('强制关闭服务器...');
    process.exit(1);
  }, 10000);
};

// Start server
server.listen(PORT, () => {
  console.log('🚀 LearnSync 后端服务器启动成功!');
  console.log(`📍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 端口: ${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📍 前端地址: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('💬 实时聊天功能已启用');
  console.log('📝 按 Ctrl+C 停止服务器\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

export default server;
