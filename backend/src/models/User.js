import { getConnection, executeQuery, executeQuerySingle } from '../config/database.js';
import { hashPassword, verifyPassword } from '../utils/encryption.js';
import { ERROR_MESSAGES } from '../config/constants.js';

export class User {
  /**
   * Create a new user
   */
  static async create(userData) {
    const { username, email, password } = userData;
    
    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error(ERROR_MESSAGES.USER_EXISTS);
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Insert user
      const connection = getConnection();
      const [result] = await connection.execute(
        `INSERT INTO users (username, email, password_hash) 
         VALUES (?, ?, ?)`,
        [username, email, passwordHash]
      );

      // Return user without password
      return await this.findById(result.insertId);
    } catch (error) {
      console.error('创建用户错误:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    try {
      const user = await executeQuerySingle(
        `SELECT id, username, email, avatar_url, created_at, updated_at 
         FROM users WHERE id = ?`,
        [id]
      );
      
      return user;
    } catch (error) {
      console.error('根据ID查找用户错误:', error);
      throw error;
    }
  }

  /**
   * Find user by email (includes password hash for authentication)
   */
  static async findByEmail(email) {
    try {
      const user = await executeQuerySingle(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );
      
      return user;
    } catch (error) {
      console.error('根据邮箱查找用户错误:', error);
      throw error;
    }
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    try {
      const user = await executeQuerySingle(
        `SELECT id, username, email, avatar_url, created_at, updated_at 
         FROM users WHERE username = ?`,
        [username]
      );
      
      return user;
    } catch (error) {
      console.error('根据用户名查找用户错误:', error);
      throw error;
    }
  }

  /**
   * Verify user password
   */
  static async verifyCredentials(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return null;
      }

      const isValidPassword = await verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return null;
      }

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('验证用户凭证错误:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async update(id, updateData) {
    try {
      const allowedFields = ['username', 'avatar_url'];
      const fieldsToUpdate = {};
      
      // Only allow specific fields to be updated
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          fieldsToUpdate[key] = updateData[key];
        }
      });
      
      if (Object.keys(fieldsToUpdate).length === 0) {
        throw new Error('没有有效的字段可以更新');
      }
      
      // Check username uniqueness if updating username
      if (fieldsToUpdate.username) {
        const existingUser = await this.findByUsername(fieldsToUpdate.username);
        if (existingUser && existingUser.id !== parseInt(id)) {
          throw new Error('用户名已被使用');
        }
      }
      
      const setClause = Object.keys(fieldsToUpdate)
        .map(key => `${key} = ?`)
        .join(', ');
      
      const values = [...Object.values(fieldsToUpdate), id];
      
      const connection = getConnection();
      await connection.execute(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        values
      );
      
      return await this.findById(id);
    } catch (error) {
      console.error('更新用户错误:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(id, currentPassword, newPassword) {
    try {
      // Get user with password hash
      const user = await executeQuerySingle(
        `SELECT * FROM users WHERE id = ?`,
        [id]
      );
      
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      
      // Verify current password
      const isValidCurrentPassword = await verifyPassword(currentPassword, user.password_hash);
      if (!isValidCurrentPassword) {
        throw new Error('当前密码不正确');
      }
      
      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);
      
      // Update password
      const connection = getConnection();
      await connection.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [newPasswordHash, id]
      );
      
      return true;
    } catch (error) {
      console.error('修改密码错误:', error);
      throw error;
    }
  }

  /**
   * Get all users (for admin purposes, paginated)
   */
  static async getAllUsers(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const users = await executeQuery(
        `SELECT id, username, email, avatar_url, created_at, updated_at 
         FROM users 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      
      // Get total count for pagination
      const [countResult] = await executeQuery(
        `SELECT COUNT(*) as total FROM users`
      );
      
      return {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      };
    } catch (error) {
      console.error('获取用户列表错误:', error);
      throw error;
    }
  }

  /**
   * Delete user (soft delete would be better in production)
   */
  static async delete(id) {
    try {
      const connection = getConnection();
      const [result] = await connection.execute(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除用户错误:', error);
      throw error;
    }
  }
}
