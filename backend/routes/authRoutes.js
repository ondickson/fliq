// routes/authRoutes.js
import express from 'express';
import { register, login, getLoggedInUser, logout } from '../controllers/authController.js';
import upload from '../utils/upload.js'

const router = express.Router();

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.get('/me', getLoggedInUser);
router.post('/logout', logout);

export default router;
