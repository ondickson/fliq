// src/pages/Home.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Home = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.emit('register_user', currentUser._id);

    const handleMessage = (data) => {
      const { senderId, receiverId } = data;
      if (
        (senderId === selectedUser?._id && receiverId === currentUser._id) ||
        (senderId === currentUser._id && receiverId === selectedUser?._id)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
      socket.disconnect();
    };
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const msgData = {
      senderId: currentUser._id,
      senderName: currentUser.fullName,
      receiverId: selectedUser._id,
      receiverName: selectedUser.fullName,
      message,
      createdAt: new Date().toISOString(),
    };

    socket.emit('private_message', msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        onSelectUser={(user) => {
          setSelectedUser(user);
          setMessages([]);
        }}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default Home;
