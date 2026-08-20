import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createNotification = async ({ recipientId, senderId, type, message, link, metadata }, io) => {
  try {
    if (!recipientId || !senderId) {
      throw new Error('Recipient ID and Sender ID are required');
    }

    if (recipientId === senderId) {
      return null; // Do not notify self
    }

    // Check for duplicate follow notifications
    if (type === 'FOLLOW' || type === 'FOLLOW_BACK') {
      const existing = await Notification.findOne({
        recipientId,
        senderId,
        type: { $in: ['FOLLOW', 'FOLLOW_BACK'] }
      });
      if (existing) {
        return null;
      }
    }

    const sender = await User.findById(senderId).lean();
    if (!sender) {
      throw new Error('Sender not found');
    }

    const newNotification = await Notification.create({
      recipientId,
      senderId,
      type,
      message,
      link,
      metadata
    });

    const populatedNotification = {
      ...newNotification.toObject(),
      sender: {
        userId: sender._id.toString(),
        name: sender.name,
        avatar: sender.avatar // Assuming avatar exists
      }
    };

    // Emit in real-time if io is provided
    if (io) {
      io.to(`user:${recipientId}`).emit('notification:new', populatedNotification);
    }

    return populatedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
