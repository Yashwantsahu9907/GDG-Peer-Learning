import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatType: {
    type: String,
    enum: ['global', 'personal'],
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: function() {
      return this.chatType === 'personal';
    }
  },
  text: {
    type: String,
    required: true
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  replyTo: {
    messageId: { type: String },
    senderName: { type: String },
    text: { type: String }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
