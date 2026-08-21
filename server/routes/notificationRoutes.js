import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  markSenderMessagesAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuth, getNotifications);
router.get('/unread-count', isAuth, getUnreadCount);
router.patch('/read-all', isAuth, markAllAsRead);
router.patch('/sender/:senderId/read', isAuth, markSenderMessagesAsRead);
router.patch('/:id/read', isAuth, markAsRead);
router.delete('/:id', isAuth, deleteNotification);

export default router;
