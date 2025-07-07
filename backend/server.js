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


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';



// === ESM-compatible __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Load env variables ===
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://172.29.80.1:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// === Middleware ===
app.use(cors({
  origin: ['http://localhost:3001', 'http://172.29.80.1:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// === Static files ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Basic Route ===
app.get('/', (req, res) => res.send('Fliq backend is running'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// === Socket.IO ===
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
  socket.broadcast.to(data.room).emit('receive_message', data);
});


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// === MongoDB Connection ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
