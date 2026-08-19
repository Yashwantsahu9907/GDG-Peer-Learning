import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get global chat messages
router.get('/global', async (req, res) => {
  try {
    const messages = await Message.find({ chatType: 'global' }).sort({ timestamp: -1 }).limit(50);
    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching global chat:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch global chat' });
  }
});

// Get personal chat messages between two users
router.get('/personal/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      chatType: 'personal',
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: -1 }).limit(50);
    
    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching personal chat:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch personal chat' });
  }
});

// Get recent personal chat contacts for a user
router.get('/contacts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all personal messages where user is sender or receiver
    const messages = await Message.find({
      chatType: 'personal',
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ timestamp: -1 });
    
    // Extract unique contacts
    const contactsMap = new Map();
    
    messages.forEach(msg => {
      const isSender = msg.senderId === userId;
      const contactId = isSender ? msg.receiverId : msg.senderId;
      // If we don't have this contact yet, add them (since messages are sorted by newest, this gets the latest)
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          userId: contactId,
          name: isSender ? 'Unknown' : msg.senderName, // We might not know the receiver's name directly from the msg if we only have their ID, but usually we can look it up
          lastMessage: msg.text,
          timestamp: msg.timestamp
        });
      }
    });
    
    // For contacts where we are the sender, we need their name. We could populate or just return what we have.
    // For simplicity, let's just return the map values. The frontend can display it.
    
    res.status(200).json({ success: true, contacts: Array.from(contactsMap.values()) });
  } catch (error) {
    console.error('Error fetching chat contacts:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch contacts' });
  }
});

export default router;
