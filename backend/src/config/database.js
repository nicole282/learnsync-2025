// backend/src/config/database.js
import mysql from 'mysql2/promise';

// 使用新创建的用户
const dbConfig = {
  host: 'localhost',
  user: 'learnsync_user',
  password: 'learnsync123', // 你设置的密码
  database: 'learnsync',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.log('❌ 数据库连接失败:', error.message);
    return false;
  }
}

// 初始化数据库表
async function initializeDatabase() {
  try {
    // 创建数据库（如果不存在）
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempConnection.end();

    // 创建学习小组表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS study_groups (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        course_code VARCHAR(20),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建小组成员表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS group_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT,
        user_id INT,
        role ENUM('owner', 'admin', 'member') DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
        UNIQUE KEY unique_member (group_id, user_id)
      )
    `);

    console.log('✅ 数据库表初始化成功');
    return true;
  } catch (error) {
    console.log('❌ 数据库初始化失败:', error);
    return false;
  }
}

export { pool, dbConfig, testConnection, initializeDatabase };