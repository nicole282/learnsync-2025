import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
// 提供静态文件访问（让浏览器能访问HTML文件）
app.use(express.static('.'));


// 创建HTTP服务器（Socket.io需要）
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // 允许所有前端连接
    methods: ["GET", "POST"]
  }
});

// 存储在线用户和聊天记录
const onlineUsers = new Map(); // {socketId: {username, userId}}
const chatMessages = []; // 存储所有聊天消息

console.log('🔧 Socket.io 服务器配置完成');

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

// === REST API 接口 ===

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '聊天服务器运行正常',
    onlineUsers: onlineUsers.size,
    totalMessages: chatMessages.length
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

// 启动服务器
server.listen(3000, () => {
  console.log('🚀 聊天服务器已启动: http://localhost:3000');
  console.log('💬 实时聊天功能已启用');
  console.log('📊 测试地址: http://localhost:3000/test-chat.html');
});