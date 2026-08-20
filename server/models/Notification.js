import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'FOLLOW',
      'FOLLOW_BACK',
      'MESSAGE',
      'MENTION',
      'LEARNING_REQUEST',
      'LEARNING_REQUEST_ACCEPTED',
      'SESSION_REQUEST',
      'SESSION_ACCEPTED',
      'SYSTEM'
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  metadata: {
    type: Object,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, { timestamps: true });

// Create compound index for querying unread notifications for a user efficiently
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
