import express from 'express';
import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember
} from '../controllers/membersController.js';

const router = express.Router();

router.post('/', createMember);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
