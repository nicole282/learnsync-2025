import bcrypt from 'bcryptjs';
import { ERROR_MESSAGES } from '../config/constants.js';

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password, saltRounds = 10) {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('密码必须是字符串');
    }
    
    if (password.length < 6) {
      throw new Error(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('密码加密错误:', error);
    throw new Error('密码加密失败');
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainPassword - Plain text password to check
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  try {
    if (!plainPassword || !hashedPassword) {
      return false;
    }
    
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('密码验证错误:', error);
    return false;
  }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validatePasswordStrength(password) {
  const errors = [];
  
  if (!password || password.length < 6) {
    errors.push(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
  }
  
  if (password.length > 100) {
    errors.push('密码长度不能超过100个字符');
  }
  
  // Optional: Add more strength checks
  // if (!/(?=.*[a-z])/.test(password)) {
  //   errors.push('密码必须包含至少一个小写字母');
  // }
  // if (!/(?=.*[A-Z])/.test(password)) {
  //   errors.push('密码必须包含至少一个大写字母');
  // }
  // if (!/(?=.*\d)/.test(password)) {
  //   errors.push('密码必须包含至少一个数字');
  // }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate a random password
 * @param {number} length - Length of the password (default: 12)
 * @returns {string} Random password
 */
export function generateRandomPassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}
