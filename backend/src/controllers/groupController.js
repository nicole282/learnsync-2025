// backend/src/controllers/groupController.js
import { Group } from '../models/Group.js';
import { getConnection } from '../config/database.js'; 

// 获取所有小组列表
export async function getGroups(req, res) {
  try {
    const groups = await Group.findAll();
    res.json({ groups });
  } catch (error) {
    console.error('获取小组列表错误:', error);
    res.status(500).json({ error: '获取小组列表失败' });
  }
}

// 创建新小组
export async function createGroup(req, res) {
  try {
    const { name, description, course_code } = req.body;
    const created_by = req.user?.id || 1; // 暂时用固定用户ID，后面接认证系统
    
    if (!name) {
      return res.status(400).json({ error: '小组名称不能为空' });
    }
    
    const group = await Group.create({
      name,
      description,
      course_code,
      created_by
    });
    
    res.status(201).json({
      message: '小组创建成功',
      group
    });
  } catch (error) {
    console.error('创建小组错误:', error);
    res.status(500).json({ error: '创建小组失败' });
  }
}

// 获取小组详情
export async function getGroupById(req, res) {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: '小组不存在' });
    }
    
    res.json({ group });
  } catch (error) {
    console.error('获取小组详情错误:', error);
    res.status(500).json({ error: '获取小组详情失败' });
  }
}

// 加入小组
export async function joinGroup(req, res) {
  try {
    const groupId = req.params.id;
    const userId = req.user?.id || 2; // 暂时用固定用户ID
    
    // 检查小组是否存在
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: '小组不存在' });
    }
    
    // 添加成员
    await Group.addMember(groupId, userId);
    
    res.json({ message: '成功加入小组' });
  } catch (error) {
    console.error('加入小组错误:', error);
    
    // 如果是重复加入，返回特定错误
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '已经在该小组中' });
    }
    
    res.status(500).json({ error: '加入小组失败' });
  }
}

// 获取小组成员列表
export async function getGroupMembers(req, res) {
  try {
    const groupId = req.params.id;
    
    // 检查小组是否存在
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: '小组不存在' });
    }
    
    const members = await Group.getMembers(groupId);
    res.json({ members });
  } catch (error) {
    console.error('获取小组成员错误:', error);
    res.status(500).json({ error: '获取小组成员失败' });
  }
}

// 删除小组
export async function deleteGroup(req, res) {
  try {
    const groupId = req.params.id;
    const userId = req.user?.id || 1; // 临时用固定用户
    
    // 检查用户是否有权限删除（必须是创建者）
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: '小组不存在' });
    }
    
    if (group.created_by !== userId) {
      return res.status(403).json({ error: '只有小组创建者可以删除小组' });
    }
    
    await Group.delete(groupId);
    
    res.json({ message: '小组删除成功' });
  } catch (error) {
    console.error('删除小组错误:', error);
    res.status(500).json({ error: '删除小组失败' });
  }
}

// 退出小组
export async function leaveGroup(req, res) {
  try {
    const groupId = req.params.id;
    const userId = req.user?.id || 1; // 临时用固定用户
    
    // 检查用户是否在小组中
    const isMember = await Group.isMember(groupId, userId);
    if (!isMember) {
      return res.status(400).json({ error: '您不在该小组中' });
    }
    
    // 检查是否是小组创建者（创建者不能退出，只能删除）
    const group = await Group.findById(groupId);
    if (group.created_by === userId) {
      return res.status(400).json({ error: '小组创建者不能退出，请删除小组' });
    }
    
    // 从 group_members 表中删除记录
    const connection = getConnection();
    await connection.execute(
      'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );
    
    res.json({ message: '成功退出小组' });
  } catch (error) {
    console.error('退出小组错误:', error);
    res.status(500).json({ error: '退出小组失败' });
  }
}