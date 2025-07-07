import React, { useState } from 'react';
import axios from '../api/axios';
import './Sidebar.css';

const mockChats = [
  {
    _id: '1',
    profilePicture: '/images/default-profile.png',
    fullName: 'Maria Santos',
    lastMessage: 'Hey, how are you doing today?',
  },
  {
    _id: '2',
    profilePicture: '/images/default-profile.png',
    fullName: 'James Brown',
    lastMessage: 'Just sent the files. Check email.',
  },
];


const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const res = await axios.get(`/api/users/search?query=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Fliq</h2>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search by email or phone..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="chat-list">
  {mockChats.map((chat) => (
    <div className="chat-item" key={chat._id}>
      <img src={chat.profilePicture} alt="Profile" />
      <div className="chat-info">
        <p className="chat-name">{chat.fullName}</p>
        <p className="chat-preview">
          {chat.lastMessage.split(' ').slice(0, 5).join(' ')}...
        </p>
      </div>
    </div>
  ))}
</div>


      <div className="sidebar-bottom">
  <button onClick={() => alert('Open settings page')} className="sidebar-btn">
    ⚙️ Settings
  </button>
  <button  className="sidebar-btn logout">
    🚪 Logout
  </button>
</div>

    </div>
  );
};

export default Sidebar;
