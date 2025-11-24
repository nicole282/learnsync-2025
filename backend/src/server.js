// backend/src/server.js
import app from './app.js';
import { testConnection, initializeDatabase } from './config/database.js';

const PORT = process.env.PORT || 3000;

// 启动服务器
const startServer = async () => {
  try {
    console.log('🔧 初始化数据库...');
    await testConnection();
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log('🚀 LearnSync 后端服务器启动成功！');
      console.log(`📍 访问地址: http://localhost:${PORT}`);
      console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.log('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();