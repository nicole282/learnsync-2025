import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  refreshToken
} from '../controllers/authController.js';
import {
  authenticateToken,
  optionalAuth
} from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate
} from '../middleware/validation.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description 用户注册
 * @access Public
 * @body {string} username - 用户名
 * @body {string} email - 邮箱地址
 * @body {string} password - 密码
 */
router.post('/register', validateRegistration, register);

/**
 * @route POST /api/auth/login
 * @description 用户登录
 * @access Public
 * @body {string} email - 邮箱地址
 * @body {string} password - 密码
 */
router.post('/login', validateLogin, login);

/**
 * @route POST /api/auth/logout
 * @description 用户退出登录
 * @access Private
 * @header Authorization: Bearer {token}
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route POST /api/auth/refresh-token
 * @description 刷新访问令牌
 * @access Private
 * @header Authorization: Bearer {token}
 */
router.post('/refresh-token', authenticateToken, refreshToken);

/**
 * @route GET /api/auth/profile
 * @description 获取当前用户资料
 * @access Private
 * @header Authorization: Bearer {token}
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route PUT /api/auth/profile
 * @description 更新当前用户资料
 * @access Private
 * @header Authorization: Bearer {token}
 * @body {string} [username] - 用户名（可选）
 * @body {string} [avatar_url] - 头像URL（可选）
 */
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);

/**
 * @route GET /api/auth/check
 * @description 检查认证状态
 * @access Public (但需要令牌来获取用户信息)
 * @header Authorization: Bearer {token} (可选)
 */
router.get('/check', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

/**
 * @route GET /api/auth/verify-email
 * @description 验证邮箱地址（预留功能）
 * @access Private
 * @header Authorization: Bearer {token}
 * @query {string} token - 邮箱验证令牌
 */
router.get('/verify-email', authenticateToken, (req, res) => {
  // 预留邮箱验证功能
  res.json({
    message: '邮箱验证功能开发中',
    status: 'pending'
  });
});

/**
 * @route POST /api/auth/forgot-password
 * @description 忘记密码请求（预留功能）
 * @access Public
 * @body {string} email - 邮箱地址
 */
router.post('/forgot-password', validateEmail, (req, res) => {
  // 预留忘记密码功能
  res.json({
    message: '密码重置功能开发中',
    status: 'pending'
  });
});

/**
 * @route POST /api/auth/reset-password
 * @description 重置密码（预留功能）
 * @access Public
 * @body {string} token - 密码重置令牌
 * @body {string} newPassword - 新密码
 */
router.post('/reset-password', (req, res) => {
  // 预留重置密码功能
  res.json({
    message: '密码重置功能开发中',
    status: 'pending'
  });
});

/**
 * @route POST /api/auth/change-password
 * @description 修改密码
 * @access Private
 * @header Authorization: Bearer {token}
 * @body {string} currentPassword - 当前密码
 * @body {string} newPassword - 新密码
 */
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // 验证输入
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: '请输入当前密码和新密码'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: '新密码长度至少6位'
      });
    }

    // 导入User模型（动态导入避免循环依赖）
    const { User } = await import('../models/User.js');
    
    // 修改密码
    await User.changePassword(userId, currentPassword, newPassword);

    res.json({
      message: '密码修改成功',
      status: 'success'
    });

  } catch (error) {
    console.error('修改密码错误:', error);
    
    if (error.message === '当前密码不正确') {
      return res.status(400).json({
        error: '当前密码不正确'
      });
    }

    if (error.message === '用户不存在') {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    res.status(500).json({
      error: '修改密码失败'
    });
  }
});

/**
 * @route GET /api/auth/stats
 * @description 获取用户统计信息（管理员功能）
 * @access Private (需要管理员权限)
 * @header Authorization: Bearer {token}
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // 导入数据库连接
    const { getConnection } = await import('../config/database.js');
    const connection = getConnection();

    // 获取用户统计
    const [userStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(avatar_url) as users_with_avatar,
        DATE(created_at) as date,
        COUNT(*) as daily_registrations
      FROM users 
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 7
    `);

    // 获取活跃用户统计（最近7天有活动的用户）
    const [activeStats] = await connection.execute(`
      SELECT 
        COUNT(DISTINCT id) as active_users
      FROM users 
      WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    res.json({
      total_users: userStats[0]?.total_users || 0,
      users_with_avatar: userStats[0]?.users_with_avatar || 0,
      active_users: activeStats[0]?.active_users || 0,
      registration_trend: userStats,
      message: '统计信息获取成功'
    });

  } catch (error) {
    console.error('获取用户统计错误:', error);
    res.status(500).json({
      error: '获取统计信息失败'
    });
  }
});

/**
 * @route GET /api/auth/users
 * @description 获取用户列表（管理员功能）
 * @access Private (需要管理员权限)
 * @header Authorization: Bearer {token}
 * @query {number} [page=1] - 页码
 * @query {number} [limit=10] - 每页数量
 */
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: '分页参数无效'
      });
    }

    // 导入User模型
    const { User } = await import('../models/User.js');
    
    // 获取用户列表
    const result = await User.getAllUsers(page, limit);

    res.json({
      users: result.users,
      pagination: result.pagination,
      message: '用户列表获取成功'
    });

  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      error: '获取用户列表失败'
    });
  }
});

/**
 * @route GET /api/auth/users/:id
 * @description 获取指定用户信息
 * @access Private
 * @header Authorization: Bearer {token}
 * @param {string} id - 用户ID
 */
router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // 导入User模型
    const { User } = await import('../models/User.js');
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      },
      message: '用户信息获取成功'
    });

  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      error: '获取用户信息失败'
    });
  }
});

// 辅助函数：邮箱验证中间件
async function validateEmail(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: '请输入邮箱地址'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: '请输入有效的邮箱地址'
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
}

export default router;
