import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

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
const server = app.listen(PORT, () => {
  console.log('🚀 LearnSync 后端服务器启动成功!');
  console.log(`📍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 端口: ${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📍 前端地址: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
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
