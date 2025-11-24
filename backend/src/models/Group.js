// backend/src/models/Group.js
import { pool } from '../config/database.js';

export class Group {
  // 创建新小组
  static async create(groupData) {
    const [result] = await pool.execute(
      `INSERT INTO study_groups (name, description, course_code, created_by) 
       VALUES (?, ?, ?, ?)`,
      [groupData.name, groupData.description, groupData.course_code, groupData.created_by]
    );
    
    // 将创建者添加为小组所有者
    await pool.execute(
      `INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, 'owner')`,
      [result.insertId, groupData.created_by]
    );
    
    return this.findById(result.insertId);
  }

  // 根据ID查找小组
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM study_groups WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // 获取所有小组列表
  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT sg.*, 
             COUNT(gm.user_id) as member_count
      FROM study_groups sg
      LEFT JOIN group_members gm ON sg.id = gm.group_id
      GROUP BY sg.id
      ORDER BY sg.created_at DESC
    `);
    return rows;
  }

  // 获取用户加入的小组
  static async findByUserId(userId) {
    const [rows] = await pool.execute(`
      SELECT sg.*, gm.role
      FROM study_groups sg
      JOIN group_members gm ON sg.id = gm.group_id
      WHERE gm.user_id = ?
      ORDER BY sg.created_at DESC
    `, [userId]);
    return rows;
  }

  // 添加成员到小组
  static async addMember(groupId, userId, role = 'member') {
    const [result] = await pool.execute(
      `INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)`,
      [groupId, userId, role]
    );
    return result;
  }

  // 在 Group 类中添加方法：

// 获取小组成员
static async getMembers(groupId) {
  const [rows] = await pool.execute(`
    SELECT gm.*, u.username, u.email
    FROM group_members gm
    LEFT JOIN users u ON gm.user_id = u.id
    WHERE gm.group_id = ?
    ORDER BY 
      CASE gm.role 
        WHEN 'owner' THEN 1
        WHEN 'admin' THEN 2 
        ELSE 3 
      END,
      gm.joined_at
  `, [groupId]);
  return rows;
}

// 检查用户是否在小组中
static async isMember(groupId, userId) {
  const [rows] = await pool.execute(
    `SELECT * FROM group_members WHERE group_id = ? AND user_id = ?`,
    [groupId, userId]
  );
  return rows.length > 0;
}
}