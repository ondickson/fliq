import { io } from 'socket.io-client';

const socket = io('https://fliq-frontend.onrender.com', {
  withCredentials: true,
});

export default socket;
