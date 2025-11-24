# LearnSync 数据库文档

## 概述
此目录包含 LearnSync 学习管理系统的数据库相关文件，包括迁移脚本和种子数据。

## 文件结构
database/
├── migrations/ # 数据库迁移脚本
│ └── 001_create_users_table.sql
├── seeds/ # 测试数据种子脚本
│ └── 001_users_seed_data.sql
├── setup_database.sh # 自动化设置脚本
└── README.md # 本文档


## 迁移脚本说明

### 001_create_users_table.sql
- **功能**: 创建用户表
- **表名**: `users`
- **字段**:
  - `id`: 主键，自增
  - `username`: 用户名，唯一
  - `email`: 邮箱地址，唯一
  - `password_hash`: 加密密码
  - `avatar_url`: 头像URL（可选）
  - `created_at`: 创建时间
  - `updated_at`: 更新时间

## 种子数据说明

### 001_users_seed_data.sql
- **功能**: 插入测试用户数据
- **用户数量**: 8个测试用户
- **默认密码**: 所有测试用户密码都是 `123456`
- **邮箱域名**: 使用 `@cuhk.edu.hk` 和 `@example.com`

## 使用方法

### 1. 手动设置
```sql
-- 创建数据库
CREATE DATABASE learnsync_dev;
USE learnsync_dev;

-- 运行迁移脚本
SOURCE database/migrations/001_create_users_table.sql;

-- 插入测试数据
SOURCE database/seeds/001_users_seed_data.sql;

-- 验证数据
SELECT * FROM users;
