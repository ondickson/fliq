// frontend/src/api/axios.js
import axios from 'axios';

const baseURL =
  window.location.hostname === 'localhost'
    ? 'https://fliq-backend.onrender.com'
    : 'http://172.18.80.1:5000';

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
