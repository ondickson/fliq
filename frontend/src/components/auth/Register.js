// src/components/auth/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [focusedInput, setFocusedInput] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const data = new FormData();

    data.append('email', formData.email.toLowerCase());

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });


    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }

    try {
      const res = await axios.post('/api/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.status === 201 || res.status === 200) {
        setSuccess('Account created successfully!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="left">nothing here for now</div>
      <div className="right">
        <div className="right-form-card">
          <h2>Sign up</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label className="label">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder={focusedInput === 'fullName' ? '' : 'John Doe'}
              value={formData.fullName}
              onChange={handleChange}
              onFocus={() => setFocusedInput('fullName')}
              onBlur={() => setFocusedInput(null)}
              required
            />

            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              placeholder={focusedInput === 'email' ? '' : 'example@mail.com'}
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              required
            />

            <label className="label">Mobile Number</label>
            <input
              type="text"
              name="phone"
              placeholder={focusedInput === 'phone' ? '' : '+1 (123) 456-7890'}
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
              required
            />

            <div className="password">
              <div className="password-left password-container">
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder={focusedInput === 'password' ? '' : '**********'}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  required
                />
              </div>

              <div className="password-right password-container">
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={
                    focusedInput === 'confirmPassword' ? '' : '**********'
                  }
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                  required
                />
              </div>
            </div>

            <div className="file-upload">
              <label htmlFor="profilePicture" className="file-label">
                Profile Picture
              </label>
              <input
                id="profilePicture"
                type="file"
                name="profilePicture"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="file-input"
              />
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Profile Preview" />
                </div>
              )}
            </div>

            {loading && <div className="spinner"></div>}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <button type="submit" class="create-account">
              Create Account
            </button>
          </form>
          <div class="divider">
            <span>Or</span>
          </div>
          <button className="login" onClick={() => navigate('/login')}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
