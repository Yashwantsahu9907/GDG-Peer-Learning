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

app.use('/api/auth', authRoutes);
app.use('/api', bountyRoutes);

// Socket.io Connection
io.on('connection', async (socket) => {
  const { userId } = socket.handshake.auth || {};
  const displayId = userId || socket.id;

  if (userId) {
    const user = await User.findOne({ userId });
    console.log(`User connected: socketId=${socket.id} userId=${displayId} ${user ? '(found)' : '(unknown user)'}`);
  } else {
    console.log(`User connected: socketId=${socket.id} userId=anonymous`);
  }

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

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
