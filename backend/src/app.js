import express from 'express';
import cors from 'cors';

// 导入路由
import groupRoutes from './routes/groups.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // 前端地址
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LearnSync 后端服务器运行正常！',
    timestamp: new Date().toISOString()
  });
});

// 注册小组路由
app.use('/api/groups', groupRoutes);

export default app;