// src/pages/Home.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import axios from '../api/axios';
import CryptoJS from 'crypto-js';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// const Home = () => {
//   const { currentUser } = useContext(AuthContext);
//   // const navigate = useNavigate();
// const [messageCache, setMessageCache] = useState({});

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [message, setMessage] = useState('');
//   // const [messages, setMessages] = useState([]);
//   const messages = selectedUser ? messageCache[selectedUser._id] || [] : [];

//   useEffect(() => {

//     socket.connect();

//     socket.emit('register_user', currentUser._id);

//  const handleMessage = (data) => {
//   const { senderId, receiverId } = data;
//   const otherUserId =
//     senderId === currentUser._id ? receiverId : senderId;

//   setMessageCache((prev) => ({
//     ...prev,
//     [otherUserId]: [...(prev[otherUserId] || []), data],
//   }));
// };

//     socket.on('receive_message', handleMessage);

//     return () => {
//       socket.off('receive_message', handleMessage);
//       socket.disconnect();
//     };
//   }, [selectedUser, currentUser._id]);

//   const handleSelectUser = async (user) => {
//   setSelectedUser(user);

//   // Already have cached messages for this user
//   if (messageCache[user._id]) return;

//   try {
//     const res = await axios.get(`/api/messages/${user._id}`);
//     setMessageCache((prev) => ({ ...prev, [user._id]: res.data }));
//   } catch (err) {
//     console.error('Failed to fetch messages:', err);
//   }
// };

// const handleSendMessage = () => {
//   if (!message.trim() || !selectedUser) return;

//   const msgData = {
//     senderId: currentUser._id,
//     senderName: currentUser.fullName,
//     receiverId: selectedUser._id,
//     receiverName: selectedUser.fullName,
//     message,
//     createdAt: new Date().toISOString(),
//   };

//   socket.emit('private_message', msgData);

//   setMessageCache((prev) => ({
//     ...prev,
//     [selectedUser._id]: [...(prev[selectedUser._id] || []), msgData],
//   }));

//   setMessage('');
// };

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <Sidebar
//         onSelectUser={(user) => {
//           setSelectedUser(user);
//           setMessages([]);
//         }}
//       />
//       <ChatWindow
//         selectedUser={selectedUser}
//         messages={messages}
//         message={message}
//         setMessage={setMessage}
//         handleSendMessage={handleSendMessage}
//         BASE_URL={BASE_URL}
//       />
//     </div>
//   );
// };

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageCache, setMessageCache] = useState({});
const [showSidebar, setShowSidebar] = useState(true);

  const messages = selectedUser ? messageCache[selectedUser._id] || [] : [];
  

  useEffect(() => {
    socket.connect();
    socket.emit('register_user', currentUser._id);

    const handleMessage = (data) => {
      const { senderId, receiverId } = data;
      const otherUserId = senderId === currentUser._id ? receiverId : senderId;

      setMessageCache((prev) => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), data],
      }));
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
      socket.disconnect();
    };
  }, [currentUser._id]);

  const handleSendMessage = () => {
    const SECRET = currentUser._id + selectedUser._id;

    const encrypted = CryptoJS.AES.encrypt(message, SECRET).toString();

    if (!message.trim() || !selectedUser) return;

    // const msgData = {
    //   senderId: currentUser._id,
    //   senderName: currentUser.fullName,
    //   receiverId: selectedUser._id,
    //   receiverName: selectedUser.fullName,
    //   message,
    //   createdAt: new Date().toISOString(),
    // };

    const msgData = {
      senderId: currentUser._id,
      senderName: currentUser.fullName,
      receiverId: selectedUser._id,
      receiverName: selectedUser.fullName,
      message: encrypted, // encrypted here!
      createdAt: new Date().toISOString(),
    };

    socket.emit('private_message', msgData);

    setMessageCache((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), msgData],
    }));

    setMessage('');
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    if (window.innerWidth <= 768) setShowSidebar(false);
    
    if (messageCache[user._id]) return;

    try {
      const res = await axios.get(`/api/messages/${user._id}`);
      setMessageCache((prev) => ({ ...prev, [user._id]: res.data }));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };


  const handleBackToSidebar = () => {
  setSelectedUser(null);
  setShowSidebar(true);
};


  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
  {(showSidebar || window.innerWidth > 768) && (
    <Sidebar onSelectUser={handleSelectUser} />
  )}

  {(selectedUser || window.innerWidth > 768) && (
    <ChatWindow
      selectedUser={selectedUser}
      messages={messages}
      message={message}
      setMessage={setMessage}
      handleSendMessage={handleSendMessage}
      BASE_URL={BASE_URL}
      handleBack={handleBackToSidebar}
    />
  )}
</div>

  );
};

export default Home;
