import { io } from 'socket.io-client';

const socket = io('http://172.18.80.1:5000', {
  withCredentials: true,
});

export default socket;
