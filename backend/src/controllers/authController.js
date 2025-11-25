import { User } from '../models/User.js';
import { generateToken } from '../utils/token.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants.js';

/**
 * User registration controller
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: ERROR_MESSAGES.USER_EXISTS
      });
    }

    // Check if username is taken
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        error: '用户名已被使用'
      });
    }

    // Create new user
    const user = await User.create({ username, email, password });
    
    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('用户注册错误:', error);
    
    if (error.message === ERROR_MESSAGES.USER_EXISTS) {
      return res.status(409).json({
        error: ERROR_MESSAGES.USER_EXISTS
      });
    }

    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * User login controller
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify user credentials
    const user = await User.verifyCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({
        error: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('用户登录错误:', error);
    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const updatedUser = await User.update(userId, updateData);

    res.json({
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar_url: updatedUser.avatar_url,
        updated_at: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('更新用户资料错误:', error);
    
    if (error.message === '用户名已被使用') {
      return res.status(409).json({
        error: '用户名已被使用'
      });
    }

    if (error.message === '没有有效的字段可以更新') {
      return res.status(400).json({
        error: '没有有效的更新数据'
      });
    }

    res.status(500).json({
      error: '更新资料失败'
    });
  }
};

/**
 * User logout controller
 */
export const logout = async (req, res) => {
  try {
    // 在实际应用中，这里可能会将token加入黑名单
    // 但对于JWT，通常客户端直接删除token即可
    
    res.json({
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
    });

  } catch (error) {
    console.error('用户退出错误:', error);
    res.status(500).json({
      error: '退出登录失败'
    });
  }
};

/**
 * Refresh token controller
 */
export const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    // Generate new token
    const newToken = generateToken(user);

    res.json({
      message: '令牌刷新成功',
      token: newToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(500).json({
      error: '刷新令牌失败'
    });
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const deleted = await User.delete(userId);
    
    if (!deleted) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    res.json({
      message: '账户删除成功'
    });

  } catch (error) {
    console.error('删除账户错误:', error);
    res.status(500).json({
      error: '删除账户失败'
    });
  }
};
