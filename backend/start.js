// backend/start.js
console.log('🚀 开始启动服务器...');

import app from './src/app.js';

const PORT = 3000;

app.listen(PORT, () => {
  console.log('✅ LearnSync 后端服务器启动成功！');
  console.log(`📍 访问地址: http://localhost:${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
});