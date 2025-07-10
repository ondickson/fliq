// frontend/src/api/axios.js
import axios from 'axios';

// Default to Render backend
let baseURL = 'https://fliq-backend.onrender.com';

// Use local backend during development
if (window.location.hostname === 'localhost') {
  baseURL = 'http://localhost:5000';
}


const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
