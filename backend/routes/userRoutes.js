// backend/routes/userRoutes.js
import express from 'express';
import { searchUsers, getAllUsers, getUsersWithChatHistory } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/search', searchUsers);
router.get('/all', verifyToken, getAllUsers);
router.get('/chat-history', verifyToken, getUsersWithChatHistory);

export default router;
