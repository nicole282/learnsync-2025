import jwt from 'jsonwebtoken';
import { JWT_CONSTANTS, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @param {number} user.id - User ID
 * @param {string} user.email - User email
 * @param {string} user.username - User username
 * @returns {string} JWT token
 */
export function generateToken(user) {
  try {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username
    };
    
    const token = jwt.sign(
      payload,
      JWT_CONSTANTS.SECRET,
      {
        expiresIn: JWT_CONSTANTS.EXPIRES_IN,
        algorithm: JWT_CONSTANTS.ALGORITHM
      }
    );
    
    return token;
  } catch (error) {
    console.error('生成JWT令牌错误:', error);
    throw new Error('生成认证令牌失败');
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export function verifyToken(token) {
  try {
    if (!token) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }
    
    const decoded = jwt.verify(token, JWT_CONSTANTS.SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error(ERROR_MESSAGES.EXPIRED_TOKEN);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }
    throw error;
  }
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header
 * @returns {string|null} Token or null if not found
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Get token expiration time
 * @returns {Date} Expiration date
 */
export function getTokenExpiration() {
  const expiresIn = JWT_CONSTANTS.EXPIRES_IN;
  const now = new Date();
  
  if (expiresIn.endsWith('d')) {
    const days = parseInt(expiresIn);
    now.setDate(now.getDate() + days);
  } else if (expiresIn.endsWith('h')) {
    const hours = parseInt(expiresIn);
    now.setHours(now.getHours() + hours);
  } else if (expiresIn.endsWith('m')) {
    const minutes = parseInt(expiresIn);
    now.setMinutes(now.getMinutes() + minutes);
  } else {
    // Default to 7 days
    now.setDate(now.getDate() + 7);
  }
  
  return now;
}

/**
 * Check if token is about to expire (within 1 day)
 * @param {string} token - JWT token
 * @returns {boolean} True if token is about to expire
 */
export function isTokenExpiringSoon(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return false;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 24 * 60 * 60;
    
    return (decoded.exp - now) < oneDay;
  } catch (error) {
    return false;
  }
}
