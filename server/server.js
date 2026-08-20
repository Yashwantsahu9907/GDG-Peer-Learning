import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
import mongoose from 'mongoose';
import Message from './models/Message.js';
import bountyRoutes from './routes/bountyRoutes.js';
import executeRoutes from './routes/executeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/bounties', bountyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', executeRoutes);

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
        timestamp: new Date()
      };
      
      let savedMsg = msgData;
      try {
        savedMsg = await Message.create(msgData);
      } catch (dbErr) {
        console.warn('DB save skipped/failed for global message, broadcasting memory fallback:', dbErr.message);
      }

      io.to('global_chat').emit('receive_global_message', savedMsg);
    } catch (err) {
      console.error('Error handling global message:', err);
    }
  });

  // Async DB check for user connection logging & personal room (safe against non-ObjectId strings)
  if (userId) {
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
    } catch (err) {
      console.error('Error handling personal message:', err);
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
      sessionRooms.set(roomId, new Map());
    }
    const roomUsers = sessionRooms.get(roomId);
    roomUsers.set(socket.id, socket.sessionUser);

    // Notify other peers in this room
    socket.to(roomId).emit('peer_joined', {
      peerId: socket.id,
      user: socket.sessionUser,
      occupantCount: roomUsers.size
    });

    // Send room occupancy list to the newly joined peer
    socket.emit('room_users', {
      users: Array.from(roomUsers.entries()).map(([peerId, u]) => ({ peerId, ...u })),
      occupantCount: roomUsers.size
    });
  });

  // Real-time Collaborative Code Editing
  socket.on('code_change', ({ roomId, code_diff, cursorPosition, language }) => {
    if (!roomId) return;
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
    socket.to(roomId).emit('notes_update', {
      notes,
      senderId: socket.id
    });
  });

  // Collaborative Whiteboard Sync
  socket.on('whiteboard_draw', ({ roomId, drawData }) => {
    if (!roomId || !drawData) return;
    socket.to(roomId).emit('whiteboard_draw', {
      drawData,
      senderId: socket.id
    });
  });

  socket.on('whiteboard_clear', ({ roomId }) => {
    if (!roomId) return;
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
    if (target) {
      io.to(target).emit('webrtc_offer', { offer, sender: socket.id });
    } else if (roomId) {
      socket.to(roomId).emit('webrtc_offer', { offer, sender: socket.id });
    }
  });

  socket.on('webrtc_answer', ({ roomId, answer, target }) => {
    if (target) {
      io.to(target).emit('webrtc_answer', { answer, sender: socket.id });
    } else if (roomId) {
      socket.to(roomId).emit('webrtc_answer', { answer, sender: socket.id });
    }
  });

  socket.on('webrtc_ice_candidate', ({ roomId, candidate, target }) => {
    if (target) {
      io.to(target).emit('webrtc_ice_candidate', { candidate, sender: socket.id });
    } else if (roomId) {
      socket.to(roomId).emit('webrtc_ice_candidate', { candidate, sender: socket.id });
    }
  });

  socket.on('leave_session', ({ roomId }) => {
    if (roomId && sessionRooms.has(roomId)) {
      const roomUsers = sessionRooms.get(roomId);
      roomUsers.delete(socket.id);
      socket.leave(roomId);
      socket.to(roomId).emit('peer_left', {
        peerId: socket.id,
        occupantCount: roomUsers.size
      });
      if (roomUsers.size === 0) {
        sessionRooms.delete(roomId);
      }
    }
  });

  socket.on('disconnect', () => {
    if (socket.currentRoom && sessionRooms.has(socket.currentRoom)) {
      const roomUsers = sessionRooms.get(socket.currentRoom);
      roomUsers.delete(socket.id);
      socket.to(socket.currentRoom).emit('peer_left', {
        peerId: socket.id,
        occupantCount: roomUsers.size
      });
      if (roomUsers.size === 0) {
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
