import mysql from 'mysql2/promise';
import { DB_CONSTANTS } from './constants.js';

// Database configuration
// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'learnsync_user',
  password: process.env.DB_PASSWORD || 'learnsync123',
  database: process.env.DB_NAME || 'learnsync',
  waitForConnections: true,
  connectionLimit: DB_CONSTANTS.MAX_CONNECTIONS,
  queueLimit: 0,
  acquireTimeout: DB_CONSTANTS.ACQUIRE_TIMEOUT,
  timeout: DB_CONSTANTS.TIMEOUT,
  charset: 'utf8mb4',
  timezone: '+08:00'
};

// 调试信息
console.log('🔍 数据库配置:', {
  user: dbConfig.user,
  database: dbConfig.database,
  hasPassword: !!dbConfig.password
});

let pool;

/**
 * Create database connection pool and initialize tables
 */
export async function createDatabaseConnection() {
  try {
    console.log('🔗 正在连接数据库...');
    
    // First, create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.end();

    // Create connection pool
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const testConnection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    testConnection.release();
    
    // Initialize database tables
    await initializeTables();
    
    return pool;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    throw error;
  }
}

/**
 * Initialize all required database tables
 */
/**
 * Initialize all required database tables
 */
async function initializeTables() {
  try {
    console.log('📊 正在初始化数据库表...');
    
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Study groups table - 添加这表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS study_groups (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        course_code VARCHAR(20),
        created_by INT NOT NULL,
        max_members INT DEFAULT 20,
        is_public BOOLEAN DEFAULT TRUE,
        category ENUM('algorithm', 'web', 'database', 'ai', 'math', 'other') DEFAULT 'other',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_created_by (created_by)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Group members table - 添加这表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS group_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT NOT NULL,
        user_id INT NOT NULL,
        role ENUM('owner', 'admin', 'member') DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_member (group_id, user_id),
        INDEX idx_group_id (group_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ 数据库表初始化完成');
  } catch (error) {
    console.error('❌ 数据库表初始化失败:', error);
    throw error;
  }
}

/**
 * Get database connection pool
 */
export function getConnection() {
  if (!pool) {
    throw new Error('数据库未连接，请先调用 createDatabaseConnection()');
  }
  return pool;
}

/**
 * Execute a query with parameters
 */
export async function executeQuery(sql, params = []) {
  const connection = getConnection();
  
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw error;
  }
}

/**
 * Execute a query and return the first result
 */
export async function executeQuerySingle(sql, params = []) {
  const rows = await executeQuery(sql, params);
  return rows[0] || null;
}

/**
 * Close database connection
 */
export async function closeDatabaseConnection() {
  if (pool) {
    await pool.end();
    console.log('✅ 数据库连接已关闭');
  }
}

export default pool;
