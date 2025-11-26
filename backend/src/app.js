import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import groupRoutes from './routes/groups.js';
import { createDatabaseConnection } from './config/database.js';



// Import routes
import authRoutes from './routes/auth.js';

// 1. 先创建 app 实例
const app = express();

// 2. 配置中间件
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
});



app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
//createDatabaseConnection();

// 3. 注册路由（在 app 定义之后）
app.use('/api/groups', groupRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'LearnSync Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 删除重复的健康检查端点（第8-10行）

// 404 handler for API routes
//app.use('/api/:any*', (req, res) => {
  //res.status(404).json({
    //error: 'API端点不存在',
    //path: req.originalUrl,
    //method: req.method
  //});
//});

// Global error handler
app.use((error, req, res, next) => {
  console.error('全局错误处理:', error);
  
  // Database errors
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: '数据已存在',
      details: '请检查输入的数据是否重复'
    });
  }
  
  if (error.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({
      error: '引用数据不存在',
      details: '请检查关联的数据是否正确'
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: '无效的认证令牌'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: '认证令牌已过期'
    });
  }
  
  // Default error
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? '内部服务器错误' 
      : error.message
  });
});

export default app;