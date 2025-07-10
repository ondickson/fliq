// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import Message from './models/Message.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const userSocketMap = {};

// === ESM-compatible __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Load env variables ===
dotenv.config();

const app = express();
const server = http.createServer(app);

// === Middleware ===
const allowedOrigins = ['https://fliq-frontend.onrender.com', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow same-origin or curl/postman
    if (process.env.NODE_ENV === 'development') return callback(null, true); // Allow all in dev
    
    const allowed = ['https://fliq-frontend.onrender.com'];
    if (allowed.includes(origin)) return callback(null, true);

    return callback(new Error('CORS Not Allowed'), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));


const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'development' ? true : ['https://fliq-frontend.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});



app.use(express.json());
app.use(cookieParser());


// === Static files ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Basic Route ===
app.get('/', (req, res) => res.send('Fliq backend is running'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// === Socket.IO ===
io.on('connection', (socket) => {
  // console.log('User connected:', socket.id);
  socket.on('register_user', (userId) => {
    userSocketMap[userId] = socket.id;
    // console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on('private_message', async (data) => {
    try {
      const newMessage = new Message({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        timestamp: data.timestamp,
      });

      const savedMessage = await newMessage.save();

      // Emit to receiver (if online)
      const targetSocket = userSocketMap[data.receiverId];
      if (targetSocket) {
        io.to(targetSocket).emit('receive_message', savedMessage);
      }

      // Emit back to sender (optional for UI consistency)
      const senderSocket = userSocketMap[data.senderId];
      if (senderSocket) {
        io.to(senderSocket).emit('message_saved', savedMessage);
      }
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
    socket.broadcast.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
  });
});

// === MongoDB Connection ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// === Start Server ===
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
