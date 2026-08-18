import express from 'express';
import { register, login, logout, getMe, googleAuth } from '../controllers/authController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.get('/me', isAuth, getMe);

export default router;
