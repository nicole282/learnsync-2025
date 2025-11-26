// backend/src/routes/groups.js
import express from 'express';
import { 
  getGroups, 
  createGroup, 
  getGroupById, 
  joinGroup,
  getGroupMembers,
  deleteGroup,  // 确保导入了deleteGroup
  leaveGroup    // 确保导入了leaveGroup
} from '../controllers/groupController.js';

const router = express.Router();

// 获取所有小组
router.get('/', getGroups);

// 创建新小组
router.post('/', createGroup);

// 获取小组详情
router.get('/:id', getGroupById);

// 加入小组
router.post('/:id/join', joinGroup);
router.get('/:id/members', getGroupMembers);

// 删除小组
router.post('/:id/delete', deleteGroup);

// 退出小组
router.post('/:id/leave', leaveGroup);

export default router;