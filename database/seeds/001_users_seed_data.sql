-- LearnSync 测试用户数据种子脚本
-- 文件名: 001_users_seed_data.sql
-- 描述: 插入测试用户数据用于开发和演示
-- 作者: LearnSync Team
-- 创建时间: 2025-01-01

-- 设置数据库
USE learnsync_dev;

-- 开始事务，确保数据完整性
START TRANSACTION;

-- 清空现有测试数据（可选，仅在开发环境使用）
-- DELETE FROM users WHERE email LIKE '%@example.com' OR email LIKE '%@cuhk.edu.hk';

-- 插入测试用户数据
-- 注意：密码都是 '123456'，使用 bcrypt 加密后的哈希值
INSERT INTO users (username, email, password_hash, avatar_url, created_at) VALUES
(
    'alice_2025',
    'alice@cuhk.edu.hk',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    '/avatars/alice.jpg',
    '2025-01-01 10:00:00'
),
(
    'bob_student',
    'bob@cuhk.edu.hk',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    '/avatars/bob.png',
    '2025-01-01 10:05:00'
),
(
    'charlie_ie',
    'charlie@cuhk.edu.hk',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    '/avatars/charlie.jpg',
    '2025-01-01 10:10:00'
),
(
    'diana_learn',
    'diana@cuhk.edu.hk',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    NULL, -- 没有头像
    '2025-01-01 10:15:00'
),
(
    'evan_dev',
    'evan@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    '/avatars/evan.png',
    '2025-01-01 10:20:00'
),
(
    'fiona_code',
    'fiona@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    NULL,
    '2025-01-01 10:25:00'
),
(
    'george_team',
    'george@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    '/avatars/george.jpg',
    '2025-01-01 10:30:00'
),
(
    'hannah_study',
    'hannah@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.KB6sZ7QwC0W8YbX6v7nQ.FGzV/zrO6', -- 密码: 123456
    NULL,
    '2025-01-01 10:35:00'
);

-- 提交事务
COMMIT;

-- 数据插入完成提示
SELECT '✅ 测试用户数据插入成功' AS '种子状态';

-- 显示插入的用户数据（不显示密码哈希）
SELECT 
    id AS '用户ID',
    username AS '用户名',
    email AS '邮箱',
    avatar_url AS '头像',
    created_at AS '创建时间',
    updated_at AS '更新时间'
FROM users 
ORDER BY id;

-- 显示数据统计
SELECT 
    COUNT(*) AS '总用户数',
    COUNT(avatar_url) AS '有头像用户数',
    MIN(created_at) AS '最早注册时间',
    MAX(created_at) AS '最新注册时间'
FROM users;

-- 显示用户名字分布统计
SELECT 
    SUBSTRING_INDEX(email, '@', -1) AS '邮箱域名',
    COUNT(*) AS '用户数量'
FROM users 
GROUP BY SUBSTRING_INDEX(email, '@', -1) 
ORDER BY COUNT(*) DESC;

-- 验证数据完整性
SELECT 
    '用户数据完整性检查' AS '检查项目',
    COUNT(*) = 8 AS '总记录数正确',
    COUNT(DISTINCT username) = 8 AS '用户名唯一',
    COUNT(DISTINCT email) = 8 AS '邮箱唯一',
    SUM(CASE WHEN LENGTH(password_hash) > 0 THEN 1 ELSE 0 END) = 8 AS '密码哈希完整'
FROM users;
