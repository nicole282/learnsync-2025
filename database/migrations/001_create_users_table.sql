-- LearnSync 用户表迁移脚本
-- 文件名: 001_create_users_table.sql
-- 描述: 创建用户表和相关索引
-- 作者: LearnSync Team
-- 创建时间: 2025-01-01

-- 设置数据库
USE learnsync_dev;

-- 删除已存在的表（仅在开发环境使用）
-- DROP TABLE IF EXISTS users;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    -- 主键和唯一标识
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- 用户身份信息
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名，唯一标识',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱地址，用于登录和通知',
    
    -- 安全信息
    password_hash VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    
    -- 个人信息
    avatar_url VARCHAR(255) DEFAULT NULL COMMENT '头像图片URL',
    
    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '账户创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    
    -- 表级别注释
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统用户表';

-- 表创建完成提示
SELECT '✅ 用户表创建成功' AS '迁移状态';

-- 显示表结构
DESCRIBE users;

-- 显示表索引信息
SHOW INDEX FROM users;

-- 表注释信息
SELECT 
    TABLE_NAME AS '表名',
    TABLE_COMMENT AS '表说明',
    ENGINE AS '存储引擎',
    TABLE_COLLATION AS '字符集'
FROM information_schema.TABLES 
WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'learnsync_dev';
