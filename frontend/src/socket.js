// frontend/src/socket.js

// import { io } from 'socket.io-client';

// const socket = io('https://fliq-backend.onrender.com', {
//   withCredentials: true,
// });

// export default socket;

// src/socket.js
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = process.env.REACT_APP_API_BASE_URL;
const socket = io(SOCKET_ENDPOINT, {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;

