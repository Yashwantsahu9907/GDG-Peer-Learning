import express from 'express';
import { register, login, logout, getMe, googleAuth, updateProfile } from '../controllers/authController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.get('/me', isAuth, getMe);
router.put('/profile', isAuth, updateProfile);

export default router;
