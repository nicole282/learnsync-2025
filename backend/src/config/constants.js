// Application constants
export const APP_CONSTANTS = {
  APP_NAME: 'LearnSync',
  VERSION: '1.0.0',
  DESCRIPTION: 'Intelligent Learning Management System'
};

// JWT constants
export const JWT_CONSTANTS = {
  SECRET: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ALGORITHM: 'HS256'
};

// Database constants
export const DB_CONSTANTS = {
  MAX_CONNECTIONS: 10,
  CONNECTION_TIMEOUT: 60000,
  ACQUIRE_TIMEOUT: 60000,
  TIMEOUT: 60000
};

// Validation constants
export const VALIDATION_CONSTANTS = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  EMAIL: {
    MAX_LENGTH: 100,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100
  },
  GROUP_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  }
};

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: '邮箱或密码错误',
  USER_EXISTS: '该邮箱已被注册',
  USER_NOT_FOUND: '用户不存在',
  INVALID_TOKEN: '无效的认证令牌',
  EXPIRED_TOKEN: '认证令牌已过期',
  UNAUTHORIZED: '未授权访问',
  
  // Validation errors
  INVALID_EMAIL: '请输入有效的邮箱地址',
  INVALID_USERNAME: '用户名只能包含字母、数字和下划线',
  PASSWORD_TOO_SHORT: '密码长度至少6位',
  PASSWORDS_DONT_MATCH: '两次输入的密码不一致',
  INVALID_INPUT: '输入数据无效',
  
  // Server errors
  INTERNAL_ERROR: '内部服务器错误',
  DATABASE_ERROR: '数据库操作失败',
  
  // Success messages
  REGISTER_SUCCESS: '注册成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出登录成功'
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: '注册成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出登录成功',
  PROFILE_UPDATED: '资料更新成功',
  OPERATION_SUCCESS: '操作成功'
};
