// src/components/auth/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
    const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        '/api/auth/login',
        { emailOrPhone: input, password },
        { withCredentials: true },
      );

      if (res.status === 200) {
        // fetch user info right after login
        const userRes = await axios.get('/api/auth/me', {
          withCredentials: true,
        });
        setCurrentUser(userRes.data);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="left">  New Commit to check Web Deployment</div>
      <div className="right">
        <div className="right-form-card login-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
             <label className="label">Email</label>
            <input
              type="text"
              placeholder={focusedInput === 'Email' ? '' : 'example@mail.com'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocusedInput('Email')}
              onBlur={() => setFocusedInput(null)}
              required
            />
             <label className="label">Password</label>
            <input
              type="password"
              placeholder={focusedInput === 'Password' ? '' : '**********'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('Password')}
              onBlur={() => setFocusedInput(null)}
              required
            />
            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="loginButton">
              Login
            </button>
          </form>

          <div class="divider">
            <span>Or</span>
          </div>
          <button className="login" onClick={() => navigate('/Register')}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
