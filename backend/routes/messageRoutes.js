import express from 'express';
import { getChatMessages } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:otherUserId', verifyToken, getChatMessages);

export default router;
