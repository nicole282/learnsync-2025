import { verifyToken, extractTokenFromHeader } from '../utils/token.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import { User } from '../models/User.js';

/**
 * JWT authentication middleware
 * Verifies the token and attaches user to request object
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: ERROR_MESSAGES.UNAUTHORIZED,
        details: '请提供有效的认证令牌'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database to ensure they still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: ERROR_MESSAGES.UNAUTHORIZED,
        details: '用户不存在或已被删除'
      });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    next();
  } catch (error) {
    console.error('认证中间件错误:', error.message);
    
    if (error.message === ERROR_MESSAGES.EXPIRED_TOKEN) {
      return res.status(401).json({
        error: ERROR_MESSAGES.EXPIRED_TOKEN,
        details: '请重新登录'
      });
    }
    
    if (error.message === ERROR_MESSAGES.INVALID_TOKEN) {
      return res.status(401).json({
        error: ERROR_MESSAGES.INVALID_TOKEN,
        details: '请提供有效的认证令牌'
      });
    }
    
    return res.status(401).json({
      error: ERROR_MESSAGES.UNAUTHORIZED,
      details: '认证失败'
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username
        };
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('可选认证失败:', error.message);
  }
  
  next();
};

/**
 * Admin authorization middleware
 * Requires user to have admin privileges
 */
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: ERROR_MESSAGES.UNAUTHORIZED,
        details: '需要管理员权限'
      });
    }

    // Here you would check if user has admin role
    // For now, we'll assume all users are regular users
    // This can be extended when roles are implemented
    
    return res.status(403).json({
      error: '权限不足',
      details: '需要管理员权限才能执行此操作'
    });
    
  } catch (error) {
    console.error('管理员权限检查错误:', error);
    return res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};
