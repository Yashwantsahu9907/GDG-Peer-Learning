import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getNotifications = async (req, res) => {
  try {
    const authenticatedUserId = req.user.userId;

    const { page = 1, limit = 10, unreadOnly } = req.query;
    const query = { recipientId: authenticatedUserId };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // Populate sender details manually since we use userId as String
    const senderIds = [...new Set(notifications.map(n => n.senderId))]
      .filter(id => id && mongoose.isValidObjectId(id));
      
    const senders = await User.find({ _id: { $in: senderIds } }).lean();
    const senderMap = senders.reduce((acc, sender) => {
      acc[sender._id.toString()] = { userId: sender._id.toString(), name: sender.name, avatar: sender.avatar };
      return acc;
    }, {});

    const populatedNotifications = notifications.map(n => ({
      ...n,
      sender: senderMap[n.senderId] || { userId: n.senderId, name: 'Unknown User' }
    }));

    res.status(200).json({ success: true, notifications: populatedNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const authenticatedUserId = req.user.userId;
    
    const unreadCount = await Notification.countDocuments({
      recipientId: authenticatedUserId,
      isRead: false
    });

    res.status(200).json({ success: true, unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const authenticatedUserId = req.user.userId;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId: authenticatedUserId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const authenticatedUserId = req.user.userId;
    
    await Notification.updateMany(
      { recipientId: authenticatedUserId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const authenticatedUserId = req.user.userId;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({ _id: id, recipientId: authenticatedUserId });
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};
