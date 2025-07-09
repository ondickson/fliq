// src/pages/Home.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import axios from '../api/axios';

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

    setMessageCache((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), msgData],
    }));

    setMessage('');
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    if (messageCache[user._id]) return;

    try {
      const res = await axios.get(`/api/messages/${user._id}`);
      setMessageCache((prev) => ({ ...prev, [user._id]: res.data }));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onSelectUser={handleSelectUser} />
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
