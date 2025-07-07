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

// === ESM-compatible __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Load env variables ===
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://172.29.80.1:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// === Middleware ===
app.use(cors({
  origin: ['http://localhost:3000', 'http://172.29.80.1:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// === Static files ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Basic Route ===
app.get('/', (req, res) => res.send('Fliq backend is running'));

app.use('/api/auth', authRoutes);

// === Socket.IO ===
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
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
