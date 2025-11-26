// backend/src/models/Group.js
import { getConnection, executeQuery } from '../config/database.js';

export class Group {
  // 创建新小组
  static async create(groupData) {
    const connection = getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO study_groups (name, description, course_code, created_by, max_members, is_public, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        groupData.name, 
        groupData.description, 
        groupData.course_code, 
        groupData.created_by,
        groupData.max_members || 20,
        groupData.is_public !== false,
        groupData.category || 'other'
      ]
    );
    
    // 将创建者添加为小组所有者
    await connection.execute(
      `INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, 'owner')`,
      [result.insertId, groupData.created_by]
    );
    
    return this.findById(result.insertId);
  }

  // 根据ID查找小组
  static async findById(id) {
    const rows = await executeQuery(
      `SELECT sg.*, 
              COUNT(gm.user_id) as member_count,
              u.username as created_by_name
       FROM study_groups sg
       LEFT JOIN group_members gm ON sg.id = gm.group_id
       LEFT JOIN users u ON sg.created_by = u.id
       WHERE sg.id = ?
       GROUP BY sg.id`,
      [id]
    );
    return rows[0] || null;
  }

  // 获取所有小组列表
  static async findAll() {
    const rows = await executeQuery(`
      SELECT sg.*, 
             COUNT(gm.user_id) as member_count,
             u.username as created_by_name
      FROM study_groups sg
      LEFT JOIN group_members gm ON sg.id = gm.group_id
      LEFT JOIN users u ON sg.created_by = u.id
      GROUP BY sg.id
      ORDER BY sg.created_at DESC
    `);
    return rows;
  }

  // 获取用户加入的小组
  static async findByUserId(userId) {
    const rows = await executeQuery(`
      SELECT sg.*, gm.role,
             COUNT(gm2.user_id) as member_count
      FROM study_groups sg
      JOIN group_members gm ON sg.id = gm.group_id
      LEFT JOIN group_members gm2 ON sg.id = gm2.group_id
      WHERE gm.user_id = ?
      GROUP BY sg.id, gm.role
      ORDER BY sg.created_at DESC
    `, [userId]);
    return rows;
  }

  // 添加成员到小组
  static async addMember(groupId, userId, role = 'member') {
    const connection = getConnection();
    const [result] = await connection.execute(
      `INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)`,
      [groupId, userId, role]
    );
    return result;
  }

  // 获取小组成员
  static async getMembers(groupId) {
    const rows = await executeQuery(`
      SELECT gm.*, u.username, u.email, u.avatar_url
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
    const rows = await executeQuery(
      `SELECT * FROM group_members WHERE group_id = ? AND user_id = ?`,
      [groupId, userId]
    );
    return rows.length > 0;
  }

  // 更新小组信息
  static async update(groupId, updateData) {
    const connection = getConnection();
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    if (fields.length === 0) {
      return this.findById(groupId);
    }
    
    values.push(groupId);
    
    await connection.execute(
      `UPDATE study_groups SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(groupId);
  }

  // 删除小组
  static async delete(groupId) {
    const connection = getConnection();
    await connection.execute(
      `DELETE FROM study_groups WHERE id = ?`,
      [groupId]
    );
  }

  // 搜索小组
  static async search(query, category = '') {
    let sql = `
      SELECT sg.*, 
             COUNT(gm.user_id) as member_count,
             u.username as created_by_name
      FROM study_groups sg
      LEFT JOIN group_members gm ON sg.id = gm.group_id
      LEFT JOIN users u ON sg.created_by = u.id
      WHERE sg.name LIKE ? OR sg.description LIKE ?
    `;
    
    const params = [`%${query}%`, `%${query}%`];
    
    if (category) {
      sql += ` AND sg.category = ?`;
      params.push(category);
    }
    
    sql += ` GROUP BY sg.id ORDER BY sg.created_at DESC`;
    
    const rows = await executeQuery(sql, params);
    return rows;
  }

  // 删除小组
static async delete(groupId) {
  const connection = getConnection();
  await connection.execute(
    'DELETE FROM study_groups WHERE id = ?',
    [groupId]
  );
}
}