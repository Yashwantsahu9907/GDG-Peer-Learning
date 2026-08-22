import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';

import notificationRoutes from './routes/notificationRoutes.js';
import { createNotification } from './services/notificationService.js';

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration for Render and Local Development
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.some(o => o.replace(/\/$/, '') === cleanOrigin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
};

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true
  }
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
import mongoose from 'mongoose';
import Message from './models/Message.js';
import bountyRoutes from './routes/bountyRoutes.js';
import executeRoutes from './routes/executeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/userRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bounties', bountyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', executeRoutes);
app.use('/api/notifications', notificationRoutes);

// Test Endpoints to simulate actions
app.post('/api/test/follow', async (req, res) => {
  const { senderId, recipientId } = req.body;
  
  // Logic to simulate follow/follow-back
  // Let's assume we randomly send FOLLOW or FOLLOW_BACK for testing
  const type = Math.random() > 0.5 ? 'FOLLOW' : 'FOLLOW_BACK';
  
  const notif = await createNotification({
    recipientId,
    senderId,
    type,
    message: type === 'FOLLOW' ? 'started following you.' : 'followed you back.',
    link: `/profile/${senderId}`
  }, io);
  
  res.json({ success: true, notification: notif });
});

app.post('/api/test/message', async (req, res) => {
  const { senderId, recipientId, content } = req.body;
  
  // Create message notification
  await createNotification({
    recipientId,
    senderId,
    type: 'MESSAGE',
    message: 'sent you a message.',
    link: `/chat/${senderId}`
  }, io);

  // Check for mentions
  const mentionRegex = /@(\w+)/g;
  const matches = [...content.matchAll(mentionRegex)];
  const mentionedUsernames = [...new Set(matches.map(m => m[1]))];

  for (const username of mentionedUsernames) {
    // Find user by name (mocking username as name here for simplicity)
    const mentionedUser = await User.findOne({ name: username });
    if (mentionedUser && mentionedUser._id.toString() !== senderId) {
      await createNotification({
        recipientId: mentionedUser._id.toString(),
        senderId,
        type: 'MENTION',
        message: 'mentioned you in a message.',
        link: `/chat/${senderId}`
      }, io);
    }
  }
  
  res.json({ success: true });
});

// In-memory room occupancy tracking
const sessionRooms = new Map();

// Socket.io Connection
io.on('connection', (socket) => {
  const { userId, auth_token } = socket.handshake.auth || {};
  const displayId = userId || socket.id;

  // Global Chat
  socket.on('join_global', () => {
    socket.join('global_chat');
  });

  socket.on('send_global_message', async (data) => {
    try {
      const msgData = {
        chatType: 'global',
        senderId: data.senderId || displayId,
        senderName: data.senderName || 'Anonymous',
        text: data.text,
        replyTo: data.replyTo || null,
        timestamp: new Date()
      };
      
      let savedMsg = msgData;
      try {
        savedMsg = await Message.create(msgData);
      } catch (dbErr) {
        console.warn('DB save skipped/failed for global message, broadcasting memory fallback:', dbErr.message);
      }

      io.to('global_chat').emit('receive_global_message', savedMsg);
      
      // Check for mentions in global chat
      const mentionRegex = /@(\w+)/g;
      const matches = [...(data.text || '').matchAll(mentionRegex)];
      const mentionedUsernames = [...new Set(matches.map(m => m[1]))];

      for (const username of mentionedUsernames) {
        const mentionedUser = await User.findOne({ name: username });
        if (mentionedUser && mentionedUser._id.toString() !== msgData.senderId) {
          await createNotification({
            recipientId: mentionedUser._id.toString(),
            senderId: msgData.senderId,
            type: 'MENTION',
            message: 'mentioned you in global chat.',
            link: `/chat/global`
          }, io);
        }
      }
    } catch (err) {
      console.error('Error handling global message:', err);
    }
  });

  // Async DB check for user connection logging & personal room (safe against non-ObjectId strings)
  if (userId) {
    socket.join(`user:${userId}`); // Ensure private user room for notifications
    socket.join(userId);
    if (mongoose.Types.ObjectId.isValid(userId)) {
      User.findById(userId).catch(err => {
        console.warn('Socket user lookup error:', err.message);
      });
    }
  }

  // Personal Chat
  socket.on('send_personal_message', async (data) => {
    try {
      const msgData = {
        chatType: 'personal',
        senderId: data.senderId,
        senderName: data.senderName,
        receiverId: data.receiverId,
        text: data.text,
        replyTo: data.replyTo || null,
        timestamp: new Date()
      };

      let savedMsg = msgData;
      try {
        savedMsg = await Message.create(msgData);
      } catch (dbErr) {
        console.warn('DB save skipped for personal message:', dbErr.message);
      }

      io.to(data.receiverId).emit('receive_personal_message', savedMsg);
      io.to(data.senderId).emit('receive_personal_message', savedMsg);
      
      // Create message notification
      await createNotification({
        recipientId: data.receiverId,
        senderId: data.senderId,
        type: 'MESSAGE',
        message: 'sent you a message.',
        link: `/chat/${data.senderId}`
      }, io);

      // Check for mentions in personal chat (if someone mentions a third person)
      const mentionRegex = /@(\w+)/g;
      const matches = [...(data.text || '').matchAll(mentionRegex)];
      const mentionedUsernames = [...new Set(matches.map(m => m[1]))];

      for (const username of mentionedUsernames) {
        const mentionedUser = await User.findOne({ name: username });
        if (mentionedUser && mentionedUser._id.toString() !== data.senderId) {
          await createNotification({
            recipientId: mentionedUser._id.toString(),
            senderId: data.senderId,
            type: 'MENTION',
            message: 'mentioned you in a message.',
            link: `/chat/${data.senderId}`
          }, io);
        }
      }
    } catch (err) {
      console.error('Error handling personal message:', err);
    }
  });

  socket.on('edit_message', async (data) => {
    try {
      const msg = await Message.findById(data.messageId);
      if (msg && msg.senderId === data.senderId) {
        msg.text = data.text;
        msg.isEdited = true;
        await msg.save();
        if (msg.chatType === 'global') {
          io.to('global_chat').emit('message_edited', msg);
        } else {
          io.to(msg.receiverId).emit('message_edited', msg);
          io.to(msg.senderId).emit('message_edited', msg);
        }
      }
    } catch (err) {
      console.error('Error editing message:', err);
    }
  });

  socket.on('delete_message', async (data) => {
    try {
      const msg = await Message.findById(data.messageId);
      if (msg && msg.senderId === data.senderId) {
        await Message.findByIdAndDelete(data.messageId);
        if (msg.chatType === 'global') {
          io.to('global_chat').emit('message_deleted', { messageId: msg._id, chatType: msg.chatType });
        } else {
          io.to(msg.receiverId).emit('message_deleted', { messageId: msg._id, chatType: msg.chatType });
          io.to(msg.senderId).emit('message_deleted', { messageId: msg._id, chatType: msg.chatType });
        }
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  });

  // ==========================================
  // Collaborative Session / Meeting Room Events
  // ==========================================
  socket.on('join_session', ({ roomId, user: sessionUser }) => {
    if (!roomId) return;
    socket.join(roomId);
    socket.currentRoom = roomId;
    socket.sessionUser = sessionUser || { name: 'Peer', id: displayId };

    if (!sessionRooms.has(roomId)) {
      sessionRooms.set(roomId, {
        users: new Map(),
        code: '// Collaborative Session\n// Share the invite link with peers to code and collaborate together!\n\nfunction welcome() {\n  console.log("Welcome to GDG Peer Collab Room!");\n}\n\nwelcome();\n',
        language: 'javascript',
        notes: '# GDG Peer Collab Notes\n\n- Collaborative shared notes\n- Real-time markdown synced between all peers\n- Discuss architecture and solutions here\n',
        drawHistory: []
      });
    }

    const roomData = sessionRooms.get(roomId);
    roomData.users.set(socket.id, socket.sessionUser);

    // Notify other peers in this room
    socket.to(roomId).emit('peer_joined', {
      peerId: socket.id,
      user: socket.sessionUser,
      occupantCount: roomData.users.size
    });

    // Send room occupancy list AND current room state to the newly joined peer
    socket.emit('room_users', {
      users: Array.from(roomData.users.entries()).map(([peerId, u]) => ({ peerId, ...u })),
      occupantCount: roomData.users.size
    });

    socket.emit('room_state', {
      roomId,
      code: roomData.code,
      language: roomData.language,
      notes: roomData.notes,
      drawHistory: roomData.drawHistory,
      users: Array.from(roomData.users.entries()).map(([peerId, u]) => ({ peerId, ...u })),
      occupantCount: roomData.users.size
    });
  });

  // Real-time Collaborative Code Editing
  socket.on('code_change', ({ roomId, code_diff, cursorPosition, language }) => {
    if (!roomId) return;
    const roomData = sessionRooms.get(roomId);
    if (roomData) {
      if (code_diff !== undefined) roomData.code = code_diff;
      if (language) roomData.language = language;
    }
    socket.to(roomId).emit('code_update', {
      code: code_diff,
      cursorPosition,
      language,
      senderId: socket.id,
      senderName: socket.sessionUser?.name || 'Peer'
    });
  });

  // Real-time Session Chat
  socket.on('session_chat_message', ({ roomId, message }) => {
    if (!roomId || !message) return;
    io.to(roomId).emit('session_chat_message', {
      ...message,
      senderSocketId: socket.id
    });
  });

  // Collaborative Session Notes Sync
  socket.on('session_notes_change', ({ roomId, notes }) => {
    if (!roomId) return;
    const roomData = sessionRooms.get(roomId);
    if (roomData && notes !== undefined) {
      roomData.notes = notes;
    }
    socket.to(roomId).emit('notes_update', {
      notes,
      senderId: socket.id
    });
  });

  // Collaborative Whiteboard Sync
  socket.on('whiteboard_draw', ({ roomId, drawData }) => {
    if (!roomId || !drawData) return;
    const roomData = sessionRooms.get(roomId);
    if (roomData) {
      roomData.drawHistory.push(drawData);
      if (roomData.drawHistory.length > 500) roomData.drawHistory.shift();
    }
    socket.to(roomId).emit('whiteboard_draw', {
      drawData,
      senderId: socket.id
    });
  });

  socket.on('whiteboard_clear', ({ roomId }) => {
    if (!roomId) return;
    const roomData = sessionRooms.get(roomId);
    if (roomData) {
      roomData.drawHistory = [];
    }
    socket.to(roomId).emit('whiteboard_clear', {
      senderId: socket.id
    });
  });

  // Typing indicator
  socket.on('peer_typing', ({ roomId, isTyping }) => {
    if (!roomId) return;
    socket.to(roomId).emit('peer_typing', {
      peerId: socket.id,
      userName: socket.sessionUser?.name || 'Peer',
      isTyping
    });
  });

  // WebRTC Signaling
  socket.on('webrtc_offer', ({ roomId, offer, target }) => {
    const payload = {
      offer,
      sender: socket.id,
      senderUser: socket.sessionUser || { name: 'Peer', id: displayId }
    };
    if (target) {
      io.to(target).emit('webrtc_offer', payload);
    } else if (roomId) {
      socket.to(roomId).emit('webrtc_offer', payload);
    }
  });

  socket.on('webrtc_answer', ({ roomId, answer, target }) => {
    const payload = {
      answer,
      sender: socket.id,
      senderUser: socket.sessionUser || { name: 'Peer', id: displayId }
    };
    if (target) {
      io.to(target).emit('webrtc_answer', payload);
    } else if (roomId) {
      socket.to(roomId).emit('webrtc_answer', payload);
    }
  });

  socket.on('webrtc_ice_candidate', ({ roomId, candidate, target }) => {
    const payload = {
      candidate,
      sender: socket.id
    };
    if (target) {
      io.to(target).emit('webrtc_ice_candidate', payload);
    } else if (roomId) {
      socket.to(roomId).emit('webrtc_ice_candidate', payload);
    }
  });

  socket.on('leave_session', ({ roomId }) => {
    if (roomId && sessionRooms.has(roomId)) {
      const roomData = sessionRooms.get(roomId);
      roomData.users.delete(socket.id);
      socket.leave(roomId);
      socket.to(roomId).emit('peer_left', {
        peerId: socket.id,
        occupantCount: roomData.users.size
      });
      if (roomData.users.size === 0) {
        sessionRooms.delete(roomId);
      }
    }
  });

  socket.on('disconnect', () => {
    if (socket.currentRoom && sessionRooms.has(socket.currentRoom)) {
      const roomData = sessionRooms.get(socket.currentRoom);
      roomData.users.delete(socket.id);
      socket.to(socket.currentRoom).emit('peer_left', {
        peerId: socket.id,
        occupantCount: roomData.users.size
      });
      if (roomData.users.size === 0) {
        sessionRooms.delete(socket.currentRoom);
      }
    }
  });
});

// User API routes
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.create({ name });
    res.status(201).json({ success: true, userId: user.userId, name: user.name });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Unable to create user' });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch user' });
  }
});

// Stats Route
app.get('/api/stats', (req, res) => {
  const activePeers = 1248 + (io.engine ? io.engine.clientsCount : 0);
  res.status(200).json({ success: true, activePeers });
});

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
