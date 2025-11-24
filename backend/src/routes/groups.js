// backend/src/routes/groups.js
import express from 'express';
import { 
  getGroups, 
  createGroup, 
  getGroupById, 
  joinGroup 
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

export default router;

// 在文件末尾添加
import { getGroupMembers } from '../controllers/groupController.js';

// 获取小组成员列表
router.get('/:id/members', getGroupMembers);