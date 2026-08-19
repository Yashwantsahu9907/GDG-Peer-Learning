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
import bountyRoutes from './routes/bountyRoutes.js';
// Socket.io Connection
io.on('connection', (socket) => {
  const { userId } = socket.handshake.auth || {};
  const displayId = userId || socket.id;

  // Global Chat
  socket.on('join_global', () => {
    socket.join('global_chat');
  });

  socket.on('send_global_message', async (data) => {
    try {
      const newMsg = await Message.create({
        chatType: 'global',
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text
      });
      io.to('global_chat').emit('receive_global_message', newMsg);
    } catch (err) {
      console.error('Error saving global message:', err);
    }
  });

  // Async DB check for user connection logging & personal room
  if (userId) {
    socket.join(userId);
    User.findById(userId).then(user => {
      if (user) {
        console.log(`User connected: socketId=${socket.id} userId=${displayId}`);
      }
    }).catch(err => {
      console.error('Socket connection DB error:', err);
    });
  }

  // Personal Chat
  socket.on('send_personal_message', async (data) => {
    try {
      const newMsg = await Message.create({
        chatType: 'personal',
        senderId: data.senderId,
        senderName: data.senderName,
        receiverId: data.receiverId,
        text: data.text
      });
      // Emit to receiver's room and sender's room
      io.to(data.receiverId).emit('receive_personal_message', newMsg);
      io.to(data.senderId).emit('receive_personal_message', newMsg);
    } catch (err) {
      console.error('Error saving personal message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id} userId=${displayId}`);
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
