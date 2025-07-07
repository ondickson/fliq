import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const Home = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

useEffect(() => {
  socket.connect();

  const handleMessage = (data) => {
    if (data.fromSocketId === socket.id) return;
    setMessages((prev) => [...prev, data]);
  };

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    socket.emit('join_room', 'public');
  });

  socket.on('receive_message', handleMessage);

  return () => {
    socket.off('receive_message', handleMessage); // ✅ Proper cleanup
    socket.disconnect(); // Optional: only if you want to fully close socket
  };
}, []);



const handleSendMessage = () => {
  if (!message.trim()) return;

  const msgData = {
    room: 'public',
    message,
    senderId: currentUser?._id,
    senderName: currentUser?.fullName,
    fromSocketId: socket.id,
  };

  // Emit to others
  socket.emit('send_message', msgData);

  // Add to own UI only once
  setMessages((prev) => [...prev, msgData]);

  setMessage('');
};


  return (
    <div style={{ padding: '1rem' }}>
      <h2>Welcome, {currentUser?.fullName}</h2>
      <button onClick={handleLogout}>Logout</button>

      <div
        style={{
          marginTop: '2rem',
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '1rem',
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderName}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '0.5rem' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;
