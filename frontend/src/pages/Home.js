import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome, {currentUser?.fullName}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
