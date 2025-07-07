// src/components/auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const Login = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      '/api/auth/login',
      { emailOrPhone: input, password },
      { withCredentials: true }
    );

    if (res.status === 200) {
      // fetch user info right after login
      const userRes = await axios.get('/api/auth/me', { withCredentials: true });
      setCurrentUser(userRes.data);
      navigate('/');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};


  return (
    <div className="auth-container">
      <h2>Login to Fliq</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Phone"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
