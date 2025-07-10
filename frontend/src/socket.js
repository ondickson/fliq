// frontend/src/socket.js

import { io } from 'socket.io-client';

const socket = io('https://fliq-backend.onrender.com', {
  withCredentials: true,
});

export default socket;
