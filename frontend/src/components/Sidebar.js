import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// console.log('BASE_URL:', BASE_URL);

const Sidebar = ({ onSelectUser }) => {
  const { currentUser, logout } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fetch users on mount
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await axios.get('/api/users/chat-history');
        setAllUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch chat users:', err);
      }
    };

    fetchChatUsers();
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // If input is empty, show chat history users only
    if (!query.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    try {
      const res = await axios.get(`/api/users/search?query=${query}`);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error('Search failed:', err);
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
        {filteredUsers.map((user) => (
          <div
            className="chat-item"
            key={user._id}
            onClick={() => onSelectUser(user)}
          >
            <img
              src={
                user.profilePicture
                  ? `${BASE_URL}${user.profilePicture.replace(/\\/g, '/')}`
                  : '/images/default-profile.png'
              }
              alt="Profile"
            />

            <div className="chat-info">
              <p className="chat-name">{user.fullName}</p>
              <p className="chat-preview">{user.email}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button
          onClick={() => alert('Open settings page')}
          className="sidebar-btn"
        >
          ⚙️ Settings
        </button>
        <button className="sidebar-btn logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
