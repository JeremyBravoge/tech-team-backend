import express from 'express';
import { getCommentsByBlogId, createComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/:blogId', getCommentsByBlogId); // Get comments for a blog
router.post('/', createComment); // Add comment
router.delete('/:id', deleteComment); // Delete comment

export default router;
